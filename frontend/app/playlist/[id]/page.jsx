import { notFound } from "next/navigation";
import SongList from "@/components/songs/song-list";
import { getPlaylistById } from "@/lib/api/playlists";
<<<<<<< HEAD
import { getSongById } from "@/lib/api/songs"; // nếu bạn có function này

// ⛳️ Metadata hiển thị title động trên trình duyệt
export async function generateMetadata({ params }) {
  const id = Array.isArray(params?.id) ? params.id[0] : params.id;
=======
import { getSongById } from "@/lib/api/songs";

// ⛳️ Metadata (dynamic browser title based on playlist name)
export async function generateMetadata({ params }) {

  const id = typeof params?.id === "string" ? params.id : undefined;
>>>>>>> origin/main

  if (!id) return { title: "Playlist" };

  try {
    const playlist = await getPlaylistById(id);
    return { title: playlist?.title || "Playlist" };
  } catch {
    return { title: "Playlist not found" };
  }
}

export default async function PlaylistPage({ params }) {
<<<<<<< HEAD
  const id = Array.isArray(params?.id) ? params.id[0] : params.id;

  if (!id || typeof id !== "string") return notFound();
=======
  const id = typeof params?.id === "string" ? params.id : undefined;

  if (!id) return notFound();
>>>>>>> origin/main

  const playlist = await getPlaylistById(id);
  if (!playlist) return notFound();

<<<<<<< HEAD
  // 🧠 Fetch từng bài hát nếu bạn lưu dưới dạng songIds = [id, id...]
  let songDetails = [];
  try {
    if (playlist.songIds && Array.isArray(playlist.songIds)) {
=======
  // 🧠 Fetch full song data using songIds array
  let songDetails = [];
  try {
    if (Array.isArray(playlist.songIds)) {
>>>>>>> origin/main
      const promises = playlist.songIds.map((songId) => getSongById(songId));
      songDetails = await Promise.all(promises);
    }
  } catch (err) {
<<<<<<< HEAD
    console.error("Failed to fetch songs:", err);
  }

  const validSongs = songDetails.filter(Boolean); // loại bỏ null
=======
    console.error("❌ Failed to fetch songs:", err);
  }

  const validSongs = songDetails.filter(Boolean); // Remove nulls
>>>>>>> origin/main

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-6">
        <img
<<<<<<< HEAD
          src={playlist.coverArt}
          alt="cover"
=======
          src={playlist.coverArt || "/placeholder.svg"}
          alt="Playlist cover"
>>>>>>> origin/main
          className="w-40 h-40 object-cover rounded shadow"
        />
        <div>
          <h1 className="text-3xl font-bold">{playlist.title}</h1>
<<<<<<< HEAD
          <p className="text-gray-400">{playlist.description}</p>
=======
          <p className="text-gray-400">{playlist.description || "No description."}</p>
>>>>>>> origin/main
          <p className="text-sm text-muted-foreground">
            {validSongs.length} {validSongs.length === 1 ? "song" : "songs"}
          </p>
        </div>
      </div>

      <SongList songs={validSongs} />
    </div>
  );
}
