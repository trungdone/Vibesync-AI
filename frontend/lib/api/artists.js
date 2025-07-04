// lib/api/artists.js
import { apiFetch } from "../utils";

// Lấy danh sách tất cả nghệ sĩ
export async function fetchArtists() {
  const endpoint = "/api/artists";
  return await apiFetch(endpoint, { fallbackOnError: [] });
}

// Lấy thông tin nghệ sĩ theo ID
export async function fetchArtistById(id) {
  const endpoint = `/api/artists/${id}`;
  return await apiFetch(endpoint);
}

// Tạo mới một nghệ sĩ
export async function createArtist(data) {
  const endpoint = "/api/artists";
  return await apiFetch(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
}

// Gợi ý nghệ sĩ khác (khác với artistId)
export async function fetchSuggestedArtists(artistId) {
  const endpoint = "/api/artists";
  return await apiFetch(endpoint, { fallbackOnError: [] })
    .then(data => {
      console.log("Raw API response for suggested artists:", data); // Debug
      const artists = Array.isArray(data.artists) ? data.artists : (Array.isArray(data) ? data : []);
      return artists.filter(a => a.id !== artistId).slice(0, 5);
    });
}
