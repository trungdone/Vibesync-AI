import axios from "axios";
import axiosRetry from "axios-retry";

axiosRetry(axios, { retries: 3, retryDelay: axiosRetry.exponentialDelay });

const API_URL = "http://localhost:8000/api";

export async function fetchSongs(params = { skip: 0, limit: 100 }) {
  const token = localStorage.getItem("token");
  const query = new URLSearchParams(params).toString();
  const response = await axios.get(`${API_URL}/admin/songs?${query}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function fetchSongById(id) {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_URL}/admin/songs/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function createSong(data) {
  const token = localStorage.getItem("token");
  console.log("Data being sent:", data); // Thêm log để kiểm tra
  const response = await axios.post(`${API_URL}/admin/songs`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
}

export async function updateSong(id, data) {
  const token = localStorage.getItem("token");
  const response = await axios.put(`${API_URL}/admin/songs/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
}

export async function deleteSong(id) {
  const token = localStorage.getItem("token");
  const response = await axios.delete(`${API_URL}/admin/songs/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function uploadMedia(formData) {
  const token = localStorage.getItem("token");
  const response = await axios.post(`${API_URL}/admin/songs/upload`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

// songApi.js
export async function fetchArtists() {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_URL}/admin/artists`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}
