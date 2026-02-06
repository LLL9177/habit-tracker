from flask import Blueprint, request, session, g
from markupsafe import escape
from .db import get_db
from werkzeug.security import generate_password_hash, check_password_hash
import json

bp = Blueprint("auth", __name__, url_prefix="/auth")

@bp.route("/register", methods=["POST"])
def register():
    username = escape(request.json.get("username").strip())
    password = escape(request.json.get("password").strip())
    password_again = escape(request.json.get("passwordAgain").strip())
    db = get_db()
    error = None

    if password != password_again:
        error = "Passwords don't match."

    if error is None:
        try:
            password = generate_password_hash(password)
            db.execute("INSERT INTO user (username, password) VALUES (?, ?)", (username, password))
            db.commit()
            user_id = db.execute("SELECT id FROM user WHERE username = ?", (username,)).fetchone()[0]
            db.execute("INSERT INTO data (user_id, data) VALUES (?, ?)", (user_id, json.dumps([0, 0]))) # 1st 0 is current streak, 2nd 0 is all time best
            db.commit()
        except Exception as e:
            error = "Something is up with the database. Fixing"
            print("Exception in /auth/register: " + str(e))

    if error is not None:
        return {"error": error}
    
    session["user_id"] = user_id
    
    return {
        "message": "Successfully registered!",
    }

@bp.route("/login", methods=["POST"])
def login():
    username = escape(request.json.get("username").strip())
    password = escape(request.json.get("password").strip())
    db = get_db()
    error = None

    try:
        user = db.execute("SELECT * FROM user WHERE username = ?", (username,)).fetchone()
        if username != user["username"] or not check_password_hash(user["password"], password):
            error = "Login or password is incorrect."
    except Exception as e:
        error = "Something is up with the database. Fixing"
        print("Exception in /auth/login: " + str(e))

    if error is not None:
        return {"error": error}

    ret = {"message": "Successfully loged in!"}
    
    session["user_id"] = user["id"]

    return ret

@bp.route("/logout", methods=["POST"])
def logout():
    session["user_id"] = None
    return {"message": "logged out sucessfully!"}

@bp.before_app_request
def load_logged_in_user():
    user_id = session.get("user_id")
    if user_id is None:
        g.user = None
    else:
        g.user = get_db().execute("SELECT * FROM user WHERE id = ?", (user_id,)).fetchone()