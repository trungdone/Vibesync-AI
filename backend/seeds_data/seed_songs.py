# seeds_data/seed_songs.py

from database.db import songs_collection

# 🧹 Xóa dữ liệu cũ (nếu cần)
songs_collection.delete_many({})  # Xóa hết bài hát hiện có

# 🎵 Thêm danh sách bài hát mới
songs = [
    {
        "title": "Blinding Lights",
        "artist": "The Weeknd",
        "album": "After Hours",
        "releaseYear": 2020,
        "duration": 203,
        "genre": "Synth-pop",
        "coverArt": "/blinding-lights-album-cover.png",
        "audioUrl": "https://yourserver.com/audio/blinding-lights.mp3"
    },
    {
        "title": "Shape of You",
        "artist": "Ed Sheeran",
        "album": "Divide",
        "releaseYear": 2017,
        "duration": 233,
        "genre": "Pop",
        "coverArt": "/shape-of-you.png",
        "audioUrl": "https://yourserver.com/audio/shape-of-you.mp3"
    },
    {
        "title": "Levitating",
        "artist": "Dua Lipa",
        "album": "Future Nostalgia",
        "releaseYear": 2020,
        "duration": 203,
        "genre": "Disco-pop",
        "coverArt": "/levitating.png",
        "audioUrl": "https://yourserver.com/audio/levitating.mp3"
    }
]

def seed_songs():
    songs_collection.delete_many({})  # Xóa tất cả bài hát cũ
    songs_collection.insert_many(songs)  # Chèn bài hát mới
    print("✅ Songs seeded successfully.")

if __name__ == "__main__":
    seed_songs()
