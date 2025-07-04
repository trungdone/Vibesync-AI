// frontend/lib/artists.js
import axios from "axios";
import axiosRetry from "axios-retry";

axiosRetry(axios, { retries: 3, retryDelay: axiosRetry.exponentialDelay });

const API_URL = "http://localhost:8000/api";

// 💡 ĐÚNG: danh sách nghệ sĩ
export async function fetchArtists(params = {}) {
  const token = localStorage.getItem("token");
  const query = new URLSearchParams(params).toString();
  try {
    const res = await axios.get(`${API_URL}/admin/artists?${query}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("✅ API response:", res.data);
    return res.data;
  } catch (err) {
    console.error("❌ API fetchArtists error", err.response?.data || err.message);
    throw err;
  }
}


// 💡 ĐÚNG: theo ID
export async function fetchArtistById(id) {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_URL}/admin/artists/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

// 💡 ĐÚNG: tạo mới
export async function createArtist(data) {
  const token = localStorage.getItem("token");
  const response = await axios.post(`${API_URL}/admin/artists`, data, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

// 💡 ĐÚNG: cập nhật
export async function updateArtist(id, data) {
  const token = localStorage.getItem("token");
  const response = await axios.put(`${API_URL}/admin/artists/${id}`, data, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

// 💡 ĐÚNG: xóa
export async function deleteArtist(id) {
  const token = localStorage.getItem("token");
  const response = await axios.delete(`${API_URL}/admin/artists/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}
