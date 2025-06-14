import Link from "next/link"
import PlaylistGrid from "./playlist-grid"
import { mockPlaylists } from "@/lib/mock-data"

export default function RecommendedPlaylists() {
  // Filter playlists that match user's personality
  // In a real app, this would use an algorithm based on user preferences
  const recommendedPlaylists = mockPlaylists.slice(0, 6)

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
