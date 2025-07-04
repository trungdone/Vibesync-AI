"use client";

<<<<<<< HEAD
import { useEffect,useState } from "react";
=======
import { useEffect, useState } from "react";
>>>>>>> origin/main
import { useDropzone } from "react-dropzone";
import { createSong, updateSong, uploadMedia, fetchArtists } from "./songApi";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
<<<<<<< HEAD
import { FaImage, FaMusic, FaTimes } from "react-icons/fa"; // Thêm icon từ react-icons


export default function SongForm({ song: initialSong, isOpen, onClose }) {
=======
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FaImage, FaMusic, FaTimes } from "react-icons/fa";

export function SongForm({ song: initialSong, onSubmit, onCancel }) {
>>>>>>> origin/main
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
<<<<<<< HEAD
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
=======
  const [preview, setPreview] = useState({ coverArt: initialSong?.coverArt || null, audio: initialSong?.audioUrl || null });
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    fetchArtists()
      .then((data) => setArtists(data?.artists || [])) // Trích xuất mảng artists từ phản hồi
      .catch(() => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load artists",
        });
      });
  }, [toast]);

  useEffect(() => {
    if (initialSong) {
      setFormData({
        title: initialSong.title || "",
        artist: initialSong.artist || "",
        album: initialSong.album || "",
        releaseYear: initialSong.releaseYear || "",
        duration: initialSong.duration || "",
        genre: initialSong.genre || "",
        coverArt: initialSong.coverArt || "",
        audioUrl: initialSong.audioUrl || "",
        artistId: initialSong.artistId || "",
      });
      setPreview({
        coverArt: initialSong.coverArt || null,
        audio: initialSong.audioUrl || null,
      });
    }
  }, [initialSong]);
>>>>>>> origin/main

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
<<<<<<< HEAD
      if (initialSong) {
        await updateSong(initialSong.id, formData);
        toast({ title: "Success", description: `${formData.title} has been updated.` });
      } else {
        await createSong(formData);
        toast({ title: "Success", description: `${formData.title} has been added.` });
      }
      queryClient.invalidateQueries(["songs"]);
      onClose();
=======
      await onSubmit(formData);
      queryClient.invalidateQueries(["songs"]);
>>>>>>> origin/main
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: err.message });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

<<<<<<< HEAD
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
=======
  return (
    <Card className="max-w-4xl mx-auto bg-card/50 backdrop-blur-sm border-2">
      <CardHeader className="border-b border-border">
        <CardTitle className="text-2xl bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
          {initialSong ? "Edit Song" : "Add New Song"}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-muted/50">
              <TabsTrigger value="basic" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400">
                Basic Info
              </TabsTrigger>
              <TabsTrigger value="media" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400">
                Media
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4 mt-6">
              <div>
                <Label htmlFor="title" className="text-sm font-medium text-foreground">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter song title"
                  className="mt-1 text-foreground bg-background border-border focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <Label htmlFor="artistId" className="text-sm font-medium text-foreground">Artist</Label>
                <select
                  id="artistId"
                  name="artistId"
                  value={formData.artistId}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select artist</option>
                  {artists.map((artist) => (
                    <option key={artist.id} value={artist.id}>
                      {artist.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="album" className="text-sm font-medium text-foreground">Album</Label>
                <Input
                  id="album"
                  name="album"
                  value={formData.album}
                  onChange={handleInputChange}
                  placeholder="Enter album name"
                  className="mt-1 text-foreground bg-background border-border focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <Label htmlFor="releaseYear" className="text-sm font-medium text-foreground">Release Year</Label>
                <Input
                  id="releaseYear"
                  name="releaseYear"
                  type="number"
                  value={formData.releaseYear}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter release year"
                  className="mt-1 text-foreground bg-background border-border focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <Label htmlFor="duration" className="text-sm font-medium text-foreground">Duration (sec)</Label>
                <Input
                  id="duration"
                  name="duration"
                  type="number"
                  value={formData.duration}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter duration in seconds"
                  className="mt-1 text-foreground bg-background border-border focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <Label htmlFor="genre" className="text-sm font-medium text-foreground">Genre</Label>
                <Input
                  id="genre"
                  name="genre"
                  value={formData.genre}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter genre"
                  className="mt-1 text-foreground bg-background border-border focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </TabsContent>

            <TabsContent value="media" className="space-y-4 mt-6">
              <div>
                <Label className="text-sm font-medium text-foreground flex items-center">
                  <FaImage className="mr-2 text-green-400" /> Cover Art
                </Label>
                <div
                  {...getCoverProps()}
                  className="border-2 border-dashed border-green-600 p-3 rounded-lg bg-background hover:bg-muted transition-colors"
                >
                  <input {...getCoverInputProps()} />
                  <p className="text-gray-400 text-xs text-center">Drag & drop or click to upload cover art</p>
                </div>
                {preview.coverArt && (
                  <div className="relative mt-2">
                    <img
                      src={preview.coverArt}
                      alt="Cover Preview"
                      className="w-20 h-20 object-cover rounded-lg border border-border"
                    />
                    <button
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, coverArt: "" }));
                        setPreview((prev) => ({ ...prev, coverArt: null }));
                      }}
                      className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition-colors"
                    >
                      <FaTimes size={12} />
                    </button>
                  </div>
                )}
                {formData.coverArt && !preview.coverArt && (
                  <p className="text-xs text-gray-400 mt-1 overflow-hidden text-ellipsis whitespace-nowrap">
                    {formData.coverArt}
                  </p>
                )}
              </div>
              <div>
                <Label className="text-sm font-medium text-foreground flex items-center">
                  <FaMusic className="mr-2 text-green-400" /> Audio
                </Label>
                <div
                  {...getAudioProps()}
                  className="border-2 border-dashed border-green-600 p-3 rounded-lg bg-background hover:bg-muted transition-colors"
                >
                  <input {...getAudioInputProps()} />
                  <p className="text-gray-400 text-xs text-center">Drag & drop or click to upload audio</p>
                </div>
                {preview.audio && (
                  <audio controls src={preview.audio} className="mt-2 w-full bg-background rounded-lg p-1">
                    Your browser does not support the audio element.
                  </audio>
                )}
                {formData.audioUrl && !preview.audio && (
                  <p className="text-xs text-gray-400 mt-1 overflow-hidden text-ellipsis whitespace-nowrap">
                    {formData.audioUrl}
                  </p>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3 pt-6 border-t border-border">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
            >
              {initialSong ? "Save" : "Add"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
>>>>>>> origin/main
  );
}