// app/artist/[id]/page.jsx
"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import { useMusic } from "@/context/music-context";
import { Play } from "lucide-react";
import { fetchArtistById } from "@/lib/api";
import SongList from "@/components/songs/song-list";

export default function ArtistDetailPage({ params }) {
  const { id } = use(params); // Sử dụng React.use() để giải nén params
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { playSong } = useMusic();

  useEffect(() => {
    async function loadArtist() {
      try {
        setLoading(true);
        const artistData = await fetchArtistById(id);
        if (!artistData) throw new Error("Artist not found");
        setArtist(artistData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadArtist();
  }, [id]);

  if (loading) {
    return <div className="flex justify-center items-center h-[60vh]">Loading...</div>;
  }

  if (error || !artist) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        {error || "Artist not found"}
      </div>
    );
  }

  const handlePlayAll = () => {
    if (artist.songs && artist.songs.length > 0) {
      playSong(artist.songs[0]);
    }
  };

  return (
    <div className="space-y-8 pb-24">
      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
        <div className="relative w-64 h-64 rounded-lg overflow-hidden shadow-lg">
          <Image
            src={artist.image || "/placeholder.svg"}
            alt={artist.name}
            fill
            priority
            className="object-cover"
          />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl font-bold mb-2">{artist.name}</h1>
          <p className="text-gray-300">{artist.bio || "No bio available"}</p>
          <button
            className="btn-primary mt-4 flex items-center gap-2"
            onClick={handlePlayAll}
            disabled={!artist.songs || artist.songs.length === 0}
          >
            <Play size={18} /> Play All
          </button>
        </div>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-4">Songs</h3>
        {artist.songs && artist.songs.length > 0 ? (
          <SongList songs={artist.songs} />
        ) : (
          <p>No songs available for this artist.</p>
        )}
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-4">Albums</h3>
        {artist.albums && artist.albums.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {artist.albums.map((album) => (
              <div key={album.id} className="bg-white/5 p-4 rounded-lg">
                <div className="relative w-full h-32 rounded overflow-hidden">
                  <Image
                    src={album.coverArt || "/placeholder.svg"}
                    alt={album.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <h4 className="text-lg font-medium mt-2">{album.title}</h4>
                <p className="text-sm text-gray-400">{album.releaseYear}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No albums available for this artist.</p>
        )}
      </div>
    </div>
  );
}