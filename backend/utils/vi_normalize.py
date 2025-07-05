import unicodedata
import re

_RE_NON_ALNUM = re.compile(r"[^a-z0-9]+")

def vn_normalize(text: str) -> str:
    """
    Bỏ dấu + về chữ thường + loại ký tự đặc biệt.
    Dùng cho field tìm kiếm 'search_title'.
    """
    text = (
        unicodedata.normalize("NFD", text)
        .encode("ascii", "ignore")
        .decode("utf-8")
        .lower()
    )
    return _RE_NON_ALNUM.sub(" ", text).strip()
