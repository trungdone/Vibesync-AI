# backend/database/repositories/search_history_repository.py
from datetime import datetime
from typing import List, Dict, Any

COLLECTION = "search_histories"


# ---------- helpers ---------- #
def _normalize(doc: Dict[str, Any]) -> Dict[str, Any]:
    """Clone & ép _id -> str, đảm bảo có keyword & created_at."""
    return {
        "_id": str(doc.get("_id")),
        "keyword": doc.get("keyword", ""),
        "created_at": doc.get("created_at"),
    }


# ---------- public API -------- #
async def save_history(
    db,
    user_id: str,
    keyword: str,
    dedup: bool = True,
) -> Dict[str, Any]:
    """
    Lưu keyword tìm kiếm. Nếu dedup=True và keyword trùng bản ghi gần nhất -> không insert mới.
    Trả về document đã (hoặc sẽ) lưu với _id dạng str.
    """
    coll     = db[COLLECTION]
    keyword  = keyword.strip()

    if not keyword:
        raise ValueError("Keyword is empty")

    if dedup:
        latest = await coll.find_one(
            {"user_id": user_id},
            sort=[("created_at", -1)],
            projection={"keyword": 1, "created_at": 1},
        )
        if latest and latest.get("keyword", "").lower() == keyword.lower():
            # Đã trùng -> trả doc cũ
            return _normalize(latest)

    doc = {
        "user_id": user_id,
        "keyword": keyword,
        "created_at": datetime.utcnow(),
    }
    res = await coll.insert_one(doc)
    doc["_id"] = res.inserted_id
    return _normalize(doc)


async def list_recent_searches(
    db,
    user_id: str,
    limit: int = 10,
) -> List[Dict[str, Any]]:
    """
    Lấy <limit> keyword gần nhất của user, _id đã ép thành str.
    """
    cursor = (
        db[COLLECTION]
        .find({"user_id": user_id})
        .sort("created_at", -1)
        .limit(limit)
    )
    return [_normalize(doc) async for doc in cursor]


# ---------- create index once -- #
async def ensure_indexes(db):
    """Tạo index (user_id, created_at) nếu chưa có."""
    await db[COLLECTION].create_index([("user_id", 1), ("created_at", -1)])
