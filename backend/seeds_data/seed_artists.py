# seeds/seed_artists.py
from database.db import artists_collection
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

def seed_artists():
    inserted_artists = artists_collection.insert_many(artists)
    artist_ids = inserted_artists.inserted_ids
    print("✅ Artists seeded successfully.")
    return artist_ids

if __name__ == "__main__":
    seed_artists()