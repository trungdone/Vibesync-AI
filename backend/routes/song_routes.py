# routes/song_routes.py

from fastapi import APIRouter
from database.db import songs_collection

router = APIRouter()

@router.get("/songs")
def get_all_songs():
    songs = list(songs_collection.find({}, {"_id": 0}))
    return songs
