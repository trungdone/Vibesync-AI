import { notFound } from "next/navigation";
import PlaylistSongListClient from "@/components/playlist/playlist-song-list-client";
import { getPlaylistById } from "@/lib/api/playlists";
import { getSongById } from "@/lib/api/songs";

export async function generateMetadata({ params }) {
  const id = typeof params?.id === "string" ? params.id : undefined;
  if (!id) return { title: "Playlist" };

  try {
    const playlist = await getPlaylistById(id);
    return { title: playlist?.title || "Playlist" };
  } catch {
    return { title: "Playlist not found" };
  }
}

export default async function PlaylistPage({ params }) {
  const id = typeof params?.id === "string" ? params.id : undefined;
  if (!id) return notFound();

  const playlist = await getPlaylistById(id);
  if (!playlist) return notFound();

  let songDetails = [];
  try {
    if (Array.isArray(playlist.songIds)) {
      const promises = playlist.songIds.map((songId) => getSongById(songId));
      songDetails = await Promise.all(promises);
    }
  } catch (err) {
    console.error("❌ Failed to fetch songs:", err);
  }

  const validSongs = songDetails.filter(Boolean);

  const isDefaultCover = playlist.coverArt?.includes("placeholder.com");
  const coverToShow = !playlist.coverArt || isDefaultCover
    ? (validSongs[0]?.coverArt || "/placeholder.svg")
    : playlist.coverArt;

  return (
    <PlaylistSongListClient
      playlist={playlist}
      songs={validSongs}
      coverToShow={coverToShow}
    />
  );
}
