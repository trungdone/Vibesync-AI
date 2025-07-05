"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { searchAll } from "@/lib/api/search";

/* ----------------- API history ----------------- */
async function saveSearchHistory(query) {
  try {
    await fetch("http://localhost:8000/history", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"), // đổi nếu dùng cookie
      },
      body: JSON.stringify({ query, search_type: "all" }),
    });
  } catch (err) {
    console.error("Cannot save history:", err);
  }
}

async function fetchHistory() {
  const res = await fetch("http://localhost:8000/history", {
    headers: { Authorization: "Bearer " + localStorage.getItem("token") },
  });
  if (!res.ok) return [];
  return res.json();
}

async function clearHistory() {
  await fetch("http://localhost:8000/history", {
    method: "DELETE",
    headers: { Authorization: "Bearer " + localStorage.getItem("token") },
  });
}

/* ------------------------------------------------ */

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";

  const [results, setResults] = useState({ songs: [], artists: [], albums: [] });
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  /* ------------ Lấy hoặc ghi LỊCH SỬ ------------ */
  useEffect(() => {
    if (!query.trim()) {
      // Lấy lịch sử khi ô tìm kiếm trống
      fetchHistory().then(setHistory).catch(console.error);
      return;
    }

    (async () => {
      setLoading(true);
      try {
        const data = await searchAll(query.trim());
        setResults(data);

        // Ghi lịch sử
        await saveSearchHistory(query.trim());
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [query]);

  /* ------------ UI khi chưa nhập ------------- */
  if (!query.trim()) {
    return (
      <div className="p-6 space-y-6">
        <p className="text-gray-400">Hãy nhập từ khóa để bắt đầu tìm kiếm.</p>

        {history.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-white">
                Lịch sử tìm kiếm
              </h2>
              <button
                onClick={async () => {
                  await clearHistory();
                  setHistory([]);
                }}
                className="text-xs text-red-400 hover:underline"
              >
                Xoá lịch sử
              </button>
            </div>
            <ul className="space-y-1">
              {history.map((h) => (
                <li key={h._id}>
                  <Link
                    href={`/search?query=${encodeURIComponent(
                      h.query
                    )}&type=${h.search_type}`}
                    className="text-blue-400 hover:underline"
                  >
                    🔍 {h.query}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  /* ------------ Hiển thị kết quả ------------- */
  return (
    <section className="p-6 space-y-10">
      <h1 className="text-xl font-semibold">
        Kết quả tìm kiếm cho “{query}”
      </h1>

      {/* ---------- BÀI HÁT ---------- */}
      <ResultBlock title="Bài hát" loading={loading} items={results.songs}>
        {results.songs.map((song) => (
          <Link
            key={song.id || song._id}
            href={`/song/${song.id || song._id}`}
            className="flex items-center gap-4 p-2 rounded hover:bg-white/5"
          >
            <Image
              src={song.coverArt || "/placeholder.svg"}
              alt={song.title}
              width={56}
              height={56}
              className="rounded object-cover"
            />
            <div className="flex-1 overflow-hidden">
              <p className="truncate">{song.title}</p>
              <p className="text-xs text-gray-400 truncate">
                {song.artist?.name || song.artist || "Unknown Artist"}
              </p>
            </div>
            <span className="text-xs text-gray-500">
              {formatDuration(song.duration)}
            </span>
          </Link>
        ))}
      </ResultBlock>

      {/* ---------- NGHỆ SĨ ---------- */}
      <ResultBlock title="Nghệ sĩ" loading={loading} items={results.artists}>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-4">
          {results.artists.map((artist) => (
            <Link
              key={artist.id || artist._id}
              href={`/artist/${artist.id || artist._id}`}
              className="flex flex-col items-center gap-2 hover:bg-white/5 p-3 rounded"
            >
              <Image
                src={artist.image || artist.avatar_url || "/placeholder.svg"}
                alt={artist.name}
                width={96}
                height={96}
                className="rounded-full object-cover"
              />
              <p className="text-sm text-center truncate w-full">{artist.name}</p>
            </Link>
          ))}
        </div>
      </ResultBlock>

      {/* ---------- ALBUM ---------- */}
      <ResultBlock title="Album" loading={loading} items={results.albums}>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4">
          {results.albums.map((album) => {
            const cover =
              album.cover_art || album.coverArt || album.cover_url || "/placeholder.svg";
            const artistName =
              (album.artist && album.artist.name) || null;
            const releaseYear =
              album.release_year || album.releaseYear || null;

            return (
              <Link
                key={album.id || album._id}
                href={`/album/${album.id || album._id}`}
                className="flex flex-col gap-2 hover:bg-white/5 p-3 rounded"
              >
                <Image
                  src={cover}
                  alt={album.title}
                  width={160}
                  height={160}
                  className="w-full aspect-square object-cover rounded"
                />
                <p className="text-sm font-medium leading-tight truncate">
                  {album.title}
                </p>
                {artistName && (
                  <p className="text-xs text-gray-400 truncate">{artistName}</p>
                )}
                {releaseYear && (
                  <p className="text-xs text-gray-500">{releaseYear}</p>
                )}
              </Link>
            );
          })}
        </div>
      </ResultBlock>
    </section>
  );
}

/* ---------------------- Component Block Wrapper ---------------------- */
function ResultBlock({ title, loading, items, children }) {
  return (
    <div>
      <h2 className="font-medium mb-3">{title}</h2>
      {loading ? (
        <p className="text-gray-400">Đang tải…</p>
      ) : items?.length ? (
        children
      ) : (
        <p className="text-gray-500 italic">
          Không tìm thấy {title.toLowerCase()} nào.
        </p>
      )}
    </div>
  );
}

/* ---------------------- Helper ---------------------- */
function formatDuration(sec = 0) {
  const m = Math.floor(sec / 60)
    .toString()
    .padStart(2, "0");
  const s = (sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}
