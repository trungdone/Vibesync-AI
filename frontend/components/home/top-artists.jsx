import Image from "next/image"
import Link from "next/link"
import { mockArtists } from "@/lib/mock-data"

export default function TopArtists() {
  const topArtists = mockArtists.slice(0, 6)

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Top Artists</h2>
        <Link href="/artists" className="text-sm text-purple-400 hover:underline">
          View All
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {topArtists.map((artist) => (
          <Link key={artist.id} href={`/artist/${artist.id}`} className="group">
            <div className="relative aspect-square rounded-full overflow-hidden mb-3 group-hover:shadow-lg group-hover:shadow-purple-500/20 transition-all">
              <Image
                src={artist.image || "/placeholder.svg"}
                alt={artist.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform"
              />
            </div>
            <h3 className="font-medium text-center truncate">{artist.name}</h3>
            <p className="text-sm text-gray-400 text-center">{artist.genre}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}
