"use client"

import { useEffect, useState } from "react"
import Sidebar from "@/components/layout/sidebar"
import Player from "@/components/player"
import Header from "@/components/layout/header"
import { MusicProvider } from "@/context/music-context"
import { useAuth } from "@/context/auth-context"

export default function ClientLayout({ children }) {
  const { isAuthenticated } = useAuth()
  const [authKey, setAuthKey] = useState(0)

  useEffect(() => {
    setAuthKey((prev) => prev + 1)
  }, [isAuthenticated])

  return (
    <MusicProvider key={authKey}>
      <div className="flex flex-col h-screen bg-gradient-to-b from-purple-900/10 to-black">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-4">{children}</main>
        </div>
        <Player />
      </div>
    </MusicProvider>
  )
}
