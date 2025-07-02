"use client";

import { useEffect,useState } from "react";
import { useDropzone } from "react-dropzone";
import { createSong, updateSong, uploadMedia, fetchArtists } from "./songApi";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { FaImage, FaMusic, FaTimes } from "react-icons/fa"; // Thêm icon từ react-icons


export default function SongForm({ song: initialSong, isOpen, onClose }) {
  const [formData, setFormData] = useState({
    title: initialSong?.title || "",
    artist: initialSong?.artist || "",
    album: initialSong?.album || "",
    releaseYear: initialSong?.releaseYear || "",
    duration: initialSong?.duration || "",
    genre: initialSong?.genre || "",
    coverArt: initialSong?.coverArt || "",
    audioUrl: initialSong?.audioUrl || "",
    artistId: initialSong?.artistId || "",
  });
  const [preview, setPreview] = useState({ coverArt: null, audio: null });
  const { toast } = useToast();
  const queryClient = useQueryClient();
const [artists, setArtists] = useState([]);

useEffect(() => {
  fetchArtists()
    .then(setArtists)
    .catch(() => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load artists",
      });
    });
}, []);

  const { getRootProps: getCoverProps, getInputProps: getCoverInputProps } = useDropzone({
    accept: { "image/*": [] },
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;
      try {
        const formData = new FormData();
        formData.append("cover_art", file);
        const result = await uploadMedia(formData);
        setFormData((prev) => ({ ...prev, coverArt: result.coverArt }));
        setPreview((prev) => ({ ...prev, coverArt: URL.createObjectURL(file) }));
      } catch (err) {
        toast({ variant: "destructive", title: "Error", description: "Failed to upload cover art" });
      }
    },
  });

  const { getRootProps: getAudioProps, getInputProps: getAudioInputProps } = useDropzone({
    accept: { "audio/*": [] },
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;
      try {
        const formData = new FormData();
        formData.append("audio", file);
        const result = await uploadMedia(formData);
        setFormData((prev) => ({ ...prev, audioUrl: result.audioUrl }));
        setPreview((prev) => ({ ...prev, audio: URL.createObjectURL(file) }));
      } catch (err) {
        toast({ variant: "destructive", title: "Error", description: "Failed to upload audio" });
      }
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (initialSong) {
        await updateSong(initialSong.id, formData);
        toast({ title: "Success", description: `${formData.title} has been updated.` });
      } else {
        await createSong(formData);
        toast({ title: "Success", description: `${formData.title} has been added.` });
      }
      queryClient.invalidateQueries(["songs"]);
      onClose();
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: err.message });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  if (!isOpen) return null;


  return (
    <div className="fixed inset-0 bg-black/60 flex items-start justify-end z-50 p-4">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-2xl w-full max-w-sm ml-auto overflow-y-auto max-h-[90vh] border border-gray-700 transition-all duration-300 hover:shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">{initialSong ? "Edit Song" : "Add Song"}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">Title</label>
            <div className="relative">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Artist</label>
            <input
              type="text"
              name="artist"
              value={formData.artist}
              onChange={handleInputChange}
              required
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Album</label>
            <input
              type="text"
              name="album"
              value={formData.album}
              onChange={handleInputChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Release Year</label>
            <input
              type="number"
              name="releaseYear"
              value={formData.releaseYear}
              onChange={handleInputChange}
              required
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Duration (sec)</label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              required
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Genre</label>
            <input
              type="text"
              name="genre"
              value={formData.genre}
              onChange={handleInputChange}
              required
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 flex items-center">
              <FaImage className="mr-2 text-purple-400" /> Cover Art
            </label>
            <div {...getCoverProps()} className="border-2 border-dashed border-purple-600 p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors">
              <input {...getCoverInputProps()} />
              <p className="text-gray-400 text-xs text-center">Drag & drop or click to upload</p>
            </div>
            {preview.coverArt && (
              <div className="relative mt-2">
                <img src={preview.coverArt} alt="Cover Preview" className="w-20 h-20 object-cover rounded-lg border border-gray-600" />
                <button
                  onClick={() => setPreview((prev) => ({ ...prev, coverArt: null }))}
                  className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition-colors"
                >
                  <FaTimes size={12} />
                </button>
              </div>
            )}
            {formData.coverArt && (
              <p className="text-xs text-gray-400 mt-1 overflow-hidden text-ellipsis whitespace-nowrap" style={{ maxWidth: "100%" }}>
                {formData.coverArt}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 flex items-center">
              <FaMusic className="mr-2 text-purple-400" /> Audio
            </label>
            <div {...getAudioProps()} className="border-2 border-dashed border-purple-600 p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors">
              <input {...getAudioInputProps()} />
              <p className="text-gray-400 text-xs text-center">Drag & drop or click to upload</p>
            </div>
            {preview.audio && (
              <audio controls src={preview.audio} className="mt-2 w-full bg-gray-700 rounded-lg p-1">
                Your browser does not support the audio element.
              </audio>
            )}
            {formData.audioUrl && (
              <p className="text-xs text-gray-400 mt-1 overflow-hidden text-ellipsis whitespace-nowrap" style={{ maxWidth: "100%" }}>
                {formData.audioUrl}
              </p>
            )}
          </div>
<div>
  <label className="block text-sm font-medium text-gray-300">Artist</label>
  <select
    name="artistId"
    value={formData.artistId}
    onChange={handleInputChange}
    required
    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white"
  >
    <option value="">Select artist</option>
    {artists.map((artist) => (
      <option key={artist.id} value={artist.id}>
        {artist.name}
      </option>
    ))}
  </select>
</div>

          <div className="flex justify-end pt-4 border-t border-gray-700 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 rounded-lg text-white hover:bg-gray-500 transition-colors mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 rounded-lg text-white hover:bg-purple-700 transition-colors"
            >
              {initialSong ? "Save" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}