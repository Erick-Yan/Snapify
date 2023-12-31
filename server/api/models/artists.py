import logging
from ..extensions import db


class Artists(db.Model):
    __tablename__ = "artists"
    artist_id = db.Column(db.String, primary_key=True, nullable=False)
    user_id = db.Column(db.String, nullable=False)
    artist_image_id = db.Column(db.String)
    artist_name = db.Column(db.String, nullable=True)
    artist_genres = db.Column(db.String, nullable=True)

    def __repre__(cls):
        return f"<Artist {cls.user_id}>"

    @classmethod
    def fetch_artists_by_user_id(cls, user_id):
        return cls.query.filter_by(user_id=user_id).all()

    @classmethod
    def create_artists(cls, user_id, artists):
        new_artists = []
        for artist in artists:
            new_artist = cls(
                user_id=user_id,
                artist_id=artist.get("artist_id"),
                artist_image_id=artist.get("artist_image_id"),
                artist_name=artist.get("artist_name"),
                artist_genres=artist.get("artist_genres"),
            )
            new_artists.append(new_artist)
        try:
            db.session.add_all(new_artists)
            db.session.commit()
            logging.info("Saved artists: ", artists)
        except Exception as e:
            db.session.rollback()
            logging.error("Failed to save artists: ", artists)
            raise e
        return new_artists

    @classmethod
    def delete_artists(cls, user_id):
        try:
            artists_to_delete = cls.query.filter_by(user_id=user_id).all()
            for artist in artists_to_delete:
                db.session.delete(artist)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            raise e

    def to_dict(self):
        artist_dict = {
            "user_id": self.user_id,
            "artist_id": self.artist_id,
            "artist_image_id": self.artist_image_id,
            "artist_name": self.artist_name,
            "artist_genres": self.artist_genres,
        }
        return artist_dict

    @classmethod
    def artists_to_dict(cls, user_id):
        artists = cls.fetch_artists_by_user_id(user_id)
        if artists:
            return [artist.to_dict() for artist in artists]
        return None
