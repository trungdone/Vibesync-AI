from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from bson import ObjectId
from database import liked_songs_collection

router = APIRouter()

class ToggleLikeRequest(BaseModel):
    userId: str
    songId: str

@router.post("/toggle")
def toggle_like_song(data: ToggleLikeRequest):
    user_id = data.userId
    song_id = data.songId

    # Check if document exists
    doc = liked_songs_collection.find_one({"userId": user_id})

    if doc:
        # If song already liked, remove it
        if song_id in doc.get("songIds", []):
            liked_songs_collection.update_one(
                {"userId": user_id},
                {"$pull": {"songIds": song_id}}
            )
            return {"message": "Song unliked", "liked": False}
        else:
            # Add song to liked list
            liked_songs_collection.update_one(
                {"userId": user_id},
                {"$addToSet": {"songIds": song_id}}
            )
            return {"message": "Song liked", "liked": True}
    else:
        # Create new doc for user
        liked_songs_collection.insert_one({
            "userId": user_id,
            "songIds": [song_id]
        })
        return {"message": "Song liked (new doc created)", "liked": True}

@router.get("/{user_id}")
def get_liked_songs(user_id: str):
    doc = liked_songs_collection.find_one({"userId": user_id})
    if not doc:
        return {"likedSongs": []}
    return {"likedSongs": doc.get("songIds", [])}
