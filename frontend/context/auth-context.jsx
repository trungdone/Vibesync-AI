"use client"

import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  signIn: async () => {},
  signUp: async () => {},
  signOut: () => {},
})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
      setIsAuthenticated(true)
    }
  }, [])

  const signIn = async (email, password) => {
    // In a real app, this would make an API call to authenticate
    return new Promise((resolve, reject) => {
      // Simulate API call
      setTimeout(() => {
        // Mock validation
        if (email && password) {
          const user = {
            id: 1,
            name: "John Doe",
            email: email,
            avatar: "/user-avatar-profile.png",
          }

          setUser(user)
          setIsAuthenticated(true)
          localStorage.setItem("user", JSON.stringify(user))
          resolve(user)
        } else {
          reject(new Error("Invalid credentials"))
        }
      }, 500)
    })
  }

  const signUp = async (name, email, password) => {
    // In a real app, this would make an API call to register
    return new Promise((resolve, reject) => {
      // Simulate API call
      setTimeout(() => {
        // Mock validation
        if (name && email && password) {
          const user = {
            id: 1,
            name: name,
            email: email,
            avatar: "/user-avatar-profile.png",
          }

          setUser(user)
          setIsAuthenticated(true)
          localStorage.setItem("user", JSON.stringify(user))
          resolve(user)
        } else {
          reject(new Error("Invalid information"))
        }
      }, 500)
    })
  }

  const signOut = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem("user")
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signIn, signUp, signOut }}>{children}</AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
