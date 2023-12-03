from flask import (
    Blueprint,
    url_for,
    session,
    redirect,
    request,
    jsonify,
    abort,
    make_response,
)
from dotenv import load_dotenv
import os
import sys
import logging
import jwt

# sys.path is a list of absolute path strings
sys.path.insert(0, "../../api/utils.py")
sys.path.insert(0, "../../api/wrapper_utils.py")
from api.utils import createStateKey, getToken, getUserInformation, makeGetRequest
from api.wrapper_utils import login_required

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
    curr_user = getUserInformation(session)
    return jsonify(curr_user), 200


@user_bp.route("/user/get_track", methods=["GET"])
@login_required
def get_tracks():
    track = request.args.get("track")
    url = f"https://api.spotify.com/v1/search?q={track}&type=track"
    payload = makeGetRequest(session, url)

    if payload == None:
        return None

    return jsonify(payload), 200


@user_bp.route("/user/get_artist", methods=["GET"])
@login_required
def get_artists():
    artist = request.args.get("artist")
    url = f"https://api.spotify.com/v1/search?q={artist}&type=artist"
    payload = makeGetRequest(session, url)

    if payload == None:
        return None

    return jsonify(payload), 200


@user_bp.route("/user/get_playlist", methods=["GET"])
@login_required
def get_playlist():
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

    ret = {"items": playlists}

    return jsonify(ret), 200
