#playlist_routes
from fastapi import APIRouter, HTTPException
from database.db import playlists_collection
from bson import ObjectId, errors
from datetime import datetime
from pydantic import BaseModel

from models.playlist import PlaylistCreate
from services.playlist_service import PlaylistService



router = APIRouter()
playlist_service = PlaylistService()

from typing import Optional

@router.get("/playlists")
async def get_playlists(creator: Optional[str] = None):
    query = {"creator": creator} if creator else {}
    playlists = list(playlists_collection.find(query))
    for playlist in playlists:
        playlist["id"] = str(playlist["_id"])
        del playlist["_id"]
    return playlists


@router.get("/playlists/{id}")
async def get_playlist(id: str):
    try:
        # Nếu không phải ObjectId → fallback slug
        try:
            _id = ObjectId(id)
            playlist = playlists_collection.find_one({"_id": _id})
        except errors.InvalidId:
            playlist = playlists_collection.find_one({"slug": id})

        if not playlist:
            raise HTTPException(status_code=404, detail="Playlist not found")

        playlist["id"] = str(playlist["_id"])
        del playlist["_id"]
        return playlist

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid playlist ID: {str(e)}")

@router.post("/playlists")
async def create_playlist(data: PlaylistCreate):
    try:
        playlist_id = playlist_service.create_playlist(data)
        return {"id": playlist_id, "message": "Playlist created successfully"}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create playlist: {str(e)}")
    

class AddSongRequest(BaseModel):
    songId: str

@router.patch("/playlists/{playlist_id}/add-song")
async def add_song_to_playlist(playlist_id: str, data: dict):
    song_id = data.get("songId")
    if not song_id:
        raise HTTPException(status_code=400, detail="Song ID is required")

    result = playlists_collection.update_one(
        {"_id": ObjectId(playlist_id)},
        {"$addToSet": {"songIds": song_id}}
    )

    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Playlist not found or song already added")

    return {"message": "Song added to playlist"}


class SongIdRequest(BaseModel):
    songId: str

@router.delete("/{playlist_id}/remove-song")
async def remove_song_from_playlist(playlist_id: str, data: SongIdRequest):
    try:
        success = playlist_service.remove_song_from_playlist(playlist_id, data.songId)
        if not success:
            raise HTTPException(status_code=400, detail="Failed to remove song")
        return {"message": "Song removed from playlist successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error removing song: {str(e)}")