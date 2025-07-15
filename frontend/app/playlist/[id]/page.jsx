"use client";

import { use } from "react";
import { useEffect, useState } from "react";
import { notFound } from "next/navigation";

import SongList from "@/components/songs/search_playlistpage"; // your custom SongList
import ArtistCard from "@/components/artist/ArtistCard";
import { getPlaylistById } from "@/lib/api/playlists";
import { getSongById } from "@/lib/api/songs";
import { searchAll } from "@/lib/api/search";

export default function PlaylistPage({ params }) {
  const { id } = use(params);

  const [playlist, setPlaylist] = useState(null);
  const [songs, setSongs] = useState([]);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState({ songs: [], artists: [] });

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
        refreshPlaylist(); // refetch if query is cleared
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
      </div>

      {/* 🔍 Search Bar */}
      <div className="px-6 md:px-10 mt-6">
        <input
          type="text"
          className="w-full p-2 rounded-md text-black"
          placeholder="Search songs or artists..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
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

            {searchResults.songs.length === 0 && searchResults.artists.length === 0 && (
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
