# albums_router.py
from fastapi import APIRouter, HTTPException, Depends
from services.album_service import AlbumService
from models.album import AlbumCreate, AlbumUpdate
from auth import get_current_user

router = APIRouter(prefix="/albums", tags=["albums"])

@router.get("")
async def get_albums(limit: int = None):
    try:
        albums = AlbumService.get_all_albums(limit)
        return {"albums": albums, "total": len(albums)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/{id}")
async def get_album(id: str):
    album = AlbumService.get_album_by_id(id)
    if not album:
        raise HTTPException(status_code=404, detail="Album not found")
    return album

@router.post("", dependencies=[Depends(get_current_user)])
async def create_album(album_data: AlbumCreate):
    try:
        album_id = AlbumService.create_album(album_data)
        return {"id": album_id, "message": "Album created successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid album data: {str(e)}")

@router.put("/{id}", dependencies=[Depends(get_current_user)])
async def update_album(id: str, album_data: AlbumUpdate):
    if not AlbumService.update_album(id, album_data):
        raise HTTPException(status_code=404, detail="Album not found")
    return {"message": "Album updated successfully"}

@router.delete("/{id}", dependencies=[Depends(get_current_user)])
async def delete_album(id: str):
    if not AlbumService.delete_album(id):
        raise HTTPException(status_code=404, detail="Album not found")
    return {"message": "Album deleted successfully"}