# db.py - MongoDB connection
from pymongo import MongoClient
from passlib.context import CryptContext
from bson import ObjectId
import datetime

client = MongoClient("mongodb+srv://trungdnbh00901:trudo42@vibesync.gaqe5kb.mongodb.net/?retryWrites=true&w=majority")
# client = MongoClient("mongodb://localhost:27017/")
db = client["Vibesync"]

history_collection = db.history
recommendations_collection = db.recommendations
playlists_collection = db["playlists"]
songs_collection = db["songs"]
artists_collection = db["artists"]
users_collection = db["users"]
song_history_collection = db["song_history"]
albums_collection = db["albums"]

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")