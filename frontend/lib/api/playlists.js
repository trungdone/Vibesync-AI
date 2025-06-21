// lib/api/playlists.js
import { apiFetch } from "../utils";

export async function fetchPlaylists() {
  const endpoint = "/api/playlists";
  return await apiFetch(endpoint, { fallbackOnError: [] });
}

export async function fetchPlaylistById(id) {
  const endpoint = `/api/playlists/${id}`;
  return await apiFetch(endpoint);
}

export async function createPlaylist(data) {
  const endpoint = "/api/playlists";
  return await apiFetch(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
}