from utils.gemini_api import ask_gemini

# ==== Từ khóa âm nhạc ====
MUSIC_KEYWORDS = [
    "nhạc", "bài hát", "ca sĩ", "playlist", "âm nhạc", "ban nhạc",
    "chill", "edm", "rap", "pop", "rock", "top hit", "giai điệu", "lời bài hát"
]

# ==== Danh sách link gợi ý theo chủ đề đặc biệt ====
SUGGESTED_LINKS = {
    "nhạc buồn": "http://localhost:3000/playlist/liked",
    "nhạc vui": "http://localhost:3000/library",
    "thư giãn": "http://localhost:3000/playlist/top-hits-2023",
}

# ==== Câu hỏi tùy chỉnh (FAQ) ====
CUSTOM_RESPONSES = {
    "creator": {
        "questions": [
            "ai tạo ra trang web này",
            "ai là người tạo ra trang web này",
            "ai phát triển trang web này",
            "người làm ra trang web này là ai",
            "ai làm website này"
        ],
        "answer": "🧑‍💻 Website này được phát triển bởi đội ngũ VibeSync – đam mê âm nhạc và công nghệ.",
    },
    "purpose": {
        "questions": [
            "trang web này dùng để làm gì",
            "mục đích của trang web này là gì",
            "website này dùng để làm gì",
            "tôi vào trang web này để làm gì"
        ],
        "answer": "🎧 VibeSync là nền tảng nghe nhạc thông minh, nơi bạn có thể tìm kiếm, nghe và khám phá playlist theo tâm trạng.",
    },
    "register": {
        "questions": [
            "làm sao để đăng ký tài khoản",
            "cách đăng ký tài khoản",
            "tôi muốn tạo tài khoản",
            "làm thế nào để đăng ký",
            "đăng ký như thế nào",
            "đăng kí như thế nào",
            "đăng kí thế nào"
        ],
        "answer": (
            "🔐 Bạn có thể tạo tài khoản bằng cách nhấn vào nút 'Đăng ký' ở góc trên cùng bên phải, "
            "sau đó điền đầy đủ thông tin và bấm nút đăng ký. Chúc bạn thành công nhé!"
        ),
    },
    "free_music": {
        "questions": [
            "tôi có thể nghe nhạc miễn phí không",
            "nghe nhạc có mất phí không",
            "có được nghe miễn phí không",
            "website có miễn phí không",
            "nghe nhạc free không"
        ],
        "answer": "✅ Hoàn toàn có thể! Tất cả playlist cơ bản đều miễn phí, không cần trả phí.",
    },
}

# ==== Hàm xử lý chính ====
async def handle_user_question(prompt: str) -> str:
    normalized = prompt.lower().strip()

    # ✅ 1. Trả lời nếu trùng câu hỏi tùy chỉnh
    for group in CUSTOM_RESPONSES.values():
        for question in group["questions"]:
            if question in normalized:
                return group["answer"]

    # ✅ 2. Nếu liên quan đến âm nhạc thì gọi Gemini
    if any(keyword in normalized for keyword in MUSIC_KEYWORDS):
        reply = await ask_gemini(prompt)

        # ✅ 3. Chèn link nếu có từ khóa đặc biệt
        for keyword, link in SUGGESTED_LINKS.items():
            if keyword in normalized or keyword in reply.lower():
                reply += f"\n\n👉 Bạn có thể nghe {keyword} tại đây: [Nghe ngay]({link})"
                break

        return reply

    # ❌ 4. Nếu không liên quan đến âm nhạc → từ chối
    return (
        "❗ Website của chúng tôi chuyên về âm nhạc. "
        "Vui lòng đặt câu hỏi liên quan đến playlist, ca sĩ, thể loại nhạc hoặc bài hát bạn muốn nghe 🎵."
    )
