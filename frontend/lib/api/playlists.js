const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

// ✅ Tạo playlist
export async function createPlaylist(payload) {
  const res = await fetch(`${API_BASE}/playlists`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      ...payload,
      coverArt: payload.coverArt || "https://via.placeholder.com/640x640.png?text=Playlist+Cover",
      songIds: payload.songIds || [],
      creator: payload.creator,
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Failed to create playlist");
  return data;
}

// ✅ Lấy tất cả playlist (có thể lọc theo creatorId)
export async function getAllPlaylists(creatorId) {
  const query = creatorId ? `?creator=${creatorId}` : "";
  const res = await fetch(`${API_BASE}/playlists${query}`, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch playlists");
  return res.json();
}

// ✅ Lấy playlist công khai
export async function getAllPublicPlaylists() {
  const res = await fetch(`${API_BASE}/playlists?isPublic=true`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch public playlists");
  return res.json();
}

// ✅ Lấy 1 playlist theo ID
export async function getPlaylistById(id) {
  const res = await fetch(`${API_BASE}/playlists/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch playlist");
  return res.json();
}

// ✅ Thêm bài hát vào playlist
export async function addSongToPlaylist(playlistId, songId) {
  const res = await fetch(`${API_BASE}/playlists/${playlistId}/add-song`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ songId }),
  });

  if (!res.ok) throw new Error("Failed to add song");
  return res.json();
}

// ✅ Xoá bài hát khỏi playlist
export async function removeSongFromPlaylist(playlistId, songId) {
  const res = await fetch(`${API_BASE}/playlists/${playlistId}/remove-song`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ songId }),
  });

  if (!res.ok) throw new Error("Failed to remove song");
  return res.json();
}

// ✅ Xoá cả playlist
export async function deletePlaylist(playlistId) {
  const res = await fetch(`${API_BASE}/playlists/${playlistId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!res.ok) throw new Error("Failed to delete playlist");
  return res.json();
}