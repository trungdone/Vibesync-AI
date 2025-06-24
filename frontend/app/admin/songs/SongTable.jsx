"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchSongs, deleteSong } from "./songApi";
import { useToast } from "@/hooks/use-toast";
import SongForm from "./SongForm";

export default function SongTable() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("title");
  const [page, setPage] = useState(1);
  const limit = 10;
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["songs", search, sort, page],
    queryFn: () => fetchSongs({ search, sort, skip: (page - 1) * limit, limit }),
    keepPreviousData: true,
  });

  const songs = data?.songs || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const handleEdit = (song) => {
    setSelectedSong(song);
    setIsFormOpen(true);
  };

  const handleDeleteSong = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete ${title}?`)) return;
    try {
      await deleteSong(id);
      toast({ title: "Success", description: `${title} has been deleted.` });
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: err.message });
    }
  };

  if (isLoading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (error) return <div className="flex items-center justify-center min-h-screen">Error: {error.message}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search by title, artist, or genre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64 bg-white/10 border border-white/10 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
        />
        <button
          onClick={() => {
            setSelectedSong(null);
            setIsFormOpen(true);
          }}
          className="px-4 py-2 bg-green-600 rounded text-white"
        >
          Add New Song
        </button>
      </div>
      <div className="bg-white/10 rounded-lg overflow-hidden">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="bg-gray-800">
              <th className="px-4 py-2 text-left cursor-pointer min-w-[150px]" onClick={() => setSort("title")}>
                Title {sort === "title" && "↓"}
              </th>
              <th className="px-4 py-2 text-left cursor-pointer min-w-[150px]" onClick={() => setSort("artist")}>
                Artist {sort === "artist" && "↓"}
              </th>
              <th className="px-4 py-2 text-left min-w-[150px]">Album</th>
              <th className="px-4 py-2 text-left cursor-pointer min-w-[100px]" onClick={() => setSort("releaseYear")}>
                Year {sort === "releaseYear" && "↓"}
              </th>
              <th className="px-4 py-2 text-left min-w-[100px]">Duration</th>
              <th className="px-4 py-2 text-left min-w-[100px]">Genre</th>
              <th className="px-4 py-2 text-left min-w-[150px]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {songs.map((song) => (
              <tr key={song.id} className="border-t border-gray-700">
                <td className="px-4 py-2">{song.title}</td>
                <td className="px-4 py-2">{song.artist}</td>
                <td className="px-4 py-2">{song.album}</td>
                <td className="px-4 py-2">{song.releaseYear}</td>
                <td className="px-4 py-2">
                  {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, "0")}
                </td>
                <td className="px-4 py-2">{song.genre}</td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    onClick={() => handleEdit(song)}
                    className="px-3 py-1 bg-yellow-500 text-black rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteSong(song.id, song.title)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
      {isFormOpen && <SongForm song={selectedSong} isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />}
    </div>
  );
}