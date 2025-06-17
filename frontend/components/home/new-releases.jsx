import Link from "next/link"
import SongList from "../songs/song-list" // Sửa đường dẫn
import { fetchSongs } from "@/lib/api"

export default async function NewReleases() {
  let newReleases = [];
  try {
    newReleases = await fetchSongs({ sort: "releaseYear", limit: 5 });
  } catch (error) {
    console.error("Error in NewReleases:", error);
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">New Releases</h2>
        <Link href="/new-releases" className="text-sm text-purple-400 hover:underline">
          View All
        </Link>
      </div>
      {newReleases.length ? (
        <SongList songs={newReleases} />
      ) : (
        <p>No new releases available</p>
      )}
    </section>
  )
}