"use client"

import { useState } from "react"
import useSWR from "swr"
import { api } from "@/lib/api"
import { getFirebaseStorageUrl } from "@/lib/storage"
import type { MetricPeriod } from "@/types/users"

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

// Detailed Artist Metrics Hooks with date range filters
export function useArtistDetailedMetrics(
  artistId: string | null,
  startDate: string,
  endDate: string,
  region?: string
) {
  const filters = { startDate, endDate, region }
  const shouldFetch = !!artistId && !!startDate && !!endDate

  // Artist Overview
  const { data: overview, error: overviewError, isLoading: overviewLoading } = useSWR(
    shouldFetch ? ["artist-overview", artistId, startDate, endDate, region] : null,
    () => api.getArtistOverview(artistId!, filters),
    {
      refreshInterval: 60000,
      revalidateOnFocus: false,
    }
  )

  // Top Songs
  const { data: topSongs, error: topSongsError, isLoading: topSongsLoading } = useSWR(
    shouldFetch ? ["artist-top-songs", artistId, startDate, endDate, region] : null,
    () => api.getArtistTopSongs(artistId!, filters),
    {
      refreshInterval: 60000,
      revalidateOnFocus: false,
    }
  )

  // Top Playlists
  const { data: topPlaylists, error: topPlaylistsError, isLoading: topPlaylistsLoading } = useSWR(
    shouldFetch ? ["artist-top-playlists", artistId, startDate, endDate, region] : null,
    () => api.getArtistTopPlaylists(artistId!, filters),
    {
      refreshInterval: 60000,
      revalidateOnFocus: false,
    }
  )

  // Top Collections
  const { data: topCollections, error: topCollectionsError, isLoading: topCollectionsLoading } = useSWR(
    shouldFetch ? ["artist-top-collections", artistId, startDate, endDate, region] : null,
    () => api.getArtistTopCollections(artistId!, filters),
    {
      refreshInterval: 60000,
      revalidateOnFocus: false,
    }
  )

  // Market Distribution
  const { data: markets, error: marketsError, isLoading: marketsLoading } = useSWR(
    shouldFetch ? ["artist-markets", artistId, startDate, endDate] : null,
    () => api.getArtistMarkets(artistId!, filters, 10),
    {
      refreshInterval: 60000,
      revalidateOnFocus: false,
    }
  )

  // History (time-series data)
  const { data: history, error: historyError, isLoading: historyLoading } = useSWR(
    shouldFetch ? ["artist-history", artistId, startDate, endDate, region] : null,
    () => api.getArtistHistory(artistId!, filters),
    {
      refreshInterval: 60000,
      revalidateOnFocus: false,
    }
  )

  const isLoading = overviewLoading || topSongsLoading || topPlaylistsLoading || 
                    topCollectionsLoading || marketsLoading || historyLoading

  const error = overviewError || topSongsError || topPlaylistsError || 
                topCollectionsError || marketsError || historyError

  // Transform avatar URL if overview exists
  const transformedOverview = overview ? {
    ...overview,
    avatarUrl: getFirebaseStorageUrl(overview.avatarUrl) || overview.avatarUrl
  } : overview

  return {
    overview: transformedOverview,
    topSongs,
    topPlaylists,
    topCollections,
    markets,
    history,
    isLoading,
    error,
  }
}

// Admin User Metrics Hooks
export function useAdminUserMetrics(initialPeriod: MetricPeriod = "LAST_MONTH") {
  const [period, setPeriod] = useState<MetricPeriod>(initialPeriod)

  // Total Users Metrics
  const { data: totalUsersData, error: totalUsersError, isLoading: totalUsersLoading } = useSWR(
    ["admin-total-users", period],
    () => api.getTotalUsersMetrics(period),
    {
      refreshInterval: 60000,
      revalidateOnFocus: false,
    }
  )

  // Role Distribution Metrics
  const { data: roleDistributionData, error: roleDistributionError, isLoading: roleDistributionLoading } = useSWR(
    ["admin-role-distribution", period],
    () => api.getRoleDistributionMetrics(period),
    {
      refreshInterval: 60000,
      revalidateOnFocus: false,
    }
  )

  // Recent SignUps Metrics (no period needed)
  const { data: recentSignUpsData, error: recentSignUpsError, isLoading: recentSignUpsLoading } = useSWR(
    "admin-recent-signups",
    () => api.getRecentSignUpsMetrics(),
    {
      refreshInterval: 60000,
      revalidateOnFocus: false,
    }
  )

  // New SignUps Metrics
  const { data: newSignUpsData, error: newSignUpsError, isLoading: newSignUpsLoading } = useSWR(
    ["admin-new-signups", period],
    () => api.getNewSignUpsMetrics(period),
    {
      refreshInterval: 60000,
      revalidateOnFocus: false,
    }
  )

  // Blocked Users Metrics
  const { data: blockedUsersData, error: blockedUsersError, isLoading: blockedUsersLoading } = useSWR(
    ["admin-blocked-users", period],
    () => api.getBlockedUsersMetrics(period),
    {
      refreshInterval: 60000,
      revalidateOnFocus: false,
    }
  )

  // Active Users Metrics
  const { data: activeUsersData, error: activeUsersError, isLoading: activeUsersLoading } = useSWR(
    ["admin-active-users", period],
    () => api.getActiveUsersMetrics(period),
    {
      refreshInterval: 60000,
      revalidateOnFocus: false,
    }
  )

  const isLoading = totalUsersLoading || roleDistributionLoading || recentSignUpsLoading || 
                    newSignUpsLoading || blockedUsersLoading || activeUsersLoading

  const error = totalUsersError || roleDistributionError || recentSignUpsError || 
                newSignUpsError || blockedUsersError || activeUsersError

  return {
    period,
    setPeriod,
    isLoading,
    error,
    totalUsers: totalUsersData,
    roleDistribution: roleDistributionData,
    recentSignUps: recentSignUpsData,
    newSignUps: newSignUpsData,
    blockedUsers: blockedUsersData,
    activeUsers: activeUsersData,
  }
}
