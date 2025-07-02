"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Pause, Heart } from "lucide-react";
import { useMusic } from "@/context/music-context";
import { formatDuration } from "@/lib/utils";
import WaveBars from "@/components/ui/WaveBars";
import SongActionsMenu from "./song-actions-menu";

export default function SongList({ songs: propSongs }) {
  const { playSong, isPlaying, currentSong, togglePlayPause, nextSong } = useMusic();
  const [optionsOpenId, setOptionsOpenId] = useState(null);
  const [popupPos, setPopupPos] = useState({ top: 0, left: 0 });
  const [likedSongs, setLikedSongs] = useState(new Set());
  const moreBtnRefs = useRef({});
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
        left: rect.right - 300,
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

  // Auto-close popup when More button is out of view
  useEffect(() => {
    if (!optionsOpenId || !moreBtnRefs.current[optionsOpenId]) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0] && !entries[0].isIntersecting) {
          setOptionsOpenId(null);
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

  // Handle other actions
  const handleLyrics = (songId) => {
    console.log(`View lyrics for song ${songId}`);
    setOptionsOpenId(null);
    // TODO: Implement lyrics functionality
  };

  const handlePlayNext = () => {
    nextSong();
    setOptionsOpenId(null);
  };

  const handleBlock = (songId) => {
    console.log(`Block song ${songId}`);
    setOptionsOpenId(null);
    // TODO: Implement block functionality
  };

  const handleCopyLink = (songId) => {
    const song = propSongs.find((s) => s.id === songId);
    const link = `${window.location.origin}/song/${songId}`;
    navigator.clipboard.writeText(link).then(() => {
      alert("✅ Link copied to clipboard!");
      setOptionsOpenId(null);
    }).catch((err) => {
      console.error("Failed to copy link:", err);
      alert("❌ Failed to copy link.");
      setOptionsOpenId(null);
    });
  };

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
          {propSongs.map((song, index) => {
            const isCurrent = currentSong?.id?.toString() === song.id?.toString();
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

      {/* Render popup with SongActionsMenu and other actions */}
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
                  propSongs.find((s) => s.id === optionsOpenId)?.coverArt || "/placeholder.svg"
                }
                alt="cover"
                fill
                className="object-cover"
              />
            </div>

            <div className="flex-1 group relative">
              <div className="font-semibold text-base truncate cursor-pointer group-hover:underline">
                {propSongs.find((s) => s.id === optionsOpenId)?.title}
              </div>
              <div className="text-sm text-gray-400">
                {propSongs.find((s) => s.id === optionsOpenId)?.artist}
              </div>

              {/* Tooltip on hover */}
              <div className="absolute bottom-full left-0 mb-2 w-max bg-black/90 text-xs text-white px-3 py-2 rounded hidden group-hover:block z-50 whitespace-nowrap">
                <div>
                  <strong>Album:</strong>{" "}
                  {propSongs.find((s) => s.id === optionsOpenId)?.album || "Unknown"}
                </div>
                <div>
                  <strong>Genre:</strong>{" "}
                  {Array.isArray(propSongs.find((s) => s.id === optionsOpenId)?.genre)
                    ? propSongs.find((s) => s.id === optionsOpenId)?.genre.join(", ")
                    : propSongs.find((s) => s.id === optionsOpenId)?.genre || "Unknown"}
                </div>
                <div>
                  <strong>Publisher:</strong>{" "}
                  {propSongs.find((s) => s.id === optionsOpenId)?.publisher || "Unknown"}
                </div>
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

          <div className="mt-4 border-t border-white/10 pt-3">
            {/* SongActionsMenu for Add to Playlist */}
            <SongActionsMenu
              song={propSongs.find((s) => s.id === optionsOpenId)}
              onClose={() => setOptionsOpenId(null)}
            />

            {/* Other actions */}
            <ul className="text-sm mt-2 space-y-2">
              <li
                className="hover:bg-white/10 rounded p-2 cursor-pointer"
                onClick={() => handleLyrics(optionsOpenId)}
              >
                Lyrics
              </li>
              <li
                className="hover:bg-white/10 rounded p-2 cursor-pointer"
                onClick={() => handlePlayNext()}
              >
                Play Next
              </li>
              <li
                className="hover:bg-white/10 rounded p-2 cursor-pointer"
                onClick={() => handleBlock(optionsOpenId)}
              >
                Block
              </li>
              <li
                className="hover:bg-white/10 rounded p-2 cursor-pointer"
                onClick={() => handleCopyLink(optionsOpenId)}
              >
                Copy Link
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}