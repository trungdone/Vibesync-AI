"use client";

import { createContext, useContext, useState, useEffect, useRef } from "react";
import { fetchSongs } from "@/lib/api";

const MusicContext = createContext();

export function MusicProvider({ children }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);
  const [songs, setSongs] = useState([]);
  const audioRef = useRef(null); // Shared audioRef for <audio> element

  useEffect(() => {
    async function loadSongs() {
      try {
        const data = await fetchSongs();
        setSongs(data.songs || []);
      } catch (error) {
        console.error("Error loading songs:", error);
      }
    }
    loadSongs();
  }, []);

  const playSong = (song) => {
    setCurrentSong(song);
    setIsPlaying(true);
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((err) => console.error("Play error:", err));
    }

    setIsPlaying((prev) => !prev);
  };

const nextSong = () => {
  const currentIndex = songs.findIndex((s) => s.id === currentSong?.id);
  const next = songs[(currentIndex + 1) % songs.length];
  if (next) {
    setCurrentSong(next);
    setIsPlaying(true);

    // Thêm đoạn này để phát ngay bài mới
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play().catch((err) => console.error("Play error on nextSong:", err));
      }
    }, 100);
  }
};


  const prevSong = () => {
    const currentIndex = songs.findIndex((s) => s.id === currentSong?.id);
    const prev = songs[(currentIndex - 1 + songs.length) % songs.length];
    if (prev) playSong(prev);
  };

  const resetPlayer = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setCurrentSong(null);
    setIsPlaying(false);
  };

  return (
    <MusicContext.Provider
      value={{
        songs,
        isPlaying,
        currentSong,
        playSong,
        togglePlayPause,
        nextSong,
        prevSong,
        resetPlayer,
        audioRef, // Expose audioRef
      }}
    >
      {children}
    </MusicContext.Provider>
  );
}

export const useMusic = () => useContext(MusicContext);
