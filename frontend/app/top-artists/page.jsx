import Image from "next/image";
import Link from "next/link";
import { fetchArtists } from "@/lib/api/artists";

export default async function TopArtistsPage() {
  const artists = await fetchArtists();

  return (
    <section className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-white">All Top Artists</h1>
      {artists.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {artists.map((artist) => (
            <Link
              key={artist.id}
              href={`/artist/${artist.id}`}
              className="group text-center hover:scale-105 transition-transform"
            >
              <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden shadow-md group-hover:shadow-purple-500/30 transition-all">
                <Image
                  src={artist.image || "/placeholder.svg"}
                  alt={artist.name}
                  fill
                  className="object-cover"
                />
              </div>
              <p className="mt-2 font-medium text-white">{artist.name}</p>
              <p className="text-sm text-gray-400">{artist.genres.join(", ")}</p>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">No artists available.</p>
      )}
    </section>
  );
}
