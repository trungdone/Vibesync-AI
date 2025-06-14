export async function fetchSongs() {
  const res = await fetch("http://localhost:8000/songs");
  return await res.json();
}
