from flask import session
import logging
import sys
import datetime

sys.path.insert(0, "../../api/models")
from api.models.users import Users
from api.models.lyrics import Lyrics
from api.models.songs import Songs
from api.models.artists import Artists
from api.models.playlists import Playlists
from api.models.followers import Followers
from api.producer import get_kafka_producer, publish
from api.consumer import get_kafka_consumer, consume, check_messages

sys.path.insert(0, "../../api/utils.py")
from api.utils import makeGetRequest, makePostRequest


def get_user_profile():
    try:
        user_profile = {
            "metadata": Users.user_to_dict(session),
            "lyrics": Lyrics.lyrics_to_dict(session["user_id"]),
            "song": Songs.song_to_dict(session["user_id"]),
            "artists": Artists.artists_to_dict(session["user_id"]),
            "playlist": Playlists.playlist_to_dict(session["user_id"]),
        }
        return user_profile
    except Exception as e:
        logging.error("Failed to fetch user profile: ", e)
        raise e


def get_public_user_profile(user_page_id):
    public_user_profile = Users.fetch_user_by_public_page_id(user_page_id)
    if not public_user_profile:
        logging.error("Failed to find public user")
        raise Exception
    
    public_user_follower = Followers.fetch_follower_by_user_id(public_user_profile.user_id, session["user_id"])

    try:
        user_profile = {
            "metadata": Users.public_user_to_dict(session, public_user_profile.user_id),
            "lyrics": Lyrics.lyrics_to_dict(public_user_profile.user_id),
            "song": Songs.song_to_dict(public_user_profile.user_id),
            "artists": Artists.artists_to_dict(public_user_profile.user_id),
            "playlist": Playlists.playlist_to_dict(public_user_profile.user_id),
            "following": public_user_follower != None
        }
        return user_profile
    except Exception as e:
        logging.error("Failed to fetch public user profile: ", e)
        raise e


def get_public_user_profile_matches(user_page_id):
    public_user_profile = Users.fetch_user_by_public_page_id(user_page_id)
    if not public_user_profile:
        logging.error("Failed to find public user")
        raise Exception

    # Check for matching song.
    song_match = (
        Songs.song_to_dict(session["user_id"]).get("song_id")
        == Songs.song_to_dict(public_user_profile.user_id).get("song_id")
        if Songs.fetch_song_by_user_id(session["user_id"])
        and Songs.fetch_song_by_user_id(public_user_profile.user_id)
        else False
    )

    # Check for matching artists.
    artists_matches = []
    current_user_artists = Artists.artists_to_dict(session["user_id"])
    public_user_artists = Artists.artists_to_dict(public_user_profile.user_id)
    for artist1 in public_user_artists:
        for artist2 in current_user_artists:
            if artist1["artist_id"] == artist2["artist_id"]:
                artists_matches.append(
                    {
                        "artist_name": artist1["artist_name"],
                        "artist_image_id": artist1["artist_image_id"],
                    }
                )

    # Check for matching playlist songs.
    playlist_song_matches = []
    current_user_playlist_songs = _get_playlist_items(
        Playlists.fetch_playlist_by_user_id(session["user_id"]).playlist_id
    )
    public_user_playlist_songs = _get_playlist_items(
        Playlists.fetch_playlist_by_user_id(public_user_profile.user_id).playlist_id
    )
    for song1 in current_user_playlist_songs:
        for song2 in public_user_playlist_songs:
            if song1["track"]["id"] == song2["track"]["id"]:
                playlist_song_matches.append(
                    {
                        "track_name": song1["track"]["name"],
                        "track_image_url": song1["track"]["album"]["images"][0]["url"],
                    }
                )

    try:
        public_user_profile_matches = {
            "song_match": song_match,
            "artists_matches": artists_matches,
            "playlist_song_matches": playlist_song_matches,
        }
        return public_user_profile_matches
    except Exception as e:
        logging.error("Failed to fetch public user profile matches: ", e)
        raise e
    

