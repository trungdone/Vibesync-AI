// lib/api/albums.js
import { apiFetch } from "../utils";

export async function fetchAlbums(params = {}) {
  const query = new URLSearchParams(params).toString();
  const endpoint = `/api/albums${query ? `?${query}` : ""}`;
  return await apiFetch(endpoint, { fallbackOnError: [] });
}

export async function fetchAlbumById(id) {
  const endpoint = `/api/albums/${id}`;
  return await apiFetch(endpoint);
}

export async function createAlbum(data) {
  const endpoint = "/api/albums";
  return await apiFetch(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
}