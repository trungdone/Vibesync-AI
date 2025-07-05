import Image from "next/image";
import Link from "next/link";

export default function ArtistGrid({ artists }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
      {artists.map((artist) => (
        <div key={artist.id} className="text-center">
          <Link href={`/artist/${artist.id}`}>
            <div className="relative w-full pt-[100%] rounded-full overflow-hidden">
              <Image
                src={artist.image || "/placeholder.svg"}
                alt={artist.name}
                fill
                className="object-cover"
              />
            </div>
            <p className="mt-2 font-medium">{artist.name}</p>
            <p className="text-sm text-gray-400">{artist.genre}</p>
          </Link>
        </div>
      ))}
    </div>
  );
}
