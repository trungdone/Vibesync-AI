import Link from "next/link"
import SongList from "../songs/song-list"
import { mockSongs } from "@/lib/mock-data"

export default function NewReleases() {
  // Get the newest songs
  const newReleases = mockSongs.slice(0, 5)

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">New Releases</h2>
        <Link href="/new-releases" className="text-sm text-purple-400 hover:underline">
          View All
        </Link>
      </div>

      <SongList songs={newReleases} />
    </section>
  )
}
