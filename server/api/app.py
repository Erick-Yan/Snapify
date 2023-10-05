from os import environ
from flask import Flask, request
from requests import get
import os
import sys
import logging
from flask_cors import CORS

from .blueprints.auth import auth_bp

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

#--facotor method that returns the app object
def create_app(config_name='production'):
    print("------config name: ", config_name)

    #point static folder to the build folder, so the root path point to the index html
    app = Flask('api', static_folder='build', static_url_path='/', template_folder='server/api/templates/admin')
    app.logger.propagate = False
    app.logger.handlers.clear()

    logger = logging.getLogger("__name__")

    logging.basicConfig(level=logging.DEBUG)

    format = logging.Formatter("%(levelname)s:%(module)s:%(asctime)s, %(message)s", "%m/%d/%Y %H:%M:%S")

    debugHandler = logging.StreamHandler(sys.stdout)
    debugHandler.setLevel(logging.DEBUG)
    debugHandler.setFormatter(format)

    logger.addHandler(debugHandler)
    logger.propagate = False

    #load configurations
    # app.config.from_object(website_config[config_name])

    #register all kinds of mudules
    register_blueprints(app)
    # register_extensions(app)
    # register_error_handler(app)
    # register_command(app)
    # register_flask_stats(app)

    @app.route("/app/", defaults={"path": "index.html"})
    @app.route("/app/<path:path>")
    def getApp(path):
        if IS_DEV:
            return proxy(WEBPACK_DEV_SERVER_HOST, request.path)
        return app.send_static_file(path)

    app.secret_key = "test_secret_key1"
    CORS(app)
    return app

def register_blueprints(app):
    app.register_blueprint(auth_bp)

if __name__ == "__main__":
    app = create_app()
    port = int(os.getenv('PORT'), 5000)
    app.run(host='0.0.0.0', port=port, debug=False)
