"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { fetchSongs } from "@/lib/api";

/* --------------------------------------------------
 * Tạo Context
 * -------------------------------------------------- */
const MusicContext = createContext();

/* --------------------------------------------------
 * Provider bọc toàn bộ ứng dụng
 * -------------------------------------------------- */
export function MusicProvider({ children }) {
  /* ---------- State ---------- */
  const [songs, setSongs] = useState([]);          // toàn bộ bài hát (để next/prev)
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  /* ---------- Thẻ <audio> dùng chung ---------- */
  const audioRef = useRef(typeof Audio !== "undefined" ? new Audio() : null);

  /* --------------------------------------------------
   * 1) Tải list bài hát khi khởi chạy app
   * -------------------------------------------------- */
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchSongs();
        setSongs(data.songs || []);
      } catch (err) {
        console.error("Error loading songs:", err);
      }
    })();
  }, []);

  /* --------------------------------------------------
   * 2) Khi currentSong đổi  ➜  gán src & play
   * -------------------------------------------------- */
  useEffect(() => {
    if (!audioRef.current || !currentSong) return;

    audioRef.current.src = currentSong.audio_url;
    audioRef.current
      .play()
      .catch((err) => console.error("Play error:", err));
    setIsPlaying(true);

    /* Auto‑next khi bài hát kết thúc */
    const handleEnded = () => nextSong();
    audioRef.current.addEventListener("ended", handleEnded);
    return () =>
      audioRef.current.removeEventListener("ended", handleEnded);
  }, [currentSong]);

  /* --------------------------------------------------
   * 3) Các hàm điều khiển
   * -------------------------------------------------- */
  const playSong = (song) => setCurrentSong(song);

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current
        .play()
        .catch((err) => console.error("Play error:", err));
    }
    setIsPlaying((p) => !p);
  };

  const nextSong = () => {
    if (!songs.length) return;
    const idx = songs.findIndex((s) => s.id === currentSong?.id);
    const next = songs[(idx + 1) % songs.length];
    if (next) setCurrentSong(next);
  };

  const prevSong = () => {
    if (!songs.length) return;
    const idx = songs.findIndex((s) => s.id === currentSong?.id);
    const prev = songs[(idx - 1 + songs.length) % songs.length];
    if (prev) setCurrentSong(prev);
  };

  const resetPlayer = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setCurrentSong(null);
    setIsPlaying(false);
  };

  /* --------------------------------------------------
   * 4) Gói tất cả vào value
   * -------------------------------------------------- */
  const value = {
    songs,
    currentSong,
    isPlaying,
    playSong,          // gọi ở SearchResult hoặc SongDetail để phát nhạc
    togglePlayPause,   // nút Play/Pause trong mini‑player
    nextSong,
    prevSong,
    resetPlayer,
    audioRef,          // để UI hiển thị waveform/thời gian, nếu muốn
  };

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
}

/* --------------------------------------------------
 * Hook tiện dụng
 * -------------------------------------------------- */
export const useMusic = () => useContext(MusicContext);
