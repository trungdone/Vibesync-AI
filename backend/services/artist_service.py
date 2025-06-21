# services/artist_service.py
from database.db import artists_collection, songs_collection, albums_collection
from bson import ObjectId
from datetime import datetime
from typing import List, Optional
from models.artist import ArtistCreate, ArtistUpdate, ArtistInDB

class ArtistService:
    @staticmethod
    def get_all_artists(limit: Optional[int] = None) -> List[ArtistInDB]:
        query = {}
        cursor = artists_collection.find(query)
        if limit:
            cursor = cursor.limit(limit)
        artists = list(cursor)
        return [
            ArtistInDB(
                id=str(artist["_id"]),
                name=artist.get("name", ""),
                bio=artist.get("bio", ""),
                image=artist.get("image", ""),
                created_at=artist.get("created_at", datetime.utcnow())
            )
            for artist in artists
        ]

    @staticmethod
    def get_artist_by_id(artist_id: str) -> Optional[ArtistInDB]:
        try:
            artist = artists_collection.find_one({"_id": ObjectId(artist_id)})
            if not artist:
                return None
            # Lấy danh sách bài hát của nghệ sĩ
            songs = list(songs_collection.find({"artistId": ObjectId(artist_id)}))
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
            # Lấy danh sách album của nghệ sĩ
            albums = list(albums_collection.find({"artistId": ObjectId(artist_id)}))
            album_data = [
                {
                    "id": str(album["_id"]),
                    "title": album.get("title", ""),
                    "releaseYear": album.get("releaseYear", 0),
                    "coverArt": album.get("coverArt", "")
                }
                for album in albums
            ]
            return ArtistInDB(
                id=str(artist["_id"]),
                name=artist.get("name", ""),
                bio=artist.get("bio", ""),
                image=artist.get("image", ""),
                songs=song_data,
                albums=album_data,
                created_at=artist.get("created_at", datetime.utcnow())
            )
        except Exception:
            return None

    @staticmethod
    def create_artist(artist_data: ArtistCreate) -> str:
        new_artist = artist_data.dict(exclude_unset=True)
        new_artist["created_at"] = datetime.utcnow()
        result = artists_collection.insert_one(new_artist)
        return str(result.inserted_id)

    @staticmethod
    def update_artist(artist_id: str, artist_data: ArtistUpdate) -> bool:
        update_data = artist_data.dict(exclude_unset=True)
        result = artists_collection.update_one(
            {"_id": ObjectId(artist_id)},
            {"$set": update_data}
        )
        return result.matched_count > 0

    @staticmethod
    def delete_artist(artist_id: str) -> bool:
        result = artists_collection.delete_one({"_id": ObjectId(artist_id)})
        if result.deleted_count > 0:
            songs_collection.delete_many({"artistId": ObjectId(artist_id)})
            albums_collection.delete_many({"artistId": ObjectId(artist_id)})
            return True
        return False