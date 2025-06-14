# app.py - Entry point for FastAPI backend
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth_routes, song_routes, user_routes, playlist_routes

app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["http://127.0.0.1:5500"] for tighter security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Include routers
app.include_router(auth_routes.router, prefix="/auth")
app.include_router(song_routes.router, prefix="/api")
app.include_router(user_routes.router, prefix="/user")
app.include_router(playlist_routes.router, prefix="/api")

@app.get("/")
def root():
    return {"message": "VibeSync API is running"}
