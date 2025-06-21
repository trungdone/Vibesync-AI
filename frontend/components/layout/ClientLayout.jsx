// components/layout/ClientLayout.jsx
"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "@/components/layout/sidebar";
import Player from "@/components/player";
import Header from "@/components/layout/header";
import { MusicProvider } from "@/context/music-context";
import { useAuth } from "@/context/auth-context";

export default function ClientLayout({ children }) {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return; // Chờ xác thực hoàn tất

    if (!isAuthenticated && pathname !== "/signin" && pathname !== "/signup") {
      router.push("/signin");
    } else if (user && user.role === "admin" && !pathname.startsWith("/admin")) {
      router.push("/admin/dashboard");
    } else if (user && user.role !== "admin" && pathname.startsWith("/admin")) {
      router.push("/profile");
    }
  }, [user, isAuthenticated, loading, pathname, router]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (pathname.startsWith("/admin")) {
    return <>{children}</>;
  }

  return (
    <MusicProvider>
      <div className="flex flex-col h-screen bg-gradient-to-b from-purple-900/10 to-black">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-4">{children}</main>
        </div>
        <Player />
      </div>
      
    </MusicProvider>
  );
}