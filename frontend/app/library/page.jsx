"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SongList from "@/components/songs/song-list";
import PlaylistGrid from "@/components/playlist/playlist-grid";
import { getAllPlaylists } from "@/lib/api/playlists";
import { useAuth } from "@/context/auth-context"; // add this

export default function LibraryPage() {
    const { user } = useAuth(); // 👈 get user info

  const [playlists, setPlaylists] = useState([]);
  const [likedSongs, setLikedSongs] = useState([]);
  const [historySongs, setHistorySongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      router.push("/signin");
    } else {
      async function loadData() {
        try {
          setLoading(true);

          // Gọi playlist
          const playlistData = await getAllPlaylists(user?.id);
          setPlaylists(playlistData || []);

          // Gọi song
          const songData = await getAllPlaylists();
          // Kiểm tra và xử lý songData
          const songs = Array.isArray(songData) ? songData : songData?.songs || [];
          if (songs.length === 0) {
            console.warn("No songs data available.");
          }
          setLikedSongs(songs.slice(0, 10));
          setHistorySongs(songs.slice(10, 20));
        } catch (err) {
          console.error("Failed to load library:", err);
          router.push("/signin");
        } finally {
          setLoading(false);
        }
      }

      loadData();
    }
  }, [token, router]);

  if (!token || loading) {
    return <div className="flex justify-center items-center h-[60vh]">Loading...</div>;
  }

  return (
    <div className="space-y-10 px-6 py-8">
      <h1 className="text-3xl font-bold mb-4">Your Library</h1>

      <div>
        <h2 className="text-xl font-semibold mb-2">Playlists</h2>
        <PlaylistGrid playlists={playlists} />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Liked Songs</h2>
        {/* <SongList songs={likedSongs} /> */}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Recently Played</h2>
        <SongList songs={historySongs} />
      </div>
    </div>
  );
}
