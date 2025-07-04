"use client";

   import React, { useEffect, useState } from "react";
   import { useAuth } from "@/context/auth-context";
   import { useToast } from "@/hooks/use-toast";
   import { fetchSongs, createSong, updateSong, deleteSong } from "./songApi";
   import { SongList } from "./SongList";
   import { SongForm } from "./SongForm";
   import { SongView } from "./SongView";

   export default function SongsPage() {
     const { user } = useAuth();
     const { toast } = useToast();
     const [songs, setSongs] = useState([]);
     const [selectedSong, setSelectedSong] = useState(null);
     const [showForm, setShowForm] = useState(false);
     const [showView, setShowView] = useState(false);

     useEffect(() => {
       loadSongs();
     }, []);

     const loadSongs = async () => {
       try {
         const data = await fetchSongs();
         console.log("Songs data:", data);
         setSongs(Array.isArray(data) ? data : data?.songs || []);
       } catch (err) {
         toast({
           variant: "destructive",
           title: "Error",
           description: "Failed to load songs",
         });
       }
     };

     const handleAdd = () => {
       setSelectedSong(null);
       setShowForm(true);
       setShowView(false);
     };

     const handleEdit = (song) => {
       setSelectedSong(song);
       setShowForm(true);
       setShowView(false);
     };

     const handleView = (song) => {
       setSelectedSong(song);
       setShowView(true);
       setShowForm(false);
     };

     const handleDelete = async (id, title) => {
       const confirmed = confirm(`Are you sure you want to delete ${title}?`);
       if (!confirmed) return;

       try {
         await deleteSong(id);
         toast({ title: "Success", description: `${title} has been deleted.` });
         loadSongs();
       } catch (err) {
         toast({ variant: "destructive", title: "Error", description: err.message });
       }
     };

     const handleFormSubmit = async (songData) => {
       try {
         if (selectedSong) {
           await updateSong(selectedSong.id, songData);
           toast({ title: "Success", description: `${songData.title} has been updated.` });
         } else {
           await createSong(songData);
           toast({ title: "Success", description: `${songData.title} has been added.` });
         }
         setShowForm(false);
         setSelectedSong(null);
         await loadSongs();
       } catch (err) {
         toast({ variant: "destructive", title: "Error", description: err.message });
       }
     };

     if (!user || user.role !== "admin") {
       toast({
         variant: "destructive",
         title: "Access Denied",
         description: "Admin access only",
       });
       return <div className="flex items-center justify-center min-h-screen text-foreground">Access Denied</div>;
     }

     return (
       <div className="space-y-6 p-8">
         {showForm ? (
           <SongForm
             song={selectedSong}
             onSubmit={handleFormSubmit}
             onCancel={() => {
               setShowForm(false);
               setSelectedSong(null);
             }}
           />
         ) : showView ? (
           <SongView
             song={selectedSong}
             onClose={() => {
               setShowView(false);
               setSelectedSong(null);
             }}
           />
         ) : (
           <SongList
             songs={songs}
             onAdd={handleAdd}
             onEdit={handleEdit}
             onDelete={handleDelete}
             onView={handleView}
           />
         )}
       </div>
     );
   }