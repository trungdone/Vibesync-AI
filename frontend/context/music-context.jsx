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
  const audioRef = useRef(null);
  

  useEffect(() => {
    fetchSongs().then(data => setSongs(data || []));
  }, []);

  const playSong = (song) => {
    setCurrentSong(song);
    setIsPlaying(true);
  };

  const resetPlayer = () => {
  setCurrentSong(null);
  setIsPlaying(false);
  audioRef.current?.pause();  // Optional: stop audio
  audioRef.current = null;
  };


  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      if (audio.currentTime === audio.duration) audio.currentTime = 0;
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const nextSong = () => {
    if (!songs.length) return;
    const idx = songs.findIndex(s => s.id === currentSong?.id);
    let next = null;

    if (isShuffling) {
      let r;
      do { r = Math.floor(Math.random() * songs.length); } while (r === idx && songs.length > 1);
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

    if (next) {
      setCurrentSong(next);
      setIsPlaying(true);
    }
  };

  const prevSong = () => {
    if (!songs.length) return;
    const idx = songs.findIndex(s => s.id === currentSong?.id);
    const prev = songs[(idx - 1 + songs.length) % songs.length];
    playSong(prev);
  };

  const toggleShuffle = () => setIsShuffling(p => !p);
  const toggleRepeat = () => setRepeatMode(m => (m + 1) % 3);

  return (
    <MusicContext.Provider value={{
      songs, currentSong, isPlaying, isShuffling, repeatMode,
      audioRef, playSong, togglePlayPause, nextSong, prevSong,
      toggleShuffle, toggleRepeat, resetPlayer
    }}>
      {children}
    </MusicContext.Provider>
  );
}

export const useMusic = () => useContext(MusicContext);
