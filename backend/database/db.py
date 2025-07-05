"""
Module kết nối MongoDB (PyMongo) và cung cấp dependency get_db cho FastAPI
"""

from pymongo import MongoClient
from passlib.context import CryptContext

# ---------------------------#
# 1) Thông tin cấu hình DB   #
# ---------------------------#
MONGO_URI = (
    "mongodb+srv://trungdnbh00901:trudo42@vibesync.gaqe5kb.mongodb.net/?retryWrites=true&w=majority"
    # Nếu bạn chạy local:
    # "mongodb://localhost:27017/"
)
DB_NAME = "Vibesync"

# ---------------------------#
# 2) Khởi tạo kết nối        #
# ---------------------------#
client = MongoClient(MONGO_URI)
db = client[DB_NAME]

# ---------------------------#
# 3) Khai báo collection     #
# ---------------------------#
history_collection         = db["history"]          # Lịch sử tìm kiếm
recommendations_collection = db["recommendations"]
playlists_collection       = db["playlists"]
songs_collection           = db["songs"]
artists_collection         = db["artists"]
users_collection           = db["users"]
song_history_collection    = db["song_history"]
albums_collection          = db["albums"]

# ---------------------------#
# 4) Password hashing config #
# ---------------------------#
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ---------------------------#
# 5) Dependency get_db       #
# ---------------------------#
def get_db():
    """
    Hàm dependency cho FastAPI.
    Khi route gọi `Depends(get_db)` sẽ nhận được biến `db`
    (kiểu `pymongo.database.Database`) để thao tác MongoDB.
    """
    return db

# ---------------------------#
# 6) Script xử lý dữ liệu (nếu cần) #
# ---------------------------#
if __name__ == "__main__":
    # Chỉ chạy khi chạy trực tiếp file này
    result1 = albums_collection.update_many(
        {"cover_art": ""},
        {"$set": {"cover_art": None}}
    )
    print(f"Updated {result1.modified_count} documents for cover_art")

    result2 = albums_collection.update_many(
        {"release_year": {"$lt": 1900}},
        {"$set": {"release_year": 2025}}
    )
    print(f"Updated {result2.modified_count} documents for release_year")

    print("Documents with empty cover_art:", albums_collection.count_documents({"cover_art": ""}))
    print("Documents with invalid release_year:", albums_collection.count_documents({"release_year": {"$lt": 1900}}))
