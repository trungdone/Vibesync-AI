"use client";

import { useAuth } from "@/context/auth-context";
import SongTable from "./SongTable";
import SongForm from "./SongForm";
import { useToast } from "@/hooks/use-toast";


export default function SongsPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  if (!user || user.role !== "admin") {
    toast({
      variant: "destructive",
      title: "Access Denied",
      description: "Admin access only",
    });
    return <div className="flex items-center justify-center min-h-screen">Access Denied</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Manage Songs</h1>
      <SongTable />
      <SongForm />
    </div>
  );
}