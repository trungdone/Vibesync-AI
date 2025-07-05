import { apiFetch } from "../utils";

// Lấy danh sách album với các params (ví dụ: limit, skip)
export async function fetchAlbums(params = {}) {
  const query = new URLSearchParams(params).toString();
  const endpoint = `/api/albums${query ? `?${query}` : ""}`;
  try {
    const data = await apiFetch(endpoint, { fallbackOnError: { albums: [] } });
    return Array.isArray(data) ? data : data.albums || [];
  } catch (error) {
    console.error("fetchAlbums error:", error);
    return [];
  }
}

// Lấy album theo id
export async function fetchAlbumById(id) {
  const endpoint = `/api/albums/${id}`;
  try {
    const data = await apiFetch(endpoint, { fallbackOnError: null });
    if (!data) throw new Error("Album not found");
    return data;
  } catch (error) {
    console.error(`fetchAlbumById error (${id}):`, error);
    return null;
  }
}

// Tạo album mới
export async function createAlbum(data) {
  const endpoint = "/api/albums";
  try {
    return await apiFetch(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("createAlbum error:", error);
    throw error;
  }
}
