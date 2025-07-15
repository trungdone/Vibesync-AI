# backend/app.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv

# Load biến môi trường
load_dotenv()

# Import các router
from routes import (
    song_routes,
    user_routes,
    playlist_routes,
    albums_routes,
    artist_routes,
    chat_routes,
    recomment_routes,
    history_songs_routes
)
from routes.admin_routes.song_admin_routes import router as admin_song_router
from routes.admin_routes.admin_artist_routes import router as admin_artist_router
from routes.admin_routes.admin_album_routes import router as admin_album_router
from routes.liked_songs import router as liked_songs_router
from routes.search_routes import router as search_routes



# Khởi tạo FastAPI
app = FastAPI(title="VibeSync API")

# Đăng static audio
app.mount("/audio", StaticFiles(directory="audio"), name="audio")

# CORS cho phép frontend gọi API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Đăng ký các router cho user
app.include_router(song_routes.router, prefix="/api")
app.include_router(user_routes.router, prefix="/user")
app.include_router(playlist_routes.router, prefix="/api")
app.include_router(albums_routes.router, prefix="/api")
app.include_router(artist_routes.router, prefix="/api")
app.include_router(chat_routes.router)
app.include_router(recomment_routes.router, prefix="/api")
app.include_router(history_songs_routes.router)

app.include_router(search_routes, prefix="/api")


app.include_router(liked_songs_router, prefix="/api/liked_songs")


# Đăng ký các router cho admin
app.include_router(admin_song_router, prefix="/api")
app.include_router(admin_artist_router, prefix="/api")
app.include_router(admin_album_router, prefix="/api")

# Root check
@app.get("/")
def root():
    return {"message": "🎵 VibeSync API is running on FastAPI!"}
