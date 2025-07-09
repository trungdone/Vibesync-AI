"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // ✅ Hàm xóa token và user
  const clearAuthStorage = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("user_id");
    setUser(null);
    setIsAuthenticated(false);
  };

  // ✅ Xác minh token khi load ứng dụng
  useEffect(() => {
    const token = localStorage.getItem("token");

    const checkToken = async () => {
      if (token) {
        try {
          await verifyToken(token);
        } catch (err) {
          console.warn("❌ Token không hợp lệ:", err.message);
          clearAuthStorage();
        }
      } else {
        clearAuthStorage();
      }
      setLoading(false);
    };

    checkToken();
  }, []);

  // ✅ Hàm xác thực token
  const verifyToken = async (token) => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const text = await response.text();

      if (response.ok) {
        const userData = JSON.parse(text);
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("user_id", userData._id || userData.id || "");
        return userData;
      } else {
        throw new Error("Invalid or expired token");
      }
    } catch (err) {
      clearAuthStorage();
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Đăng nhập
  const signIn = async (email, password) => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ username: email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.access_token);
        const userData = await verifyToken(data.access_token);

        if (userData.banned) {
          clearAuthStorage();
          throw new Error("Tài khoản đã bị khóa");
        }

        // Điều hướng theo role
        router.push(userData.role === "admin" ? "/admin/dashboard" : "/profile");
      } else {
        throw new Error(data.detail || "Sai thông tin đăng nhập");
      }
    } catch (err) {
      console.error("❌ Lỗi đăng nhập:", err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Đăng ký
  const signUp = async (name, email, password) => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/signin");
      } else {
        throw new Error(data.detail || "Đăng ký thất bại");
      }
    } catch (err) {
      console.error("❌ Lỗi đăng ký:", err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Đăng xuất
  const signOut = () => {
    clearAuthStorage();
    router.push("/signin");
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, loading, signIn, signUp, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ✅ Hook tiện dùng
export const useAuth = () => useContext(AuthContext);
