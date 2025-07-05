import { apiFetch } from "../utils";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

// 📥 Lấy danh sách bài hát với tham số (sort, limit, v.v.)
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

// 📥 Lấy 1 bài hát theo ID
export async function fetchSongById(id) {
  try {
    return await apiFetch(`/api/songs/${id}`);
  } catch (error) {
    console.error(`fetchSongById error (${id}):`, error);
    return null;
  }
}

// 📥 Lấy nhiều bài hát theo danh sách ID
export async function fetchSongsByIds(songIds) {
  try {
    const promises = songIds.map((id) => apiFetch(`/api/songs/${id}`));
    return await Promise.all(promises);
  } catch (error) {
    console.error("fetchSongsByIds error:", error);
    return [];
  }
}

// 📤 Tạo bài hát mới
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

// ✏️ Cập nhật bài hát
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

// ❌ Xoá bài hát
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

// 📥 Lấy bài hát theo artist
export async function fetchSongsByArtist(artistId) {
  const endpoint = "/api/songs";
  try {
    const data = await apiFetch(endpoint, { fallbackOnError: [] });
    const songs = Array.isArray(data.songs)
      ? data.songs
      : Array.isArray(data)
      ? data
      : [];
    return songs.filter((song) => song.artistId === artistId);
  } catch (error) {
    console.error("fetchSongsByArtist error:", error);
    return [];
  }
}

// ⭐ Lấy danh sách top bài hát (ngẫu nhiên, giới hạn)
export async function fetchTopSongs(limit = 10) {
  const endpoint = "/api/songs";
  try {
    const data = await apiFetch(endpoint, { fallbackOnError: [] });
    const songs = Array.isArray(data.songs)
      ? data.songs
      : Array.isArray(data)
      ? data
      : [];
    return songs.sort(() => 0.5 - Math.random()).slice(0, limit);
  } catch (error) {
    console.error("fetchTopSongs error:", error);
    return [];
  }
}

// 🔁 Lấy bài hát từ backend trực tiếp (ví dụ dùng ở server components)
export async function getSongById(id) {
  try {
    const res = await fetch(`${API_BASE}/songs/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error(`getSongById error (${id}):`, error);
    return null;
  }
}
