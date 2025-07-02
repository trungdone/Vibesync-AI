from models.artist import ArtistInDB, ArtistCreate, ArtistUpdate
from database.repositories.artist_repository import ArtistRepository
from bson import ObjectId
from datetime import datetime
from typing import Optional


class AdminArtistService:
    def __init__(self, repo: ArtistRepository):
        self.repo = repo

    def get_all_artists(self) -> list[ArtistInDB]:
        artists = self.repo.find_all()
        return [
            ArtistInDB(
                id=str(artist["_id"]),
                name=artist.get("name", ""),
                bio=artist.get("bio", ""),
                image=artist.get("image"),
                songs=[],  # load if needed
                albums=[],
                genres=artist.get("genres", []),
                followers=artist.get("followers", 0),
                created_at=artist.get("created_at", datetime.utcnow()),
                updated_at=artist.get("updated_at", datetime.utcnow()),
            )
            for artist in artists
        ]

    def get_artist_by_id(self, artist_id: str) -> Optional[ArtistInDB]:
        artist = self.repo.find_by_id(ObjectId(artist_id))
        if not artist:
            return None
        return ArtistInDB(
            id=str(artist["_id"]),
            name=artist.get("name", ""),
            bio=artist.get("bio", ""),
            image=artist.get("image"),
            genres=artist.get("genres", []),
            followers=artist.get("followers", 0),
            songs=[],
            albums=[],
            created_at=artist.get("created_at", datetime.utcnow()),
            updated_at=artist.get("updated_at", datetime.utcnow()),
        )
    
    def search_artists(self, name: str) -> list[ArtistInDB]:
        artists = self.repo.find_by_name(name)
        return [
            ArtistInDB(
                id=str(artist["_id"]),
                name=artist.get("name", ""),
                bio=artist.get("bio", ""),
                image=artist.get("image"),
                songs=[],  # load if needed
                albums=[],
                genres=artist.get("genres", []),
                followers=artist.get("followers", 0),
                created_at=artist.get("created_at", datetime.utcnow()),
                updated_at=artist.get("updated_at", datetime.utcnow()),
            )
            for artist in artists
        ]

    def create_artist(self, data: ArtistCreate) -> str:
        # Kiểm tra trùng lặp tên
        existing_artist = self.repo.find_by_name(data.name)
        if existing_artist:
            raise ValueError("Artist with this name already exists")
        
        artist_dict = data.dict()
        artist_dict["created_at"] = datetime.utcnow()
        artist_dict["updated_at"] = datetime.utcnow()
        artist_dict["followers"] = artist_dict.get("followers", 0)
        new_artist = self.repo.insert_one(artist_dict)
        return str(new_artist.inserted_id)

    def update_artist(self, artist_id: str, data: ArtistUpdate) -> bool:
        update_data = data.dict(exclude_unset=True)
        update_data["updated_at"] = datetime.utcnow()
        result = self.repo.update_one(ObjectId(artist_id), update_data)
        return result.matched_count > 0

    def delete_artist(self, artist_id: str) -> bool:
        result = self.repo.delete_one(ObjectId(artist_id))
        return result.deleted_count > 0
