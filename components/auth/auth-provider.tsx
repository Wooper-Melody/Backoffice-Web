"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import type { UserResponse } from "@/types/auth"

interface AuthContextType {
  user: UserResponse | null
  token: string | null
  refreshToken: string | null
  expiresAt: number | null
  login: (token: string, refreshToken: string, user: UserResponse, expiresIn: number) => void
  logout: () => void
  isLoading: boolean
  isTokenExpiringSoon: () => boolean
  refreshTokenIfNeeded: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [refreshToken, setRefreshToken] = useState<string | null>(null)
  const [expiresAt, setExpiresAt] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check for existing session on mount
    const storedToken = sessionStorage.getItem("admin_token")
    const storedRefreshToken = sessionStorage.getItem("admin_refresh_token")
    const storedUser = sessionStorage.getItem("admin_user")
    const storedExpiresAt = sessionStorage.getItem("admin_expires_at")

    if (storedToken && storedRefreshToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        const parsedExpiresAt = storedExpiresAt ? parseInt(storedExpiresAt) : null
        setToken(storedToken)
        setRefreshToken(storedRefreshToken)
        setUser(parsedUser)
        setExpiresAt(parsedExpiresAt)
      } catch (error) {
        console.error("Error parsing stored user:", error)
        // Clear invalid data
        sessionStorage.removeItem("admin_token")
        sessionStorage.removeItem("admin_refresh_token")
        sessionStorage.removeItem("admin_user")
        sessionStorage.removeItem("admin_expires_at")
      }
    }

    setIsLoading(false)
  }, [])

  useEffect(() => {
    // Listen for token refresh events from the API client
    const handleTokenRefresh = (event: CustomEvent) => {
      const { token: newToken, refreshToken: newRefreshToken, user: newUser, expiresIn } = event.detail
      const newExpiresAt = Date.now() + (expiresIn * 1000)
      setToken(newToken)
      setRefreshToken(newRefreshToken)
      setUser(newUser)
      setExpiresAt(newExpiresAt)
      
      // Update sessionStorage with new expiration
      sessionStorage.setItem("admin_expires_at", newExpiresAt.toString())
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('tokenRefreshed', handleTokenRefresh as EventListener)
      
      return () => {
        window.removeEventListener('tokenRefreshed', handleTokenRefresh as EventListener)
      }
    }
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

  // Proactive token refresh effect
  useEffect(() => {
    if (!token || !expiresAt) return

    // Check token expiration every minute
    const interval = setInterval(() => {
      refreshTokenIfNeeded()
    }, 60 * 1000) // Check every minute

    // Also check immediately if token is already expiring soon
    refreshTokenIfNeeded()

    return () => clearInterval(interval)
  }, [token, expiresAt, refreshToken])

  const login = (newToken: string, newRefreshToken: string, newUser: UserResponse, expiresIn: number) => {
    const newExpiresAt = Date.now() + (expiresIn * 1000)
    setToken(newToken)
    setRefreshToken(newRefreshToken)
    setUser(newUser)
    setExpiresAt(newExpiresAt)
    sessionStorage.setItem("admin_token", newToken)
    sessionStorage.setItem("admin_refresh_token", newRefreshToken)
    sessionStorage.setItem("admin_user", JSON.stringify(newUser))
    sessionStorage.setItem("admin_expires_at", newExpiresAt.toString())
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
      setRefreshToken(null)
      setUser(null)
      setExpiresAt(null)
      sessionStorage.removeItem("admin_token")
      sessionStorage.removeItem("admin_refresh_token")
      sessionStorage.removeItem("admin_user")
      sessionStorage.removeItem("admin_expires_at")

      // Clear any other cached data
      sessionStorage.clear()

      router.push("/login")
    }
  }

  // Check if token will expire within 5 minutes (300 seconds)
  const isTokenExpiringSoon = (): boolean => {
    if (!expiresAt) return false
    const timeUntilExpiry = expiresAt - Date.now()
    const fiveMinutesInMs = 5 * 60 * 1000
    return timeUntilExpiry <= fiveMinutesInMs
  }

  // Proactively refresh token if it's expiring soon
  const refreshTokenIfNeeded = async (): Promise<void> => {
    if (!refreshToken || !isTokenExpiringSoon()) {
      return
    }

    try {
      const response = await fetch('/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      })

      if (!response.ok) {
        throw new Error(`Refresh failed: ${response.status}`)
      }

      const authResponse = await response.json()
      
      // Update auth state with new tokens
      const newExpiresAt = Date.now() + (authResponse.expiresIn * 1000)
      setToken(authResponse.token)
      setRefreshToken(authResponse.refreshToken)
      setUser(authResponse.user)
      setExpiresAt(newExpiresAt)
      
      // Update sessionStorage
      sessionStorage.setItem('admin_token', authResponse.token)
      sessionStorage.setItem('admin_refresh_token', authResponse.refreshToken)
      sessionStorage.setItem('admin_user', JSON.stringify(authResponse.user))
      sessionStorage.setItem('admin_expires_at', newExpiresAt.toString())

      // Dispatch event for API client
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('tokenRefreshed', {
          detail: {
            token: authResponse.token,
            refreshToken: authResponse.refreshToken,
            user: authResponse.user,
            expiresIn: authResponse.expiresIn
          }
        }))
      }
    } catch (error) {
      console.error('Proactive token refresh failed:', error)
      // If refresh fails, logout user
      logout()
    }
  }

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        token, 
        refreshToken,
        expiresAt,
        login, 
        logout, 
        isLoading,
        isTokenExpiringSoon,
        refreshTokenIfNeeded
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
