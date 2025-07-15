"use client";

import { use, useRef, useEffect, useState } from "react";
import { notFound } from "next/navigation";

// import SongList from "/components/songs/song-list";

import SongList from "@/components/songs/search_playlistpage";
import ArtistCard from "@/components/artist/ArtistCard";
import { getPlaylistById } from "@/lib/api/playlists";
import { getSongById } from "@/lib/api/songs";
import { searchAll } from "@/lib/api/search";
import { Heart, MoreHorizontal, Search } from "lucide-react";

export default function PlaylistPage({ params }) {
  const { id } = use(params);

  const [playlist, setPlaylist] = useState(null);
  const [songs, setSongs] = useState([]);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState({ songs: [], artists: [] });
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const searchInputRef = useRef(null);

  const refreshPlaylist = async () => {
    try {
      const updated = await getPlaylistById(id);
      const songData = await Promise.all(updated.songIds.map(getSongById));
      setPlaylist(updated);
      setSongs(songData.filter(Boolean));
    } catch (err) {
      console.error("❌ Refresh playlist failed:", err);
    }
  };

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const playlistData = await getPlaylistById(id);
        if (!playlistData) return notFound();

        setPlaylist(playlistData);
        const songData = await Promise.all(playlistData.songIds.map(getSongById));
        setSongs(songData.filter(Boolean));
      } catch (err) {
        console.error("❌ Failed to load playlist:", err);
        notFound();
      }
    };

    fetchPlaylist();
  }, [id]);

  useEffect(() => {
    const fetchSearch = async () => {
      if (!query.trim()) {
        setSearchResults({ songs: [], artists: [] });
        refreshPlaylist();
        return;
      }

      try {
        const result = await searchAll(query);
        setSearchResults({
          songs: result.songs || [],
          artists: result.artists || [],
        });
      } catch (err) {
        console.error("Search error:", err);
      }
    };

    fetchSearch();
  }, [query]);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  if (!playlist) return null;

  const firstSongCover = songs[0]?.coverArt || "/placeholder.svg";

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-800/60 via-black to-black text-white">
      {/* 🎧 Playlist Header */}
      <div className="p-6 pb-2 md:p-10 md:pb-4">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
          <img
            src={firstSongCover}
            alt="Playlist cover"
            className="w-40 h-40 md:w-56 md:h-56 object-cover rounded shadow-lg"
          />
          <div className="text-center md:text-left">
            <p className="uppercase text-xs font-semibold text-purple-300">Playlist</p>
            <h1 className="text-4xl md:text-5xl font-bold mt-1 text-white">{playlist.title}</h1>
            <p className="text-gray-300 mt-2 text-sm">
              {playlist.description || "No description."}
            </p>
            <p className="text-sm text-neutral-400 mt-1">
              {songs.length} {songs.length === 1 ? "song" : "songs"}
            </p>
          </div>
        </div>

        {/* ▶️ Action Buttons */}
        <div className="mt-6 flex items-center gap-4">
          <button className="bg-green-500 hover:bg-green-600 text-black px-6 py-2 rounded-full font-bold shadow">
            Play
          </button>
          <button className="text-white hover:text-pink-400">
            <Heart className="w-6 h-6" />
          </button>
          <button className="text-white hover:text-gray-300">
            <MoreHorizontal className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* 🔍 Smart Search Bar - Purple & Black Styled */}
      <div className="px-6 md:px-10 mt-6">
        {isSearchOpen ? (
          <div className="relative max-w-md">
            <input
              ref={searchInputRef}
              type="text"
              className="w-full p-3 pl-10 rounded-full bg-gradient-to-r from-purple-900 to-purple-800 text-white placeholder-purple-300 border border-purple-600 shadow focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
              placeholder="Search songs or artists..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onBlur={() => {
                if (!query.trim()) setIsSearchOpen(false);
              }}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-300 pointer-events-none" />
          </div>
        ) : (
          <button
            className="p-3 rounded-full bg-gradient-to-br from-purple-700 to-purple-900 text-white hover:from-purple-600 hover:to-purple-800 border border-purple-600 shadow-lg transition"
            onClick={() => setIsSearchOpen(true)}
            aria-label="Open Search"
          >
            <Search className="w-5 h-5" />
          </button>
        )}
      </div>



      {/* 🔎 Results or Playlist Songs */}
      <div className="p-6 pt-4 md:p-10 md:pt-6 space-y-10">
        {query.trim() ? (
          <>
            {searchResults.songs.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold mb-2">Songs</h2>
                <SongList
                  songs={searchResults.songs.map((s) => ({
                    id: s.id || s._id,
                    title: s.title,
                    artist: s.artist?.name || s.artist,
                    artistId: s.artist?._id || s.artistId,
                    album: s.album || "Unknown",
                    duration: s.duration || 0,
                    coverArt: s.coverArt || "/placeholder.svg",
                    genre: s.genre,
                    publisher: s.publisher,
                    refreshPlaylist,
                  }))}
                />
              </div>
            )}

            {searchResults.artists.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold mb-2">Artists</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {searchResults.artists.map((artist) => (
                    <ArtistCard key={artist._id} artist={artist} />
                  ))}
                </div>
              </div>
            )}

            {searchResults.songs.length === 0 &&
              searchResults.artists.length === 0 && (
                <p className="text-gray-400">No results found for "{query}".</p>
              )}
          </>
        ) : (
          <SongList songs={songs} />
        )}
      </div>
    </div>
  );
}
