# db.py - MongoDB connection
from pymongo import MongoClient

client = MongoClient("mongodb+srv://trungdnbh00901:U3GJNIFeo5y26W7X@vibesync.gaqe5kb.mongodb.net/")
#client = MongoClient("mongodb://localhost:27017/<vibesync>")
db = client.vibesync

users_collection = db.users
history_collection = db.history
playlists_collection = db.playlists
recommendations_collection = db.recommendations
preferences_collection = db["preferences"]
playlists_collection = db["playlists"]
songs_collection = db["songs"]






