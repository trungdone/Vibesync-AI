// frontend/lib/api/user.js
export async function toggleLikeSong(songId, token) {
  const res = await fetch(`http://localhost:8000/user/me/toggle-like/${songId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to like/unlike song");
  return await res.json();
}

