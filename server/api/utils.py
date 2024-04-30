import random as rand
import string as string
import os
import requests
import logging
import base64
import time


def createStateKey(size):
    # https://stackoverflow.com/questions/2257441/random-string-generation-with-upper-case-letters-and-digits
    return "".join(
        rand.SystemRandom().choice(string.ascii_uppercase + string.digits)
        for _ in range(size)
    )


"""
*** Token Functions ***
"""


def getToken(code):
    CLIENT_ID = os.getenv("CLIENT_ID")
    CLIENT_SECRET = os.getenv("CLIENT_SECRET")
    REDIRECT_URI = os.getenv("REDIRECT_URI")
    auth_string = CLIENT_ID + ":" + CLIENT_SECRET
    auth_bytes = auth_string.encode("utf-8")
    auth_base64 = str(base64.b64encode(auth_bytes), "utf-8")

    url = "https://accounts.spotify.com/api/token"
    token_headers = {
        "Authorization": "Basic " + auth_base64,
        "Content-Type": "application/x-www-form-urlencoded",
    }

    token_data = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": REDIRECT_URI,
    }
    result = requests.post(url, headers=token_headers, data=token_data)

    if result.status_code == 200:
        json = result.json()
        return json["access_token"], json["refresh_token"], json["expires_in"]
    else:
        logging.error("getToken:" + str(result.status_code))
        return None


def refreshToken(refresh_token):
    CLIENT_ID = os.getenv("CLIENT_ID")
    CLIENT_SECRET = os.getenv("CLIENT_SECRET")
    auth_string = CLIENT_ID + ":" + CLIENT_SECRET
    auth_bytes = auth_string.encode("utf-8")
    auth_base64 = str(base64.b64encode(auth_bytes), "utf-8")
    token_url = "https://accounts.spotify.com/api/token"

    headers = {
        "Authorization": "Basic " + auth_base64,
        "Content-Type": "application/x-www-form-urlencoded",
    }
    body = {"grant_type": "refresh_token", "refresh_token": refresh_token}
    post_response = requests.post(token_url, headers=headers, data=body)

    if post_response.status_code == 200:
        return post_response.json()["access_token"], post_response.json()["expires_in"]
    else:
        logging.error("refreshToken:" + str(post_response.status_code))
        return None


def checkTokenStatus(session):
    if time.time() > session["token_expiration"]:
        payload = refreshToken(session["refresh_token"])

        if payload != None:
            session["token"] = payload[0]
            session["token_expiration"] = time.time() + payload[1]
        else:
            logging.error("Token refresh failed!")
            return None

    return "Success"


"""
*** Fetch User Data Functions ***
"""


def makeGetRequest(session, url, params={}):
    headers = {"Authorization": "Bearer {}".format(session["token"])}
    response = requests.get(url, headers=headers, params=params)

    if response.status_code == 200:
        return response.json()

    elif response.status_code == 401 and checkTokenStatus(session) != None:
        return makeGetRequest(session, url, params)
    else:
        logging.error("makeGetRequest:" + str(response.status_code))
        return None


def makePostRequest(session, url, params={}):
    headers = {
        "Authorization": "Bearer {}".format(session["token"]),
    }
    response = requests.post(url, headers=headers, params=params)

    if response.status_code == 200:
        return True

    elif response.status_code == 401 and checkTokenStatus(session) != None:
        return makePostRequest(session, url, params)
    else:
        logging.error("makePostRequest:" + str(response.status_code))
        return False


def getUserInformation(session):
    url = "https://api.spotify.com/v1/me"
    payload = makeGetRequest(session, url)

    if payload == None:
        return None

    return payload


def getPublicUserInformation(session, user_id):
    url = f"https://api.spotify.com/v1/users/{user_id}"
    payload = makeGetRequest(session, url)

    if payload == None:
        return None

    return payload
