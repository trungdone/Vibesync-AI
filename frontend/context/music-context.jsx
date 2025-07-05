"use client";

import { createContext, useContext, useState, useEffect, useRef } from "react";
import { fetchSongs } from "@/lib/api";
import axios from "axios";

const MusicContext = createContext();

export function MusicProvider({ children }) {
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [repeatMode, setRepeatMode] = useState(0); // 0: off, 1: repeat one, 2: repeat all
  const [context, setContext] = useState("new-releases");
  const [contextId, setContextId] = useState(null);
  const audioRef = useRef(typeof Audio !== "undefined" ? new Audio() : null);

  const resetPlayer = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setCurrentSong(null);
    setIsPlaying(false);
  };

  const updateSongsForContext = async (newContext, newContextId) => {
    try {
      let data = [];
      const token = localStorage.getItem("token");

      if (newContext === "new-releases") {
        const res = await fetchSongs();
        data = res.songs || [];
      } else if (newContext === "playlist") {
        const res = await axios.get(`http://localhost:8000/api/playlists/${newContextId}/songs`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        data = res.data.songs || [];
      } else if (newContext === "album") {
        const res = await axios.get(`http://localhost:8000/api/albums/${newContextId}/songs`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        data = res.data.songs || [];
      } else if (newContext === "artist") {
        const res = await axios.get(`http://localhost:8000/api/artists/${newContextId}/songs`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        data = res.data.songs || [];
      }

      setSongs(data);
      if (currentSong && !data.some((s) => s.id === currentSong.id)) {
        resetPlayer();
      }
    } catch (err) {
      console.error("Failed to load songs:", err);
      setSongs([]);
    }
  };

  useEffect(() => {
    updateSongsForContext(context, contextId);
  }, [context, contextId]);

  useEffect(() => {
    if (!audioRef.current || !currentSong) return;

    audioRef.current.src = currentSong.audio_url;
    audioRef.current.play().then(() => setIsPlaying(true)).catch((err) => console.error("Play error:", err));
  }, [currentSong]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      if (repeatMode === 1) {
        audio.currentTime = 0;
        audio.play().then(() => setIsPlaying(true));
      } else {
        nextSong();
      }
    };

    audio.addEventListener("ended", handleEnded);
    return () => audio.removeEventListener("ended", handleEnded);
  }, [currentSong, repeatMode, songs, isShuffling]);

  const playSong = (song) => {
    if (!song?.id) return;
    setCurrentSong(song);
    setIsPlaying(true);
  };

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      if (audio.currentTime >= audio.duration) audio.currentTime = 0;
      audio.play().then(() => setIsPlaying(true)).catch((err) => {
        console.error("Playback failed:", err);
      });
    }
  };

  const nextSong = () => {
    if (!songs.length || !currentSong) return;

    const idx = songs.findIndex((s) => s.id.toString() === currentSong.id.toString());
    if (idx === -1) {
      playSong(songs[0]);
      return;
    }

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
        if (repeatMode === 2) {
          next = songs[0]; // Repeat All
        } else {
          setIsPlaying(false);
          return;
        }
      } else {
        next = songs[idx + 1];
      }
    }

    if (next) playSong(next);
  };

  const prevSong = () => {
    if (!songs.length || !currentSong) return;

    const idx = songs.findIndex((s) => s.id.toString() === currentSong.id.toString());
    if (idx === -1) {
      playSong(songs[0]);
      return;
    }

    const isFirst = idx === 0;
    let prev = null;
    if (isFirst) {
      if (repeatMode === 2) {
        prev = songs[songs.length - 1]; // Repeat All
      } else {
        setIsPlaying(false);
        return;
      }
    } else {
      prev = songs[idx - 1];
    }

    if (prev) playSong(prev);
  };

  const toggleShuffle = () => {
    if (songs.length <= 1) return;
    setIsShuffling((prev) => !prev);
  };

  const toggleRepeat = () => {
    if (songs.length <= 1) {
      setRepeatMode((m) => (m === 1 ? 0 : 1));
    } else {
      setRepeatMode((m) => (m + 1) % 3);
    }
  };

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
        resetPlayer,
        setContext,
        setContextId,
        updateSongsForContext,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
}

export const useMusic = () => useContext(MusicContext);
