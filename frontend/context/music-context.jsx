"use client"

import { createContext, useContext, useState } from "react"
import { mockSongs } from "@/lib/mock-data"

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

  const playSong = (song) => {
    setCurrentSong(song)
    setIsPlaying(true)

    // In a real app, you would update the queue based on context
    // For now, we'll just set the queue to all songs
    const songIndex = mockSongs.findIndex((s) => s.id === song.id)
    const newQueue = [...mockSongs.slice(songIndex + 1), ...mockSongs.slice(0, songIndex)]
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
    // In a real app, you would have a history of played songs
    // For now, we'll just go to a random song
    const randomIndex = Math.floor(Math.random() * mockSongs.length)
    setCurrentSong(mockSongs[randomIndex])
    setIsPlaying(true)
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
      }}
    >
      {children}
    </MusicContext.Provider>
  )
}

export const useMusic = () => useContext(MusicContext)
