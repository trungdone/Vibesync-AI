from pydantic import BaseModel, validator, HttpUrl
from datetime import datetime
from typing import Optional
from bson import ObjectId

class SongBase(BaseModel):
    title: str
    artist: str
    album: Optional[str] = None
    releaseYear: int
    duration: int  # seconds
    genre: str
    coverArt: Optional[HttpUrl] = None
    audioUrl: Optional[HttpUrl] = None
    artistId: str

    @validator("releaseYear")
    def validate_release_year(cls, v):
        if v < 1900 or v > datetime.now().year + 1:
            raise ValueError("Invalid release year")
        return v

    @validator("duration")
    def validate_duration(cls, v):
        if v <= 0:
            raise ValueError("Duration must be positive")
        return v

class SongCreate(SongBase):
    pass

class SongUpdate(BaseModel):
    title: Optional[str] = None
    artist: Optional[str] = None
    album: Optional[str] = None
    releaseYear: Optional[int] = None
    duration: Optional[int] = None
    genre: Optional[str] = None
    coverArt: Optional[HttpUrl] = None
    audioUrl: Optional[HttpUrl] = None
    artistId: Optional[str] = None

class SongInDB(SongBase):
    id: str
    created_at: datetime

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}