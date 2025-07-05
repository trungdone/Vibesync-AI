from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from routes import (
    song_routes,
    user_routes,
    playlist_routes,
    albums_routes,
    artist_routes,
)
from routes.admin_routes.song_admin_routes import router as admin_song_router
from routes.admin_routes.admin_artist_routes import router as admin_artist_router
from routes.admin_routes.admin_album_routes import router as admin_album_router
from routes.search_routes import router as search_router
from routes.history_routes import router as history_router

from dotenv import load_dotenv
import os

# Load env variables
load_dotenv()

# Init FastAPI
app = FastAPI()

# Serve static audio files
app.mount("/audio", StaticFiles(directory="audio"), name="audio")

# CORS config
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(song_routes.router, prefix="/api")
app.include_router(user_routes.router, prefix="/user")
app.include_router(playlist_routes.router, prefix="/api")
app.include_router(albums_routes.router, prefix="/api")
app.include_router(artist_routes.router, prefix="/api")
app.include_router(admin_artist_router, prefix="/api")
app.include_router(admin_album_router, prefix="/api")
app.include_router(admin_song_router, prefix="/api")
app.include_router(search_router)
app.include_router(history_router)

@app.get("/")
def root():
    return {"message": "VibeSync API is running"}
