"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Heart, Share2, MoreHorizontal, Play, ArrowLeft } from "lucide-react";

import { useMusic } from "@/context/music-context";
import { formatDuration } from "@/lib/utils";
import {
  fetchSongById,
  fetchSongs,
  fetchArtistById,
} from "@/lib/api";
import SongList from "@/components/songs/song-list";

export default function SongDetailPage() {
  /* --------------------------------------------------
   * 1) Lấy id từ URL ( `/song/123` -> id = "123" )
   * -------------------------------------------------- */
  const { id } = useParams();          // ✅ dùng hook
  const router  = useRouter();

  /* --------------------------------------------------
   * 2) State
   * -------------------------------------------------- */
  const [song, setSong]           = useState(null);
  const [artist, setArtist]       = useState(null);
  const [related, setRelated]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  const { playSong } = useMusic();

  /* --------------------------------------------------
   * 3) Load dữ liệu mỗi khi id thay đổi
   * -------------------------------------------------- */
  useEffect(() => {
    if (!id) return;                       // hydration phase

    const abort = new AbortController();

    async function load() {
      try {
        setLoading(true);

        // --- 3.1 Song ---
        const s = await fetchSongById(id, { signal: abort.signal });
        if (!s) throw new Error("Song not found");
        setSong(s);

        // --- 3.2 Artist ---
        if (s.artistId) {
          const a = await fetchArtistById(s.artistId, { signal: abort.signal });
          setArtist(a ?? { name: s.artist });
        }

        // --- 3.3 Related songs (cùng artist) ---
        const all = await fetchSongs({ signal: abort.signal });
        setRelated(all.filter((x) => x.id !== s.id && x.artistId === s.artistId));
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();

    return () => abort.abort();            // huỷ request cũ khi unmount
  }, [id]);

  /* --------------------------------------------------
   * 4) UI hiển thị
   * -------------------------------------------------- */
  if (!id || loading)
    return (
      <div className="flex items-center justify-center h-[60vh]">
        Loading…
      </div>
    );

  if (error || !song)
    return (
      <div className="flex items-center justify-center h-[60vh]">
        {error || "Song not found."}
      </div>
    );

  return (
    <div className="space-y-10 pb-24">
      {/* ---- Back button ---- */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-400 hover:text-white"
      >
        <ArrowLeft size={18} /> Back
      </button>

      {/* ---- TOP SECTION ---- */}
      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
        {/* Cover */}
        <div className="relative w-64 h-64 rounded-lg overflow-hidden shadow-lg">
          <Image
            src={song.coverArt || "/placeholder.svg"}
            alt={song.title}
            fill
            sizes="(max-width: 768px) 100vw, 256px"
            className="object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl font-bold mb-2">{song.title}</h1>
          <p className="text-xl text-gray-300 mb-1">
            {artist?.name || song.artist}
          </p>
          <p className="text-gray-400">
            {song.album} • {song.releaseYear} • {formatDuration(song.duration)}
          </p>

          {/* Actions */}
          <div className="flex flex-wrap gap-4 justify-center md:justify-start mt-6">
            <button
              className="btn-primary flex items-center gap-2"
              onClick={() => playSong(song)}
            >
              <Play size={18} /> Play
            </button>
            <button className="btn-secondary flex items-center gap-2">
              <Heart size={18} /> Like
            </button>
            <button className="btn-secondary flex items-center gap-2">
              <Share2 size={18} /> Share
            </button>
            <button className="btn-secondary">
              <MoreHorizontal size={18} />
            </button>
          </div>

          {/* About */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-2">About</h3>
            <p className="text-gray-300">
              {song.description ||
                `"${song.title}" is a ${song.genre} track by ${artist?.name || song.artist} from the album ${song.album}, released in ${song.releaseYear}.`}
            </p>
          </div>
        </div>
      </div>

      {/* ---- LYRICS ---- */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Lyrics</h3>
        <div className="bg-white/5 rounded-lg p-6 whitespace-pre-line">
          {song.lyrics || "Lyrics are not available for this song."}
        </div>
      </section>

      {/* ---- RELATED SONGS ---- */}
      <section>
        
        <h3 className="text-xl font-semibold mb-4">
          More from {artist?.name || song.artist}
        </h3>
        <SongList songs={related} />
      </section>
    </div>
  );
}
