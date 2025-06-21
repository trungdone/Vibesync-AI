# models/album.py
from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional
from bson import ObjectId

class AlbumBase(BaseModel):
    title: str
    artistId: str
    releaseYear: int
    coverArt: Optional[str] = None
    songIds: List[str]

class AlbumCreate(AlbumBase):
    pass

class AlbumUpdate(AlbumBase):
    pass

class AlbumInDB(AlbumBase):
    id: str
    created_at: datetime

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}