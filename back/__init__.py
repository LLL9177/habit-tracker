import os
from flask import Flask
from dotenv import load_dotenv
from flask_cors import CORS

load_dotenv()

def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY=os.getenv("SECRET_KEY"),
        DATABASE=os.path.join(app.instance_path, "habit-tracker.sqlite"),
    )

    if test_config is None:
        app.config.from_pyfile("config.py", silent=True)
        app.config.update(
            SESSION_COOKIE_HTTPONLY=True,
            SESSION_COOKIE_SECURE=False,
            SESSION_COOKIE_SAMESITE=None,
            SESSION_COOKIE_PARTITIONED=None
        )
    else:
        app.config.from_mapping(test_config)
        app.config.update(
            SESSION_COOKIE_HTTPONLY=True,  # prevents JS access
            SESSION_COOKIE_SECURE=False,   # True if using HTTPS in prod
            SESSION_COOKIE_SAMESITE=None,  # prevents CSRF in most cases
            SESSION_COOKIE_PARTITIONED=None
        )

    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    from . import user, auth
    app.register_blueprint(user.bp)
    app.register_blueprint(auth.bp)

    from . import db
    db.init_app(app)
    
    CORS(app, origins=os.getenv("FRONTEND_URL"), supports_credentials=True)

    return app