from flask import Response, redirect, session

def login_required(func):
    def wrap(*args, **kwargs):
        if "user_id" in session:
            func()
        return redirect("http://localhost:5000/app")
    return wrap