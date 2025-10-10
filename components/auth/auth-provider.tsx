"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import type { UserResponse } from "@/types/auth"
import { api } from "@/lib/api"

interface AuthContextType {
  user: UserResponse | null
  token: string | null
  refreshToken: string | null
  login: (token: string, refreshToken: string, user: UserResponse) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [refreshToken, setRefreshToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check for existing session on mount
    const storedToken = sessionStorage.getItem("admin_token")
    const storedRefreshToken = sessionStorage.getItem("admin_refresh_token")
    const storedUser = sessionStorage.getItem("admin_user")

    if (storedToken && storedRefreshToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setToken(storedToken)
        setRefreshToken(storedRefreshToken)
        setUser(parsedUser)
      } catch (error) {
        console.error("Error parsing stored user:", error)
        // Clear invalid data
        sessionStorage.removeItem("admin_token")
        sessionStorage.removeItem("admin_refresh_token")
        sessionStorage.removeItem("admin_user")
      }
    }

    setIsLoading(false)
  }, [])

  useEffect(() => {
    // Listen for token refresh events from the API client
    const handleTokenRefresh = (event: CustomEvent) => {
      const { token: newToken, refreshToken: newRefreshToken, user: newUser } = event.detail
      setToken(newToken)
      setRefreshToken(newRefreshToken)
      setUser(newUser)
    }

    // Listen for auth logout events from the API client
    const handleAuthLogout = () => {
      setToken(null)
      setRefreshToken(null)
      setUser(null)
      sessionStorage.removeItem("admin_token")
      sessionStorage.removeItem("admin_refresh_token")
      sessionStorage.removeItem("admin_user")
      router.push("/login")
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('tokenRefreshed', handleTokenRefresh as EventListener)
      window.addEventListener('authLogout', handleAuthLogout as EventListener)
      
      return () => {
        window.removeEventListener('tokenRefreshed', handleTokenRefresh as EventListener)
        window.removeEventListener('authLogout', handleAuthLogout as EventListener)
      }
    }
  }, [router])

  useEffect(() => {
    // Redirect logic
    if (!isLoading) {
      if (!token && pathname !== "/login") {
        router.push("/login")
      } else if (token && pathname === "/login") {
        router.push("/users")
      }
    }
  }, [token, pathname, router, isLoading])

  const login = (newToken: string, newRefreshToken: string, newUser: UserResponse) => {
    setToken(newToken)
    setRefreshToken(newRefreshToken)
    setUser(newUser)
    sessionStorage.setItem("admin_token", newToken)
    sessionStorage.setItem("admin_refresh_token", newRefreshToken)
    sessionStorage.setItem("admin_user", JSON.stringify(newUser))
  }

  const logout = async () => {
    try {
      // Use the centralized API client for logout
      await api.logout()
    } catch (error) {
      console.error("Logout API error:", error)
      // Continue with logout even if API call fails
    } finally {
      setToken(null)
      setRefreshToken(null)
      setUser(null)
      sessionStorage.removeItem("admin_token")
      sessionStorage.removeItem("admin_refresh_token")
      sessionStorage.removeItem("admin_user")

      // Clear any other cached data
      sessionStorage.clear()

      router.push("/login")
    }
  }

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        token, 
        refreshToken,
        login, 
        logout, 
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
