"use client";

import { useState, useEffect } from "react";
import { searchAll } from "@/lib/api/search";
import SongList from "@/components/songs/song-list";
import ArtistCard from "@/components/artist/ArtistCard"; // or adjust to your artist display component

export default function PlaylistSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({ songs: [], artists: [] });

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) return setResults({ songs: [], artists: [] });

      try {
        const res = await searchAll(query);
        setResults({
          songs: res.songs || [],
          artists: res.artists || [],
        });
      } catch (error) {
        console.error("Search failed:", error);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div className="p-4">
      <input
        type="text"
        className="w-full p-2 rounded-md border border-gray-300"
        placeholder="Search songs or artists..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {results.songs.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2">Songs</h2>
          <SongList songs={results.songs} />
        </div>
      )}

      {results.artists.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-2">Artists</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {results.artists.map((artist) => (
              <ArtistCard key={artist._id} artist={artist} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
