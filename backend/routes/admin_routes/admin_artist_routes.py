from fastapi import APIRouter, HTTPException, Depends
from services.admin_service.admin_artist_service import AdminArtistService
from database.repositories.artist_repository import ArtistRepository
from models.artist import ArtistCreate, ArtistUpdate, ArtistInDB
from auth import get_current_admin

router = APIRouter(prefix="/admin/artists", tags=["admin_artists"])

# Khởi tạo service quản lý nghệ sĩ cho admin
service = AdminArtistService(ArtistRepository())

@router.get("", response_model=dict, dependencies=[Depends(get_current_admin)])
async def get_artists(skip: int = 0, limit: int = 20):
    """
    Lấy danh sách tất cả nghệ sĩ (dành cho admin)
    """
    try:
        artists = service.get_all_artists(skip=skip, limit=limit)
        return {
            "artists": artists,
            "total": len(artists),
            "skip": skip,
            "limit": limit
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Không thể lấy danh sách nghệ sĩ: {str(e)}")

@router.get("/search", response_model=dict, dependencies=[Depends(get_current_admin)])
async def search_artists(name: str, skip: int = 0, limit: int = 20):
    """
    Tìm kiếm nghệ sĩ theo tên
    """
    try:
        artists = service.search_artists(name)
        return {"artists": artists, "total": len(artists)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Không thể tìm nghệ sĩ: {str(e)}")

@router.get("/{artist_id}", response_model=ArtistInDB, dependencies=[Depends(get_current_admin)])
async def get_artist_by_id(artist_id: str):
    """
    Lấy thông tin chi tiết của 1 nghệ sĩ theo ID
    """
    artist = service.get_artist_by_id(artist_id)
    if not artist:
        raise HTTPException(status_code=404, detail="Nghệ sĩ không tìm thấy")
    return artist

@router.post("", dependencies=[Depends(get_current_admin)], response_model=dict)
async def create_artist(artist: ArtistCreate):
    """
    Tạo mới nghệ sĩ
    """
    try:
        artist_id = service.create_artist(artist)
        return {"id": artist_id, "message": "Tạo nghệ sĩ thành công"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{artist_id}", dependencies=[Depends(get_current_admin)], response_model=dict)
async def update_artist(artist_id: str, artist: ArtistUpdate):
    """
    Cập nhật thông tin nghệ sĩ
    """
    updated = service.update_artist(artist_id, artist)
    if not updated:
        raise HTTPException(status_code=404, detail="Nghệ sĩ không tìm thấy")
    return {"message": "Cập nhật nghệ sĩ thành công"}

@router.delete("/{artist_id}", dependencies=[Depends(get_current_admin)], response_model=dict)
async def delete_artist(artist_id: str):
    """
    Xoá nghệ sĩ khỏi hệ thống
    """
    deleted = service.delete_artist(artist_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Nghệ sĩ không tìm thấy")
    return {"message": "Xóa nghệ sĩ thành công"}
