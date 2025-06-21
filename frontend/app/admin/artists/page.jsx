// app/admin/artists/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchArtists } from "@/lib/api";

export default function AdminArtists() {
  const [artists, setArtists] = useState([]);
  const [newArtist, setNewArtist] = useState({ name: "", bio: "" });
  const [image, setImage] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function loadArtists() {
      const data = await fetchArtists() || {};
      setArtists(data.artists || []);
    }
    loadArtists();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", newArtist.name);
    formData.append("bio", newArtist.bio);
    if (image) formData.append("image", image);

    const res = await fetch("/api/artists", {
      method: "POST",
      headers: { Authorization: "Bearer admin-token" }, // Thay bằng token thực tế
      body: formData,
    });
    if (res.ok) {
      router.refresh(); // Refresh page to update list
      setNewArtist({ name: "", bio: "" });
      setImage(null);
    } else {
      console.error("Failed to create artist:", await res.text());
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Manage Artists</h1>
      <form onSubmit={handleCreate} className="space-y-4 mb-6">
        <input
          type="text"
          value={newArtist.name}
          onChange={(e) => setNewArtist({ ...newArtist, name: e.target.value })}
          placeholder="Name"
          className="p-2 border"
          required
        />
        <textarea
          value={newArtist.bio}
          onChange={(e) => setNewArtist({ ...newArtist, bio: e.target.value })}
          placeholder="Bio"
          className="p-2 border"
        />
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          className="p-2 border"
        />
        <button type="submit" className="btn-primary p-2">
          Create Artist
        </button>
      </form>
      <ul>
        {artists.map((artist) => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ul>
    </div>
  );
}