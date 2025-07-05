import Link from "next/link";
import SongList from "../songs/song-list"; 
import { fetchSongs } from "@/lib/api";

export default async function NewReleases() {
  let songs = [];
  try {
    const response = await fetchSongs({ sort: "releaseYear", limit: 5 });
    // Đảm bảo lấy đúng mảng songs
    songs = Array.isArray(response) ? response : response?.songs || [];
  } catch (error) {
    console.error("Error loading new releases:", error);
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">New Releases</h2>
<Link href="/new-releases" className="text-sm text-purple-400 hover:underline">
  View All
</Link>

      </div>

      {songs.length > 0 ? (
        <SongList songs={songs} />
      ) : (
        <p className="text-gray-400">No new releases available</p>
      )}
    </section>
  );
}
