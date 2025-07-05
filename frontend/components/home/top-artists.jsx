import Image from "next/image";
import Link from "next/link";
import { fetchArtists } from "@/lib/api/artists";

export default async function TopArtists() {
  let artists = [];

  try {
    const data = await fetchArtists();
    artists = Array.isArray(data) ? data : data?.artists || [];
  } catch (error) {
    console.error("Failed to fetch artists:", error);
    artists = [];
  }

  const topArtists = artists.slice(0, 5);

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Top Artists</h2>
        <Link
          href="/top-artists"
          className="text-sm text-purple-400 hover:underline"
        >
          View All
        </Link>
      </div>

      {topArtists.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {topArtists.map((artist) => (
            <Link key={artist.id} href={`/artist/${artist.id}`} className="group">
              <div className="relative aspect-square rounded-xl overflow-hidden mb-3 shadow-sm group-hover:shadow-lg group-hover:shadow-purple-500/30 transition-all duration-300">
                <Image
                  src={artist.image || "/placeholder.svg"}
                  alt={artist.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h3 className="font-medium text-center truncate">{artist.name}</h3>
              <p className="text-sm text-gray-400 text-center">
                {Array.isArray(artist.genres) && artist.genres.length > 0
                  ? artist.genres[0]
                  : "Unknown"}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400">No top artists available.</p>
      )}
    </section>
  );
}
