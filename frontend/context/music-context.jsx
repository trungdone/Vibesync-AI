"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { fetchSongs } from "@/lib/api"

const MusicContext = createContext({
  currentSong: null,
  isPlaying: false,
  playSong: () => {},
  togglePlayPause: () => {},
  nextSong: () => {},
  prevSong: () => {},
})

export function MusicProvider({ children }) {
  const [currentSong, setCurrentSong] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [queue, setQueue] = useState([])
  const [allSongs, setAllSongs] = useState([])

  useEffect(() => {
    async function loadSongs() {
      try {
        const songs = await fetchSongs()
        setAllSongs(songs)
      } catch (err) {
        console.error("Failed to load songs:", err)
      }
    }
    loadSongs()
  }, [])

  const playSong = (song) => {
    setCurrentSong(song)
    setIsPlaying(true)

    // Update queue based on all songs
    const songIndex = allSongs.findIndex((s) => s.id === song.id)
    const newQueue = [...allSongs.slice(songIndex + 1), ...allSongs.slice(0, songIndex)]
    setQueue(newQueue)
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const nextSong = () => {
    if (queue.length > 0) {
      const nextSong = queue[0]
      const newQueue = queue.slice(1)
      setCurrentSong(nextSong)
      setQueue(newQueue)
      setIsPlaying(true)
    }
  }

  const prevSong = () => {
    // Use a random song from allSongs
    if (allSongs.length > 0) {
      const randomIndex = Math.floor(Math.random() * allSongs.length)
      setCurrentSong(allSongs[randomIndex])
      setIsPlaying(true)
    }
  }

    // ✅ Thêm hàm reset
  const resetPlayer = () => {
    setCurrentSong(null)
    setIsPlaying(false)
    setQueue([])
  }

  return (
    <MusicContext.Provider
      value={{
        currentSong,
        isPlaying,
        playSong,
        togglePlayPause,
        nextSong,
        prevSong,
        resetPlayer,
      }}
    >
      {children}
    </MusicContext.Provider>
  )
}

export const useMusic = () => useContext(MusicContext)