# routes/user_routes.py
from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from pymongo import MongoClient
from database.db import users_collection
from models.user import UserRegister
from fastapi import Body
from bson import ObjectId
from pydantic import BaseModel

print("User routes loaded")

# Config JWT
SECRET_KEY = "your-secret-key"  # Thay bằng key an toàn
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="user/login")

class User(BaseModel):
    id: str
    name: str
    email: str
    avatar: str | None = None
    role: str
    banned: bool = False

class UserProfile(BaseModel):
    name: str
    email: str

# Dependency to get current user
async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if not user_id:
            raise credentials_exception
        user = users_collection.find_one({"_id": user_id})
        if not user:
            raise credentials_exception
        user["id"] = str(user["_id"])
        del user["_id"]
        del user["hashed_password"]
        return user
    except JWTError:
        raise credentials_exception

# Helper function to create JWT
def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire, "iat": datetime.utcnow()})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

router = APIRouter(tags=["user"])

# Register endpoint
@router.post("/register")
async def register(user: UserRegister):
    print("Register endpoint called")
    if users_collection.find_one({"email": user.email.lower()}):
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = pwd_context.hash(user.password)
    user_data = {
        "_id": str(ObjectId()),
        "name": user.name,
        "email": user.email.lower(),
        "hashed_password": hashed_password,
        "role": "user",
        "created_at": datetime.utcnow(),
        "avatar": "/placeholder.svg",
        "banned": False
    }
    result = users_collection.insert_one(user_data)
    return {"message": "User created successfully", "user_id": str(result.inserted_id)}

# Login endpoint
@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    print("Login endpoint called")
    user = users_collection.find_one({"email": form_data.username.lower()})
    if not user or not pwd_context.verify(form_data.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    if user.get("banned", False):
        raise HTTPException(status_code=403, detail="Account is banned")

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user["_id"]), "role": user["role"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# Get current user
@router.get("/me", response_model=dict)
async def get_current_user_endpoint(current_user: dict = Depends(get_current_user)):
    return current_user

# Get all users (admin only)
@router.get("/users")
async def get_users(current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    users = list(users_collection.find({}, {"hashed_password": 0}))
    for user in users:
        user["id"] = str(user["_id"])
        del user["_id"]
    return users

# Promote user to admin
@router.post("/users/{user_id}/promote")
async def promote_to_admin(user_id: str, current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    user = users_collection.find_one({"_id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user["role"] == "admin":
        raise HTTPException(status_code=400, detail="User is already an admin")
    users_collection.update_one({"_id": user_id}, {"$set": {"role": "admin"}})
    return {"message": "User promoted to admin"}

# Demote admin to user
@router.post("/users/{user_id}/demote")
async def demote_from_admin(user_id: str, current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    user = users_collection.find_one({"_id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user["role"] != "admin":
        raise HTTPException(status_code=400, detail="User is not an admin")
    if user_id == current_user["id"]:
        raise HTTPException(status_code=400, detail="Cannot demote yourself")
    users_collection.update_one({"_id": user_id}, {"$set": {"role": "user"}})
    return {"message": "User demoted to user"}

# Ban user
@router.post("/users/{user_id}/ban")
async def ban_user(user_id: str, current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    user = users_collection.find_one({"_id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.get("banned", False):
        raise HTTPException(status_code=400, detail="User is already banned")
    if user_id == current_user["id"]:
        raise HTTPException(status_code=400, detail="Cannot ban yourself")
    users_collection.update_one({"_id": user_id}, {"$set": {"banned": True}})
    return {"message": "User banned"}

# Unban user
@router.post("/users/{user_id}/unban")
async def unban_user(user_id: str, current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    user = users_collection.find_one({"_id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if not user.get("banned", False):
        raise HTTPException(status_code=400, detail="User is not banned")
    users_collection.update_one({"_id": user_id}, {"$set": {"banned": False}})
    return {"message": "User unbanned"}

# Update user profile
@router.put("/me")
async def update_user_profile(
    current_user: dict = Depends(get_current_user), name: str = None, avatar: str = None
):
    update_data = {}
    if name:
        update_data["name"] = name
    if avatar:
        update_data["avatar"] = avatar
    if update_data:
        update_data["updated_at"] = datetime.utcnow()
        users_collection.update_one({"_id": current_user["id"]}, {"$set": update_data})
    updated_user = users_collection.find_one({"_id": current_user["id"]})
    updated_user["id"] = str(updated_user["_id"])
    del updated_user["_id"]
    del updated_user["hashed_password"]
    return updated_user

@router.get("/admin/search")
async def admin_search(query: str, current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    users = list(users_collection.find({"name": {"$regex": query, "$options": "i"}}, {"hashed_password": 0}))
    for user in users:
        user["id"] = str(user["_id"])
        del user["_id"]
    return {"users": users}