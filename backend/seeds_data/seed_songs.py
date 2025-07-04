# seeds_data/seed_songs.py

from database.db import songs_collection, artists_collection
from datetime import datetime, timezone
from seeds_data.seed_artists import seed_artists


# Step 1: Seed nghệ sĩ và lấy mapping name → ObjectId
artist_map = seed_artists()
print("[✅ DEBUG] artist_map:", artist_map)

# Step 2: Xoá dữ liệu cũ
songs_collection.delete_many({})


# Step 3: Chuẩn bị dữ liệu bài hát
now = datetime.now(timezone.utc)

songs = [
    {
        "title": "Đi Về Nhà",
        "artist": "Đen Vâu",
        "album": "ShowCuaDen",
        "releaseYear": 2024,
        "duration": 325,
        "genre": ["Hip-Hop", "Rap", "V-Pop"],
        "coverArt": "https://res.cloudinary.com/dhifiomji/image/upload/v1750647290/diVeNha_rawgtu.jpg",
        "audioUrl": "https://res.cloudinary.com/dhifiomji/raw/upload/v1750750807/audios/diVeNha.mp3",
        "artistId": artist_map["Đen Vâu"],
        "created_at": now
    },
    {
        "title": "Ngày Đầu Tiên",
        "artist": "Đức Phúc",
        "album": "Single",
        "releaseYear": 2024,
        "duration": 328,
        "genre": ["Pop", "Ballad", "V-Pop"],
        "coverArt": "https://res.cloudinary.com/dhifiomji/image/upload/v1750647263/ngayDauTien_aveknh.jpg",
        "audioUrl": "https://res.cloudinary.com/dhifiomji/raw/upload/v1750750854/audios/ngayDauTien.mp3",
        "artistId": artist_map["Đức Phúc"],
        "created_at": now
    },
    {
        "title": "Dù Cho Tận Thế",
        "artist": "ERIK",
        "album": "Single",
        "releaseYear": 2024,
        "duration": 353,
        "genre": ["Pop", "V-Pop", "R&B"],
        "coverArt": "https://res.cloudinary.com/dhifiomji/image/upload/v1750647290/duChoTanThe_rqtst5.jpg",
        "audioUrl": "https://res.cloudinary.com/dhifiomji/raw/upload/v1750342592/audios/duChoTanThe.mp3",
        "artistId": artist_map["ERIK"],
        "created_at": now
    },
    {
        "title": "Bắc Bling",
        "artist": "Hòa Minzy",
        "album": "Single",
        "releaseYear": 2024,
        "duration": 405,
        "genre": ["Pop", "Ballad", "V-Pop"],
        "coverArt": "https://res.cloudinary.com/dhifiomji/image/upload/v1750647285/bacBling_iibwiv.jpg",
        "audioUrl": "https://res.cloudinary.com/dhifiomji/raw/upload/v1750750757/audios/bacBling.mp3",
        "artistId": artist_map["Hòa Minzy"],
        "created_at": now
    },
    {
        "title": "Ngáo Ngơ",
        "artist": "HieuThuHai",
        "album": "Anh Trai Say Hi",
        "releaseYear": 2024,
        "duration": 432,
        "genre": ["Hip-Hop", "Rap", "V-Pop"],
        "coverArt": "https://res.cloudinary.com/dhifiomji/image/upload/v1750647262/ngaoNg%C6%A1_xvi1lj.jpg",
        "audioUrl": "https://res.cloudinary.com/dhifiomji/raw/upload/v1750750852/audios/ngaoNg%C6%A1.mp3",
        "artistId": artist_map["HieuThuHai"],
        "created_at": now
    },
    {
        "title": "Lời Tạm Biệt Chưa Nói",
        "artist": "Kai Đinh",
        "album": "Single",
        "releaseYear": 2024,
        "duration": 419,
        "genre": ["Indie", "Ballad", "V-Pop"],
        "coverArt": "https://res.cloudinary.com/dhifiomji/image/upload/v1750647262/loiTamBietChuaNoi_b8de78.jpg",
        "audioUrl": "https://res.cloudinary.com/dhifiomji/raw/upload/v1750750841/audios/loiTamBietChuaNoi.mp3",
        "artistId": artist_map["Kai Đinh"],
        "created_at": now
    },
    {
        "title": "Sài Gòn Hôm Nay Mưa",
        "artist": "Hoàng Duyên",
        "album": "Single",
        "releaseYear": 2024,
        "duration": 407,
        "genre": ["Ballad", "V-Pop", "Indie"],
        "coverArt": "https://res.cloudinary.com/dhifiomji/image/upload/v1750647267/saiGonHomNayMua_aezxmi.jpg",
        "audioUrl": "https://res.cloudinary.com/dhifiomji/raw/upload/v1750750861/audios/saiGonHomNayMua.mp3",
        "artistId": artist_map["Hoàng Duyên"],
        "created_at": now
    },
    {
        "title": "Trái Đất Ôm Mặt Trời",
        "artist": "Hoàng Thùy Linh",
        "album": "Single",
        "releaseYear": 2024,
        "duration": 314,
        "genre": ["Pop", "V-Pop", "Electronic"],
        "coverArt": "https://res.cloudinary.com/dhifiomji/image/upload/v1750647281/traiDatOmMatTroi_la2xnn.jpg",
        "audioUrl": "https://res.cloudinary.com/dhifiomji/raw/upload/v1750750866/audios/traiDatOmMatTroi.mp3",
        "artistId": artist_map["Hoàng Thùy Linh"],
        "created_at": now
    },
    {
        "title": "Yêu Một Người Có Lẽ",
        "artist": "JSOL",
        "album": "Single",
        "releaseYear": 2024,
        "duration": 210,
        "genre": ["Pop", "V-Pop", "R&B"],
        "coverArt": "https://res.cloudinary.com/dhifiomji/image/upload/v1750647281/yeuMotNguoiCoLe_vvbgzk.jpg",
        "audioUrl": "https://res.cloudinary.com/dhifiomji/raw/upload/v1750750878/audios/yeuMotNguoiCoLe.mp3",
        "artistId": artist_map["JSOL"],
        "created_at": now
    }
]

# Step 4: Seed songs
inserted = songs_collection.insert_many(songs)
song_ids = inserted.inserted_ids
song_map = {song["title"]: song_id for song, song_id in zip(songs, song_ids)}
print(f"✅ Seeded {len(inserted.inserted_ids)} songs successfully.")
