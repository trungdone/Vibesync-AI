# backend/app.py - Unified FastAPI backend entry

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from utils.gemini_api import ask_gemini




# Import other routes
from routes import song_routes, user_routes, playlist_routes, artist_routes, albums_routes,chat_routes

app = FastAPI()

# Serve static audio files
app.mount("/audio", StaticFiles(directory="audio"), name="audio")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # React frontend origin
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers (Authorization, Content-Type, etc.)
)

# Include routers with appropriate prefixes
app.include_router(song_routes.router, prefix="/api")
app.include_router(user_routes.router, prefix="/user")
app.include_router(playlist_routes.router, prefix="/api")
app.include_router(artist_routes.router, prefix="/api")
app.include_router(albums_routes.router, prefix="/api")
app.include_router(chat_routes.router)




# Health check endpoint
@app.get("/")
def root():
    return {"message": "VibeSync API is running"}


