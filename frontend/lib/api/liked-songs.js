
import { getSongById } from "./songs";

export async function toggleLikeSong(songId, userId) {
  const res = await fetch("http://localhost:8000/api/liked_songs/toggle", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, songId }),
  });

  if (!res.ok) {
    console.error("Failed to toggle like. Status:", res.status);
    return { likedSongs: [] };
  }

  return await res.json();
}
export async function getLikedSongs(userId) {
  const res = await fetch(`http://localhost:8000/api/liked_songs/${userId}`);
  if (!res.ok) {
    console.error("Failed to fetch liked songs. Status:", res.status);
    return [];
  }

  const data = await res.json();
  const songIds = data.likedSongs || [];

  const songs = await Promise.all(songIds.map((id) => getSongById(id)));
  return songs.filter((s) => s); // filter out null
}


