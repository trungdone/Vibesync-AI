# user_routes.py
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

print("User routes loaded")  # Debug

# Config JWT
SECRET_KEY = "your-secret-key"  # Thay bằng key an toàn hơn
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="user/login")  # Cập nhật tokenUrl

class User(BaseModel):
    id: int
    name: str
    email: str
    avatar: str | None = None

# User response model
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
        del user["hashed_password"]  # Không trả về mật khẩu
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
async def register(user: UserRegister):  # ✅ Đọc từ JSON body
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
        "avatar": "/placeholder.svg"
    }
    result = users_collection.insert_one(user_data)

    return {"message": "User created successfully", "user_id": str(result.inserted_id)}

# Login endpoint
@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    print("Login endpoint called")  # Debug
    user = users_collection.find_one({"email": form_data.username.lower()})
    if not user or not pwd_context.verify(form_data.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Incorrect email or password")

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user["_id"]), "role": user["role"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# Get current user (protected)
@router.get("/me", response_model=dict, dependencies=[Depends(get_current_user)])
async def get_current_user_endpoint(current_user: dict = Depends(get_current_user)):
    return current_user

# Get all users (admin only)
@router.get("/users", dependencies=[Depends(get_current_user)])
async def get_users(current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    users = list(users_collection.find({}, {"hashed_password": 0}))
    for user in users:
        user["id"] = str(user["_id"])
        del user["_id"]
    return users

# Update user profile (protected)
@router.put("/me", dependencies=[Depends(get_current_user)])
async def update_user_profile(current_user: dict = Depends(get_current_user), name: str = None, avatar: str = None):
    update_data = {}
    if name:
        update_data["name"] = name
    if avatar:
        update_data["avatar"] = avatar
    if update_data:
        update_data["updated_at"] = datetime.utcnow()
        users_collection.update_one({"_id": current_user["_id"]}, {"$set": update_data})
    updated_user = users_collection.find_one({"_id": current_user["_id"]})
    updated_user["id"] = str(updated_user["_id"])
    del updated_user["_id"]
    del updated_user["hashed_password"]
    return updated_user

@router.get("/auth/me", response_model=User)
async def get_dummy_user(token: str = Depends(oauth2_scheme)):
    # 🔽 Giả lập giải mã token - thay bằng logic xác thực của bạn
    if token != "your-valid-token":
        raise HTTPException(status_code=401, detail="Unauthorized")
    return User(id=1, name="Trung Đỗ", email="trung@example.com", avatar="/profile.jpg")

