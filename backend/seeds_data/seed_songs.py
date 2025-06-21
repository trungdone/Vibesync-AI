from database.db import songs_collection, artists_collection, albums_collection
from bson import ObjectId
from datetime import datetime
import requests
from cloudinary.uploader import upload
from cloudinary import config  # Import config từ cloudinary
from dotenv import load_dotenv
import os

# Tải biến môi trường từ .env
load_dotenv()

# Cấu hình Cloudinary
cloudinary_config = {
    "cloud_name": os.getenv("CLOUDINARY_CLOUD_NAME", "dhifiomji"),
    "api_key": os.getenv("CLOUDINARY_API_KEY", "467596386185684"),
    "api_secret": os.getenv("CLOUDINARY_API_SECRET", "cN3IFilAA5xzMMzi_AeLgoHRLBs")
}
config(**cloudinary_config)  # Sử dụng cloudinary.config thay vì upload.configure

# Xóa dữ liệu cũ
songs_collection.delete_many({})
artists_collection.delete_many({})
albums_collection.delete_many({})

# Seed artists
artists = [
    {
        "name": "The Weeknd",
        "bio": "Canadian singer-songwriter known for his unique voice.",
        "created_at": datetime.utcnow()
    },
    {
        "name": "Ed Sheeran",
        "bio": "British singer-songwriter with a global hit catalog.",
        "created_at": datetime.utcnow()
    },
    {
        "name": "Dua Lipa",
        "bio": "British-Albanian singer known for disco-pop hits.",
        "created_at": datetime.utcnow()
    }
]
inserted_artists = artists_collection.insert_many(artists)
artist_ids = inserted_artists.inserted_ids  # Lấy danh sách _id tự động sinh

# Hàm kiểm tra URL
def is_url_accessible(url):
    try:
        response = requests.head(url, timeout=5)
        return response.status_code == 200
    except:
        return False

# Seed songs với artistId khớp
songs = [
    {
        "title": "Blinding Lights",
        "artist": "The Weeknd",
        "album": "After Hours",
        "releaseYear": 2020,
        "duration": 203,
        "genre": "Synth-pop",
        "coverArt": "https://res.cloudinary.com/dhifiomji/image/upload/v1750342631/images/AnhBoVai.jpg",
        "audioUrl": "https://res.cloudinary.com/dhifiomji/raw/upload/v1718800000/audios/AnhBoVai.mp3",
        "artistId": artist_ids[0],  # Khớp với The Weeknd
        "created_at": datetime.utcnow()
    },
    {
        "title": "Shape of You",
        "artist": "Ed Sheeran",
        "album": "Divide",
        "releaseYear": 2017,
        "duration": 233,
        "genre": "Pop",
        "coverArt": "https://res.cloudinary.com/dhifiomji/image/upload/v1718800000/images/ChungTaCuaHienTai.jpg",
        "audioUrl": "https://res.cloudinary.com/dhifiomji/raw/upload/v1718800000/audios/gheQua.mp3",
        "artistId": artist_ids[1],  # Khớp với Ed Sheeran
        "created_at": datetime.utcnow()
    },
    {
        "title": "Levitating",
        "artist": "Dua Lipa",
        "album": "Future Nostalgia",
        "releaseYear": 2020,
        "duration": 203,
        "genre": "Disco-pop",
        "coverArt": "https://res.cloudinary.com/dhifiomji/image/upload/v1750342666/images/matKetNoi.jpg",
        "audioUrl": "https://res.cloudinary.com/dhifiomji/raw/upload/v1718800000/audios/matKetNoi.mp3",
        "artistId": artist_ids[2],  # Khớp với Dua Lipa
        "created_at": datetime.utcnow()
    }
]
inserted_songs = songs_collection.insert_many(songs)
song_ids = inserted_songs.inserted_ids

# Seed albums
albums = [
    {
        "title": "After Hours",
        "artistId": artist_ids[0],
        "releaseYear": 2020,
        "coverArt": "https://res.cloudinary.com/dhifiomji/image/upload/v1750342631/images/AnhBoVai.jpg",
        "songIds": [song_ids[0]],  # Liên kết với Blinding Lights
        "created_at": datetime.utcnow()
    },
    {
        "title": "Divide",
        "artistId": artist_ids[1],
        "releaseYear": 2017,
        "coverArt": "https://res.cloudinary.com/dhifiomji/image/upload/v1718800000/images/ChungTaCuaHienTai.jpg",
        "songIds": [song_ids[1]],  # Liên kết với Shape of You
        "created_at": datetime.utcnow()
    },
    {
        "title": "Future Nostalgia",
        "artistId": artist_ids[2],
        "releaseYear": 2020,
        "coverArt": "https://res.cloudinary.com/dhifiomji/image/upload/v1750342666/images/matKetNoi.jpg",
        "songIds": [song_ids[2]],  # Liên kết với Levitating
        "created_at": datetime.utcnow()
    }
]
albums_collection.insert_many(albums)

def seed_data():
    artists_collection.delete_many({})
    inserted_artists = artists_collection.insert_many(artists)
    albums_collection.delete_many({})
    albums_collection.insert_many(albums)
    songs_collection.delete_many({})
    for song in songs:
        if not is_url_accessible(song["coverArt"]) or not is_url_accessible(song["audioUrl"]):
            print(f"Warning: URL not accessible for {song['title']}")
        else:
            songs_collection.insert_one(song)
    print("✅ Data seeded successfully.")

if __name__ == "__main__":
    seed_data()