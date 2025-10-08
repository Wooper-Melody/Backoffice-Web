"use client"

import { useAuth } from "@/components/auth/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function HomePage() {
  const { token, isLoading } = useAuth()
  const router = useRouter()
  useEffect(() => {
    if (!isLoading) {
      if (token) {
        router.push("/catalog")
      } else {
        router.push("/login")
      }
    }
  }, [token, isLoading, router])

  return null
}
