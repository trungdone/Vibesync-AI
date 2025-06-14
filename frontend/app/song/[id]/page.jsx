"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useMusic } from "@/context/music-context"
import { Heart, Share2, MoreHorizontal, Play } from "lucide-react"
import { formatDuration } from "@/lib/utils"
import { mockSongs, mockArtists } from "@/lib/mock-data"
import SongList from "@/components/songs/song-list"

export default function SongDetailPage({ params }) {
  const { id } = params
  const [song, setSong] = useState(null)
  const [artist, setArtist] = useState(null)
  const [relatedSongs, setRelatedSongs] = useState([])
  const { playSong } = useMusic()

  useEffect(() => {
    // In a real app, fetch song data from API
    const foundSong = mockSongs.find((s) => s.id === Number.parseInt(id))
    setSong(foundSong || mockSongs[0])

    if (foundSong) {
      const foundArtist = mockArtists.find((a) => a.id === foundSong.artistId)
      setArtist(foundArtist)

      // Get related songs by same artist
      const related = mockSongs.filter((s) => s.id !== foundSong.id && s.artistId === foundSong.artistId)
      setRelatedSongs(related)
    }
  }, [id])

  if (!song) {
    return <div className="flex justify-center items-center h-[60vh]">Loading...</div>
  }

  return (
    <div className="space-y-8 pb-24">
      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
        <div className="relative w-64 h-64 rounded-lg overflow-hidden shadow-lg">
          <Image src={song.coverArt || "/placeholder.svg"} alt={song.title} fill className="object-cover" />
        </div>

        <div className="flex-1 text-center md:text-left">
          <div className="mb-4">
            <h1 className="text-4xl font-bold mb-2">{song.title}</h1>
            <p className="text-xl text-gray-300">{artist?.name}</p>
            <p className="text-gray-400 mt-1">
              {song.album} • {song.releaseYear} • {formatDuration(song.duration)}
            </p>
          </div>

          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <button className="btn-primary flex items-center gap-2" onClick={() => playSong(song)}>
              <Play size={18} /> Play
            </button>

            <button className="btn-secondary flex items-center gap-2">
              <Heart size={18} /> Like
            </button>

            <button className="btn-secondary flex items-center gap-2">
              <Share2 size={18} /> Share
            </button>

            <button className="btn-secondary">
              <MoreHorizontal size={18} />
            </button>
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-2">About</h3>
            <p className="text-gray-300">
              {song.description ||
                `"${song.title}" is a ${song.genre} song by ${artist?.name} from the album ${song.album}, released in ${song.releaseYear}.`}
            </p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Lyrics</h3>
        <div className="bg-white/5 rounded-lg p-6 whitespace-pre-line">
          {song.lyrics || "Lyrics are not available for this song."}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">More from {artist?.name}</h3>
        <SongList songs={relatedSongs.length ? relatedSongs : mockSongs.slice(0, 5)} />
      </div>
    </div>
  )
}
