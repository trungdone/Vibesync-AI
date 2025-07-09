from fastapi import APIRouter, HTTPException, Depends
from services.album_service import AlbumService
from models.album import AlbumCreate, AlbumUpdate, AlbumInDB
from auth import get_current_admin

router = APIRouter(prefix="/albums", tags=["albums"])

album_service = AlbumService()

@router.get("", response_model=dict)
async def get_albums(limit: int = 10, skip: int = 0):
    """
    Lấy danh sách các album với phân trang.
    """
    try:
        albums = album_service.get_all_albums(limit=limit, skip=skip)
        return {
            "albums": albums,
            "total": len(albums),
            "skip": skip,
            "limit": limit
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/{id}", response_model=AlbumInDB)
async def get_album(id: str):
    """
    Lấy chi tiết một album theo ID.
    """
    print(f"Received request for album ID: {id}")  # Debug log
    album = album_service.get_album_by_id(id)
    if not album:
        raise HTTPException(status_code=404, detail=f"Album with ID {id} not found")
    return album

@router.post("", dependencies=[Depends(get_current_admin)], response_model=dict)
async def create_album(album_data: AlbumCreate):
    """
    Tạo mới một album (chỉ admin).
    """
    try:
        album_id = album_service.create_album(album_data)
        return {"id": album_id, "message": "Album created successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid album data: {str(e)}")

@router.put("/{id}", dependencies=[Depends(get_current_admin)], response_model=dict)
async def update_album(id: str, album_data: AlbumUpdate):
    """
    Cập nhật thông tin album (chỉ admin).
    """
    if not album_service.update_album(id, album_data):
        raise HTTPException(status_code=404, detail="Album not found")
    return {"message": "Album updated successfully"}

@router.delete("/{id}", dependencies=[Depends(get_current_admin)], response_model=dict)
async def delete_album(id: str):
    """
    Xoá một album (chỉ admin).
    """
    if not album_service.delete_album(id):
        raise HTTPException(status_code=404, detail="Album not found")
    return {"message": "Album deleted successfully"}
