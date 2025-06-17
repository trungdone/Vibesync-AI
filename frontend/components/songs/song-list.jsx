"use client"

import Image from "next/image"
import Link from "next/link"
import { Play, MoreHorizontal } from "lucide-react"
import { useMusic } from "@/context/music-context"
import { formatDuration } from "@/lib/utils"

export default function SongList({ songs }) {
  const { playSong,isPlaying, currentSong, togglePlayPause } = useMusic();

  if (!songs || !songs.length) {
    return <p>No songs available</p>;
  }

  return (
    <div className="bg-white/5 rounded-lg overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10 text-left text-gray-400">
            <th className="p-4 w-12">#</th>
            <th className="p-4">Title</th>
            <th className="p-4 hidden md:table-cell">Album</th>
            <th className="p-4 hidden md:table-cell">Duration</th>
            <th className="p-4 w-12"></th>
          </tr>
        </thead>
        <tbody>
          {songs.map((song, index) => (
            <tr
              key={song.id}
              className={`border-b border-white/5 hover:bg-white/10 ${
                currentSong?.id === song.id ? "bg-white/10" : ""
              }`}
            >
              <td className="p-4 text-gray-400">
                <div className="relative w-6 h-6 flex items-center justify-center group">
                  <span className="group-hover:opacity-0">{index + 1}</span>
                  <button
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center"
                    onClick={() => handlePlayClick(song)}
                  >
                    {currentSong?.id === song.id && isPlaying ? (
                      <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    ) : (
                      <Play size={14} />
                    )}
                  </button>
                </div>
              </td>
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded overflow-hidden flex-shrink-0">
                    <Image src={song.coverArt || "/placeholder.svg"} alt={song.title} fill className="object-cover" />
                  </div>
                  <div>
                    <Link href={`/song/${song.id}`} className="font-medium hover:underline">
                      {song.title}
                    </Link>
                    <p className="text-sm text-gray-400">{song.artist}</p>
                  </div>
                </div>
              </td>
              <td className="p-4 text-gray-400 hidden md:table-cell">{song.album}</td>
              <td className="p-4 text-gray-400 hidden md:table-cell">{formatDuration(song.duration)}</td>
              <td className="p-4">
                <button className="text-gray-400 hover:text-white">
                  <MoreHorizontal size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
