from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional
from bson import ObjectId

class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: Optional[str] = "user"

class UserCreate(UserBase):
    password: str

class UserUpdate(UserBase):
    password: Optional[str] = None
    avatar: Optional[str] = None

class UserInDB(UserBase):
    id: str
    hashed_password: str
    created_at: datetime
    avatar: Optional[str] = None
    banned: bool = False

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str


class UserOut(UserBase):
    id: str
    avatar: Optional[str] = None
    banned: bool = False
    class Config:
        orm_mode = True
