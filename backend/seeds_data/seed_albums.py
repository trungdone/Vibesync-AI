# seeds/seed_albums.py
from database.db import albums_collection
from bson import ObjectId
from datetime import datetime
from dotenv import load_dotenv
import os
from cloudinary import config

# Tải biến môi trường từ .env
load_dotenv()

# Cấu hình Cloudinary
cloudinary_config = {
    "cloud_name": os.getenv("CLOUDINARY_CLOUD_NAME", "dhifiomji"),
    "api_key": os.getenv("CLOUDINARY_API_KEY", "467596386185684"),
    "api_secret": os.getenv("CLOUDINARY_API_SECRET", "cN3IFilAA5xzMMzi_AeLgoHRLBs")
}
config(**cloudinary_config)


# Seed albums (giả sử song_ids và artist_ids từ các file trước)
albums = [
    {
        "title": "After Hours",
        "artistId": None,  # Sẽ được cập nhật sau
        "releaseYear": 2020,
        "coverArt": "https://res.cloudinary.com/dhifiomji/image/upload/v1750342631/images/AnhBoVai.jpg",
        "songIds": [],  # Sẽ được cập nhật sau
        "created_at": datetime.utcnow()
    },
    {
        "title": "Divide",
        "artistId": None,  # Sẽ được cập nhật sau
        "releaseYear": 2017,
        "coverArt": "https://res.cloudinary.com/dhifiomji/image/upload/v1718800000/images/ChungTaCuaHienTai.jpg",
        "songIds": [],  # Sẽ được cập nhật sau
        "created_at": datetime.utcnow()
    },
    {
        "title": "Future Nostalgia",
        "artistId": None,  # Sẽ được cập nhật sau
        "releaseYear": 2020,
        "coverArt": "https://res.cloudinary.com/dhifiomji/image/upload/v1750342666/images/matKetNoi.jpg",
        "songIds": [],  # Sẽ được cập nhật sau
        "created_at": datetime.utcnow()
    }
]

def seed_albums(artist_ids, song_ids):
    # Cập nhật artistId và songIds dựa trên tiêu đề album
    for album in albums:
        if album["title"] == "After Hours":
            album["artistId"] = artist_ids[0]
            album["songIds"] = [song_ids[0]]
        elif album["title"] == "Divide":
            album["artistId"] = artist_ids[1]
            album["songIds"] = [song_ids[1]]
        elif album["title"] == "Future Nostalgia":
            album["artistId"] = artist_ids[2]
            album["songIds"] = [song_ids[2]]

    # Thêm albums vào database
    albums_collection.insert_many(albums)
    print("✅ Albums seeded successfully.")

if __name__ == "__main__":
    # Chạy các file trước để lấy artist_ids và song_ids
    from seed_artists import seed_artists
    from seed_songs import seed_songs
    artist_ids = seed_artists()
    song_ids = seed_songs(artist_ids)
    seed_albums(artist_ids, song_ids)