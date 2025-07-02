from fastapi import APIRouter, HTTPException, Depends
from services.album_service import AlbumService
from models.album import AlbumCreate, AlbumUpdate, AlbumInDB
from auth import get_current_admin

router = APIRouter(prefix="/albums", tags=["albums"])

@router.get("", response_model=dict)
async def get_albums(limit: int = None, skip: int = 0):
    try:
        albums = AlbumService().get_all_albums(limit=limit, skip=skip)
        return {"albums": albums, "total": len(albums)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/{id}", response_model=AlbumInDB)
async def get_album(id: str):
    print(f"Received request for album ID: {id}")  
    album = AlbumService().get_album_by_id(id)
    if not album:
        raise HTTPException(status_code=404, detail=f"Album with ID {id} not found")
    return album

