"use client"

import { useState } from "react"
import useSWR from "swr"
import { api } from "@/lib/api"

export function useMetrics(initialTimeRange = "30d") {
  const [timeRange, setTimeRange] = useState(initialTimeRange)

  const { data, error, isLoading } = useSWR(["metrics", timeRange], () => api.getMetrics(timeRange), {
    refreshInterval: 60000, // Refresh every minute
    revalidateOnFocus: false,
  })

  return {
    data,
    isLoading,
    error,
    timeRange,
    setTimeRange,
  }
}

export function useUserMetrics(initialTimeRange = "30d") {
  const [timeRange, setTimeRange] = useState(initialTimeRange)

  const { data, error, isLoading } = useSWR(["user-metrics", timeRange], () => api.getUserMetrics(timeRange), {
    refreshInterval: 60000,
    revalidateOnFocus: false,
  })

  return {
    data,
    isLoading,
    error,
    timeRange,
    setTimeRange,
  }
}

export function useContentMetrics(initialTimeRange = "30d") {
  const [timeRange, setTimeRange] = useState(initialTimeRange)

  const { data, error, isLoading } = useSWR(["content-metrics", timeRange], () => api.getContentMetrics(timeRange), {
    refreshInterval: 60000,
    revalidateOnFocus: false,
  })

  return {
    data,
    isLoading,
    error,
    timeRange,
    setTimeRange,
  }
}

export function useArtistMetrics(artistId?: string, initialTimeRange = "30d") {
  const [timeRange, setTimeRange] = useState(initialTimeRange)

  const { data, error, isLoading } = useSWR(
    ["artist-metrics", artistId, timeRange],
    () => api.getArtistMetrics(artistId, timeRange),
    {
      refreshInterval: 60000,
      revalidateOnFocus: false,
    },
  )

  return {
    data,
    isLoading,
    error,
    timeRange,
    setTimeRange,
  }
}
