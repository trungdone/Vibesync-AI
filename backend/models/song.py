# models/song.py
from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from bson import ObjectId
from typing import Optional

class SongBase(BaseModel):
    title: str
    artist: str
    album: Optional[str] = None
    releaseYear: int
    duration: int
    genre: str
    coverArt: Optional[str] = None
    audioUrl: Optional[str] = None
    artistId: str

class SongCreate(SongBase):
    pass

class SongUpdate(BaseModel):
    title: Optional[str] = None
    artist: Optional[str] = None
    album: Optional[str] = None
    releaseYear: Optional[int] = None
    duration: Optional[int] = None
    genre: Optional[str] = None
    coverArt: Optional[str] = None
    audioUrl: Optional[str] = None
    artistId: Optional[str] = None

class SongInDB(SongBase):
    id: str
    created_at: datetime


    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}