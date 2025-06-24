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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      verifyToken(token).finally(() => setLoading(false));
    } else {
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);
    }
  }, []);

  const verifyToken = async (token) => {
    try {
      const response = await fetch("http://localhost:8000/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setIsAuthenticated(true);

        // ✅ Lưu toàn bộ user và user_id vào localStorage
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("user_id", userData.id || userData._id || "");

        return userData;
      } else {
        clearAuthStorage();
      }
    } catch (err) {
      console.error("Token verification error:", err);
      clearAuthStorage();
    }
  };

  const clearAuthStorage = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("user_id");
    setIsAuthenticated(false);
    setUser(null);
  };

  const signIn = async (email, password) => {
    try {
      const response = await fetch("http://localhost:8000/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ username: email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.access_token);

        const userData = await verifyToken(data.access_token);
        if (userData?.role === "admin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/profile");
        }
      } else {
        throw new Error(data.detail || "Invalid credentials");
      }
    } catch (err) {
      throw new Error(err.message || "Sign-in failed");
    }
  };

  const signUp = async (name, email, password) => {
    try {
      const response = await fetch("http://localhost:8000/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        router.push("/signin");
      } else {
        throw new Error(data.detail || "Failed to create account");
      }
    } catch (err) {
      throw new Error(err.message);
    }
  };

  const signOut = () => {
    clearAuthStorage();
    router.push("/signin");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
