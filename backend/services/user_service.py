# services/user_service.py
from database.db import users_collection
from bson import ObjectId
from datetime import datetime
from passlib.context import CryptContext
from models.user import UserCreate, UserInDB, UserUpdate
from typing import Optional

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserService:
    @staticmethod
    def get_user_by_email(email: str) -> Optional[UserInDB]:
        user = users_collection.find_one({"email": email})
        if not user:
            return None
        return UserInDB(
            id=str(user["_id"]),
            name=user.get("name", ""),
            email=user.get("email", ""),
            role=user.get("role", "user"),
            hashed_password=user.get("hashed_password", ""),
            created_at=user.get("created_at", datetime.utcnow()),
            avatar=user.get("avatar", "")
        )
    

    @staticmethod
    def create_user(user_data: UserCreate) -> str:
        existing_user = users_collection.find_one({"email": user_data.email})
        if existing_user:
            raise ValueError("Email already registered")
        new_user = {
            "name": user_data.name,
            "email": user_data.email,
            "hashed_password": pwd_context.hash(user_data.password),
            "role": user_data.role,
            "created_at": datetime.utcnow(),
            "avatar": "/avatars/default.png"
        }
        result = users_collection.insert_one(new_user)
        return str(result.inserted_id)

    @staticmethod
    def authenticate_user(email: str, password: str) -> Optional[UserInDB]:
        user = users_collection.find_one({"email": email})
        if not user or not pwd_context.verify(password, user.get("hashed_password", "")):
            return None
        return UserInDB(
            id=str(user["_id"]),
            name=user.get("name", ""),
            email=user.get("email", ""),
            role=user.get("role", "user"),
            hashed_password=user.get("hashed_password", ""),
            created_at=user.get("created_at", datetime.utcnow()),
            avatar=user.get("avatar", "")
        )

    @staticmethod
    def update_user(user_id: str, user_data: UserUpdate) -> bool:
        update_data = user_data.dict(exclude_unset=True)
        if "password" in update_data:
            update_data["hashed_password"] = pwd_context.hash(update_data["password"])
            del update_data["password"]
        result = users_collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": update_data}
        )
        return result.matched_count > 0

    @staticmethod
    def delete_user(user_id: str) -> bool:
        result = users_collection.delete_one({"_id": ObjectId(user_id)})
        return result.deleted_count > 0
    

    