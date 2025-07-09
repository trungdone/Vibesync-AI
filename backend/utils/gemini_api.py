# backend/utils/gemini_api.py
import os
import httpx
from dotenv import load_dotenv

load_dotenv()
GEMINI_API_KEY = os.getenv("GOOGLE_API_KEY")

GEMINI_API_URL = (
    f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"
)

async def ask_gemini(prompt: str) -> str:
    headers = {"Content-Type": "application/json"}
    body = {
        "contents": [
            {
                "parts": [{"text": prompt}]
            }
        ]
    }

    try:
        async with httpx.AsyncClient() as client:
            res = await client.post(GEMINI_API_URL, headers=headers, json=body)
            res.raise_for_status()
            data = res.json()
            reply = data["candidates"][0]["content"]["parts"][0]["text"]
            return reply

    except Exception as e:
        return f"Gemini error: {str(e)}"
