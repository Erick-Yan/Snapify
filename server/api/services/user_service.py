from flask import session
import logging
import sys
import uuid

sys.path.insert(0, "../../api/models")
from api.models.users import Users
from api.models.lyrics import Lyrics
from api.models.songs import Songs
from api.models.artists import Artists
from api.models.playlists import Playlists

sys.path.insert(0, "../../api/utils.py")
from api.utils import makeGetRequest


def get_user_profile():
    try:
        user_profile = {
            "metadata": Users.user_to_dict(session["user_id"]),
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
    try:
        user_profile = {
            "metadata": Users.user_to_dict(public_user_profile.user_id),
            "lyrics": Lyrics.lyrics_to_dict(public_user_profile.user_id),
            "song": Songs.song_to_dict(public_user_profile.user_id),
            "artists": Artists.artists_to_dict(public_user_profile.user_id),
            "playlist": Playlists.playlist_to_dict(public_user_profile.user_id),
        }
        return user_profile
    except Exception as e:
        logging.error("Failed to fetch public user profile: ", e)
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
                    "song_image_id": track.get("album").get("images")[0].get("url")
                    if track.get("album") and track.get("album").get("images")
                    else None,
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
                    "artist_image_id": artist.get("images")[0].get("url")
                    if artist.get("images")
                    else None,
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
                        "playlist_image_id": playlist.get("images")[0].get("url")
                        if playlist.get("images")
                        else None,
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
