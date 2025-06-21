# songs_router.py
from fastapi import APIRouter, HTTPException, Depends
from services.song_service import SongService
from models.song import SongCreate, SongUpdate
from auth import get_current_user

router = APIRouter(prefix="/songs", tags=["songs"])

@router.get("")
async def get_songs(sort: str = None, limit: int = None):
    try:
        songs = SongService.get_all_songs(sort, limit)
        return {"songs": songs, "total": len(songs)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/{id}")
async def get_song(id: str):
    song = SongService.get_song_by_id(id)
    if not song:
        raise HTTPException(status_code=404, detail="Song not found")
    return song

@router.post("", dependencies=[Depends(get_current_user)])
async def create_song(song_data: SongCreate):
    try:
        song_id = SongService.create_song(song_data)
        return {"id": song_id, "message": "Song created successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid song data: {str(e)}")

@router.put("/{id}", dependencies=[Depends(get_current_user)])
async def update_song(id: str, song_data: SongUpdate):
    if not SongService.update_song(id, song_data):
        raise HTTPException(status_code=404, detail="Song not found")
    return {"message": "Song updated successfully"}

@router.delete("/{id}", dependencies=[Depends(get_current_user)])
async def delete_song(id: str):
    if not SongService.delete_song(id):
        raise HTTPException(status_code=404, detail="Song not found")
    return {"message": "Song deleted successfully"}