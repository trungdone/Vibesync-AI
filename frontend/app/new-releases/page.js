"use client";
import { useEffect, useState } from "react";
import { fetchSongs } from "@/lib/api/songs";
import SongList from "@/components/songs/song-list"; // Đảm bảo path đúng!

export default function NewReleasesPage() {
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    async function loadSongs() {
      try {
        const data = await fetchSongs();  // Lấy toàn bộ bài hát
        setSongs(data);
      } catch (err) {
        console.error("Error loading songs:", err);
      }
    }
    loadSongs();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">All New Releases</h1>
      {songs.length > 0 ? (
        <SongList songs={songs} />
      ) : (
        <p>No songs found or loading...</p>
      )}
    </div>
  );
}
