"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useMusic } from "@/context/music-context";
import {
  Play, Pause, SkipBack, SkipForward, Volume2, Volume1, VolumeX,
  Repeat, Shuffle, Heart
} from "lucide-react";
import { formatDuration } from "@/lib/utils";

export default function Player() {
  const {
    currentSong,
    isPlaying,
    togglePlayPause,
    nextSong,
    prevSong,
    audioRef,
  } = useMusic();

  const [volume, setVolume] = useState(50);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [repeatMode, setRepeatMode] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const progressBarRef = useRef(null);

  useEffect(() => {
    if (currentSong && audioRef.current) {
      audioRef.current.play()
    }
  }, [currentSong])

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play()
      } else {
        audioRef.current.pause()
      }
    }
  }, [isPlaying])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (audio) {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration || 0);
    }
  };

const handleProgressChange = (e) => {
  const audio = audioRef.current;
  const progressBar = progressBarRef.current;
  if (!audio || !progressBar || isNaN(audio.duration)) return;

  const rect = progressBar.getBoundingClientRect();
  const pos = (e.clientX - rect.left) / rect.width;

  const newTime = pos * audio.duration;

  if (isFinite(newTime)) {
    audio.currentTime = newTime;
  }
};


  const handleVolumeChange = (e) => {
    const newVol = parseInt(e.target.value);
    setVolume(newVol);
    setIsMuted(newVol === 0);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = volume / 100;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const toggleRepeat = () => setRepeatMode((prev) => (prev + 1) % 3);
  const toggleShuffle = () => setIsShuffling(!isShuffling);
  const toggleLike = () => setIsLiked(!isLiked);

  if (!currentSong) {
    return (
      <div className="h-20 bg-black/50 backdrop-blur-md border-t border-white/10 px-4 flex items-center justify-center text-gray-400">
        No song is currently playing
      </div>
    );
  }

  return (
    <div className="h-20 bg-black/50 backdrop-blur-md border-t border-white/10 px-4 flex items-center">
      <audio
        ref={audioRef}
        src={currentSong.audioUrl}
        type="audio/mpeg"
        onTimeUpdate={handleTimeUpdate}
        onEnded={nextSong}
        loop={repeatMode === 2}
        autoPlay
      />

      <div className="flex items-center gap-4 w-1/4">
        <div className="relative w-14 h-14 rounded overflow-hidden flex-shrink-0">
          <Image
            src={currentSong.coverArt || "/placeholder.svg"}
            alt={currentSong.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="truncate">
          <Link href={`/song/${currentSong.id}`} className="font-medium hover:underline truncate block">
            {currentSong.title}
          </Link>
          <Link
            href={`/artist/${currentSong.artistId}`}
            className="text-sm text-gray-400 hover:underline truncate block"
          >
            {currentSong.artist}
          </Link>
        </div>
        <button
          className={`text-gray-400 hover:text-white ${isLiked ? "text-purple-500" : ""}`}
          onClick={toggleLike}
        >
          <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-2">
        <div className="flex items-center gap-4">
          <button
            className={`text-gray-400 hover:text-white ${isShuffling ? "text-purple-500" : ""}`}
            onClick={toggleShuffle}
          >
            <Shuffle size={18} />
          </button>
          <button className="text-gray-400 hover:text-white" onClick={prevSong}>
            <SkipBack size={22} />
          </button>
          <button
            className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-black hover:scale-105 transition-transform"
            onClick={togglePlayPause}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
          </button>
          <button className="text-gray-400 hover:text-white" onClick={nextSong}>
            <SkipForward size={22} />
          </button>
          <button
            className={`text-gray-400 hover:text-white ${repeatMode > 0 ? "text-purple-500" : ""}`}
            onClick={toggleRepeat}
          >
            <Repeat size={18} />
            {repeatMode === 2 && <span className="absolute text-[8px] font-bold">1</span>}
          </button>
        </div>

        <div className="w-full flex items-center gap-2">
          <span className="text-xs text-gray-400 w-10 text-right">{formatDuration(currentTime)}</span>
          <div
            ref={progressBarRef}
            className="flex-1 h-1 bg-white/20 rounded-full cursor-pointer relative overflow-hidden"
            onClick={handleProgressChange}
          >
            <div
              className="absolute h-full bg-white rounded-full"
              style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
            />
          </div>
          <span className="text-xs text-gray-400 w-10">{formatDuration(duration)}</span>
        </div>
      </div>

      <div className="w-1/4 flex justify-end items-center gap-2">
        <button className="text-gray-400 hover:text-white" onClick={toggleMute}>
          {isMuted ? <VolumeX size={18} /> : volume < 50 ? <Volume1 size={18} /> : <Volume2 size={18} />}
        </button>
        <input
          type="range"
          min="0"
          max="100"
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          className="w-24 h-1 bg-white/20 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
        />
      </div>
    </div>
  );
}
