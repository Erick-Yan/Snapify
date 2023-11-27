from flask import Response, redirect, session, current_app, jsonify
from functools import wraps

def login_required(view_func):
    @wraps(view_func)
    def wrapped_view(*args, **kwargs):
        if "user_id" not in session:
            # User is not authenticated, return an unauthorized response (HTTP 401)
            return jsonify({"error": "Authentication required"}), 401
        return view_func(*args, **kwargs)
    return wrapped_view