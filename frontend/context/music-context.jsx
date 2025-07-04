"use client";

import { createContext, useContext, useState, useEffect, useRef } from "react";
import { fetchSongs } from "@/lib/api";

const MusicContext = createContext();

export function MusicProvider({ children }) {
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [repeatMode, setRepeatMode] = useState(0);
  const audioRef = useRef(typeof Audio !== "undefined" ? new Audio() : null);

  useEffect(() => {
    fetchSongs().then((data) => {
      const normalized = data?.map((song) => ({
        ...song,
        id: song._id || song.id, // ✅ Chuẩn hóa id
      })) || [];
      setSongs(normalized);
    });
  }, []);

  useEffect(() => {
    if (!currentSong || !audioRef.current) return;

    audioRef.current.src = currentSong.audioUrl;

    audioRef.current
      .play()
      .then(() => setIsPlaying(true))
      .catch((err) => {
        console.warn("🎵 Không thể tự động phát:", err.message);
      });
  }, [currentSong]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      if (audio.currentTime === audio.duration) {
        audio.currentTime = 0;
      }
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  };

  const playSong = (song) => {
    if (!song || !song.audioUrl) return;
    setCurrentSong({
      ...song,
      id: song._id || song.id, // ✅ Đảm bảo luôn có .id
    });
  };

  const nextSong = () => {
    if (!songs.length || !currentSong) return;

    const idx = songs.findIndex((s) => s.id === currentSong.id);
    let next = null;

    if (isShuffling) {
      let r;
      do {
        r = Math.floor(Math.random() * songs.length);
      } while (r === idx && songs.length > 1);
      next = songs[r];
    } else {
      const isLast = idx === songs.length - 1;
      if (isLast) {
        if (repeatMode === 2) next = songs[0];
        else {
          setIsPlaying(false);
          return;
        }
      } else next = songs[idx + 1];
    }

    if (next) setCurrentSong(next);
  };

  const prevSong = () => {
    if (!songs.length || !currentSong) return;
    const idx = songs.findIndex((s) => s.id === currentSong.id);
    const prev = songs[(idx - 1 + songs.length) % songs.length];
    setCurrentSong(prev);
  };

  const toggleShuffle = () => setIsShuffling((prev) => !prev);
  const toggleRepeat = () => setRepeatMode((mode) => (mode + 1) % 3);

  return (
    <MusicContext.Provider
      value={{
        songs,
        currentSong,
        isPlaying,
        isShuffling,
        repeatMode,
        audioRef,
        playSong,
        togglePlayPause,
        nextSong,
        prevSong,
        toggleShuffle,
        toggleRepeat,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
}

export const useMusic = () => useContext(MusicContext);
