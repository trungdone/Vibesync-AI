# backend/routes/history_routes.py
from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from database.db import db
from database.repositories import search_history_repository as repo
from services.auth_service import get_current_user

# ❌ Bỏ prefix, khai báo đường dẫn tuyệt đối → /history
router = APIRouter(tags=["Search History"])


# ---------- Pydantic schema ----------
class HistoryCreate(BaseModel):
    keyword: str


def extract_user_id(current_user):
    """Trả về user_id dưới dạng str, bất kể current_user là dict hay model."""
    if isinstance(current_user, dict):
        return str(current_user.get("_id"))
    return str(getattr(current_user, "id", ""))


# ---------- POST /history ----------
@router.post("/history", status_code=status.HTTP_201_CREATED)
async def save_history(
    payload: HistoryCreate,
    current_user=Depends(get_current_user),
):
    user_id = extract_user_id(current_user)
    if not user_id:
        raise HTTPException(status_code=400, detail="Invalid user")

    keyword = payload.keyword.strip()
    if not keyword:
        raise HTTPException(status_code=400, detail="Keyword cannot be empty")

    return await repo.save_history(db, user_id, keyword)


# ---------- GET /history ----------
@router.get("/history")
async def get_history(
    limit: int = Query(10, ge=1, le=50),
    current_user=Depends(get_current_user),
):
    user_id = extract_user_id(current_user)
    if not user_id:
        raise HTTPException(status_code=400, detail="Invalid user")

    return await repo.list_recent_searches(db, user_id, limit)
