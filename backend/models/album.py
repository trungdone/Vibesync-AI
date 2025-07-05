from __future__ import annotations
from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field, field_validator
from bson import ObjectId

PLACEHOLDER_COVER = "/placeholder.svg"   # đường dẫn ảnh mặc định


# ------------------------------------------------------------------
#  Base schema
# ------------------------------------------------------------------
class AlbumBase(BaseModel):
    title: str
    artist_id: str
    cover_art: Optional[str] = Field(
        default=None,
        description="URL ảnh bìa (có thể để trống – sẽ gán placeholder).",
    )
    release_year: int
    genre: str
    songs: List[str]                      # danh sách _id bài hát dạng str

    # --- validate release_year ---
    @field_validator("release_year")
    @classmethod
    def validate_release_year(cls, v: int) -> int:
        if v < 1900 or v > datetime.now().year + 1:
            raise ValueError("Invalid release year")
        return v

    # --- convert cover_art rỗng -> placeholder ---
    @field_validator("cover_art", mode="before")
    @classmethod
    def default_cover_art(cls, v: str | None) -> str:
        if not v or str(v).strip() == "":
            return PLACEHOLDER_COVER
        return v


class AlbumCreate(AlbumBase):
    pass


class AlbumUpdate(BaseModel):
    title: Optional[str] = None
    cover_art: Optional[str] = None
    release_year: Optional[int] = None
    genre: Optional[str] = None
    songs: Optional[List[str]] = None

    # đảm bảo placeholder nếu cover_art cập nhật thành chuỗi rỗng
    @field_validator("cover_art", mode="before")
    @classmethod
    def default_cover_art(cls, v):
        if v is not None and str(v).strip() == "":
            return PLACEHOLDER_COVER
        return v


class AlbumInDB(AlbumBase):
    id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
