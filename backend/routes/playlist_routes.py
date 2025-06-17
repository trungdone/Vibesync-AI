from fastapi import APIRouter, HTTPException
from database.db import playlists_collection
from bson import ObjectId

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
        # 1. Thử tìm bằng string ID (vì _id trong DB là string như "liked")
        playlist = playlists_collection.find_one({"_id": id})

        # 2. Nếu không tìm thấy, fallback theo title hoặc slug (không bắt buộc)
        if not playlist:
            playlist = playlists_collection.find_one({"slug": id})  # hoặc {"title": id}

        if not playlist:
            raise HTTPException(status_code=404, detail="Playlist not found")

        playlist["id"] = str(playlist["_id"])
        del playlist["_id"]
        return playlist
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid playlist ID: {str(e)}")
