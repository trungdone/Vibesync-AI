"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Play, Pause, MoreHorizontal } from "lucide-react";
import { useMusic } from "@/context/music-context";
import { formatDuration } from "@/lib/utils";
import Link from "next/link";
import WaveBars from "../ui/WaveBars";

export default function PlaylistSongList({ songs: initialSongs, onRemove, onMoveUp, onMoveDown }) {
  const { playSong, isPlaying, currentSong, togglePlayPause } = useMusic();

  const [optionsOpenId, setOptionsOpenId] = useState(null);
  const [popupPos, setPopupPos] = useState({ top: 0, left: 0 });
  const moreBtnRefs = useRef({});
  const popupRef = useRef(null);
  const observerRef = useRef(null);

  const handlePlayClick = (song) => {
    if (currentSong?.id === song.id) {
      togglePlayPause();
    } else {
      playSong(song);
    }
  };

  const toggleOptions = (songId) => {
    if (optionsOpenId === songId) {
      setOptionsOpenId(null);
      return;
    }

    const rect = moreBtnRefs.current[songId]?.getBoundingClientRect();
    if (rect) {
      setPopupPos({ top: rect.bottom + window.scrollY + 8, left: rect.right - 300 });
    }
    setOptionsOpenId(songId);
  };

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

    const observer = new IntersectionObserver((entries) => {
      if (entries[0] && !entries[0].isIntersecting) {
        setOptionsOpenId(null);
      }
    }, { threshold: 0.1 });

    observer.observe(moreBtnRefs.current[optionsOpenId]);
    observerRef.current = observer;

    return () => observer.disconnect();
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
          {initialSongs.map((song, index) => {
            const isCurrent = currentSong?.id === song.id;

            return (
              <tr key={song.id} className={`transition hover:bg-white/10 ${isCurrent ? "bg-white/10" : ""}`}>
                <td className="p-4 text-gray-400">
                  {isCurrent && isPlaying ? <WaveBars /> : index + 1}
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 cursor-pointer group" onClick={() => handlePlayClick(song)}>
                      <Image
                        src={song.coverArt || "/placeholder.svg"}
                        alt="cover"
                        fill
                        className="object-cover rounded group-hover:opacity-80 transition"
                      />
                    </div>
                    <div className="flex flex-col">
                      <Link href={`/song/${song.id}`} className="text-white font-medium truncate max-w-[180px] hover:underline">
                        {song.title}
                      </Link>
                      <Link href={`/artist/${song.artistId}`} className="text-sm text-gray-400 truncate max-w-[180px] hover:underline">
                        {song.artist}
                      </Link>
                    </div>
                  </div>
                </td>
                <td className="p-4 hidden md:table-cell text-gray-300">{song.album}</td>
                <td className="p-4 hidden md:table-cell text-gray-300">{formatDuration(song.duration)}</td>
                <td className="p-4 text-right">
                  <button
                    ref={(el) => (moreBtnRefs.current[song.id] = el)}
                    onClick={() => toggleOptions(song.id)}
                    className="text-gray-400 hover:text-white"
                  >
                    <MoreHorizontal size={18} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {optionsOpenId && (() => {
        const song = initialSongs.find((s) => s.id === optionsOpenId);
        if (!song) return null;

        return (
          <div
            ref={popupRef}
            className="fixed w-72 bg-[#181818] text-white rounded-xl shadow-xl z-50 p-4 animate-fadeIn"
            style={{ top: popupPos.top, left: popupPos.left }}
          >
            <div className="text-base font-semibold truncate mb-2">{song.title}</div>
            <ul className="text-sm space-y-2 border-t border-white/10 pt-3">
                {onRemove && (
                <li
                    className="hover:bg-white/10 rounded p-2 cursor-pointer"
                    onClick={() => onRemove(song.id)}
                >
                    Remove from Playlist
                </li>
                )}
                
              <li onClick={() => { onMoveUp(song.id); setOptionsOpenId(null); }} className="hover:bg-white/10 rounded p-2 cursor-pointer">Move Up</li>
              <li onClick={() => { onMoveDown(song.id); setOptionsOpenId(null); }} className="hover:bg-white/10 rounded p-2 cursor-pointer">Move Down</li>
            </ul>
          </div>
        );
      })()}
    </div>
  );
}
