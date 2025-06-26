from fastapi import APIRouter, HTTPException
from database.db import playlists_collection
from bson import ObjectId
from datetime import datetime

router = APIRouter()

@router.get("/playlists")
async def get_playlists():
    playlists = list(playlists_collection.find())
    for playlist in playlists:
        playlist["id"] = str(playlist["_id"])
        del playlist["_id"]
    return playlists

@router.get("/playlists/{id}")
async def get_playlist(id: str):
    try:
        playlist = playlists_collection.find_one({"_id": id})
        if not playlist:
            playlist = playlists_collection.find_one({"slug": id})  # Fallback
        if not playlist:
            raise HTTPException(status_code=404, detail="Playlist not found")
        playlist["id"] = str(playlist["_id"])
        del playlist["_id"]
        return playlist
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid playlist ID: {str(e)}")

@router.post("/playlists")
async def create_playlist(data: dict):
    try:
        new_playlist = {
            "title": data.get("title", ""),
            "description": data.get("description", "A new playlist"),
            "creator": data.get("creator", "You"),
            "coverArt": data.get("coverArt", "https://via.placeholder.com/640x640.png?text=New+Playlist"),
            "songIds": data.get("songIds", []),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        }
        if not new_playlist["title"].strip():
            raise HTTPException(status_code=400, detail="Title cannot be empty")
        result = playlists_collection.insert_one(new_playlist)
        new_playlist["id"] = str(result.inserted_id)
        del new_playlist["_id"]  # Xóa _id gốc nếu có
        return new_playlist
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create playlist: {str(e)}")