from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import song_routes, user_routes, playlist_routes, albums_routes
from fastapi.staticfiles import StaticFiles
from routes.admin_routes.song_admin_routes import router as admin_song_router
from routes.admin_routes.admin_artist_routes import router as admin_artist_router
from dotenv import load_dotenv
import os

load_dotenv()
app = FastAPI()


app.mount("/audio", StaticFiles(directory="audio"), name="audio")
# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],

)

# Include routers
app.include_router(song_routes.router, prefix="/api")
app.include_router(user_routes.router, prefix="/user")
app.include_router(playlist_routes.router, prefix="/api")
app.include_router(admin_artist_router, prefix="/api")
app.include_router(albums_routes.router, prefix="/api")
app.include_router(admin_song_router, prefix="/api")


@app.get("/")
def root():
    return {"message": "VibeSync API is running"}
