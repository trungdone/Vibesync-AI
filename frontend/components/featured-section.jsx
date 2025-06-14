import Image from "next/image"
import Link from "next/link"
import { Play } from "lucide-react"

export default function FeaturedSection() {
  return (
    <div className="relative w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden">
      <Image src="/music-concert-stage-colorful-lighting.png" alt="Featured Artist" fill className="object-cover" />

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex flex-col justify-end p-8">
        <div className="max-w-2xl">
          <p className="text-purple-400 font-medium mb-2">Featured Artist</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">The Weeknd</h1>
          <p className="text-gray-300 mb-6 max-w-lg">
            Experience the latest album "After Hours" with its unique blend of R&B and pop. Featuring hit singles
            "Blinding Lights" and "Save Your Tears".
          </p>

          <div className="flex flex-wrap gap-4">
            <Link href="/playlist/1" className="btn-primary flex items-center gap-2">
              <Play size={18} /> Listen Now
            </Link>
            <Link href="/artist/1" className="btn-secondary">
              View Artist
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
