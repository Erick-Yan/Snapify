from datetime import datetime, timedelta
import logging
import sys

sys.path.insert(0, "../../api/utils.py")
from ..extensions import db


class Followers(db.Model):
    __tablename__ = "followers"
    user_id = db.Column(db.String, primary_key=True, nullable=False)
    follow_date = db.Column(db.DateTime, default=datetime.now())
    follower_id = db.Column(db.String, nullable=False)

    def __repre__(cls):
        return f"<Follower {cls.user_id}>"

    @classmethod
    def fetch_follower_by_user_id(cls, user_id: str, follower_id: str):
        return cls.query.filter_by(user_id=user_id, follower_id=follower_id).first()

    @classmethod
    def create_follower(
        cls,
        user_id,
        follower_id,
    ):
        new_follower = Followers(
            user_id=user_id,
            follower_id=follower_id,
        )
        try:
            db.session.add(new_follower)
            db.session.commit()
            logging.info("Created new Follower!")
        except Exception:
            db.session.rollback()
            raise Exception("Failed to create new Follower!")

        return new_follower
