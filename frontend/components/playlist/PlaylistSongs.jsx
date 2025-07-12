"use client";

import { useMusic } from "@/context/music-context";
import SongRow from "@/components/songs/SongRow"; // you may need to create this if not exists

export default function PlaylistSongs({ songs, playlistId }) {
  const { playPlaylist } = useMusic();

  return (
    <div>
      <div className="mb-4">
        <button
          onClick={() => playPlaylist(songs, playlistId)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full font-semibold transition"
        >
          Play
        </button>
      </div>

      <div className="space-y-4">
        {songs.map((song, idx) => (
          <SongRow key={song._id} song={song} index={idx + 1} />
        ))}
      </div>
    </div>
  );
}
