from datetime import datetime
from typing import List, Optional

from bson import ObjectId
from bson.errors import InvalidId
from fastapi import HTTPException

from models.album import AlbumCreate, AlbumUpdate, AlbumInDB, PLACEHOLDER_COVER
from database.repositories.album_repository import AlbumRepository
from database.repositories.song_repository import SongRepository


# ------------------------------------------------------------------
#  AlbumService
# ------------------------------------------------------------------
class AlbumService:
    def __init__(self):
        self.album_repo = AlbumRepository()
        self.song_repo = SongRepository()

    # -------------------------- Helpers -----------------------------
    def _build_album_in_db(self, album: dict) -> AlbumInDB:
        current_year = datetime.utcnow().year
        cover = album.get("cover_art") or album.get("cover_image") or PLACEHOLDER_COVER
        release_year = (
            album.get("release_date", datetime.utcnow()).year
            if album.get("release_date")
            else (
                album.get("release_year", current_year)
                if album.get("release_year", current_year) >= 1900
                else current_year
            )
        )

        return AlbumInDB(
            id=str(album["_id"]),
            title=album.get("title", ""),
            artist_id=str(album.get("artist_id", "")),
            cover_art=cover,
            release_year=release_year,
            genre=album.get("genre", ""),
            songs=album.get("songs", []),
            created_at=album.get("created_at", datetime.utcnow()),
            updated_at=album.get("updated_at"),
        )

    # -------------------------- CRUD -----------------------------
    def get_all_albums(
        self, limit: Optional[int] = None, skip: int = 0
    ) -> List[AlbumInDB]:
        try:
            albums = self.album_repo.find_all(limit=limit, skip=skip)
            return [self._build_album_in_db(a) for a in albums]
        except Exception as e:
            raise HTTPException(
                status_code=500, detail=f"Không thể lấy danh sách album: {e}"
            )

    def get_album_by_id(self, album_id: str) -> Optional[AlbumInDB]:
        try:
            print(f"Searching for album with ID: {album_id}")
            album = self.album_repo.find_by_id(album_id)
            if not album:
                return None
            return self._build_album_in_db(album)
        except InvalidId:
            raise HTTPException(status_code=400, detail="ID album không hợp lệ")
        except Exception as e:
            raise HTTPException(
                status_code=500, detail=f"Không thể lấy thông tin album: {e}"
            )

    def create_album(self, album_data: AlbumCreate) -> str:
        try:
            new_album = album_data.dict(exclude_unset=True)
            new_album["created_at"] = datetime.utcnow()
            new_album["updated_at"] = datetime.utcnow()
            return self.album_repo.insert(new_album)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Không thể tạo album: {e}")

    def update_album(self, album_id: str, album_data: AlbumUpdate) -> bool:
        try:
            update = album_data.dict(exclude_unset=True)
            if not update:
                raise ValueError("Không có dữ liệu cập nhật được cung cấp")
            update["updated_at"] = datetime.utcnow()
            return self.album_repo.update(album_id, update)
        except InvalidId:
            raise HTTPException(status_code=400, detail="ID album không hợp lệ")
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))
        except Exception as e:
            raise HTTPException(
                status_code=500, detail=f"Không thể cập nhật album: {e}"
            )

    def delete_album(self, album_id: str) -> bool:
        try:
            return self.album_repo.delete(album_id)
        except InvalidId:
            raise HTTPException(status_code=400, detail="ID album không hợp lệ")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Không thể xóa album: {e}")

    # -------------------------- SEARCH -----------------------------
    def search_albums_by_title(
        self, keyword: str, limit: int = 20
    ) -> List[AlbumInDB]:
        """
        Tìm album theo tiêu đề (không phân biệt hoa/thường).
        Yêu cầu AlbumRepository có hàm `search_by_title`.
        """
        try:
            albums = self.album_repo.search_by_title(keyword, limit=limit)
            return [self._build_album_in_db(a) for a in albums]
        except Exception as e:
            raise HTTPException(
                status_code=500, detail=f"Không thể tìm kiếm album: {e}"
            )


# ------------------------------------------------------------------
#  Singleton & proxy export (cho search_routes import)
# ------------------------------------------------------------------
_album_service = AlbumService()


def search_albums_by_title(keyword: str, limit: int = 20):
    """
    Proxy cho AlbumService.search_albums_by_title.
    Giữ nguyên chữ ký để các module khác import dễ dàng.
    """
    return _album_service.search_albums_by_title(keyword, limit)
