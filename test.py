import json
import requests
from dotenv import load_dotenv
import os
import base64
import webbrowser
from urllib.parse import urlencode

load_dotenv()

client_id = os.getenv("CLIENT_ID")
client_secret = os.getenv("CLIENT_SECRET")

def authenticate():
    auth_headers = {
        "client_id": client_id,
        "response_type": "code",
        "redirect_uri": "http://localhost:3000",
        "scope": "user-library-read user-read-private playlist-read-private"
    }

    webbrowser.open("https://accounts.spotify.com/authorize?" + urlencode(auth_headers))

def get_token():
    code = "AQDI2DyT8tbFXhY94EMFZej_9nj8oPzejZzgc7G04B2EAWtb5EHqxRs4HP6U9x0gmumhLnnJ9g2sLkK6QmM_XvVyB7tcz7ys5N2nKANK8COSqGKQuQj8yuqq0RHhxq2bMZLSkkCIFLa1eQbMWItdlYXl3Aj2-6s-_CVd2SpCaRvs8lKsHsEF74UIcftfDyIRToruyFZ7f79tQdH5nANsl5tCg0gXYOgWOjhcw3Tx8Ynu5o9zOJc"

    auth_string = client_id + ":" + client_secret
    auth_bytes = auth_string.encode("utf-8")
    auth_base64 = str(base64.b64encode(auth_bytes), "utf-8")

    url = "https://accounts.spotify.com/api/token"
    token_headers = {
        "Authorization": "Basic " + auth_base64,
        "Content-Type": "application/x-www-form-urlencoded"
    }

    token_data = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": "http://localhost:3000"
    }
    result = requests.post(url, headers=token_headers, data=token_data)
    json_result = json.loads(result.content)
    print(json_result)
    token = json_result["access_token"]

    return token

def get_auth_header(token):
    return {"Authorization": "Bearer " + token}

def get_user_id(token):
    url = "https://api.spotify.com/v1/me"
    headers = get_auth_header(token)
    result = requests.get(url, headers=headers)
    user_id = json.loads(result.content)["id"]

    return user_id

def get_user_playlists(token, user_id):
    url = f"https://api.spotify.com/v1/users/{user_id}/playlists?offset=0&limit=50"
    headers = get_auth_header(token)
    result = requests.get(url, headers=headers)
    
    return json.loads(result.content)

def get_user_local_tracks(token, user_id)

# authenticate()
# print(get_token())
token = "BQCTsHxKBg0rgWiuc1KtCtZTRRjh0lxFtloS-JG20FOfsE0Oz7ik7__YnL0-s7j-FUEJeqBLHsd4y-n8ET830uzDq_57egb8SdFX2hhabIhjzfxAWSn-79o2uj-ZJOyDO98roZ6tk565VgGPT_8XkWR2I0QjqzXWIdy9HVbKXlUfKjcxo__KXFsnxLnA_Y2bAAoHO5djIfzRtY-f_pXQvjQJ5G3ouWCWMXls4jdt"
user_id = get_user_id(token)
print(user_id)
print(get_user_playlists(token, user_id))
