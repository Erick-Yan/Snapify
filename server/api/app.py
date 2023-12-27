from os import environ
from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from requests import get
import os
import sys
import logging
from flask_migrate import Migrate

from .blueprints.auth import auth_bp
from .blueprints.user import user_bp
from .extensions import db

IS_DEV = environ["FLASK_ENV"] == "development"
WEBPACK_DEV_SERVER_HOST = "http://localhost:3000"


def proxy(host, path):
    response = get(f"{host}{path}")
    excluded_headers = [
        "content-encoding",
        "content-length",
        "transfer-encoding",
        "connection",
    ]
    headers = {
        name: value
        for name, value in response.raw.headers.items()
        if name.lower() not in excluded_headers
    }
    return (response.content, response.status_code, headers)


# --facotor method that returns the app object
def create_app(config_name="production"):
    print("------config name: ", config_name)

    # point static folder to the build folder, so the root path point to the index html
    app = Flask(
        "api",
        static_folder="build",
        static_url_path="/",
        template_folder="server/api/templates/admin",
    )
    app.config[
        "SQLALCHEMY_DATABASE_URI"
    ] = "postgresql://postgres:StartingSmthnggN3ww@localhost:5432/snapify"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = True
    app.logger.propagate = False
    app.logger.handlers.clear()

    logger = logging.getLogger("__name__")

    logging.basicConfig(level=logging.DEBUG)

    format = logging.Formatter(
        "%(levelname)s:%(module)s:%(asctime)s, %(message)s", "%m/%d/%Y %H:%M:%S"
    )

    debugHandler = logging.StreamHandler(sys.stdout)
    debugHandler.setLevel(logging.DEBUG)
    debugHandler.setFormatter(format)

    logger.addHandler(debugHandler)
    logger.propagate = False

    # load configurations
    # app.config.from_object(website_config[config_name])

    # register all kinds of mudules
    app.register_blueprint(user_bp)
    app.register_blueprint(auth_bp)
    # register_extensions(app)
    # register_error_handler(app)
    # register_command(app)
    # register_flask_stats(app)

    with app.app_context():
        db.init_app(app)
        migrate = Migrate(app, db)
        from .models.artists import Artists
        from .models.lyrics import Lyrics
        from .models.users import Users
        from .models.songs import Songs
        from .models.playlists import Playlists

        db.create_all()
        db.session.commit()

    @app.route("/app/", defaults={"path": "index.html"})
    @app.route("/app/<path:path>")
    def getApp(path):
        if IS_DEV:
            return proxy(WEBPACK_DEV_SERVER_HOST, request.path)
        return app.send_static_file(path)

    app.secret_key = "test_secret_key1"
    return app


if __name__ == "__main__":
    app = create_app()
    port = int(os.getenv("PORT"), 5000)
    app.run(host="0.0.0.0", port=port, debug=False)
