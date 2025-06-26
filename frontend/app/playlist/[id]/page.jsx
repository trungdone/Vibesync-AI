import { notFound } from "next/navigation";
import SongList from "@/components/songs/song-list";

export async function generateMetadata({ params }) {
  const id = typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : null;

  if (!id) return { title: "Playlist" };

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/playlists/${id}`);
  const playlist = await res.json();

  return {
    title: `Playlist - ${playlist.title || "Untitled"}`,
  };
}



async function fetchPlaylist(id) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/playlists/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch (e) {
    return null;
  }
}

export default async function PlaylistPage({ params }) {
  if (!params || !params.id) return notFound();

  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const playlist = await fetchPlaylist(id);
  if (!playlist) return notFound();

  const songs = playlist.songIds || [];

  const songDetails = await Promise.all(
    songs.map(async (songId) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/songs/${songId}`);
      return res.ok ? res.json() : null;
    })
  );

  const validSongs = songDetails.filter(Boolean);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-6">
        <img
          src={playlist.coverArt}
          alt="cover"
          className="w-40 h-40 object-cover rounded shadow"
        />
        <div>
          <h1 className="text-3xl font-bold">{playlist.title}</h1>
          <p className="text-gray-400">{playlist.description}</p>
          <p className="text-sm text-muted-foreground">
            {validSongs.length} {validSongs.length === 1 ? "song" : "songs"}
          </p>
        </div>
      </div>

      <SongList songs={validSongs} />
    </div>
  );
}
