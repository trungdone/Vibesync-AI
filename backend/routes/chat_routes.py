from fastapi import APIRouter, HTTPException
from models.chat import ChatRequest, ChatResponse, ChatMessage, ChatHistory
from database.db import history_collection
from utils.question_handler import handle_user_question  # ✅ dùng module chuyên xử lý
from typing import Optional
from utils.question_handler import handle_user_question


router = APIRouter()


@router.post("/chat", response_model=ChatResponse)
async def chat_with_bot(payload: ChatRequest):
    """
    Gửi tin nhắn đến AI và lưu lịch sử chat cho user_id.
    """
    user_id = payload.user_id
    user_message = payload.message.strip()

    bot_reply = await handle_user_question(user_message)

    if not user_message:
        raise HTTPException(status_code=400, detail="Tin nhắn không được để trống.")

    # ✅ Gọi AI (tách xử lý ra module)
    bot_reply = await handle_user_question(user_message)

    # Chuẩn bị tin nhắn để lưu
    user_msg = {"sender": "user", "text": user_message}
    bot_msg = {"sender": "bot", "text": bot_reply}

    # ✅ Lưu vào MongoDB
    history_collection.update_one(
        {"user_id": user_id},
        {"$push": {"history": {"$each": [user_msg, bot_msg]}}},
        upsert=True,
    )

    # Lấy lại toàn bộ lịch sử để trả về
    updated_doc = history_collection.find_one({"user_id": user_id})
    history = [ChatMessage(**msg) for msg in updated_doc.get("history", [])]

    return ChatResponse(response=bot_reply, history=history)


@router.get("/chat/history/{user_id}", response_model=ChatHistory)
async def get_chat_history(user_id: str):
    """
    Lấy toàn bộ lịch sử chat theo user_id.
    """
    doc = history_collection.find_one({"user_id": user_id})
    if not doc:
        return {"user_id": user_id, "history": []}

    history = [ChatMessage(**msg) for msg in doc.get("history", [])]
    return {"user_id": user_id, "history": history}


@router.delete("/chat/history/{user_id}")
async def delete_chat_history(user_id: str):
    """
    Xoá toàn bộ lịch sử chat của user_id.
    """
    result = history_collection.delete_one({"user_id": user_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Không tìm thấy lịch sử để xoá.")

    return {"message": f"🗑️ Đã xoá lịch sử chat của user {user_id}"}
