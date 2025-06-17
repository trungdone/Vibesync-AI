from database.db import artists_collection

artists_collection.delete_many({})

artists = [
    {"_id": "artist_1", "name": "The Weeknd"},
    {"_id": "artist_2", "name": "Ed Sheeran"},
    {"_id": "artist_3", "name": "Dua Lipa"}
]

def seed_artists():
    artists_collection.delete_many({})
    artists_collection.insert_many(artists)
    print("✅ Artists seeded successfully.")

if __name__ == "__main__":
    seed_artists()