"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SongList from "@/components/songs/song-list";
import PlaylistGrid from "@/components/playlist/playlist-grid";
import { fetchPlaylists, fetchSongs } from "@/lib/api";
import { useRouter } from "next/navigation";
import ChatBox from "@/components/chatbot/ChatBox";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [likedSongs, setLikedSongs] = useState([]);
  const [historySongs, setHistorySongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const router = useRouter();

  // ✅ Load trạng thái chat từ localStorage
  useEffect(() => {
    const savedState = localStorage.getItem("isChatOpen");
    if (savedState === "true") {
      setIsChatOpen(true);
    }
  }, []);

  // ✅ Ghi lại mỗi lần thay đổi isChatOpen
  useEffect(() => {
    localStorage.setItem("isChatOpen", isChatOpen.toString());
  }, [isChatOpen]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/signin");
      return;
    }

    async function loadData() {
      try {
        setLoading(true);

        const userResponse = await fetch("http://localhost:8000/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = await userResponse.json();

        if (!userResponse.ok) throw new Error(userData.detail || "Unauthorized");

        setUser(userData);

        const playlistData = await fetchPlaylists();
        setPlaylists(playlistData.slice(0, 8));

        const songData = await fetchSongs();
        const songs = Array.isArray(songData) ? songData : songData?.songs || [];

        setLikedSongs(songs.slice(0, 10));
        setHistorySongs(songs.slice(10, 20));
      } catch (err) {
        console.error("Failed to load profile data:", err);
        router.push("/signin");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [router]);

  if (loading || !user) {
    return <div className="flex justify-center items-center h-[60vh]">Loading...</div>;
  }

  return (
    <div className="space-y-6 pb-24">
      {/* Profile UI */}
      <div className="flex items-center gap-6">
        <div className="relative w-32 h-32 rounded-full overflow-hidden">
          <Image
            src={user?.avatar || "/placeholder.svg?height=128&width=128&query=user+avatar"}
            alt="Profile"
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold">{user?.name || "User Name"}</h1>
          <p className="text-gray-400">{user?.email || "user@example.com"}</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="playlists">
        <TabsList className="bg-white/5">
          <TabsTrigger value="playlists">Playlists</TabsTrigger>
          <TabsTrigger value="liked">Liked Songs</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        <TabsContent value="playlists" className="mt-6">
          <PlaylistGrid playlists={playlists} />
        </TabsContent>
        <TabsContent value="liked" className="mt-6">
          <SongList songs={likedSongs} />
        </TabsContent>
        <TabsContent value="history" className="mt-6">
          <SongList songs={historySongs} />
        </TabsContent>
      </Tabs>

      {/* Nút mở chat */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 flex items-center justify-center z-50"
      >
        💬
      </button>

      {/* ChatBox */}
      {isChatOpen && (
        <ChatBox isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      )}
    </div>
  );
}
