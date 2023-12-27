from ..extensions import db


class Playlists(db.Model):
    __tablename__ = "playlists"
    playlist_id = db.Column(db.String, primary_key=True, nullable=False)
    user_id = db.Column(db.String, nullable=False)
    playlist_name = db.Column(db.String, nullable=False)
    playlist_image_id = db.Column(db.String)
    playlist_description = db.Column(db.String)

    def __repre__(cls):
        return f"<Playlist {cls.user_id}>"

    @classmethod
    def fetch_playlist_by_user_id(cls, user_id):
        return cls.query.filter_by(user_id=user_id).first()

    @classmethod
    def create_playlist(cls, user_id, playlist_data):
        try:
            new_playlist = cls(
                user_id=user_id,
                playlist_id=playlist_data.get("id"),
                playlist_name=playlist_data.get("playlist_name"),
                playlist_image_id=playlist_data.get("image_id"),
                playlist_description=playlist_data.get("description"),
            )
            db.session.add(new_playlist)
            db.session.commit()
            return new_playlist
        except Exception as e:
            db.session.rollback()
            raise e

    @classmethod
    def delete_playlist(cls, user_id):
        try:
            playlist_to_delete = cls.query.filter_by(user_id=user_id).first()
            if playlist_to_delete:
                db.session.delete(playlist_to_delete)
                db.session.commit()
        except Exception as e:
            db.session.rollback()
            raise e

    def to_dict(self):
        playlist_dict = {
            "user_id": self.user_id,
            "playlist_id": self.playlist_id,
            "playlist_name": self.playlist_name,
            "playlist_image_id": self.playlist_image_id,
            "playlist_description": self.playlist_description,
        }
        return playlist_dict

    @classmethod
    def playlist_to_dict(cls, user_id):
        playlist = cls.fetch_playlist_by_user_id(user_id)
        if playlist:
            return playlist.to_dict()
        return None
