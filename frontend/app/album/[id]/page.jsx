"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { fetchAlbumById } from "@/lib/api/albums";
import SongList from "@/components/songs/song-list";
import { fetchSongsByIds } from "@/lib/api/songs";
import { fetchArtistById } from "@/lib/api/artists";

export default function AlbumDetailPage() {
  const params = useParams();
  const id = params.id;

  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [songs, setSongs] = useState([]);
  const [artist, setArtist] = useState(null); 

useEffect(() => {
  async function loadAlbum() {
    try {
      setLoading(true);

      const albumData = await fetchAlbumById(id);
      if (!albumData) throw new Error("Album not found");

      setAlbum(albumData);

      // ✅ Fetch chi tiết các bài hát
      if (albumData.songs && albumData.songs.length > 0) {
        const songsData = await fetchSongsByIds(albumData.songs);
        setSongs(songsData);
        const artistData = await fetchArtistById(albumData.artist_id);
setArtist(artistData);
      }
    } catch (err) {
      console.error("Error fetching album:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  loadAlbum();
}, [id]);



  if (loading) {
    return <div className="flex justify-center items-center h-[60vh]">Loading...</div>;
  }

  if (error || !album) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-red-500">
        {error || "Album not found"} (ID: {id})
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-24 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start p-4 bg-gray-900 rounded-lg shadow-lg">
        <div className="relative w-64 h-64 rounded-lg overflow-hidden">
          <Image
            src={album.cover_art || "/placeholder.svg"}
            alt={album.title}
            fill
            priority
            className="object-cover"
          />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl font-bold text-white mb-2">{album.title}</h1>
          <p className="text-gray-300">Release Year: {album.release_year}</p>
          <p className="text-gray-300">Genre: {album.genres}</p>
          <p className="text-gray-300">
  Artist: {artist ? artist.name : "Loading..."}
</p>

        </div>
      </div>
      <div className="p-4 bg-gray-900 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold text-white mb-4">Songs</h3>
        {album.songs && album.songs.length > 0 ? (
<SongList songs={songs} />

        ) : (
          <p className="text-gray-400">No songs available for this album.</p>
        )}
      </div>
    </div>
  );
}
