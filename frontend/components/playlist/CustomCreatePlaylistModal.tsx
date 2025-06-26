"use client";

import { useState } from "react";
import { createPlaylist } from "@/lib/api/playlists";
import { createPortal } from "react-dom";

interface CustomCreatePlaylistModalProps {
  open: boolean;
  onClose: () => void;
  onPlaylistCreated?: (playlist: any) => void;
}

export default function CustomCreatePlaylistModal({
  open,
  onClose,
  onPlaylistCreated,
}: CustomCreatePlaylistModalProps) {
  const [title, setTitle] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [isShuffle, setIsShuffle] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError("Playlist name is required.");
      return;
    }

    try {
      setLoading(true);
      const newPlaylist = await createPlaylist({ title, isPublic, isShuffle });
      onPlaylistCreated?.(newPlaylist);
      setTitle("");
      setError(null);
      onClose();
    } catch (err) {
      console.error("Error creating playlist:", err);
      setError("Failed to create playlist. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[10000] bg-black/60 flex items-center justify-center">
      <div className="relative bg-zinc-900 text-white p-6 rounded-2xl w-full max-w-md shadow-xl">
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-white text-lg font-bold"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-6">Create New Playlist</h2>

        {/* Playlist Title Input */}
        <input
          className="w-full px-4 py-2 mb-4 rounded-md bg-zinc-800 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
          placeholder="Enter playlist name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Toggle Controls */}
        <div className="space-y-4 text-sm">
          <Toggle
            label="Public"
            checked={isPublic}
            onChange={() => setIsPublic(!isPublic)}
          />
          <Toggle
            label="Shuffle"
            checked={isShuffle}
            onChange={() => setIsShuffle(!isShuffle)}
          />
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading || !title.trim()}
          className="mt-6 w-full py-2 bg-purple-600 hover:bg-purple-700 rounded-md font-semibold transition-all duration-200 disabled:opacity-50"
        >
          {loading ? "Creating..." : "CREATE"}
        </button>
      </div>
    </div>,
    document.body
  );
}

// Toggle component for reuse
function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex justify-between items-center">
      <span>{label}</span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-600 rounded-full peer-checked:bg-purple-600 transition-colors duration-300" />
        <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 peer-checked:translate-x-5" />
      </label>
    </div>
  );
}
