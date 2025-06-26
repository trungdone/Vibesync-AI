"use client";

import { useParams } from "next/navigation";
import PlaylistPage from "@/components/playlist/page";
import { mockPlaylistData } from "@/lib/mockData";

export default function PlaylistDetailPage() {
  // Không cần useParams, không cần find
  const playlist = mockPlaylistData;

  return <PlaylistPage playlist={playlist} />;
}

