from flask import (
    Blueprint,
    session,
    redirect,
    request,
    make_response,
)
from dotenv import load_dotenv
import os
import sys
import logging
import jwt
import uuid

# sys.path is a list of absolute path strings
sys.path.insert(0, "../../api/utils.py")
sys.path.insert(0, "../../api/wrapper_utils.py")
from api.utils import createStateKey, getToken, getUserInformation, makePostRequest
from api.wrapper_utils import login_required

sys.path.insert(0, "../../api/models/users.py")
from api.models.users import Users

load_dotenv()
CLIENT_ID = os.getenv("CLIENT_ID")
CLIENT_SECRET = os.getenv("CLIENT_SECRET")
SCOPES = os.getenv("SCOPES")
REDIRECT_URI = os.getenv("REDIRECT_URI")
SECRET_KEY = os.getenv("SECRET_KEY")

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/auth/logout")
@login_required
def logout():
    session.clear()
    return redirect("http://localhost:5000/app")


@auth_bp.route("/auth/check_auth", methods=["GET"])
def check_auth():
    # Create JWT Token
    user = Users.fetch_user_by_user_id(session.get("user_id"))
    token_payload = {
        "user_id": session.get("user_id"),
        "token": session.get("token"),
        "token_expiration": session.get("token_expiration") or -1,
        "profile_url": user.user_page_id if user else "",
    }
    token = jwt.encode(token_payload, SECRET_KEY, algorithm="HS256")
    return token, 200


@auth_bp.route("/auth/login", methods=["GET"])
# @limiter.limit("2 per second")
def login():
    state_key = createStateKey(15)
    session["state_key"] = state_key

    authorize_url = "https://accounts.spotify.com/en/authorize?"
    parameters = (
        "response_type=code&client_id="
        + CLIENT_ID
        + "&redirect_uri="
        + REDIRECT_URI
        + "&scope="
        + SCOPES
        + "&state="
        + state_key
        + "&show_dialog=True"
    )
    redirect_response = make_response(redirect(authorize_url + parameters))

    return redirect_response


# --api: the page that returns to after user get authentication from spotify
@auth_bp.route("/auth/callback")
def redirect_page():
    # make sure the response came from Spotify
    if request.args.get("state") != session.get("state_key"):
        logging.error("Failed to Authenticate User: State keys don't match")
        return redirect("http://localhost:5000/app", 400)
    if request.args.get("error"):
        logging.error("Failed to Authenticate User: Permissions not granted")
        return redirect("http://localhost:5000/app")
    else:
        try:
            code = request.args.get("code")
            session.pop("state_key", None)
            payload = getToken(code)
            if payload:
                session["code"] = code
                (
                    session["token"],
                    session["refresh_token"],
                    session["token_expiration"],
                ) = (payload[0], payload[1], payload[2])
            else:
                logging.warning("Failed to retrieve token!")
                return redirect("http://localhost:5000/app", code=400)
        except Exception as e:
            logging.error("Failed to Authenticate User: Failed to retrieve token")
            raise e

        try:
            current_user = getUserInformation(session)
            session["user_id"] = current_user["id"]
            user = Users().fetch_user_by_user_id(user_id=current_user["id"])
            if not user:
                new_user = Users().create_user(
                    user_id=current_user["id"],
                    user_name=current_user["display_name"],
                    user_country=current_user["country"],
                    user_type=create_user_type(
                        current_user["product"], current_user["type"]
                    ),
                    user_followers=current_user["followers"]["total"],
                    user_image_id=current_user["images"][1]["url"],
                    user_page_id=uuid.uuid4(),
                )
                logging.info(f"New user created: {new_user}")
            Users().update_last_login(user.user_id)
            logging.info("New User Log In: " + session["user_id"])
        except Exception as e:
            logging.error("Failed to Authenticate User: Failed to retrieve user info")
            raise e

    return redirect("http://localhost:5000/app")


def create_user_type(product: str, type: str):
    return product.capitalize() + " " + type.capitalize()
