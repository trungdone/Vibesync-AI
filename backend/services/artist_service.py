from datetime import datetime
from typing import List, Optional

from bson import ObjectId
from bson.errors import InvalidId
from fastapi import HTTPException

from models.artist import (
    ArtistCreate,
    ArtistUpdate,
    ArtistInDB,
    SongData,
    AlbumData,
)
from database.repositories.artist_repository import ArtistRepository
from database.repositories.song_repository   import SongRepository
from database.repositories.album_repository  import AlbumRepository


# ------------------------------------------------------------------
#  ArtistService
# ------------------------------------------------------------------
class ArtistService:
    def __init__(self):
        self.artist_repo = ArtistRepository()
        self.song_repo   = SongRepository()
        self.album_repo  = AlbumRepository()

    # -------------------------- Private helpers -----------------------------
    def _build_artist_in_db(
        self,
        artist: dict,
        include_songs_albums: bool = False,
        artist_id: Optional[ObjectId] = None,
    ) -> ArtistInDB:
        # Lấy danh sách bài hát & album kèm theo (nếu cần)
        if include_songs_albums and artist_id:
            songs  = self.song_repo.find_by_artist_id(artist_id)
            albums = self.album_repo.find_by_artist_id(artist_id)

            song_data = [
                SongData(
                    id=str(s["_id"]),
                    title=s.get("title", ""),
                    album=s.get("album"),
                    releaseYear=s.get("releaseYear", 0),
                    coverArt=s.get("coverArt"),
                    audioUrl=s.get("audioUrl"),
                    genre=(s.get("genre", [])[0]
                           if isinstance(s.get("genre", []), list) and s.get("genre")
                           else ""),
                )
                for s in songs
            ]
            album_data = [
                AlbumData(
                    id=str(a["_id"]),
                    title=a.get("title", ""),
                    releaseYear=a.get("releaseYear", 0),
                    coverArt=a.get("coverArt"),
                )
                for a in albums
            ]
        else:
            song_data = []
            album_data = []

        # Map sang ArtistInDB
        return ArtistInDB(
            id=str(artist["_id"]),
            name=artist.get("name", ""),
            bio=artist.get("bio"),
            image=artist.get("image"),
            genres=artist.get("genres", []),
            followers=artist.get("followers", 0),
            songs=song_data,
            albums=album_data,
            created_at=artist.get("created_at", datetime.utcnow()),
            updated_at=artist.get("updated_at"),
        )

    # -------------------------- CRUD -----------------------------
    def get_all_artists(
        self,
        skip: int = 0,
        limit: Optional[int] = None,
        include_songs_albums: bool = False,
    ) -> List[ArtistInDB]:
        try:
            artists = self.artist_repo.find_all(skip=skip, limit=limit)
            return [
                self._build_artist_in_db(a, include_songs_albums, a["_id"])
                for a in artists
            ]
        except Exception as e:
            raise HTTPException(
                status_code=500, detail=f"Không thể lấy danh sách nghệ sĩ: {e}"
            )

    def get_artist_by_id(self, artist_id: str) -> Optional[ArtistInDB]:
        try:
            artist = self.artist_repo.find_by_id(ObjectId(artist_id))
            if not artist:
                return None
            return self._build_artist_in_db(
                artist, include_songs_albums=True, artist_id=ObjectId(artist_id)
            )
        except InvalidId:
            raise HTTPException(status_code=400, detail="ID nghệ sĩ không hợp lệ")
        except Exception as e:
            raise HTTPException(
                status_code=500, detail=f"Không thể lấy thông tin nghệ sĩ: {e}"
            )

    def create_artist(self, artist_data: ArtistCreate) -> str:
        try:
            new_artist = artist_data.dict(exclude_unset=True)
            if not new_artist.get("name"):
                raise ValueError("Tên nghệ sĩ là bắt buộc")
            new_artist["followers"] = new_artist.get("followers", 0)
            new_artist["created_at"] = datetime.utcnow()
            new_artist["updated_at"] = datetime.utcnow()

            result = self.artist_repo.insert_one(new_artist)
            return str(result.inserted_id)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))
        except Exception as e:
            raise HTTPException(
                status_code=500, detail=f"Không thể tạo nghệ sĩ: {e}"
            )

    def update_artist(self, artist_id: str, artist_data: ArtistUpdate) -> bool:
        try:
            update_data = artist_data.dict(exclude_unset=True)
            if not update_data:
                raise ValueError("Không có dữ liệu cập nhật được cung cấp")
            update_data["updated_at"] = datetime.utcnow()

            result = self.artist_repo.update_one(ObjectId(artist_id), update_data)
            return result.matched_count > 0
        except InvalidId:
            raise HTTPException(status_code=400, detail="ID nghệ sĩ không hợp lệ")
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))
        except Exception as e:
            raise HTTPException(
                status_code=500, detail=f"Không thể cập nhật nghệ sĩ: {e}"
            )

    def delete_artist(self, artist_id: str) -> bool:
        try:
            res = self.artist_repo.delete_one(ObjectId(artist_id))
            if res.deleted_count:
                self.song_repo.delete_by_artist_id(ObjectId(artist_id))
                self.album_repo.delete_by_artist_id(ObjectId(artist_id))
                return True
            return False
        except InvalidId:
            raise HTTPException(status_code=400, detail="ID nghệ sĩ không hợp lệ")
        except Exception as e:
            raise HTTPException(
                status_code=500, detail=f"Không thể xóa nghệ sĩ: {e}"
            )

    # -------------------------- SEARCH -----------------------------
    def search_by_name(self, keyword: str, limit: int = 20) -> List[ArtistInDB]:
        """
        Tìm nghệ sĩ theo tên, không phân biệt hoa thường.
        Yêu cầu ArtistRepository có hàm `search_by_name`.
        """
        try:
            artists = self.artist_repo.search_by_name(keyword, limit=limit)
            return [
                self._build_artist_in_db(a, include_songs_albums=False)
                for a in artists
            ]
        except Exception as e:
            raise HTTPException(
                status_code=500, detail=f"Không thể tìm kiếm nghệ sĩ: {e}"
            )


# ------------------------------------------------------------------
#  Singleton & proxy export  (cho search_routes import)
# ------------------------------------------------------------------
_artist_service = ArtistService()


def search_by_name(keyword: str, limit: int = 20):
    """
    Proxy cho ArtistService.search_by_name.
    Giữ nguyên chữ ký để các module khác import dễ dàng.
    """
    return _artist_service.search_by_name(keyword, limit)
