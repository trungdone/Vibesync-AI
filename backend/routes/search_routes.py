
# routes/search_routes.py
from fastapi import APIRouter, Query, Depends, HTTPException
from services.search_service import search_all
from database.repositories.search_history_repository import save_history
from routes.user_routes import get_current_user  # Dependency lấy user từ JWT/cookie

router = APIRouter(prefix="/search", tags=["Search"])


@router.get("")  # /search?query=<text>&type=song
async def search_endpoint(
    q: str = Query(..., alias="query", min_length=1),
    type: str = Query(
        "all",
        description="Loại tìm kiếm",
        regex="^(all|song|artist|album)$",
    ),
    current_user: dict = Depends(get_current_user),
):
    """
    Trả kết quả tìm kiếm và ghi lịch sử theo tài khoản.

    - **query**  : từ khóa cần tìm  
    - **type**   : all | song | artist | album  
    """
    # 1) LƯU LỊCH SỬ (chỉ khi user đăng nhập)
    try:
        if current_user:
            save_history(
                user_id=str(current_user["_id"]),
                keyword=q.strip(),
                search_type=type,
            )
    except Exception as e:
        # không làm hỏng tìm kiếm nếu ghi lịch sử lỗi
        print("⚠️  Cannot save search history:", e)

    # 2) TRẢ KẾT QUẢ
    try:
        return await search_all(q.strip(), type)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
