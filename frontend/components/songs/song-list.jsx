"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Pause, Heart } from "lucide-react";
import { useMusic } from "@/context/music-context";
import { formatDuration } from "@/lib/utils";
import SongActionsMenu from "./song-actions-menu";

export default function SongList({ songs }) {
  const { currentSong, isPlaying, playSong, togglePlayPause } = useMusic();
  const [likedSongs, setLikedSongs] = useState(new Set());

  const toggleLike = (songId) => {
    const updated = new Set(likedSongs);
    updated.has(songId) ? updated.delete(songId) : updated.add(songId);
    setLikedSongs(updated);
  };

  return (
    <div className="space-y-2">
      {songs.map((song) => {
        const isCurrent = currentSong?.id === song.id;
        const isLiked = likedSongs.has(song.id);

        return (
          <div
            key={song.id}
            className={`flex items-center justify-between px-4 py-2 rounded-md transition hover:bg-white/10 group ${
              isCurrent ? "bg-white/10" : ""
            }`}
          >
            {/* LEFT */}
            <div className="flex items-center gap-4">
              <button
                onClick={() =>
                  isCurrent ? togglePlayPause() : playSong(song)
                }
                className="p-1 hover:bg-gray-600 rounded-full"
              >
                {isCurrent && isPlaying ? (
                  <Pause className="w-5 h-5 text-white" />
                ) : (
                  <Play className="w-5 h-5 text-white" />
                )}
              </button>

              <Image
                src={song.coverArt || "/placeholder.jpg"}
                alt={song.title}
                width={48}
                height={48}
                className="rounded object-cover"
              />

              <div>
                <Link href={`/song/${song.id}`} className="text-white font-medium hover:underline">
                  {song.title}
                </Link>
                <p className="text-xs text-gray-400">
                  {song.artist} • {song.album || "Unknown"}
                </p>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-sm text-gray-400">
                {formatDuration(song.duration)}
              </span>
              <button
                onClick={() => toggleLike(song.id)}
                className={`text-gray-400 hover:text-white ${
                  isLiked ? "text-pink-500" : ""
                }`}
              >
                <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
              </button>
              <SongActionsMenu song={song} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
