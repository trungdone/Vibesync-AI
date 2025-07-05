from datetime import datetime
from typing import List, Optional, Dict

from bson import ObjectId
from bson.errors import InvalidId
from bson.regex import Regex

from database.db import albums_collection


class AlbumRepository:
    # ------------------------------------------------------------------
    #  Helpers
    # ------------------------------------------------------------------
    @staticmethod
    def _validate_object_id(album_id: str) -> ObjectId:
        try:
            return ObjectId(album_id)
        except InvalidId:
            raise ValueError(f"Invalid ObjectId: {album_id}")

    # ------------------------------------------------------------------
    #  Generic queries
    # ------------------------------------------------------------------
    @staticmethod
    def find_all(limit: Optional[int] = None, skip: int = 0) -> List[Dict]:
        try:
            cursor = albums_collection.find().skip(skip)
            if limit:
                cursor = cursor.limit(limit)
            return list(cursor)
        except Exception as e:
            raise ValueError(f"Failed to query albums: {e}")

    @staticmethod
    def find_by_id(album_id: str) -> Optional[Dict]:
        return albums_collection.find_one(
            {"_id": AlbumRepository._validate_object_id(album_id)}
        )

    @staticmethod
    def find_by_artist_id(artist_id: ObjectId) -> List[Dict]:
        try:
            albums = albums_collection.find(
                {
                    "$or": [
                        {"artist_id": str(artist_id)},
                        {"artist_id": artist_id},
                    ]
                }
            )
            return list(albums)
        except Exception as e:
            raise ValueError(f"Failed to query albums by artist_id: {e}")

    # ------------------------------------------------------------------
    #  CRUD
    # ------------------------------------------------------------------
    @staticmethod
    def insert(album_data: Dict) -> str:
        res = albums_collection.insert_one(album_data)
        return str(res.inserted_id)

    @staticmethod
    def update(album_id: str, update_data: Dict) -> bool:
        update_data["updated_at"] = datetime.utcnow()
        res = albums_collection.update_one(
            {"_id": AlbumRepository._validate_object_id(album_id)},
            {"$set": update_data},
        )
        return res.matched_count > 0

    @staticmethod
    def delete(album_id: str) -> bool:
        res = albums_collection.delete_one(
            {"_id": AlbumRepository._validate_object_id(album_id)}
        )
        return res.deleted_count > 0

    @staticmethod
    def delete_by_artist_id(artist_id: ObjectId) -> bool:
        res = albums_collection.delete_many(
            {
                "$or": [
                    {"artist_id": str(artist_id)},
                    {"artist_id": artist_id},
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
        Tìm album có 'title' chứa `keyword` (không phân biệt hoa thường).
        """
        try:
            regex = Regex(keyword, "i")
            cursor = (
                albums_collection.find({"title": {"$regex": regex}})
                .sort("title", 1)
                .limit(limit)
            )
            results = list(cursor)
            print(f"AlbumRepository.search_by_title -> {len(results)} hit(s) for '{keyword}'")
            return results
        except Exception as e:
            raise ValueError(f"Failed to search albums: {e}")
