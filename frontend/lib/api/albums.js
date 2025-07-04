// lib/api/albums.js
import { apiFetch } from "../utils";

// Lấy danh sách album (có thể kèm tham số lọc)
export async function fetchAlbums(params = {}) {
  const query = new URLSearchParams(params).toString();
  const endpoint = `/api/albums${query ? `?${query}` : ""}`;
  const data = await apiFetch(endpoint, { fallbackOnError: { albums: [] } });
  return data.albums || [];
}

// Lấy thông tin album theo ID
export async function fetchAlbumById(id) {
  const endpoint = `/api/albums/${id}`;
  const data = await apiFetch(endpoint, { fallbackOnError: null });
  if (!data) throw new Error("Album not found");
  return data;
}

// Tạo album mới
export async function createAlbum(data) {
  const endpoint = "/api/albums";
  return await apiFetch(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
}

// Lọc album theo artist_id
export async function fetchAlbumsByArtist(artist_id) {
  const endpoint = "/api/albums";
  return await apiFetch(endpoint, { fallbackOnError: [] })
    .then(data => {
      const albums = Array.isArray(data.albums) ? data.albums : (Array.isArray(data) ? data : []);
      return albums.filter(album => album.artist_id === artist_id);
    });
}
