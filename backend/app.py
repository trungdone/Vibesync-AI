# app.py - Entry point for FastAPI backend
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import  song_routes, user_routes, playlist_routes
from fastapi.staticfiles import StaticFiles
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


@app.get("/")
def root():
    return {"message": "VibeSync API is running"}
