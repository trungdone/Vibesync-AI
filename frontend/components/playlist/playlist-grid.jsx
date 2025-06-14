import Image from "next/image"
import Link from "next/link"

export default function PlaylistGrid({ playlists }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {playlists.map((playlist) => (
        <Link key={playlist.id} href={`/playlist/${playlist.id}`} className="group">
          <div className="card p-0 overflow-hidden">
            <div className="relative aspect-square mb-3">
              <Image
                src={playlist.coverArt || "/placeholder.svg"}
                alt={playlist.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform"
              />
            </div>
            <div className="p-3">
              <h3 className="font-medium truncate">{playlist.title}</h3>
              <p className="text-sm text-gray-400 truncate">{playlist.description}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
