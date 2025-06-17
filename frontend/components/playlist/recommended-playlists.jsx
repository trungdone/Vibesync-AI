import Link from "next/link"
import PlaylistGrid from "./playlist-grid"
import { fetchPlaylists } from "@/lib/api"

export default async function RecommendedPlaylists() {
  // Fetch playlists from API
  const playlistsData = await fetchPlaylists() || []
  // Filter first 6 playlists
  const recommendedPlaylists = playlistsData.slice(0, 6)

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Recommended for You</h2>
        <Link href="/recommendations" className="text-sm text-purple-400 hover:underline">
          View All
        </Link>
      </div>

      <PlaylistGrid playlists={recommendedPlaylists} />
    </section>
  )
}