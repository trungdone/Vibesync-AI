import { apiFetch } from "../utils";

export async function fetchAlbums(params = {}) {
  const query = new URLSearchParams(params).toString();
  const endpoint = `/api/albums${query ? `?${query}` : ""}`;
  const data = await apiFetch(endpoint, { fallbackOnError: { albums: [] } });
  return data.albums || [];
}

export async function fetchAlbumById(id) {
  const endpoint = `/api/albums/${id}`;
  const data = await apiFetch(endpoint, { fallbackOnError: null });
  if (!data) throw new Error("Album not found");
  return data;
}


export async function createAlbum(data) {
  const endpoint = "/api/albums";
  return await apiFetch(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
}