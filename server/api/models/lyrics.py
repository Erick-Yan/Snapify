import logging
from ..extensions import db


class Lyrics(db.Model):
    __tablename__ = "lyrics"
    lyric_id = db.Column(db.String, primary_key=True, nullable=False)
    user_id = db.Column(db.String, nullable=False)
    lyrics = db.Column(db.String, nullable=True)

    def __repre__(cls):
        return f"<Lyrics {cls.user_id}>"

    @classmethod
    def fetch_lyrics_by_user_id(cls, user_id):
        return cls.query.filter_by(user_id=user_id).first()

    @classmethod
    def create_lyrics(cls, user_id, lyric_data):
        try:
            new_lyrics = cls(
                user_id=user_id,
                lyric_id=lyric_data.get("lyric_id"),
                lyrics=lyric_data.get("lyrics"),
            )
            db.session.add(new_lyrics)
            db.session.commit()
            logging.info("Saved lyrics: ", lyric_data)
            return new_lyrics
        except Exception as e:
            db.session.rollback()
            logging.error("Failed to save lyrics: ", lyric_data)
            raise e

    @classmethod
    def delete_lyrics(cls, user_id):
        try:
            lyrics_to_delete = cls.query.filter_by(user_id=user_id).first()
            if lyrics_to_delete:
                db.session.delete(lyrics_to_delete)
                db.session.commit()
        except Exception as e:
            db.session.rollback()
            raise e

    def to_dict(self):
        lyrics_dict = {
            "user_id": self.user_id,
            "lyric_id": self.lyric_id,
            "lyrics": self.lyrics,
        }
        return lyrics_dict

    @classmethod
    def lyrics_to_dict(cls, user_id):
        lyrics = cls.fetch_lyrics_by_user_id(user_id)
        if lyrics:
            return lyrics.to_dict()
        return None
