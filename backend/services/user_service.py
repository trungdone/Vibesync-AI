# services/user_service.py
from bson import ObjectId
from datetime import datetime
from typing import Optional, List
from passlib.context import CryptContext
from models.user import UserCreate, UserInDB, UserUpdate
from database.repositories.user_repository import UserRepository
from fastapi import HTTPException

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserService:
    @staticmethod
    def get_user_by_email(email: str) -> Optional[UserInDB]:
        user = UserRepository.find_by_email(email)
        if not user:
            return None
        return UserService._convert_to_user_in_db(user)

    @staticmethod
    def get_user_by_id(user_id: str) -> Optional[UserInDB]:
        user = UserRepository.find_by_id(user_id)
        if user:
            print(f"✅ Found user in get_user_by_id: {user}")
            return UserService._convert_to_user_in_db(user)
        print(f"❌ No user found with ID: {user_id} in DB")
        return None

    @staticmethod
    def authenticate_user(email: str, password: str) -> Optional[UserInDB]:
        user = UserRepository.find_by_email(email)
        if not user or not pwd_context.verify(password, user.get("hashed_password", "")):
            return None
        print(f"✅ Authenticated user with ID: {user['_id']}")
        return UserService._convert_to_user_in_db(user)

    @staticmethod
    def create_user(user_data: UserCreate) -> str:
        if UserRepository.find_by_email(user_data.email):
            raise HTTPException(status_code=400, detail="Email already registered")
        hashed_password = pwd_context.hash(user_data.password)
        user_dict = {
            "name": user_data.name,
            "email": user_data.email.lower(),
            "hashed_password": hashed_password,
            # Sử dụng role mặc định "user" nếu không có trong user_data
            "role": getattr(user_data, "role", "user"),
            "avatar": "/avatars/default.png",
            "banned": False
        }
        return UserRepository.create(user_dict)

    @staticmethod
    def update_user(user_id: str, user_data: UserUpdate) -> UserInDB:
        update_data = user_data.dict(exclude_unset=True)
        if "password" in update_data:
            update_data["hashed_password"] = pwd_context.hash(update_data["password"])
            del update_data["password"]
        if not UserRepository.update(user_id, update_data):
            raise HTTPException(status_code=404, detail="User not found")
        updated_user = UserService.get_user_by_id(user_id)
        if not updated_user:
            raise HTTPException(status_code=404, detail="User not found")
        return updated_user

    @staticmethod
    def delete_user(user_id: str) -> bool:
        if not UserRepository.delete(user_id):
            raise HTTPException(status_code=404, detail="User not found")
        return True

    @staticmethod
    def get_all_users() -> List[UserInDB]:
        users = UserRepository.find_all()
        return [UserService._convert_to_user_in_db(user) for user in users]

    @staticmethod
    def promote_to_admin(user_id: str, current_user_id: str) -> None:
        user = UserRepository.find_by_id(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        if user["role"] == "admin":
            raise HTTPException(status_code=400, detail="User is already an admin")
        UserRepository.update(user_id, {"role": "admin"})

    @staticmethod
    def demote_from_admin(user_id: str, current_user_id: str) -> None:
        user = UserRepository.find_by_id(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        if user.get("role", "user") != "admin":
            raise HTTPException(status_code=400, detail="User is not an admin")
        
        if user_id == current_user_id:
            raise HTTPException(status_code=400, detail="Cannot demote yourself")
        
        updated = UserRepository.update(user_id, {"role": "user"})
        if not updated:
            raise HTTPException(status_code=500, detail="Failed to demote user")

    @staticmethod
    def ban_user(user_id: str, current_user_id: str) -> None:
        user = UserRepository.find_by_id(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        if user.get("banned", False):
            raise HTTPException(status_code=400, detail="User is already banned")
        if user_id == current_user_id:
            raise HTTPException(status_code=400, detail="Cannot ban yourself")
        UserRepository.update(user_id, {"banned": True})

    @staticmethod
    def unban_user(user_id: str) -> None:
        user = UserRepository.find_by_id(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        if not user.get("banned", False):  # Dùng .get(..., False) để tránh lỗi None
            raise HTTPException(status_code=400, detail="User is not banned")
        
        updated = UserRepository.update(user_id, {"banned": False})
        if not updated:
            raise HTTPException(status_code=500, detail="Failed to unban user")

    @staticmethod
    def search_users(query: str) -> List[UserInDB]:
        users = UserRepository.search_by_name(query)
        return [UserService._convert_to_user_in_db(user) for user in users]

    @staticmethod
    def _convert_to_user_in_db(user: dict) -> UserInDB:
        return UserInDB(
            id=str(user["_id"]),
            name=user.get("name", ""),
            email=user.get("email", ""),
            role=user.get("role", "user"),
            hashed_password=user.get("hashed_password", ""),
            created_at=user.get("created_at", datetime.utcnow()),
            avatar=user.get("avatar", ""),
            banned=user.get("banned", False)
        )
    
    @staticmethod
    def toggle_like_song(user_id: str, song_id: str) -> list[str]:
        user = UserRepository.find_by_id(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        liked = set(user.get("likedSongs", []))
        if song_id in liked:
            liked.remove(song_id)
        else:
            liked.add(song_id)

        success = UserRepository.update(user_id, {"likedSongs": list(liked)})
        if not success:
            raise HTTPException(status_code=500, detail="Failed to update liked songs")

        return list(liked)
