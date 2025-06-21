# services/song_service.py
from database.db import songs_collection
from bson import ObjectId
from datetime import datetime
from typing import List, Optional
from models.song import SongCreate, SongUpdate, SongInDB

class SongService:
    @staticmethod
    def get_all_songs(sort: Optional[str] = None, limit: Optional[int] = None) -> List[SongInDB]:
        query = {}
        cursor = songs_collection.find(query)
        if sort:
            cursor = cursor.sort(sort, -1)
        if limit:
            cursor = cursor.limit(limit)
        songs = list(cursor)[:limit or 100]
        return [
            SongInDB(
                id=str(song["_id"]),
                title=song.get("title", ""),
                artist=song.get("artist", ""),
                album=song.get("album", ""),
                releaseYear=song.get("releaseYear", 0),
                duration=song.get("duration", 0),
                genre=song.get("genre", ""),
                coverArt=song.get("coverArt", ""),
                audioUrl=song.get("audioUrl", ""),
                artistId=str(song.get("artistId", ObjectId())),
                created_at=song.get("created_at", datetime.utcnow())
            )
            for song in songs
        ]

    @staticmethod
    def get_song_by_id(song_id: str) -> Optional[SongInDB]:
        song = songs_collection.find_one({"_id": ObjectId(song_id)})
        if not song:
            return None
        return SongInDB(
            id=str(song["_id"]),
            title=song.get("title", ""),
            artist=song.get("artist", ""),
            album=song.get("album", ""),
            releaseYear=song.get("releaseYear", 0),
            duration=song.get("duration", 0),
            genre=song.get("genre", ""),
            coverArt=song.get("coverArt", ""),
            audioUrl=song.get("audioUrl", ""),
            artistId=str(song.get("artistId", ObjectId())),
            created_at=song.get("created_at", datetime.utcnow())
        )

    @staticmethod
    def create_song(song_data: SongCreate) -> str:
        new_song = song_data.dict(exclude_unset=True)
        new_song["created_at"] = datetime.utcnow()
        result = songs_collection.insert_one(new_song)
        return str(result.inserted_id)

    @staticmethod
    def update_song(song_id: str, song_data: SongUpdate) -> bool:
        update_data = song_data.dict(exclude_unset=True)
        result = songs_collection.update_one(
            {"_id": ObjectId(song_id)},
            {"$set": update_data}
        )
        return result.matched_count > 0

    @staticmethod
    def delete_song(song_id: str) -> bool:
        result = songs_collection.delete_one({"_id": ObjectId(song_id)})
        return result.deleted_count > 0