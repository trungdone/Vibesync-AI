"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home, Search, Library, Music, Heart, ListMusic, PlusCircle, Play
} from "lucide-react";
import CustomCreatePlaylistModal from "@/components/playlist/CustomCreatePlaylistModal";
import { getAllPlaylists } from "@/lib/api/playlists";
import { useAuth } from "@/context/auth-context";
import { useMusic } from "@/context/music-context";

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { setContext, setContextId, updateSongsForContext, playSong, songs } = useMusic();
  const [playlists, setPlaylists] = useState([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const handleSubmit = async (title, description, isPublic) => {
    if (!user?.id) return;
    await createPlaylist({
      title,
      description,
      isPublic,
      creator: user.id,
    });
  };

  useEffect(() => {
    if (!user?.id) return;

    if (!user?.id) return;

    async function loadPlaylists() {
      try {
        const playlistsData = await getAllPlaylists(user.id);
        setPlaylists(playlistsData || []);
      } catch (e) {
        console.error("Failed to load playlists:", e);
      }
    }


    loadPlaylists();
  }, [user]);

  const isActive = (path) => pathname === path;

  const handlePlayPlaylist = async (playlistId) => {
    setContext("playlist");
    setContextId(playlistId);
    await updateSongsForContext("playlist", playlistId);
    if (songs.length > 0) {
      playSong(songs[0]);
    }
  };

  return (
    <aside className="w-64 hidden md:flex flex-col bg-black/30 h-full overflow-y-auto">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 mb-8">
          <div className="bg-purple-600 w-8 h-8 rounded-full flex items-center justify-center">
            <Music size={16} className="text-white" />
          </div>
          <span className="text-xl font-bold text-white">VibeSync</span>
        </Link>

        <nav className="space-y-1">
          <Link href="/" className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
            isActive("/") ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"
          }`}>
            <Home size={20} />
            <span>Home</span>
          </Link>
          <Link href="/search" className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
            isActive("/search") ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"
          }`}>
            <Search size={20} />
            <span>Search</span>
          </Link>
          <Link href="/library" className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
            isActive("/library") ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"
          }`}>
            <Library size={20} />
            <span>Your Library</span>
          </Link>
        </nav>

        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 font-medium text-xs uppercase tracking-wider">Playlists</h3>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="text-gray-400 hover:text-white"
              title="Create new playlist"
            >
              <PlusCircle size={18} />
            </button>
          </div>

          <CustomCreatePlaylistModal
            open={isCreateOpen}
            onClose={() => setIsCreateOpen(false)}
            onPlaylistCreated={async () => {
              try {
                if (!user?.id) return;
                const latest = await getAllPlaylists(user.id);
                setPlaylists(latest || []);
              } catch (e) {
                console.error("Failed to refresh playlists:", e);
              }
            }}
            onSubmit={handleSubmit}
          />

          <div className="space-y-1">
            <Link
              href="/playlist/liked"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-white/5 text-gray-400 hover:text-white"
            >
              <div className="w-6 h-6 flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-400 rounded-sm">
                <Heart size={12} className="text-white" />
              </div>
              <span>Liked Songs</span>
            </Link>

            {playlists.map((playlist) => (
              <div key={playlist.id} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-white/5">
                <button
                  onClick={() => handlePlayPlaylist(playlist.id)}
                  className="text-gray-400 hover:text-white w-6 h-6 flex items-center justify-center"
                >
                  <Play size={12} />
                </button>
                <Link
                  href={`/playlist/${playlist.id}`}
                  className="flex-1 text-gray-400 hover:text-white truncate"
                >
                  {playlist.title}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}