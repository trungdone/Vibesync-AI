# db.py - MongoDB connection
from pymongo import MongoClient
from passlib.context import CryptContext
from bson import ObjectId
import datetime

client = MongoClient("mongodb+srv://trungdnbh00901:trudo42@vibesync.gaqe5kb.mongodb.net/?retryWrites=true&w=majority")
#client = MongoClient("mongodb://localhost:27017/")
db = client["Vibesync"]

history_collection = db.history
recommendations_collection = db.recommendations
playlists_collection = db["playlists"]
songs_collection = db["songs"]
artists_collection =db["artists"]
users_collection = db["users"]
song_history_collection = db["song_history"]


# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Dữ liệu mẫu
users = [
    {
        "_id": str(ObjectId()),
        "name": "Admin User",
        "email": "admin@example.com",
        "hashed_password": pwd_context.hash("admin123"),
        "role": "admin",
        "created_at": datetime.datetime.utcnow(),
        "avatar": "/avatars/admin.png"
    },
    {
        "_id": str(ObjectId()),
        "name": "Regular User",
        "email": "user@example.com",
        "hashed_password": pwd_context.hash("user123"),
        "role": "user",
        "created_at": datetime.datetime.utcnow(),
        "avatar": "/avatars/user.png"
    }
]

def seed_users():
    users_collection.delete_many({})  # Xóa users cũ
    users_collection.insert_many(users)
    print("✅ Users seeded successfully.")

if __name__ == "__main__":
    seed_users()
    print("📂 Danh sách collections:", db.list_collection_names())
    





