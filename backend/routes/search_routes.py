# ❌ Đang dùng get_current_user làm cho route cần login
from fastapi import APIRouter, Depends, Query
# from auth import get_current_user ❌

from services.search_service import SearchService

router = APIRouter(prefix="/search", tags=["Search"])

@router.get("")
async def search_all(query: str = Query("", min_length=0), type: str = "all"):
    print(f"[SEARCH] 🔍 query='{query}', type='{type}'")
    if not query.strip():
        return {"songs": [], "artists": [], "albums": []}
    return SearchService.search_all(query.strip(), type)

