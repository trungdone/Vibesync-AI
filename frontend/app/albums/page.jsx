import Image from "next/image";
import Link from "next/link";
import { fetchAlbums } from "@/lib/api/albums";

export default async function AlbumsPage() {
  let albums = [];
  try {
    albums = await fetchAlbums() || [];
  } catch (error) {
    console.error("Failed to fetch albums:", error);
    albums = [];
  }

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-3xl font-bold text-white">All Albums</h1>
      {albums.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {albums.map((album) => (
            <Link key={album.id} href={`/album/${album.id}`} className="group">
              <div className="relative aspect-square rounded-lg overflow-hidden mb-3 bg-gray-800 group-hover:shadow-lg group-hover:shadow-purple-500/20 transition-all">
                <Image
                  src={album.cover_art || "/placeholder.svg"}
                  alt={album.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-sm font-medium text-center text-white truncate">{album.title}</h3>
              <p className="text-xs text-gray-400 text-center">{album.release_year}</p>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400">No albums available.</p>
      )}
    </div>
  );
}
