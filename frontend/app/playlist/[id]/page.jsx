import { notFound } from "next/navigation";
import SongList from "@/components/songs/song-list";
import { getPlaylistById } from "@/lib/api/playlists";
import { getSongById } from "@/lib/api/songs";

// ⛳️ Dynamic page title
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



  const firstSongCover = validSongs[0]?.coverArt || "/placeholder.svg";

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-800/60 via-black to-black text-white">
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
            <p className="text-gray-300 mt-2 text-sm">{playlist.description || "No description."}</p>
            <p className="text-sm text-neutral-400 mt-1">
              {validSongs.length} {validSongs.length === 1 ? "song" : "songs"}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 pt-4 md:p-10 md:pt-6">
        <SongList songs={validSongs} />
      </div>
    </div>
  );
}
