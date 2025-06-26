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
  const response = await fetch("/api/playlists", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to create playlist");
  }

  return await response.json(); // Trả về newPlaylist với id
}