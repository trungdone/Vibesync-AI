"use client"

import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SongList from "@/components/songs/song-list"
import PlaylistGrid from "@/components/playlist/playlist-grid"
import { mockPlaylists, mockSongs } from "@/lib/mock-data"

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/signin")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center gap-6">
        <div className="relative w-32 h-32 rounded-full overflow-hidden">
          <Image
            src={user?.avatar || "/placeholder.svg?height=128&width=128&query=user+avatar"}
            alt="Profile"
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold">{user?.name || "User Name"}</h1>
          <p className="text-gray-400">{user?.email || "user@example.com"}</p>
          <div className="flex gap-4 mt-2">
            <div>
              <span className="text-gray-400">Playlists</span>
              <p className="font-semibold">12</p>
            </div>
            <div>
              <span className="text-gray-400">Followers</span>
              <p className="font-semibold">245</p>
            </div>
            <div>
              <span className="text-gray-400">Following</span>
              <p className="font-semibold">118</p>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="playlists">
        <TabsList className="bg-white/5">
          <TabsTrigger value="playlists">Playlists</TabsTrigger>
          <TabsTrigger value="liked">Liked Songs</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        <TabsContent value="playlists" className="mt-6">
          <PlaylistGrid playlists={mockPlaylists.slice(0, 8)} />
        </TabsContent>
        <TabsContent value="liked" className="mt-6">
          <SongList songs={mockSongs.slice(0, 10)} />
        </TabsContent>
        <TabsContent value="history" className="mt-6">
          <SongList songs={mockSongs.slice(10, 20)} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
