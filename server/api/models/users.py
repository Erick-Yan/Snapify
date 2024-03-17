from datetime import datetime
import logging
from ..extensions import db


class Users(db.Model):
    __tablename__ = "users"
    user_id = db.Column(db.String, primary_key=True, nullable=False)
    user_name = db.Column(db.String)
    join_date = db.Column(db.DateTime, default=datetime.now())
    user_country = db.Column(db.String)
    user_type = db.Column(db.String)
    user_followers = db.Column(db.Integer)
    user_image_id = db.Column(db.String)
    user_page_id = db.Column(db.String)
    user_last_login = db.Column(db.DateTime, default=datetime.now())

    def __repre__(cls):
        return f"<User {cls.user_id}>"

    @classmethod
    def fetch_user_by_user_id(cls, user_id: str):
        return cls.query.filter_by(user_id=user_id).first()

    @classmethod
    def fetch_user_by_public_page_id(cls, user_page_id: str):
        return cls.query.filter_by(user_page_id=user_page_id).first()

    @classmethod
    def update_last_login(cls, user_id):
        user = cls.query.get(user_id)
        if user:
            user.user_last_login = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            db.session.commit()
            logging.info("Updated user_id={} user_last_login!", user.user_id)
            return True
        logging.warning("Failed to update user_id={} user_last_login!")
        return False

    @classmethod
    def create_user(
        cls,
        user_id,
        user_name,
        user_country,
        user_type,
        user_followers,
        user_image_id,
        user_page_id,
    ):
        new_user = Users(
            user_id=user_id,
            user_name=user_name,
            user_country=user_country,
            user_type=user_type,
            user_followers=user_followers,
            user_image_id=user_image_id,
            user_page_id=user_page_id,
        )
        try:
            db.session.add(new_user)
            db.session.commit()
            logging.info("Created new user!")
        except Exception:
            db.session.rollback()
            raise Exception("Failed to create new User!")

        return new_user

    def to_dict(self):
        user_dict = {
            "user_name": self.user_name,
            "user_country": self.user_country,
            "user_type": self.user_type,
            "user_followers": self.user_followers,
            "user_image_id": self.user_image_id,
            "user_page_id": self.user_page_id,
        }
        return user_dict

    @classmethod
    def user_to_dict(cls, user_id):
        user = cls.fetch_user_by_user_id(user_id)
        if user:
            return user.to_dict()
        return None
