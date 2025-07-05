// lib/api/artists.js
import { apiFetch } from "../utils";

export async function fetchArtists() {
  const endpoint = "/api/artists";
  try {
    const data = await apiFetch(endpoint, { fallbackOnError: { artists: [] } });
    // Trích xuất đúng mảng artists
    return Array.isArray(data) ? data : data.artists || [];
  } catch (error) {
    console.error("fetchArtists error:", error);
    return [];
  }
}

export async function fetchArtistById(id) {
  const endpoint = `/api/artists/${id}`;
  return await apiFetch(endpoint);
}

export async function createArtist(data) {
  const endpoint = "/api/artists";
  return await apiFetch(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
}
