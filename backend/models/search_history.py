from pydantic import BaseModel
from datetime import datetime

class SearchHistory(BaseModel):
    user_id: str
    search_query: str
    timestamp: datetime = datetime.utcnow()

    class Config:
        schema_extra = {
            "example": {
                "user_id": "user123",
                "search_query": "rock music",
                "timestamp": "2025-07-04T10:29:00"
            }
        }