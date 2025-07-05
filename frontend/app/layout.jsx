import { Inter } from "next/font/google";
import "./globals.css";

import { AuthProvider } from "@/context/auth-context";
import { MusicProvider } from "@/context/music-context"; // ✅ Thêm dòng này
import ClientLayout from "@/components/layout/ClientLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Your App",
  description: "Music App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MusicProvider>                    {/* ✅ Bọc toàn bộ app */}
          <AuthProvider>
            <ClientLayout>{children}</ClientLayout>
          </AuthProvider>
        </MusicProvider>

        {/* Optional: modal root if bạn dùng dialog */}
        <div id="modal-root" />
      </body>
    </html>
  );
}
