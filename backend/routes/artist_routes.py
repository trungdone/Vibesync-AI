from fastapi import APIRouter, HTTPException
from database.db import artists_collection
from bson import ObjectId

router = APIRouter()

@router.get("/artists/{id}")
async def get_artist(id: str):
    try:
        artist = artists_collection.find_one({"_id": ObjectId(id)})
        if not artist:
            raise HTTPException(status_code=404, detail="Artist not found")
        artist["id"] = str(artist["_id"])
        del artist["_id"]
        return artist
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid artist ID")
