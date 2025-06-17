import Link from "next/link"
import Image from "next/image"

export default function PlaylistGrid({ playlists }) {
  if (!playlists || playlists.length === 0) {
    return <p className="text-gray-400">No playlists available</p>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {playlists.map((playlist) => (
        <Link
          key={playlist.id}
          href={`/playlist/${playlist.slug}`}  
          className="bg-white/5 rounded-lg overflow-hidden hover:bg-white/10 transition-colors"
        >
          <div className="relative w-full h-48">
            <Image
              src={playlist.coverArt || "/placeholder.svg"}
              alt={playlist.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-4">
            <h3 className="font-medium text-white truncate">{playlist.title}</h3>
            <p className="text-gray-400 text-sm">By {playlist.creator}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}