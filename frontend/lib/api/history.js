const API_BASE = "http://localhost:8000";

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export async function saveSearchHistory(keyword) {
  const res = await fetch(`${API_BASE}/history`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(getToken() && { Authorization: `Bearer ${getToken()}` }),
    },
    body: JSON.stringify({ keyword }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getSearchHistory(limit = 10) {
  const res = await fetch(`${API_BASE}/history?limit=${limit}`, {
    headers: getToken() ? { Authorization: `Bearer ${getToken()}` } : {},
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
