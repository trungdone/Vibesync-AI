"use client";

import { useState } from "react";
import PlaylistSongList from "./playlist-song-list";

export default function PlaylistSongListClient({ playlist, songs, coverToShow }) {
  const [currentSongs, setCurrentSongs] = useState(songs);

  const handleRemove = async (songId) => {
    try {
      const res = await fetch(`http://localhost:8000/api/${playlist.id}/remove-song`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ songId }),
      });

      if (!res.ok) {
        throw new Error("Failed to remove song");
      }

      // ✅ Remove song from UI
      setCurrentSongs((prev) => prev.filter((s) => s.id !== songId));
    } catch (error) {
      console.error("❌ Failed to remove song from playlist:", error);
      alert("Failed to remove song from playlist.");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-6">
        <div className="w-40 h-40 rounded shadow overflow-hidden bg-gray-800 flex items-center justify-center">
          {currentSongs.length === 0 ? (
            <span className="text-gray-400 text-sm">No cover</span>
          ) : (
            <img
              src={coverToShow || "/placeholder.svg"}
              alt="Playlist cover"
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div>
          <h1 className="text-3xl font-bold">{playlist.title}</h1>
          <p className="text-gray-400">{playlist.description || "No description."}</p>
          <p className="text-sm text-muted-foreground">
            {currentSongs.length} {currentSongs.length === 1 ? "song" : "songs"}
          </p>
        </div>
      </div>

      <PlaylistSongList songs={currentSongs} onRemove={handleRemove} />
    </div>
  );
}
