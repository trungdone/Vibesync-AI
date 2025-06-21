# services/album_service.py
from database.db import albums_collection, artists_collection, songs_collection
from bson import ObjectId
from datetime import datetime
from typing import List, Optional
from models.album import AlbumCreate, AlbumUpdate, AlbumInDB

class AlbumService:
    @staticmethod
    def get_all_albums(limit: Optional[int] = None) -> List[AlbumInDB]:
        query = {}
        cursor = albums_collection.find(query)
        if limit:
            cursor = cursor.limit(limit)
        albums = list(cursor)
        return [
            AlbumInDB(
                id=str(album["_id"]),
                title=album.get("title", ""),
                artistId=str(album.get("artistId", ObjectId())),
                releaseYear=album.get("releaseYear", 0),
                coverArt=album.get("coverArt", ""),
                songIds=[str(song_id) for song_id in album.get("songIds", [])],
                created_at=album.get("created_at", datetime.utcnow())
            )
            for album in albums
        ]

    @staticmethod
    def get_album_by_id(album_id: str) -> Optional[AlbumInDB]:
        album = albums_collection.find_one({"_id": ObjectId(album_id)})
        if not album:
            return None
        artist = artists_collection.find_one({"_id": album["artistId"]})
        songs = list(songs_collection.find({"_id": {"$in": album.get("songIds", [])}}))
        song_data = [
            {
                "id": str(song["_id"]),
                "title": song.get("title", ""),
                "album": song.get("album", ""),
                "releaseYear": song.get("releaseYear", 0),
                "coverArt": song.get("coverArt", ""),
                "audioUrl": song.get("audioUrl", ""),
                "genre": song.get("genre", "")
            }
            for song in songs
        ]
        return AlbumInDB(
            id=str(album["_id"]),
            title=album.get("title", ""),
            artistId=str(album.get("artistId", ObjectId())),
            releaseYear=album.get("releaseYear", 0),
            coverArt=album.get("coverArt", ""),
            songIds=[str(song_id) for song_id in album.get("songIds", [])],
            created_at=album.get("created_at", datetime.utcnow())
        )

    @staticmethod
    def create_album(album_data: AlbumCreate) -> str:
        new_album = album_data.dict(exclude_unset=True)
        new_album["created_at"] = datetime.utcnow()
        result = albums_collection.insert_one(new_album)
        return str(result.inserted_id)

    @staticmethod
    def update_album(album_id: str, album_data: AlbumUpdate) -> bool:
        update_data = album_data.dict(exclude_unset=True)
        result = albums_collection.update_one(
            {"_id": ObjectId(album_id)},
            {"$set": update_data}
        )
        return result.matched_count > 0

    @staticmethod
    def delete_album(album_id: str) -> bool:
        result = albums_collection.delete_one({"_id": ObjectId(album_id)})
        return result.deleted_count > 0
    

    