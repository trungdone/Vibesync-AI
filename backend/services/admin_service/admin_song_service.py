from database.db import artists_collection, songs_collection
from bson import ObjectId
from datetime import datetime
from typing import List, Optional, Tuple
from models.song import SongCreate, SongUpdate, SongInDB
from database.repositories.song_repository import SongRepository
from urllib.request import urlopen
from urllib.error import HTTPError

class AdminSongService:
    def __init__(self, song_repository: SongRepository):
        self.song_repository = song_repository

    @staticmethod
    def _map_to_song_in_db(song: dict) -> SongInDB:
        try:
            if not song.get("_id"):
                raise ValueError("Song document missing '_id' field")
            if not song.get("created_at"):
                song["created_at"] = datetime.utcnow()  # Fallback if missing
            # Convert releaseYear and duration to int if they are strings
            song["releaseYear"] = int(song.get("releaseYear", 0))
            song["duration"] = int(song.get("duration", 0))
            return SongInDB(
                id=str(song["_id"]),
                title=song.get("title", ""),
                artist=song.get("artist", ""),
                album=song.get("album", None),
                releaseYear=song["releaseYear"],
                duration=song["duration"],
                genre=song.get("genre", ""),
                coverArt=song.get("coverArt", None),
                audioUrl=song.get("audioUrl", None),
                artistId=str(song.get("artistId", "")),
                created_at=song["created_at"]
            )
        except Exception as e:
            print(f"Error mapping song to SongInDB: {str(e)}, song_data={song}")
            raise ValueError(f"Failed to map song data: {str(e)}")

    @staticmethod
    def _is_url_accessible(url: str) -> bool:
        if not url:
            return True
        try:
            with urlopen(url, timeout=5) as response:
                return response.status == 200
        except HTTPError as e:
            print(f"URL inaccessible: {url}, error: {str(e)}")
            return False

    def get_all_songs(self, search: Optional[str], sort: Optional[str], skip: Optional[int], limit: Optional[int]) -> Tuple[List[SongInDB], int]:
        try:
            query = {}
            if search:
                query["$or"] = [
                    {"title": {"$regex": search, "$options": "i"}},
                    {"artist": {"$regex": search, "$options": "i"}},
                    {"genre": {"$regex": search, "$options": "i"}}
                ]
            print(f"Querying songs with query={query}, sort={sort}, skip={skip}, limit={limit}")
            songs = self.song_repository.find_all(sort, limit, skip, query)
            total = songs_collection.count_documents(query) if search else songs_collection.count_documents({})
            print(f"Fetched {len(songs)} songs, total count: {total}")
            return [self._map_to_song_in_db(song) for song in songs], total
        except Exception as e:
            print(f"Error fetching songs: {str(e)}")
            raise ValueError(f"Failed to fetch songs: {str(e)}")

    def get_song_by_id(self, song_id: str) -> Optional[SongInDB]:
        try:
            song = self.song_repository.find_by_id(song_id)
            if not song:
                print(f"Song not found: {song_id}")
                return None
            return self._map_to_song_in_db(song)
        except Exception as e:
            print(f"Error fetching song {song_id}: {str(e)}")
            raise ValueError(f"Failed to fetch song: {str(e)}")

    def create_song(self, song_data: SongCreate) -> str:
        try:
            if not artists_collection.find_one({"_id": ObjectId(song_data.artistId)}):
                raise ValueError(f"Artist with ID {song_data.artistId} does not exist")
            if song_data.audioUrl and not self._is_url_accessible(song_data.audioUrl):
                raise ValueError("Invalid or inaccessible audio URL")
            if song_data.coverArt and not self._is_url_accessible(song_data.coverArt):
                raise ValueError("Invalid or inaccessible cover art URL")
            new_song = song_data.dict(exclude_unset=True)
            new_song["created_at"] = datetime.utcnow()
            song_id = self.song_repository.insert(new_song)
            print(f"Created song with ID: {song_id}")
            return str(song_id)
        except Exception as e:
            print(f"Error creating song: {str(e)}")
            raise ValueError(f"Failed to create song: {str(e)}")

def update_song(self, song_id: str, song_data: SongUpdate) -> bool:
    try:
        update_data = song_data.dict(exclude_unset=True)
        if "artistId" in update_data:
            if not artists_collection.find_one({"_id": ObjectId(update_data["artistId"])}):
                raise ValueError(f"Artist with ID {update_data['artistId']} does not exist")
        if "audioUrl" in update_data and update_data["audioUrl"]:
            if not self._is_url_accessible(str(update_data["audioUrl"])):  # Chuyển sang string
                raise ValueError("Invalid or inaccessible audio URL")
        if "coverArt" in update_data and update_data["coverArt"]:
            if not self._is_url_accessible(str(update_data["coverArt"])):  # Chuyển sang string
                raise ValueError("Invalid or inaccessible cover art URL")
        result = self.song_repository.update(song_id, update_data)
        print(f"Updated song {song_id}: {result}")
        return result
    except Exception as e:
        print(f"Error updating song {song_id}: {str(e)}")
        raise ValueError(f"Failed to update song: {str(e)}")

    def delete_song(self, song_id: str) -> bool:
        try:
            result = self.song_repository.delete(song_id)
            print(f"Deleted song {song_id}: {result}")
            return result
        except Exception as e:
            print(f"Error deleting song {song_id}: {str(e)}")
            raise ValueError(f"Failed to delete song: {str(e)}")