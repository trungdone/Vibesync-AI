// lib/api/artists.js
import { apiFetch } from "../utils";

export async function fetchArtists() {
  const endpoint = "/api/artists";
  return await apiFetch(endpoint, { fallbackOnError: [] });
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

export async function fetchSuggestedArtists(artistId) {
  const endpoint = "/api/artists";
  return await apiFetch(endpoint, { fallbackOnError: [] })
    .then(data => {
      console.log("Raw API response for suggested artists:", data); // Debug raw data
      const artists = Array.isArray(data.artists) ? data.artists : (Array.isArray(data) ? data : []);
      return artists.filter(a => a.id !== artistId).slice(0, 5);
    });
}