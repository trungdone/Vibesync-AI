from services.song_service   import search_by_title
from services.artist_service import search_by_name
from services.album_service  import search_albums_by_title


async def search_all(query: str, search_type: str = "all") -> dict:
    """
    Tìm kiếm theo `query` và loại `search_type`.
    - search_type: all | song | artist | album
    """
    query = (query or "").strip()
    if not query:
        return {"songs": [], "artists": [], "albums": []}

    # Kết quả mặc định rỗng
    result = {"songs": [], "artists": [], "albums": []}

    # SONG
    if search_type in ("all", "song"):
        result["songs"] = search_by_title(query)

    # ARTIST
    if search_type in ("all", "artist"):
        result["artists"] = search_by_name(query)

    # ALBUM
    if search_type in ("all", "album"):
        result["albums"] = search_albums_by_title(query)

    return result
