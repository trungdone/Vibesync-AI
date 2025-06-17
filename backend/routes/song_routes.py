from fastapi import APIRouter, HTTPException, Body
from database.db import songs_collection, song_history_collection
from bson import ObjectId
from datetime import datetime

router = APIRouter()

@router.get("/songs")
async def get_songs(sort: str = None, limit: int = None):
    query = {}
    cursor = songs_collection.find(query)
    if sort:
        cursor = cursor.sort(sort, -1)  # Sort descending
    if limit:
        cursor = cursor.limit(limit)
    songs = list(cursor)[:limit or 100]  # Convert cursor to list
    for song in songs:
        song["id"] = str(song["_id"])
        del song["_id"]
    return songs

@router.get("/songs/{id}")
async def get_song(id: str):
    try:
        song = songs_collection.find_one({"_id": ObjectId(id)})
        if not song:
            raise HTTPException(status_code=404, detail="Song not found")
        song["id"] = str(song["_id"])
        del song["_id"]
        return song
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid song ID")
    




