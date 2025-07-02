// app/admin/dashboard/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";

export default function AdminDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState({
    users: 0,
    songs: 0,
    playlists: 0,
    albums: 0,
    artists: 0,
    song_likes: 0,
    followers: 0,
    comments: 0,
    reports: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== "admin") return;

    const fetchStats = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8000/admin/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        } else {
          throw new Error("Failed to fetch dashboard stats");
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
    fetchStats();
  }, [user, toast]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 bg-white/10 rounded-lg">
          <h2 className="text-xl font-semibold">Total Users</h2>
          <p className="text-2xl">{stats.users}</p>
        </div>
        <div className="p-4 bg-white/10 rounded-lg">
          <h2 className="text-xl font-semibold">Total Songs</h2>
          <p className="text-2xl">{stats.songs}</p>
        </div>
        <div className="p-4 bg-white/10 rounded-lg">
          <h2 className="text-xl font-semibold">Total Playlists</h2>
          <p className="text-2xl">{stats.playlists}</p>
        </div>
        <div className="p-4 bg-white/10 rounded-lg">
          <h2 className="text-xl font-semibold">Total Albums</h2>
          <p className="text-2xl">{stats.albums}</p>
        </div>
        <div className="p-4 bg-white/10 rounded-lg">
          <h2 className="text-xl font-semibold">Total Artists</h2>
          <p className="text-2xl">{stats.artists}</p>
        </div>
        <div className="p-4 bg-white/10 rounded-lg">
          <h2 className="text-xl font-semibold">Total Song Likes</h2>
          <p className="text-2xl">{stats.song_likes}</p>
        </div>
        <div className="p-4 bg-white/10 rounded-lg">
          <h2 className="text-xl font-semibold">Total Followers</h2>
          <p className="text-2xl">{stats.followers}</p>
        </div>
        <div className="p-4 bg-white/10 rounded-lg">
          <h2 className="text-xl font-semibold">Total Comments</h2>
          <p className="text-2xl">{stats.comments}</p>
        </div>
        <div className="p-4 bg-white/10 rounded-lg">
          <h2 className="text-xl font-semibold">Total Reports</h2>
          <p className="text-2xl">{stats.reports}</p>
        </div>
      </div>
    </div>
  );
}
