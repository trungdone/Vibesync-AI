

from datetime import datetime
from typing import List, Optional, Dict

from bson import ObjectId
from bson.errors import InvalidId
from bson.regex import Regex

from database.db import songs_collection


class SongRepository:
    # ------------------------------------------------------------------
    #  Helpers
    # ------------------------------------------------------------------
    @staticmethod
    def _validate_object_id(song_id: str) -> ObjectId:
        try:
            return ObjectId(song_id)
        except InvalidId:
            raise ValueError(f"Invalid ObjectId: {song_id}")

    # ------------------------------------------------------------------
    #  Generic queries
    # ------------------------------------------------------------------
    @staticmethod
    def find_all(
        sort: Optional[str] = None,
        limit: Optional[int] = None,
        skip: Optional[int] = 0,
        query: Optional[Dict] = None,
    ) -> List[Dict]:
        try:
            cursor = songs_collection.find(query or {})
            if sort:
                cursor = cursor.sort(sort, 1)
            if skip:
                cursor = cursor.skip(skip)
            if limit:
                cursor = cursor.limit(limit)
            songs = list(cursor)
            print(
                f"Found {len(songs)} songs with query={query}, sort={sort}, skip={skip}, limit={limit}"
            )
            return songs
        except Exception as e:
            print(f"Error in find_all: {e}")
            raise ValueError(f"Failed to query songs: {e}")

    @staticmethod
    def find_by_id(song_id: str) -> Optional[Dict]:
        return songs_collection.find_one(
            {"_id": SongRepository._validate_object_id(song_id)}
        )

    @staticmethod
    def find_by_artist_id(artist_id: ObjectId) -> List[Dict]:
        try:
            songs = songs_collection.find(
                {
                    "$or": [
                        {"artistId": str(artist_id)},
                        {"artistId": artist_id},
                    ]
                }
            )
            return list(songs)
        except Exception as e:
            print(f"Error in find_by_artist_id: {e}")
            raise ValueError(f"Failed to query songs by artist_id: {e}")

    # ------------------------------------------------------------------
    #  CRUD
    # ------------------------------------------------------------------
    @staticmethod
    def insert(song_data: Dict) -> str:
        res = songs_collection.insert_one(song_data)
        return str(res.inserted_id)

    @staticmethod
    def update(song_id: str, update_data: Dict) -> bool:
        update_data["updated_at"] = datetime.utcnow()
        res = songs_collection.update_one(
            {"_id": SongRepository._validate_object_id(song_id)},
            {"$set": update_data},
        )
        return res.matched_count > 0

    @staticmethod
    def delete(song_id: str) -> bool:
        res = songs_collection.delete_one(
            {"_id": SongRepository._validate_object_id(song_id)}
        )
        return res.deleted_count > 0

    @staticmethod
    def delete_by_artist_id(artist_id: ObjectId) -> bool:
        res = songs_collection.delete_many(
            {
                "$or": [
                    {"artistId": str(artist_id)},
                    {"artistId": artist_id},
                ]
            }
        )
        return res.deleted_count > 0

    # ------------------------------------------------------------------
    #  🔍 SEARCH  (BỔ SUNG)
    # ------------------------------------------------------------------
    @staticmethod
    def search_by_title(keyword: str, limit: int = 20) -> List[Dict]:
        """
        Tìm bài hát có 'title' chứa `keyword` (không phân biệt hoa thường).
        """
        try:
            regex = Regex(keyword, "i")  # 'i' = case‑insensitive
            cursor = (
                songs_collection.find({"title": {"$regex": regex}})
                .sort("title", 1)
                .limit(limit)
            )
            results = list(cursor)
            print(f"search_by_title -> {len(results)} hit(s) for '{keyword}'")
            return results
        except Exception as e:
            print(f"Error in search_by_title: {e}")
            raise ValueError(f"Failed to search songs: {e}")
