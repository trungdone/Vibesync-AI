"use client";

import { useMusic } from "@/context/music-context";
import { Play, Pause } from "lucide-react";
import SongActionsMenu from "./song-actions-menu";



export default function SongList({ songs }) {
  const { currentSong, isPlaying, playSong } = useMusic();
  

  return (
    <div className="space-y-2">
      
      {songs.map((song) => (
        <div
          key={song.id}
          className="flex items-center justify-between p-2 rounded-md transition-colors hover:bg-gray-800/40 group"
        >
          {/* LEFT: Thumbnail + Title */}
          <div className="flex items-center gap-4">
            {/* ▶️ Button */}
            <button
              onClick={() => playSong(song)}
              className="p-1 hover:bg-gray-600 rounded-full"
            >
              {currentSong?.id === song.id && isPlaying ? (
                <Pause className="w-5 h-5 text-white" />
              ) : (
                <Play className="w-5 h-5 text-white" />
              )}
            </button>

            {/* Cover + Info */}
            <img
              src={song.coverArt || "/placeholder.jpg"}
              alt={song.title}
              className="w-12 h-12 object-cover rounded"
            />
            <div>
              <p className="text-sm font-medium text-white">{song.title}</p>
              <p className="text-xs text-gray-400">{song.artist} • {song.album}</p>
            </div>
          </div>

          {/* RIGHT: duration + menu */}
          <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-sm text-gray-400">
              {formatDuration(song.duration)}
            </span>
              <SongActionsMenu song={song} />
          </div>
        </div>
      ))}
    </div>
  );
}

// Helper to format duration in mm:ss
function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  return `${minutes}:${remaining.toString().padStart(2, "0")}`;
}
