import json
from flask import Blueprint, request, session, g
from .db import get_db
import functools

bp = Blueprint("user", __name__, url_prefix="/user")

def login_required(view):
    @functools.wraps(view)
    def wrapped_view(**kwargs):
        if g.user is None:
            return {"error": "User is not logged in"}
        
        return view(**kwargs)
        
    return wrapped_view

def parse_date(date):
    arr = date.split(':')
    for i in range(len(arr)):
        try:
            arr[i] = int(arr[i])
        except Exception:
            return [None, None, None]
    
    return arr

@login_required
@bp.route("/get_data", methods=["POST"])
def get_user_data():
    db = get_db()
    data = None
    error = None

    if g.user:
        try:
            data = db.execute("SELECT * FROM data WHERE user_id = ?", (g.user["id"],)).fetchone()
        except Exception as e:
            error = "Something is up with the database."
            print("Exception in /get_data (get_user_data) fetching data: " + str(e))
    else:
        error = "You are not logged in"

    if error is not None:
        return {"error": error}

    return {"data": data["data"]}

@login_required
@bp.route("/post_data", methods=["POST"])
def post_user_data():
    db = get_db()
    data_json = request.json.get("data")
    db_data = None
    prev_streak = 0
    error = None

    if g.user:
        try:
            db_data = db.execute("SELECT data FROM data WHERE user_id = ?", (g.user["id"],)).fetchone()[0]
        except Exception as e:
            error = "Something went wrong."
            print("Exception in /user/post_data fetching data: " + str(e))

        if db_data:
            db_data = json.loads(db_data) # expects an array of objects. I mean there couldn't be anything else
            #loop over the whole thing to see if the same day already exists
            editing = None
            for index, day_info in enumerate(db_data):
                if isinstance(day_info, int): continue
                if day_info["date"] == data_json["date"]:
                    editing = index
                    break
                else:
                    di_day, di_month, di_year = parse_date(day_info["date"])
                    dj_day, dj_month, dj_year = parse_date(data_json["date"])
                    if di_month == dj_month and di_year == dj_year and dj_day-1 == di_day:
                        prev_streak = day_info["streak"]
                
            if data_json["isStreakAlive"] == True:
                # please change the way you get the streak when you add tabs.
                db_data[0] = prev_streak + 1
                if db_data[1] < db_data[0]: db_data[1] = db_data[0] + 0
                data_json["streak"] = prev_streak + 1
            elif data_json["isStreakAlive"] == False:
                db_data[0] = 0
                data_json["streak"] = db_data[0]

            if editing:
                db_data[editing] = dict(data_json)
                print(editing)
                print(data_json)
                print(db_data)
            else:
                db_data.append(data_json)

            try:
                db.execute("UPDATE data SET data = ? WHERE user_id = ?", (json.dumps(db_data), g.user["id"]))
                db.commit()
            except Exception as e:
                error = "Something went wrong."
                print("Exception in /user/post_data setting data: " + str(e))
            try:
                db_data = db.execute("SELECT data FROM data WHERE user_id = ?", (g.user["id"],)).fetchone()[0]
            except Exception as e:
                error = "Something went wrong."
                print("Exception in /user/post_data fetching new data: " + str(e))
        else:
            error = "Something went wrong."

    else:
        error = "You are not logged in."
    
    if error is not None:
        return {"error": error}
    
    return {
        "message": "Updated successfully!",
        "data": db_data
    }

@bp.route("/get_username", methods=["POST"])
def get_username():
    error = None
    db=get_db()

    try:
        username = db.execute("SELECT username FROM user WHERE id = ?", (g.user["id"],)).fetchone()[0]
    except Exception as e:
        error = "Something went wrong."
        print("Exception in get_username: " + str(e))

    if error is not None:
        return {"error": error}

    return {"username": username}