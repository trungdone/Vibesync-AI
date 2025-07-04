"use client";

import Link from "next/link";
import { Music, Users, FileText, Settings, List, BarChart, MessageSquare } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { MusicProvider } from "@/context/music-context";
import Header from "@/components/layout/header";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function AdminLayout({ children }) {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user || user.role !== "admin") {
    return <div className="flex items-center justify-center min-h-screen">Access Denied</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <MusicProvider>
        <div className="flex flex-col min-h-screen bg-gray-900">
          <Header />
          <div className="flex flex-1">
            <aside className="w-64 bg-gray-800 text-white p-4">
              <div className="flex items-center gap-2 mb-8">
                <Music size={32} />
                <h1 className="text-2xl font-bold">Admin Panel</h1>
              </div>
              <nav className="space-y-2">
                <Link
                  href="/admin/dashboard"
                  className="flex items-center gap-2 p-2 rounded hover:bg-gray-700"
                >
                  <BarChart size={20} /> Dashboard
                </Link>
                <Link
                  href="/admin/songs"
                  className="flex items-center gap-2 p-2 rounded hover:bg-gray-700"
                >
                  <Music size={20} /> Songs
                </Link>
                <Link
                  href="/admin/users"
                  className="flex items-center gap-2 p-2 rounded hover:bg-gray-700"
                >
                  <Users size={20} /> Users
                </Link>
                <Link
                  href="/admin/artists"
                  className="flex items-center gap-2 p-2 rounded hover:bg-gray-700"
                >
                  <Users size={20} /> Artists
                </Link>
                <Link
                  href="/admin/playlists"
                  className="flex items-center gap-2 p-2 rounded hover:bg-gray-700"
                >
                  <List size={20} /> Playlists
                </Link>
                <Link
                  href="/admin/ai-config"
                  className="flex items-center gap-2 p-2 rounded hover:bg-gray-700"
                >
                  <Settings size={20} /> AI Config
                </Link>
                <Link
                  href="/admin/comments"
                  className="flex items-center gap-2 p-2 rounded hover:bg-gray-700"
                >
                  <MessageSquare size={20} /> Comments
                </Link>
                <Link
                  href="/admin/logs"
                  className="flex items-center gap-2 p-2 rounded hover:bg-gray-700"
                >
                  <FileText size={20} /> Logs
                </Link>
                <button
                  onClick={signOut}
                  className="flex items-center gap-2 p-2 rounded hover:bg-gray-700 w-full text-left"
                >
                  Sign Out
                </button>
              </nav>
            </aside>
            <main className="flex-1 p-8">{children}</main>
          </div>
        </div>
      </MusicProvider>
    </QueryClientProvider>
  );
}