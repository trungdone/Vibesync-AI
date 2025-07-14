"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import SongList from "@/components/songs/liked_song_song-list"; // ✅ same as LibraryPage
import { getLikedSongs } from "@/lib/api/liked-songs"; // ✅ same import that works in LibraryPage

export default function LikedSongsPage() {
  const { user } = useAuth();
  const [likedSongs, setLikedSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/signin");
      return;
    }

    async function loadLiked() {
      try {
        setLoading(true);
        const liked = await getLikedSongs(user?.id);
        setLikedSongs(liked);
      } catch (err) {
        console.error("Failed to load liked songs:", err);
      } finally {
        setLoading(false);
      }
    }

    loadLiked();
  }, [router, user?.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        Loading...
      </div>
    );
  }

  return (
    <div className="space-y-6 px-6 py-8 min-h-screen text-white bg-gradient-to-b from-purple-900/30 via-black to-black">
      <h1 className="text-3xl font-bold mb-4">Liked Songs</h1>
      <SongList songs={likedSongs} />
    </div>
  );
}
