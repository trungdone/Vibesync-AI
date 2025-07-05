from datetime import datetime
from typing import List, Optional

from bson import ObjectId
from urllib.request import urlopen
from urllib.error import HTTPError

from database.repositories.song_repository import SongRepository
from database.repositories.artist_repository import ArtistRepository
from models.song import SongCreate, SongUpdate, SongInDB

# ---------------------------------------------------------------------------------
#  SongService
# ---------------------------------------------------------------------------------
class SongService:
    def __init__(self, song_repository: SongRepository, artist_repository: ArtistRepository):
        self.song_repository = song_repository
        self.artist_repository = artist_repository

    # ---------- Helpers ----------
    @staticmethod
    def _map_to_song_in_db(song: dict) -> SongInDB:
        return SongInDB(
            id=str(song["_id"]),
            title=song.get("title", ""),
            artist=song.get("artist", ""),
            album=song.get("album", ""),
            releaseYear=song.get("releaseYear", 0),
            duration=song.get("duration", 0),
            genre=song.get("genre", []),
            coverArt=song.get("coverArt", ""),
            audioUrl=song.get("audioUrl", ""),
            artistId=str(song.get("artistId", "")),
            created_at=song.get("created_at", datetime.utcnow()),
            updated_at=song.get("updated_at", None),
        )

    @staticmethod
    def _is_url_accessible(url: str) -> bool:
        try:
            with urlopen(url, timeout=5) as resp:
                return resp.status == 200
        except HTTPError:
            return False

    # ---------- CRUD ----------
    def get_all_songs(self, sort: Optional[str] = None, limit: Optional[int] = None) -> List[SongInDB]:
        songs = self.song_repository.find_all(sort=sort, limit=limit)
        return [self._map_to_song_in_db(s) for s in songs]

    def get_song_by_id(self, song_id: str) -> Optional[SongInDB]:
        song = self.song_repository.find_by_id(song_id)
        return self._map_to_song_in_db(song) if song else None

    def create_song(self, song_data: SongCreate) -> str:
        # 1) Kiểm tra artistId tồn tại
        if not self.artist_repository.find_by_id(ObjectId(song_data.artistId)):
            raise ValueError(f"Artist with ID {song_data.artistId} does not exist")

        # 2) Kiểm tra URL media
        if song_data.audioUrl and not self._is_url_accessible(song_data.audioUrl):
            raise ValueError("Invalid or inaccessible audio URL")
        if song_data.coverArt and not self._is_url_accessible(song_data.coverArt):
            raise ValueError("Invalid or inaccessible cover art URL")

        new_song = song_data.dict(exclude_unset=True)
        new_song["artistId"] = str(new_song["artistId"])
        new_song["created_at"] = datetime.utcnow()
        new_song["updated_at"] = None
        return str(self.song_repository.insert(new_song))

    def update_song(self, song_id: str, song_data: SongUpdate) -> bool:
        update = song_data.dict(exclude_unset=True)

        if "artistId" in update:
            if not self.artist_repository.find_by_id(ObjectId(update["artistId"])):
                raise ValueError(f"Artist with ID {update['artistId']} does not exist")
            update["artistId"] = str(update["artistId"])

        if "audioUrl" in update and update["audioUrl"]:
            if not self._is_url_accessible(update["audioUrl"]):
                raise ValueError("Invalid or inaccessible audio URL")

        if "coverArt" in update and update["coverArt"]:
            if not self._is_url_accessible(update["coverArt"]):
                raise ValueError("Invalid or inaccessible cover art URL")

        return self.song_repository.update(song_id, update)

    def delete_song(self, song_id: str) -> bool:
        return self.song_repository.delete(song_id)

    # ---------- SEARCH ----------
    def search_by_title(self, keyword: str, limit: int = 20) -> List[SongInDB]:
        """
        Tìm bài hát có tiêu đề khớp `keyword` (không phân biệt hoa thường).
        """
        songs = self.song_repository.search_by_title(keyword, limit=limit)
        return [self._map_to_song_in_db(s) for s in songs]


# ---------------------------------------------------------------------------------
#  Singleton & hàm export module‑level
# ---------------------------------------------------------------------------------
_song_repo = SongRepository()
_artist_repo = ArtistRepository()
song_service = SongService(_song_repo, _artist_repo)

# Hàm này để `search_service.py` import cho tiện:
def search_by_title(keyword: str, limit: int = 20):
    """
    Proxy gọi sang SongService.search_by_title.
    Giữ nguyên chữ ký đồng bộ -> search_service không cần sửa gì.
    """
    return song_service.search_by_title(keyword, limit=limit)
