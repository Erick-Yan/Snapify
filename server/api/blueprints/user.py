from flask import (
    Blueprint,
    request,
    jsonify,
)
from dotenv import load_dotenv
import os
import sys

sys.path.insert(0, "../../api/wrapper_utils.py")
from api.wrapper_utils import login_required

sys.path.insert(0, "../../api/services")
from api.services.user_service import (
    get_public_user_profile,
    get_spotify_artists,
    get_user_playlists,
    get_user_profile,
    get_spotify_tracks,
    save_user_profile,
)

load_dotenv()
CLIENT_ID = os.getenv("CLIENT_ID")
CLIENT_SECRET = os.getenv("CLIENT_SECRET")
SCOPES = os.getenv("SCOPES")
REDIRECT_URI = os.getenv("REDIRECT_URI")
SECRET_KEY = os.getenv("SECRET_KEY")

user_bp = Blueprint("user", __name__)


@user_bp.route("/user/get_profile", methods=["GET"])
@login_required
def get_profile():
    user_profile = get_user_profile()
    print("get_profile: ", user_profile)
    return jsonify(user_profile), 200


@user_bp.route("/user/get_public_profile", methods=["GET"])
def get_public_profile():
    public_id = request.args.get("public_id")
    public_user_profile = get_public_user_profile(public_id)
    print("get_public_profile: ", public_user_profile)
    return jsonify(public_user_profile), 200


@user_bp.route("/user/get_track", methods=["GET"])
@login_required
def get_tracks():
    track_name = request.args.get("track")
    tracks = get_spotify_tracks(track_name)

    print("get_tracks: ", tracks)
    return jsonify(tracks), 200


@user_bp.route("/user/get_artist", methods=["GET"])
@login_required
def get_artists():
    artist_name = request.args.get("artist")
    artists = get_spotify_artists(artist_name)

    print("get_artists: ", artists)
    return jsonify(artists), 200


@user_bp.route("/user/get_playlist", methods=["GET"])
@login_required
def get_playlist():
    playlists = get_user_playlists()

    print("get_playlist: ", playlists)
    return jsonify(playlists), 200


@user_bp.route("/user/save_profile", methods=["POST"])
@login_required
def save_profile():
    data = request.json
    lyrics = data.get("lyrics", "")
    song = data.get("song")
    artists = data.get("artists", [])
    playlist = data.get("playlist")
    save_user_profile(lyrics, song, artists, playlist)

    return jsonify({"message": "Profile saved successfully"}), 200
