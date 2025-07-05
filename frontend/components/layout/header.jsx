"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Search } from "lucide-react";
import {
  saveSearchHistory,
  getSearchHistory,
} from "@/lib/api/history";

export default function Header() {
  const [keyword,   setKeyword]   = useState("");
  const [history,   setHistory]   = useState([]);
  const [showList,  setShowList]  = useState(false);

  const router     = useRouter();
  const pathname   = usePathname();
  const inputRef   = useRef(null);

  /* 🧹 Clear input khi đổi route */
  useEffect(() => setKeyword(""), [pathname]);

  /* ⏬ Lấy lịch sử 1 lần khi component mount */
  useEffect(() => {
    (async () => {
      try {
        const data = await getSearchHistory();
        setHistory(data);
      } catch (err) {
        console.error("Lỗi lấy lịch sử:", err);
      }
    })();
  }, []);

  /* 🚀 Hàm lưu + refresh list */
  const storeKeyword = async (kw) => {
    try {
      await saveSearchHistory(kw);
      // chèn ngay vào đầu mảng, loại trùng
      setHistory((prev) => [kw, ...prev.filter((i) => i.keyword !== kw)].slice(0, 10));
    } catch (err) {
      console.error("Lỗi khi lưu lịch sử:", err);
    }
  };

  /* ⌨️ Enter tìm kiếm */
  const handleSearch = async (e) => {
    if (e.key === "Enter" && keyword.trim()) {
      const q = keyword.trim();
      await storeKeyword({ keyword: q });      // lưu
      router.push(`/search?query=${encodeURIComponent(q)}`);
      setShowList(false);
    }
  };

  /* 👆 focus để mở dropdown */
  const handleFocus = () => setShowList(true);

  /* ⬆️ click ngoài để đóng dropdown */
  useEffect(() => {
    const handler = (e) => {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        setShowList(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="p-4 bg-black text-white flex justify-between items-center">
      <div className="relative w-full max-w-md" ref={inputRef}>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handleSearch}
          onFocus={handleFocus}
          placeholder={
            pathname.startsWith("/admin")
              ? "Tìm người dùng, bài hát hoặc thiết lập..."
              : "Tìm bài hát, nghệ sĩ hoặc album..."
          }
          className="w-full bg-white/10 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
        />

        {showList && history.length > 0 && (
          <ul className="absolute top-12 left-0 bg-white text-black w-full rounded-md shadow-lg z-10 max-h-64 overflow-y-auto">
            {history.map((item) => (
              <li
                key={item._id ?? item.keyword}
                onMouseDown={() => {               // onMouseDown để không mất focus
                  setKeyword(item.keyword);
                  router.push(`/search?query=${encodeURIComponent(item.keyword)}`);
                  setShowList(false);
                }}
                className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
              >
                {item.keyword}
              </li>
            ))}
          </ul>
        )}
      </div>
    </header>
  );
}
