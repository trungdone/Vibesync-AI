import { apiFetch } from "../utils";

// Lấy toàn bộ nghệ sĩ
export async function fetchArtists() {
  const endpoint = "/api/artists";
  try {
    const data = await apiFetch(endpoint, { fallbackOnError: { artists: [] } });
    return Array.isArray(data) ? data : data.artists || [];
  } catch (error) {
    console.error("fetchArtists error:", error);
    return [];
  }
}

// Lấy chi tiết nghệ sĩ theo ID
export async function fetchArtistById(id) {
  const endpoint = `/api/artists/${id}`;
  try {
    const data = await apiFetch(endpoint, { fallbackOnError: null });
    return data;
  } catch (error) {
    console.error(`fetchArtistById error (${id}):`, error);
    return null;
  }
}

// Tạo nghệ sĩ mới
export async function createArtist(data) {
  const endpoint = "/api/artists";
  try {
    return await apiFetch(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("createArtist error:", error);
    throw error;
  }
}

// Gợi ý nghệ sĩ tương tự (loại bỏ chính artist hiện tại)
export async function fetchSuggestedArtists(artistId) {
  const endpoint = "/api/artists";
  try {
    const data = await apiFetch(endpoint, { fallbackOnError: [] });
    const artists = Array.isArray(data.artists)
      ? data.artists
      : Array.isArray(data)
      ? data
      : [];
    return artists.filter((a) => a.id !== artistId).slice(0, 5);
  } catch (error) {
    console.error("fetchSuggestedArtists error:", error);
    return [];
  }
}
