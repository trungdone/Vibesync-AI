// components/home/hot-albums.jsx
import Image from "next/image";
import Link from "next/link";
import { fetchAlbums } from "@/lib/api/albums";

export default async function HotAlbums() {
  let albums = [];
  try {
    albums = await fetchAlbums({ limit: 5 }) || [];
  } catch (error) {
    console.error("Failed to fetch albums:", error);
    albums = [];
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Hot Albums</h2>
        <Link href="/albums" className="text-sm text-purple-400 hover:underline transition-colors">
          View All
        </Link>
      </div>

      {albums.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {albums.map((album) => (
            <Link key={album.id} href={`/album/${album.id}`} className="group">
              <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-800 group-hover:shadow-lg group-hover:shadow-purple-500/30 transition-all duration-300">
                <Image
                  src={album.cover_art || "/placeholder.svg"}
                  alt={album.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300 ease-in-out"
                />
              </div>
              <h3 className="mt-1 text-sm font-semibold text-center text-white truncate">{album.title}</h3>
              <p className="text-xs text-center text-gray-400">{album.release_year || "Unknown Year"}</p>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400">No hot albums available.</p>
      )}
    </section>
  );
}
