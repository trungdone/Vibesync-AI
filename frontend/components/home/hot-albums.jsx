"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function RecommendedAlbums() {
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    const fetchRecommendedAlbums = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/recommend/albums");
        if (!res.ok) throw new Error("Failed to fetch albums");
        const data = await res.json();
        setAlbums(data);
      } catch (err) {
        console.error("⚠️ Error loading recommended albums:", err);
      }
    };

    fetchRecommendedAlbums();
  }, []);

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white">Recommended Albums</h2>
        <Link href="/albums" className="text-sm text-purple-400 hover:underline">
          View All
        </Link>
      </div>

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
    </section>
  );
}
