from database.db import songs_collection
from bson import ObjectId
songs_collection.delete_many({})

songs = [
    {
        "title": "Blinding Lights",
        "artist": "The Weeknd",
        "album": "After Hours",
        "releaseYear": 2020,
        "duration": 203,
        "genre": "Synth-pop",
        "coverArt": "/blinding-lights-album-cover.png",
        "audioUrl": "/audio/AnhBoVai.mp3",
        "artistId": "artist_1"  # Thêm artistId
    },
    {
        "title": "Shape of You",
        "artist": "Ed Sheeran",
        "album": "Divide",
        "releaseYear": 2017,
        "duration": 233,
        "genre": "Pop",
        "coverArt": "/ChungTaCuaHienTai.jpg",
        "audioUrl": "/audio/gheQua.mp3",
        "artistId": "artist_2"  # Thêm artistId
    },
    {
        "title": "Levitating",
        "artist": "Dua Lipa",
        "album": "Future Nostalgia",
        "releaseYear": 2020,
        "duration": 203,
        "genre": "Disco-pop",
        "coverArt": "/save-your-tears-album-cover",
        "audioUrl": "/audio/matKetNoi.mp3",
        "artistId": "artist_3"  # Thêm artistId
    }
]

def seed_songs():
    songs_collection.delete_many({})
    songs_collection.insert_many(songs)
    print("✅ Songs seeded successfully.")
print(ObjectId())
if __name__ == "__main__":
    seed_songs()