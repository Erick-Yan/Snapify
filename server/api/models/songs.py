import logging
from ..extensions import db


class Songs(db.Model):
    __tablename__ = "songs"
    song_id = db.Column(db.String, primary_key=True, nullable=False)
    user_id = db.Column(db.String, nullable=False)
    song_name = db.Column(db.String, nullable=False)
    song_artists = db.Column(db.String, nullable=False)
    song_image_id = db.Column(db.String)

    def __repre__(cls):
        return f"<Song {cls.user_id}>"

    @classmethod
    def fetch_song_by_user_id(cls, user_id):
        return cls.query.filter_by(user_id=user_id).first()

    @classmethod
    def create_song(cls, user_id, song_data):
        try:
            new_song = cls(
                user_id=user_id,
                song_id=song_data.get("song_id"),
                song_name=song_data.get("song_name"),
                song_artists=song_data.get("song_artists"),
                song_image_id=song_data.get("song_image_id"),
            )
            db.session.add(new_song)
            db.session.commit()
            logging.info("Saved song: ", song_data)
            return new_song
        except Exception as e:
            db.session.rollback()
            logging.error("Failed to save song: ", song_data)
            raise e

    @classmethod
    def delete_song(cls, user_id):
        try:
            song_to_delete = cls.query.filter_by(user_id=user_id).first()
            if song_to_delete:
                db.session.delete(song_to_delete)
                db.session.commit()
        except Exception as e:
            db.session.rollback()
            raise e

    def to_dict(self):
        song_dict = {
            "user_id": self.user_id,
            "song_id": self.song_id,
            "song_name": self.song_name,
            "song_artists": self.song_artists,
            "song_image_id": self.song_image_id,
        }
        return song_dict

    @classmethod
    def song_to_dict(cls, user_id):
        song = cls.fetch_song_by_user_id(user_id)
        if song:
            return song.to_dict()
        return None
