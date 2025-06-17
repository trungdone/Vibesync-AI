"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { Home, Search, Library, PlusCircle, Music, Heart, Disc3, ListMusic } from "lucide-react"
import { fetchPlaylists } from "@/lib/api"

export default function Sidebar() {
  const pathname = usePathname()
  const [playlists, setPlaylists] = useState([])

  useEffect(() => {
    async function loadPlaylists() {
      const playlistsData = await fetchPlaylists()
      setPlaylists(playlistsData || [])
    }
    loadPlaylists()
  }, [])

  const isActive = (path) => {
    return pathname === path
  }

  return (
    <aside className="w-64 hidden md:flex flex-col bg-black/30 h-full overflow-y-auto">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 mb-8">
          <div className="bg-purple-600 w-8 h-8 rounded-full flex items-center justify-center">
            <Music size={16} className="text-white" />
          </div>
          <span className="text-xl font-bold">VibeSync</span>
        </Link>
        <nav className="space-y-1">
          <Link
            href="/"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
              isActive("/") ? "bg-white/10" : "hover:bg-white/5"
            }`}
          >
            <Home size={20} />
            <span>Home</span>
          </Link>
          <Link
            href="/search"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
              isActive("/search") ? "bg-white/10" : "hover:bg-white/5"
            }`}
          >
            <Search size={20} />
            <span>Search</span>
          </Link>
          <Link
            href="/library"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
              isActive("/library") ? "bg-white/10" : "hover:bg-white/5"
            }`}
          >
            <Library size={20} />
            <span>Your Library</span>
          </Link>
        </nav>

        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 font-medium text-sm uppercase">Playlists</h3>
            <button className="text-gray-400 hover:text-white">
              <PlusCircle size={18} />
            </button>
          </div>

          <div className="space-y-1">
            <Link href="/playlist/liked" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5">
              <div className="w-6 h-6 flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-400 rounded-sm">
                <Heart size={12} className="text-white" />
              </div>
              <span>Liked Songs</span>
            </Link>

            {playlists.slice(0, 8).map((playlist) => (
              <Link
                key={playlist.id}
                href={`/playlist/${playlist.slug}`}  
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5"
              >
                <div className="w-6 h-6 flex items-center justify-center bg-white/10 rounded-sm">
                  {playlist.type === "playlist" ? (
                    <ListMusic size={12} className="text-white" />
                  ) : (
                    <Disc3 size={12} className="text-white" />
                  )}
                </div>
                <span className="truncate">{playlist.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}