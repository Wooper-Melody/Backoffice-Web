"use client"

import type React from "react"

import { SWRConfig } from "swr"

interface SWRProviderProps {
  children: React.ReactNode
}

export function SWRProvider({ children }: SWRProviderProps) {
  return (
    <SWRConfig
      value={{
        refreshInterval: 0,
        revalidateOnFocus: false,
        revalidateOnReconnect: true,
        shouldRetryOnError: true,
        errorRetryCount: 3,
        errorRetryInterval: 5000,
        onError: (error) => {
          console.error("SWR Error:", error)
          // In a real app, you might want to show a toast notification
        },
      }}
    >
      {children}
    </SWRConfig>
  )
}
