import sys
import os
from datetime import datetime

sys.path.insert(0, "../api/")
from app import db


class User(db.Model):
    __tablename__ = "user"
    user_id = db.Column(db.String(100), primary_key=True, nullable=False)
    user_name = db.Column(db.String(100))
    join_date = db.Column(db.DateTime, default=datetime.utcnow)


class Songs(db.Model):
    __tablename__ = "songs"
    user_id = db.Column(db.String(100), primary_key=True, nullable=False)
    song_id = db.Column(db.String(100), nullable=False)


class Lyrics(db.Model):
    __tablename__ = "lyrics"
    user_id = db.Column(db.String(100), primary_key=True, nullable=False)
    lyric_id = db.Column(db.String(100), nullable=False)
    lyrics = db.Column(db.String(100), nullable=True)


class Artists(db.Model):
    __tablename__ = "artists"
    user_id = db.Column(db.String(100), primary_key=True, nullable=False)
    artist_id = db.Column(db.String(100), nullable=False)
    artist_image_id = db.Column(db.String(100), nullable=False)
    artist_name = db.Column(db.String(100), nullable=True)
    artist_genres = db.Column(db.String(100), nullable=True)


class Playlists(db.Model):
    __tablename__ = "playlists"
    user_id = db.Column(db.String(100), primary_key=True, nullable=False)
    playlist_id = db.Column(db.String(100), nullable=False)
    playlist_description = db.Column(db.String(100), nullable=True)
