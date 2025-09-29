"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

interface User {
  email: string
  name: string
  role: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (token: string, user: User) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check for existing session on mount
    const storedToken = sessionStorage.getItem("admin_token")
    const storedUser = sessionStorage.getItem("admin_user")

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setToken(storedToken)
        setUser(parsedUser)
      } catch (error) {
        console.error("Error parsing stored user:", error)
        // Clear invalid data
        sessionStorage.removeItem("admin_token")
        sessionStorage.removeItem("admin_user")
      }
    }

    setIsLoading(false)
  }, [])

  useEffect(() => {
    // Redirect logic
    if (!isLoading) {
      if (!token && pathname !== "/login") {
        router.push("/login")
      } else if (token && pathname === "/login") {
        router.push("/catalog")
      }
    }
  }, [token, pathname, router, isLoading])

  const login = (newToken: string, newUser: User) => {
    setToken(newToken)
    setUser(newUser)
    sessionStorage.setItem("admin_token", newToken)
    sessionStorage.setItem("admin_user", JSON.stringify(newUser))
  }

  const logout = async () => {
    try {
      await fetch("/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          // Backend expects token in x-access-token header for JWT validation
          ...(typeof window !== 'undefined' && token ? { 'x-access-token': token } : {}),
        },
      })
    } catch (error) {
      console.error("Logout API error:", error)
      // Continue with logout even if API call fails
    } finally {
      setToken(null)
      setUser(null)
      sessionStorage.removeItem("admin_token")
      sessionStorage.removeItem("admin_user")

      // Clear any other cached data
      sessionStorage.clear()

      router.push("/login")
    }
  }

  return <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
