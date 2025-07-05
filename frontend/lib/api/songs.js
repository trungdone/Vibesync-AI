import { apiFetch } from "../utils";

// Lấy danh sách bài hát, có thể truyền params như sort, limit
export async function fetchSongs(params = {}) {
  const query = new URLSearchParams(params).toString();
  const endpoint = `/api/songs${query ? `?${query}` : ""}`;
  try {
    const data = await apiFetch(endpoint);
    return Array.isArray(data) ? data : data?.songs || [];
  } catch (error) {
    console.error("fetchSongs error:", error);
    return [];
  }
}

// Lấy 1 bài hát theo ID
export async function fetchSongById(id) {
  try {
    return await apiFetch(`/api/songs/${id}`);
  } catch (error) {
    console.error(`fetchSongById error (${id}):`, error);
    return null;
  }
}

// Lấy nhiều bài hát theo danh sách ID
export async function fetchSongsByIds(songIds) {
  try {
    const promises = songIds.map((id) => apiFetch(`/api/songs/${id}`));
    return await Promise.all(promises);
  } catch (error) {
    console.error("fetchSongsByIds error:", error);
    return [];
  }
}

// Tạo mới bài hát
export async function createSong(data) {
  try {
    return await apiFetch("/api/songs", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("createSong error:", error);
    throw error;
  }
}

// Cập nhật bài hát
export async function updateSong(id, data) {
  try {
    return await apiFetch(`/api/songs/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(`updateSong error (${id}):`, error);
    throw error;
  }
}

// Xoá bài hát
export async function deleteSong(id) {
  try {
    return await apiFetch(`/api/songs/${id}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error(`deleteSong error (${id}):`, error);
    throw error;
  }
}

// 🔍 Tìm kiếm bài hát theo từ khóa (title)
export async function fetchSongsByKeyword(keyword) {
  try {
    const query = encodeURIComponent(keyword);
    const data = await apiFetch(`/api/search?query=${query}`);
    return data?.songs || [];
  } catch (error) {
    console.error(`fetchSongsByKeyword error (${keyword}):`, error);
    return [];
  }
}
