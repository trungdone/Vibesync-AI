// app/signin/page.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Music } from "lucide-react";
import { useAuth } from "@/context/auth-context";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { signIn } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await signIn(email, password); // Sử dụng signIn từ AuthContext
    } catch (err) {
      setError(err.message || "An error occurred");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md p-8 space-y-8 bg-white/5 backdrop-blur-sm rounded-2xl">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-600 mb-4">
            <Music size={32} />
          </div>
          <h2 className="text-3xl font-bold">Welcome back</h2>
          <p className="text-gray-400 mt-2">Sign in to continue to Melody</p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-white p-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="input-field"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="input-field"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-purple-600 focus:ring-purple-600"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="text-purple-400 hover:text-purple-300">
                Forgot password?
              </a>
            </div>
          </div>

          <button type="submit" className="btn-primary w-full">
            Sign in
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-gray-400">
            Don't have an account?{" "}
            <Link href="/signup" className="text-purple-400 hover:text-purple-300">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}