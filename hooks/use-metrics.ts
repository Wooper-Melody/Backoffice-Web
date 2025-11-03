"use client"

import { useState } from "react"
import useSWR from "swr"
import { api } from "@/lib/api"
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
