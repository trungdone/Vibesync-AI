from fastapi import APIRouter, HTTPException, Depends
from services.artist_service import ArtistService
from models.artist import ArtistCreate, ArtistUpdate
from auth import get_current_user, get_current_admin

router = APIRouter(prefix="/artists", tags=["artists"])

@router.get("")
async def get_artists(limit: int = None):
    try:
        artists = ArtistService.get_all_artists(limit)
        return {"artists": artists, "total": len(artists)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/{id}")
async def get_artist(id: str):
    artist = ArtistService.get_artist_by_id(id)
    if not artist:
        raise HTTPException(status_code=404, detail="Artist not found")
    return artist

@router.post("", dependencies=[Depends(get_current_admin)])
async def create_artist(artist_data: ArtistCreate):
    try:
        artist_id = ArtistService.create_artist(artist_data)
        return {"id": artist_id, "message": "Artist created successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid artist data: {str(e)}")

@router.put("/{id}", dependencies=[Depends(get_current_admin)])
async def update_artist(id: str, artist_data: ArtistUpdate):
    if not ArtistService.update_artist(id, artist_data):
        raise HTTPException(status_code=404, detail="Artist not found")
    return {"message": "Artist updated successfully"}

@router.delete("/{id}", dependencies=[Depends(get_current_admin)])
async def delete_artist(id: str):
    if not ArtistService.delete_artist(id):
        raise HTTPException(status_code=404, detail="Artist not found")
    return {"message": "Artist deleted successfully"}