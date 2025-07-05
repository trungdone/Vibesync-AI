from typing import List, Optional, Dict

from bson import ObjectId
from bson.errors import InvalidId
from bson.regex import Regex

from database.db import artists_collection


class ArtistRepository:
    """Truy vấn collection `artists` (PyMongo sync)."""

    def __init__(self):
        self.collection = artists_collection

    # --------------------------------------------------
    # Helper
    # --------------------------------------------------
    @staticmethod
    def _validate_id(artist_id: str | ObjectId) -> ObjectId:
        if isinstance(artist_id, ObjectId):
            return artist_id
        try:
            return ObjectId(artist_id)
        except InvalidId:
            raise ValueError(f"Invalid ObjectId: {artist_id}")

    # --------------------------------------------------
    # Generic find
    # --------------------------------------------------
    def find_all(self, skip: int = 0, limit: Optional[int] = None) -> List[Dict]:
        cursor = self.collection.find().skip(skip)
        if limit:
            cursor = cursor.limit(limit)
        return list(cursor)
    
    def find_by_name(self, name: str) -> List[dict]:
     return list(self.collection.find({"name": {"$regex": f"^{name}$", "$options": "i"}}))


    def find_by_id(self, artist_id: str | ObjectId) -> Optional[Dict]:
        return self.collection.find_one({"_id": self._validate_id(artist_id)})

    # --------------------------------------------------
    # 🔍 SEARCH  (BỔ SUNG)
    # --------------------------------------------------
    def search_by_name(self, keyword: str, limit: int = 20) -> List[Dict]:
        """
        Tìm nghệ sĩ theo tên, không phân biệt hoa thường.
        """
        try:
            regex = Regex(keyword, "i")  # i = case‑insensitive
            cursor = (
                self.collection.find({"name": {"$regex": regex}})
                .sort("name", 1)
                .limit(limit)
            )
            results = list(cursor)
            print(
                f"ArtistRepository.search_by_name -> {len(results)} hit(s) for '{keyword}'"
            )
            return results
        except Exception as e:
            raise ValueError(f"Failed to search artists: {e}")

    # --------------------------------------------------
    # CRUD
    # --------------------------------------------------
    def insert_one(self, artist_dict: Dict):
        return self.collection.insert_one(artist_dict)

    def update_one(self, artist_id: str | ObjectId, update_data: Dict):
        return self.collection.update_one(
            {"_id": self._validate_id(artist_id)}, {"$set": update_data}
        )

    def delete_one(self, artist_id: str | ObjectId):
        return self.collection.delete_one({"_id": self._validate_id(artist_id)})
