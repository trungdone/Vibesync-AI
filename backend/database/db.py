from pymongo import MongoClient
from passlib.context import CryptContext
from bson import ObjectId
import os

# Lấy URI từ biến môi trường hoặc dùng mặc định
MONGO_URI = os.getenv(
    "MONGO_URI",
    "mongodb+srv://trungdnbh00901:trudo42@vibesync.gaqe5kb.mongodb.net/?retryWrites=true&w=majority"
)

# Kết nối MongoDB
client = MongoClient(MONGO_URI)
db = client["Vibesync"]

# Các collection trong MongoDB
songs_collection = db.get_collection("songs")
users_collection = db.get_collection("users")
history_collection = db.get_collection("song_history")  # ✅ Dùng cho lưu lịch sử nghe
song_history_collection = db.get_collection("song_history")  # alias (có thể gộp)
recommendations_collection = db.get_collection("recommendations")
playlists_collection = db.get_collection("playlists")
artists_collection = db.get_collection("artists")
albums_collection = db.get_collection("albums")
chat_history_collection = db.get_collection("chat_history")

# Password hash setup
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
