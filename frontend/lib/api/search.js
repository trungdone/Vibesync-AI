// lib/api/search.js
/**
 * Gọi API tìm kiếm
 * @param {string} keyword  - Từ khoá người dùng nhập
 * @param {"all"|"song"|"artist"|"album"} type - Loại tìm (mặc định "all")
 * @returns {Promise<{songs:[], artists:[], albums:[]}>}
 */
export async function searchAll(keyword, type = "all") {
  const kw = (keyword || "").trim();
  if (!kw) return { songs: [], artists: [], albums: [] };

  // Lấy token đã lưu khi login
  const token = localStorage.getItem("token");

  // Xây URL: /search?query=<kw>&type=<type>
  const params = new URLSearchParams({ query: kw, type });
  const url = `http://localhost:8000/search?${params.toString()}`;

  const res = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (res.status === 401) {
    throw new Error("Bạn cần đăng nhập để tìm kiếm (401 Unauthorized)");
  }
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`Search failed (${res.status}): ${msg}`);
  }

  return res.json();
}
