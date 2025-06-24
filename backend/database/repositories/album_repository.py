from database.db import albums_collection
from bson import ObjectId
from typing import List

class AlbumRepository:
    def __init__(self):
        self.collection = albums_collection

    def find_by_artist_id(self, artist_id: ObjectId) -> List[dict]:
        return list(self.collection.find({"artistId": artist_id}))

    def delete_by_artist_id(self, artist_id: ObjectId):
        return self.collection.delete_many({"artistId": artist_id})