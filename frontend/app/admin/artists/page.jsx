"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchArtists } from "@/lib/api";
import { ArtistList } from "./ArtistList"; // ✅ import đúng thư mục hiện tại
import { ArtistForm } from "./ArtistForm";

export default function AdminArtistsPage() {
  const [artists, setArtists] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadArtists();
  }, []);

  const loadArtists = async () => {
    const data = await fetchArtists();
    setArtists(data?.artists || []);
  };

  const handleAdd = () => {
    setSelectedArtist(null);
    setShowForm(true);
  };

  const handleEdit = (artist) => {
    setSelectedArtist(artist);
    setShowForm(true);
  };

  const handleView = (artist) => {
    alert(`Viewing artist: ${artist.name}`);
    // Hoặc điều hướng đến trang chi tiết: router.push(`/admin/artists/${artist.id}`);
  };

  const handleDelete = async (id) => {
    const confirmed = confirm("Are you sure you want to delete this artist?");
    if (!confirmed) return;

    const res = await fetch(`/api/artists/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer admin-token", // thay bằng token thật
      },
    });
    if (res.ok) {
      loadArtists();
    } else {
      console.error("Failed to delete artist:", await res.text());
    }
  };

  const handleFormSubmit = async (artistData) => {
    const method = selectedArtist ? "PUT" : "POST";
    const url = selectedArtist ? `/api/artists/${selectedArtist.id}` : `/api/artists`;

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer admin-token",
      },
      body: JSON.stringify(artistData),
    });

    if (res.ok) {
      setShowForm(false);
      setSelectedArtist(null);
      await loadArtists();
    } else {
      console.error("Failed to save artist:", await res.text());
    }
  };

  return (
    <div className="space-y-6">
      {showForm ? (
        <ArtistForm
          artist={selectedArtist}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setSelectedArtist(null);
          }}
        />
      ) : (
        <ArtistList
          artists={artists}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
        />
      )}
    </div>
  );
}
