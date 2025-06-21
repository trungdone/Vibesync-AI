# models/artist.py
from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional
from bson import ObjectId

class ArtistBase(BaseModel):
    name: str
    bio: Optional[str] = None

class ArtistCreate(ArtistBase):
    pass

class ArtistUpdate(BaseModel):
    name: Optional[str] = None
    bio: Optional[str] = None
    image: Optional[str] = None


class SongData(BaseModel):
    id: str
    title: str
    album: Optional[str] = None
    releaseYear: int
    coverArt: Optional[str] = None
    audioUrl: Optional[str] = None
    genre: str

class AlbumData(BaseModel):
    id: str
    title: str
    releaseYear: int
    coverArt: Optional[str] = None

class ArtistInDB(ArtistBase):
    id: str
    image: Optional[str] = None
    songs: List[SongData] = []
    albums: List[AlbumData] = []
    created_at: datetime

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}