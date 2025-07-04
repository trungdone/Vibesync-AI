from database.db import artists_collection
from bson import ObjectId
from typing import List, Optional

class ArtistRepository:
    def __init__(self):
        self.collection = artists_collection

    def find_all(self, skip: int = 0, limit: Optional[int] = None) -> List[dict]:
        cursor = self.collection.find({}).skip(skip)
        if limit is not None:
            cursor = cursor.limit(limit)
        return list(cursor)

    
    def find_by_name(self, name: str) -> List[dict]:
     return list(self.collection.find({"name": {"$regex": f"^{name}$", "$options": "i"}}))

    def find_by_id(self, artist_id: ObjectId) -> Optional[dict]:
        return self.collection.find_one({"_id": artist_id})

    def insert_one(self, artist_dict: dict):
        return self.collection.insert_one(artist_dict)

    def update_one(self, artist_id: ObjectId, update_data: dict):
        return self.collection.update_one({"_id": artist_id}, {"$set": update_data})

    def delete_one(self, artist_id: ObjectId):
        return self.collection.delete_one({"_id": artist_id})
    
    