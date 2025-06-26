"use client";

import Image from "next/image";
import Link from "next/link";
import { Play, Heart, MoreHorizontal, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useMusic } from "@/context/music-context";
import { formatDuration } from "@/lib/utils";
import WaveBars from "@/components/ui/WaveBars";

export default function SongList({ songs }) {
  const { playSong, isPlaying, currentSong, togglePlayPause } = useMusic();
  const [optionsOpenId, setOptionsOpenId] = useState(null);
  const [popupPos, setPopupPos] = useState({ top: 0, left: 0 });
  const [likedSongs, setLikedSongs] = useState(new Set());
  const moreBtnRefs = useRef({}); // Save refs for each song's More button
  const popupRef = useRef(null);
  const observerRef = useRef(null);

  const handlePlayClick = (song) => {
    if (currentSong?.id?.toString() === song.id?.toString()) {
      togglePlayPause();
    } else {
      playSong(song);
    }
  };

  const toggleLike = (songId) => {
    const updated = new Set(likedSongs);
    updated.has(songId) ? updated.delete(songId) : updated.add(songId);
    setLikedSongs(updated);
  };

  const toggleOptions = (songId) => {
    if (optionsOpenId === songId) {
      setOptionsOpenId(null);
      return;
    }

    const rect = moreBtnRefs.current[songId]?.getBoundingClientRect();
    if (rect) {
      setPopupPos({
        top: rect.bottom + window.scrollY + 8,
        left: rect.right - 300, // Adjust width of popup (e.g., 300px)
      });
    }
    setOptionsOpenId(songId);
  };

  // Auto-close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setOptionsOpenId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
  if (!optionsOpenId || !moreBtnRefs.current[optionsOpenId]) return;

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0] && !entries[0].isIntersecting) {
        setOptionsOpenId(null); // Auto-close when not visible
      }
    },
    { threshold: 0.1 }
  );

  observer.observe(moreBtnRefs.current[optionsOpenId]);
  observerRef.current = observer;

  return () => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
  };
}, [optionsOpenId]);

  return (
    <div className="bg-white/5 rounded-lg overflow-hidden relative">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10 text-left text-gray-400 text-sm">
            <th className="p-4 w-12">#</th>
            <th className="p-4">Title</th>
            <th className="p-4 hidden md:table-cell">Album</th>
            <th className="p-4 hidden md:table-cell">Duration</th>
            <th className="p-4 w-12 text-right">•••</th>
          </tr>
        </thead>
        <tbody>
          {songs.map((song, index) => {
            const isCurrent = currentSong?.id?.toString() === song.id?.toString();
            const isLiked = likedSongs.has(song.id);

            return (
              <tr
                key={song.id}
                className={`group border-b border-white/5 hover:bg-white/10 transition ${
                  isCurrent ? "bg-white/10" : ""
                }`}
              >
                <td className="p-4 text-gray-400">
                  <div className="relative w-6 h-6 flex items-center justify-center">
                    {isCurrent && isPlaying ? (
                      <WaveBars />
                    ) : (
                      <>
                        <span className="group-hover:opacity-0 transition-opacity">{index + 1}</span>
                        <button
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center"
                          onClick={() => handlePlayClick(song)}
                        >
                          <Play size={16} className="text-white" />
                        </button>
                      </>
                    )}
                  </div>
                </td>

                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded overflow-hidden flex-shrink-0">
                      <Image
                        src={song.coverArt || "/placeholder.svg"}
                        alt={song.title}
                        fill
                        className={`object-cover ${isCurrent && isPlaying ? "animate-pulse" : ""}`}
                      />
                    </div>
                    <div>
                      <Link href={`/song/${song.id}`} className="font-medium hover:underline">
                        {song.title}
                      </Link>
                      <p className="text-sm text-gray-400">{song.artist}</p>
                    </div>
                  </div>
                </td>

                <td className="p-4 text-gray-400 hidden md:table-cell">{song.album || "N/A"}</td>

                <td className="p-4 text-gray-400 hidden md:table-cell">
                  {formatDuration(song.duration || 0)}
                </td>

                <td className="p-4 text-right relative">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => toggleLike(song.id)}
                      className={`text-gray-400 hover:text-white ${isLiked ? "text-pink-500" : ""}`}
                    >
                      <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
                    </button>

                    <button
                      ref={(el) => (moreBtnRefs.current[song.id] = el)}
                      onClick={() => toggleOptions(song.id)}
                      className="text-gray-400 hover:text-white"
                    >
                      <MoreHorizontal size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Render popup outside table */}
      {optionsOpenId && (
        <div
          ref={popupRef}
          className="fixed w-72 bg-[#181818] text-white rounded-xl shadow-xl z-50 p-4 animate-fadeIn"
          style={{ top: popupPos.top, left: popupPos.left }}
        >
          <div className="flex gap-3 items-start">
            <div className="w-14 h-14 relative rounded overflow-hidden flex-shrink-0">
              <Image
                src={
                  songs.find((s) => s.id === optionsOpenId)?.coverArt || "/placeholder.svg"
                }
                alt="cover"
                fill
                className="object-cover"
              />
            </div>

            <div className="flex-1 group relative">
              <div className="font-semibold text-base truncate cursor-pointer group-hover:underline">
                {songs.find((s) => s.id === optionsOpenId)?.title}
              </div>
              <div className="text-sm text-gray-400">
                {songs.find((s) => s.id === optionsOpenId)?.artist}
              </div>

              {/* Tooltip on hover */}
              <div className="absolute bottom-full left-0 mb-2 w-max bg-black/90 text-xs text-white px-3 py-2 rounded hidden group-hover:block z-50 whitespace-nowrap">
                <div>
                  <strong>Album:</strong>{" "}
                  {songs.find((s) => s.id === optionsOpenId)?.album || "Unknown"}
                </div>
                <div>
                  <strong>Genre:</strong>{" "}
                  {Array.isArray(songs.find((s) => s.id === optionsOpenId)?.genre)
                    ? songs.find((s) => s.id === optionsOpenId)?.genre.join(", ")
                    : songs.find((s) => s.id === optionsOpenId)?.genre || "Unknown"}
                </div>
                <div>
                  <strong>Publisher:</strong>{" "}
                  {songs.find((s) => s.id === optionsOpenId)?.publisher || "Unknown"}
                </div>
              </div>
            </div>

            <button
              onClick={() => setOptionsOpenId(null)}
              className="text-gray-400 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>

          <ul className="text-sm mt-4 space-y-2 border-t border-white/10 pt-3">
            <li className="hover:bg-white/10 rounded p-2 cursor-pointer">Add to Playlist</li>
            <li className="hover:bg-white/10 rounded p-2 cursor-pointer">Lyrics</li>
            <li className="hover:bg-white/10 rounded p-2 cursor-pointer">Play Next</li>
            <li className="hover:bg-white/10 rounded p-2 cursor-pointer">Block</li>
            <li className="hover:bg-white/10 rounded p-2 cursor-pointer">Copy Link</li>
          </ul>
        </div>
      )}
    </div>
  );
}
