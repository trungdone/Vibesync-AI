const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function fetchSongs(params = {}) {
  try {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE_URL}/api/songs${query ? `?${query}` : ""}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch songs: ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    console.error("Error fetching songs:", error);
    return []; // Return empty array as fallback
  }
}

export async function fetchSongById(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/songs/${id}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch song: ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    console.error("Error fetching song:", error);
    return null;
  }
}

export async function fetchPlaylists() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/playlists`);
    if (!res.ok) {
      throw new Error(`Failed to fetch playlists: ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    console.error("Error fetching playlists:", error);
    return [];
  }
}

export async function fetchPlaylistById(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/playlists/${id}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch playlist: ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    console.error("Error fetching playlist:", error);
    return null;
  }
}

export async function fetchArtists() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/artists`);
    if (!res.ok) {
      throw new Error(`Failed to fetch artists: ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    console.error("Error fetching artists:", error);
    return [];
  }
}

export async function fetchArtistById(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/artists/${id}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch artist: ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    console.error("Error fetching artist:", error);
    return null;
  }
}