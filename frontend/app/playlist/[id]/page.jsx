"use client"

import { use, useEffect, useState } from "react";
import Image from "next/image";
import { useMusic } from "@/context/music-context";
import { Play, Clock, MoreHorizontal } from "lucide-react";
import { formatDuration } from "@/lib/utils";
import { fetchPlaylistById, fetchSongs } from "@/lib/api";

export default function PlaylistPage({ params }) {
  const { id } = use(params); // ✅ unwrap params bằng use()
  const [playlist, setPlaylist] = useState(null); // ✅ thêm useState cho playlist
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { playSong, currentSong, isPlaying, togglePlayPause } = useMusic();

  useEffect(() => {
    async function loadPlaylist() {
      try {
        setLoading(true);
        const playlistData = await fetchPlaylistById(id);
        setPlaylist(playlistData);

        if (playlistData?.songIds) {
          const allSongs = await fetchSongs();
          // Kiểm tra và xử lý allSongs
          const songsArray = Array.isArray(allSongs) ? allSongs : allSongs?.songs || [];
          if (songsArray.length === 0) {
            console.warn("No songs data available.");
          }
          const playlistSongs = songsArray.filter((s) => playlistData.songIds.includes(s.id));
          setSongs(playlistSongs);
        } else {
          setSongs([]);
        }
      } catch (err) {
        console.error("Error loading playlist:", err);
        setError("Failed to load playlist");
      } finally {
        setLoading(false);
      }
    }
    loadPlaylist();
  }, [id]);

  const totalDuration = songs.reduce((total, song) => total + (song.duration || 0), 0);

  if (loading) {
    return <div className="flex justify-center items-center h-[60vh]">Loading...</div>;
  }

  if (error || !playlist) {
    return <div className="flex justify-center items-center h-[60vh]">{error || "Playlist not found"}</div>;
  }

  return (
    <div className="space-y-8 pb-24">
      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
        <div className="relative w-64 h-64 rounded-lg overflow-hidden shadow-lg">
          <Image src={playlist.coverArt || "/placeholder.svg"} alt={playlist.title} fill className="object-cover" />
        </div>

        <div className="flex-1 text-center md:text-left">
          <div className="mb-4">
            <p className="text-gray-400">Playlist</p>
            <h1 className="text-4xl font-bold mb-2">{playlist.title}</h1>
            <p className="text-gray-300">{playlist.description}</p>
            <p className="text-gray-400 mt-2">
              Created by {playlist.creator} • {songs.length} songs • {formatDuration(totalDuration)}
            </p>
          </div>

          <div className="flex flex-wrap gap-4 justify-center md:justify-start mt-6">
            <button
              className="btn-primary flex items-center gap-2"
              onClick={() => songs.length && playSong(songs[0])}
            >
              <Play size={18} /> Play All
            </button>
          </div>
        </div>
      </div>

      <div>
        <div className="bg-white/5 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 text-left text-gray-400">
                <th className="p-4 w-12">#</th>
                <th className="p-4">Title</th>
                <th className="p-4 hidden md:table-cell">Album</th>
                <th className="p-4 hidden md:table-cell">
                  <Clock size={16} />
                </th>
                <th className="p-4 w-12"></th>
              </tr>
            </thead>
            <tbody>
              {songs.map((song, index) => (
                <tr
                  key={song.id}
                  className={`border-b border-white/5 hover:bg-white/10 ${
                    currentSong?.id === song.id ? "bg-white/10" : ""
                  }`}
                  onClick={() => playSong(song)}
                >
                  <td className="p-4 text-gray-400">{index + 1}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded overflow-hidden flex-shrink-0">
                        <Image
                          src={song.coverArt || "/placeholder.svg"}
                          alt={song.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{song.title}</p>
                        <p className="text-sm text-gray-400">{song.artist}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-gray-400 hidden md:table-cell">{song.album}</td>
                  <td className="p-4 text-gray-400 hidden md:table-cell">{formatDuration(song.duration)}</td>
                  <td className="p-4">
                    <button className="text-gray-400 hover:text-white">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
