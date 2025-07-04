from utils.gemini_api import ask_gemini

# ==== Danh sách nghệ sĩ (có thể lấy từ MongoDB hoặc backend) ====
ARTISTS_DATA = [
    {
        "name": "Tuấn Cry",
        "artist_id": "6863a891ff8a95c50b291b91",
    },
    {
        "name": "Sơn Tùng MTP",
        "artist_id": "6863a891ff8a95c50b291b92",
    },
    {
        "name": "ATUS",
        "artist_id": "6863a891ff8a95c50b291b93",
    },
    {
        "name": "Tăng Duy Tân",
        "artist_id": "6863a891ff8a95c50b291b94",
    },
    {
        "name": "Vũ Cát Tường",
        "artist_id": "6863d16fde04aba6e20b15b2",
    },
]

# ==== Từ khóa âm nhạc ====
MUSIC_KEYWORDS = [
    "nhạc", "hòa minzy", "bài hát", "ca sĩ", "playlist", "âm nhạc", "ban nhạc",
    "đen vâu", "Hòa Minzy", "chill", "edm", "rap", "pop", "rock",
    "top hit", "giai điệu", "lời bài hát"
]

# ==== Link gợi ý cố định theo từ khóa đặc biệt (ngoài nghệ sĩ) ====
FIXED_SUGGESTED_LINKS = {
    "đen vâu": "http://localhost:3000/artist/685ac55014516e6500439333",
    "nhạc vui": "http://localhost:3000/artist/685ac55014516e6500439334?from=youmaylike",
    "thư giãn": "http://localhost:3000/song/685ac55114516e6500439340",
    "hòa minzy": "http://localhost:3000/artist/685ac55014516e6500439338?from=youmaylike",
}

# ==== Tạo SUGGESTED_LINKS từ ARTISTS_DATA ====
ARTIST_LINKS = {
    artist["name"].lower(): f"http://localhost:3000/artist/{artist['artist_id']}"
    for artist in ARTISTS_DATA
}

# Gộp tất cả link gợi ý
SUGGESTED_LINKS = {**FIXED_SUGGESTED_LINKS, **ARTIST_LINKS}

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

    # ✅ 2. Kiểm tra nếu là câu hỏi liên quan đến âm nhạc hoặc có tên nghệ sĩ
    if any(keyword in normalized for keyword in MUSIC_KEYWORDS) or any(name in normalized for name in SUGGESTED_LINKS):
        reply = await ask_gemini(prompt)

        # ✅ 3. Chèn link nếu có từ khóa đặc biệt hoặc tên nghệ sĩ
        for keyword, link in SUGGESTED_LINKS.items():
            if keyword in normalized or keyword in reply.lower():
                reply += f"\n\n👉 Bạn có thể xem thêm về **{keyword.title()}** tại đây: [Xem ngay]({link})"
                break

        return reply

    # ❌ 4. Nếu không liên quan đến âm nhạc → từ chối
    return (
        "❗ Website của chúng tôi chuyên về âm nhạc. "
        "Vui lòng đặt câu hỏi liên quan đến playlist, ca sĩ, thể loại nhạc hoặc bài hát bạn muốn nghe 🎵."
    )
