import { Inter } from "next/font/google"
import "./globals.css"
import Sidebar from "@/components/layout/sidebar"
import Player from "@/components/player"
import Header from "@/components/layout/header"
import { MusicProvider } from "@/context/music-context"
import { AuthProvider } from "@/context/auth-context"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
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
        </AuthProvider>
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.dev'
    };