def follow_user_by_id(user_page_id):
    # Fetch user id.
    public_user_profile = Users.fetch_user_by_public_page_id(user_page_id)
    if not public_user_profile:
        logging.error("Failed to find public user")
        raise Exception
    user_id = public_user_profile.user_id

    # Follow user through PUT request.
    try:
        url = f"https://api.spotify.com/v1/me/following?type=user&ids={user_id}"
        makePostRequest(session, url)
    except Exception as e:
        logging.error("Failed to follow user on Spotify: ", e)
        raise e

    # Produce message to user_follow kafka topic.
    try:
        producer = get_kafka_producer()
        value = {
            'follower_user_id': session["user_id"],
            'followed_user_id': user_id,
            'followed_date': datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
        publish(producer, "user_follow", key=user_id.encode('utf-8'), value=value)
    except Exception as e:
        raise e

    # Save follower to DB.
    try:
        follower = Followers.fetch_follower_by_user_id(user_id, session["user_id"])
        if not follower:
            Followers.create_follower(user_id, session["user_id"])
    except Exception as e:
        logging.error("Failed to create follower in DB: ", e)
        raise e
    

def check_followers_in_kafka():
    try:
        consumer = get_kafka_consumer("user_follow")
        new_follower_count = check_messages(consumer, session["user_id"])
        return {"new_follower_count": new_follower_count}
    except Exception as e:
        raise e


def get_spotify_tracks(track_name):
    try:
        url = f"https://api.spotify.com/v1/search?q={track_name}&type=track"
        payload = makeGetRequest(session, url)

        tracks = payload.get("tracks", {}).get("items", [])

        extracted_songs = []
        for track in tracks:
            extracted_songs.append(
                {
                    "user_id": session["user_id"],
                    "song_id": track.get("id"),
                    "song_name": track.get("name"),
                    "song_artists": _parse_artists(track.get("artists")),
                    "song_image_id": (
                        track.get("album").get("images")[0].get("url")
                        if track.get("album") and track.get("album").get("images")
                        else None
                    ),
                }
            )

        return {"songs": extracted_songs}
    except Exception as e:
        logging.error("Failed to fetch song results: ", e)
        raise e


def _parse_artists(artists):
    artists_list = []
    for artist in artists:
        artists_list.append(artist.get("name"))

    return ", ".join(artists_list)


def get_spotify_artists(artist_name):
    try:
        url = f"https://api.spotify.com/v1/search?q={artist_name}&type=artist"
        payload = makeGetRequest(session, url)
        artists = payload.get("artists", {}).get("items", [])

        extracted_artists = []
        for artist in artists:
            extracted_artists.append(
                {
                    "user_id": session["user_id"],
                    "artist_id": artist.get("id"),
                    "artist_image_id": (
                        artist.get("images")[0].get("url")
                        if artist.get("images")
                        else None
                    ),
                    "artist_name": artist.get("name"),
                    "artist_genres": ", ".join(artist.get("genres")),
                }
            )

        return {"artists": extracted_artists}
    except Exception as e:
        logging.error("Failed to fetch artists: ", e)
        raise e


def get_user_playlists():
    try:
        playlists = []
        prev_len = -1
        offset = 0
        INCREMENT = 50
        while len(playlists) > prev_len:
            prev_len = len(playlists)
            url = f"https://api.spotify.com/v1/me/playlists?limit=50&offset={offset}"
            payload = makeGetRequest(session, url)
            if payload == None:
                break
            playlists.extend(payload.get("items"))
            offset += INCREMENT

        extracted_playlists = []
        for playlist in playlists:
            if playlist.get("public"):
                extracted_playlists.append(
                    {
                        "user_id": session["user_id"],
                        "playlist_id": playlist.get("id"),
                        "playlist_name": playlist.get("name"),
                        "playlist_image_id": (
                            playlist.get("images")[0].get("url")
                            if playlist.get("images")
                            else None
                        ),
                        "playlist_description": playlist.get("description"),
                    }
                )

        return {"playlists": extracted_playlists}
    except Exception as e:
        logging.error("Failed to fetch user's playlists: ", e)
        raise e


def save_user_profile(lyrics, song, artists, playlist):
    try:
        Lyrics.delete_lyrics(session["user_id"])
        if lyrics:
            Lyrics.create_lyrics(session["user_id"], lyrics)

        Songs.delete_song(session["user_id"])
        if song:
            Songs.create_song(session["user_id"], song)

        Artists.delete_artists(session["user_id"])
        if artists:
            Artists.create_artists(session["user_id"], artists)

        Playlists.delete_playlist(session["user_id"])
        if playlist:
            Playlists.create_playlist(session["user_id"], playlist)
    except Exception as e:
        logging.error("Failed to save user profile: ", e)
        raise e


def _get_playlist_items(playlist_id):
    try:
        playlist_items = []
        prev_len = -1
        offset = 0
        INCREMENT = 50
        while len(playlist_items) > prev_len:
            prev_len = len(playlist_items)
            url = f"https://api.spotify.com/v1/playlists/{playlist_id}/tracks?limit=50&offset={offset}"
            payload = makeGetRequest(session, url)
            if payload == None:
                break
            playlist_items.extend(payload.get("items"))
            offset += INCREMENT
        return playlist_items
    except Exception as e:
        logging.error("Failed to retrieve current user's followed artists: ", e)
        raise e
