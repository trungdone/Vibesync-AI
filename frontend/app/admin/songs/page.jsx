// app/admin/songs/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";

export default function SongsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [songs, setSongs] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("title");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    album: "",
    releaseYear: "",
    duration: "",
    genre: "",
    coverArt: "",
    audioUrl: "",
    artistId: "",
  });

  // Fetch songs
  useEffect(() => {
    if (!user || user.role !== "admin") return;

    const fetchSongs = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:8000/api/songs?search=${search}&sort=${sort}&skip=${
            (page - 1) * limit
          }&limit=${limit}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setSongs(data.songs);
          setTotal(data.total);
        } else {
          throw new Error("Failed to fetch songs");
        }
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Error",
          description: err.message,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, [user, search, sort, page, limit, toast]);

  // Handle add song
  const handleAddSong = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:8000/api/songs", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setSongs([...songs, data.song]);
        setTotal(total + 1);
        setShowAddDialog(false);
        resetForm();
        toast({
          title: "Success",
          description: `${formData.title} has been added.`,
        });
      } else {
        throw new Error(data.detail || "Failed to add song");
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message,
      });
    }
  };

  // Handle edit song
  const handleEditSong = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:8000/api/songs/${selectedSong.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setSongs(
          songs.map((song) => (song.id === selectedSong.id ? data.song : song))
        );
        setShowEditDialog(false);
        resetForm();
        toast({
          title: "Success",
          description: `${formData.title} has been updated.`,
        });
      } else {
        throw new Error(data.detail || "Failed to update song");
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message,
      });
    }
  };

  // Handle delete song
  const handleDeleteSong = async (id, title) => {
    const confirm = window.confirm(
      `Are you sure you want to delete ${title}? This action cannot be undone.`
    );
    if (!confirm) return;

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:8000/api/songs/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setSongs(songs.filter((song) => song.id !== id));
        setTotal(total - 1);
        toast({
          title: "Success",
          description: `${title} has been deleted.`,
        });
      } else {
        throw new Error(data.detail || "Failed to delete song");
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message,
      });
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      artist: "",
      album: "",
      releaseYear: "",
      duration: "",
      genre: "",
      coverArt: "",
      audioUrl: "",
      artistId: "",
    });
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Open edit dialog
  const openEditDialog = (song) => {
    setSelectedSong(song);
    setFormData(song);
    setShowEditDialog(true);
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Manage Songs</h1>

      {/* Search and Add Button */}
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
            resetForm();
            setShowAddDialog(true);
          }}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Add Song
        </button>
      </div>

      {/* Songs Table */}
      <div className="bg-white/10 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-800">
              <th
                className="px-4 py-2 text-left cursor-pointer"
                onClick={() => setSort("title")}
              >
                Title {sort === "title" && "↓"}
              </th>
              <th
                className="px-4 py-2 text-left cursor-pointer"
                onClick={() => setSort("artist")}
              >
                Artist {sort === "artist" && "↓"}
              </th>
              <th className="px-4 py-2 text-left">Album</th>
              <th
                className="px-4 py-2 text-left cursor-pointer"
                onClick={() => setSort("releaseYear")}
              >
                Year {sort === "releaseYear" && "↓"}
              </th>
              <th className="px-4 py-2 text-left">Duration</th>
              <th className="px-4 py-2 text-left">Genre</th>
              <th className="px-4 py-2 text-left">Actions</th>
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
                    onClick={() => openEditDialog(song)}
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

      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Add Song Dialog */}
      {showAddDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Add Song</h2>
            <form onSubmit={handleAddSong} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-white/10 border border-white/10 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Artist</label>
                <input
                  type="text"
                  name="artist"
                  value={formData.artist}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-white/10 border border-white/10 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Album</label>
                <input
                  type="text"
                  name="album"
                  value={formData.album}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-white/10 border border-white/10 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Release Year</label>
                <input
                  type="number"
                  name="releaseYear"
                  value={formData.releaseYear}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-white/10 border border-white/10 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Duration (seconds)</label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-white/10 border border-white/10 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Genre</label>
                <input
                  type="text"
                  name="genre"
                  value={formData.genre}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-white/10 border border-white/10 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Cover Art URL</label>
                <input
                  type="text"
                  name="coverArt"
                  value={formData.coverArt}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/10 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Audio URL</label>
                <input
                  type="text"
                  name="audioUrl"
                  value={formData.audioUrl}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/10 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Artist ID</label>
                <input
                  type="text"
                  name="artistId"
                  value={formData.artistId}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/10 rounded px-3 py-2"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddDialog(false)}
                  className="px-4 py-2 bg-gray-700 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 rounded hover:bg-purple-700"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Song Dialog */}
      {showEditDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Edit Song</h2>
            <form onSubmit={handleEditSong} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-white/10 border border-white/10 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Artist</label>
                <input
                  type="text"
                  name="artist"
                  value={formData.artist}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-white/10 border border-white/10 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Album</label>
                <input
                  type="text"
                  name="album"
                  value={formData.album}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-white/10 border border-white/10 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Release Year</label>
                <input
                  type="number"
                  name="releaseYear"
                  value={formData.releaseYear}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-white/10 border border-white/10 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Duration (seconds)</label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-white/10 border border-white/10 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Genre</label>
                <input
                  type="text"
                  name="genre"
                  value={formData.genre}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-white/10 border border-white/10 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Cover Art URL</label>
                <input
                  type="text"
                  name="coverArt"
                  value={formData.coverArt}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/10 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Audio URL</label>
                <input
                  type="text"
                  name="audioUrl"
                  value={formData.audioUrl}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/10 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Artist ID</label>
                <input
                  type="text"
                  name="artistId"
                  value={formData.artistId}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/10 rounded px-3 py-2"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowEditDialog(false)}
                  className="px-4 py-2 bg-gray-700 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 rounded hover:bg-purple-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}