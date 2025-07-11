"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SongList from "@/components/songs/liked_song_song-list"; // 👈 your custom component
import PlaylistGrid from "@/components/playlist/playlist-grid";
import { getAllPlaylists } from "@/lib/api/playlists";
import { getSongById } from "@/lib/api/songs";
import { getLikedSongs } from "@/lib/api/liked-songs";
import { useAuth } from "@/context/auth-context";

export default function LibraryPage() {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [historySongs, setHistorySongs] = useState([]);
  const [likedSongs, setLikedSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/signin");
      return;
    }

    async function loadData() {
      try {
        setLoading(true);

        // ✅ Get all user playlists
        const rawPlaylists = await getAllPlaylists(user?.id);
        const processedPlaylists = await Promise.all(
          rawPlaylists.map(async (playlist) => {
            const firstSongId = playlist.songIds?.[0];
            let cover = "/placeholder.svg";

            if (firstSongId) {
              const song = await getSongById(firstSongId);
              if (song?.coverArt) cover = song.coverArt;
            }

            return {
              ...playlist,
              coverArt: cover,
            };
          })
        );
        setPlaylists(processedPlaylists);

        // ✅ History Songs (reusing all songs from all playlists)
        const allSongs = await Promise.all(
          rawPlaylists.flatMap((p) =>
            p.songIds.map((id) => getSongById(id))
          )
        );

        // ✅ Deduplicate by song.id
        const seen = new Set();
        const uniqueSongs = [];

        for (const song of allSongs) {
          if (song && !seen.has(song.id)) {
            seen.add(song.id);
            uniqueSongs.push(song);
          }
        }

        setHistorySongs(uniqueSongs.slice(0, 10));

        // ✅ Liked Songs
        const liked = await getLikedSongs(user?.id);
        setLikedSongs(liked);

      } catch (err) {
        console.error("Failed to load library:", err);
        router.push("/signin");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [router, user?.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        Loading...
      </div>
    );
  }

  return (
    <div className="space-y-10 px-6 py-8 min-h-screen text-white bg-gradient-to-b from-purple-900/30 via-black to-black">
      <h1 className="text-3xl font-bold mb-4">Your Library</h1>

      {/* Recently Played */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Recently Played</h2>
        <SongList songs={historySongs} />
      </div>

      {/* Liked Songs */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Liked Songs</h2>
        <SongList songs={likedSongs} />
      </div>

      {/* Playlists */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Playlists</h2>
        <PlaylistGrid playlists={playlists} />
      </div>
    </div>
  );
}
