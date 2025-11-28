"use client"

import useSWR from "swr"
import { api } from "@/lib/api"
import type {
  ContentTrendsResponse,
  TopSongsResponse,
  TopPlaylistsResponse,
  TopCollectionsResponse,
  TopArtistsContentResponse,
  ContentSummaryResponse,
  ContentStateManagementResponse,
  ContentRatesResponse,
} from "@/types/catalog"

export interface ContentMetricsFilters {
  startDate: string
  endDate: string
  region?: string
}

export function useContentTrends(filters: ContentMetricsFilters) {
  const { startDate, endDate, region } = filters
  const { data, error, isLoading } = useSWR<ContentTrendsResponse>(
    ["content-trends", startDate, endDate, region],
    () => api.getContentTrends(startDate, endDate, region),
    {
      refreshInterval: 60000,
      revalidateOnFocus: false,
    }
  )

  return {
    data,
    error,
    isLoading,
  }
}

export function useTopSongs(filters: ContentMetricsFilters) {
  const { startDate, endDate, region } = filters
  const { data, error, isLoading } = useSWR<TopSongsResponse>(
    ["top-songs", startDate, endDate, region],
    () => api.getTopSongsMetrics(startDate, endDate, region),
    {
      refreshInterval: 60000,
      revalidateOnFocus: false,
    }
  )

  return {
    data,
    error,
    isLoading,
  }
}

export function useTopPlaylists(filters: ContentMetricsFilters) {
  const { startDate, endDate, region } = filters
  const { data, error, isLoading } = useSWR<TopPlaylistsResponse>(
    ["top-playlists", startDate, endDate, region],
    () => api.getTopPlaylistsMetrics(startDate, endDate, region),
    {
      refreshInterval: 60000,
      revalidateOnFocus: false,
    }
  )

  return {
    data,
    error,
    isLoading,
  }
}

export function useTopCollections(filters: ContentMetricsFilters) {
  const { startDate, endDate, region } = filters
  const { data, error, isLoading } = useSWR<TopCollectionsResponse>(
    ["top-collections", startDate, endDate, region],
    () => api.getTopCollectionsMetrics(startDate, endDate, region),
    {
      refreshInterval: 60000,
      revalidateOnFocus: false,
    }
  )

  return {
    data,
    error,
    isLoading,
  }
}

export function useTopArtists(filters: ContentMetricsFilters) {
  const { startDate, endDate, region } = filters
  const { data, error, isLoading } = useSWR<TopArtistsContentResponse>(
    ["top-artists-content", startDate, endDate, region],
    () => api.getTopArtistsContent(startDate, endDate, region),
    {
      refreshInterval: 60000,
      revalidateOnFocus: false,
    }
  )

  return {
    data,
    error,
    isLoading,
  }
}

export function useContentSummary(filters: ContentMetricsFilters) {
  const { startDate, endDate, region } = filters
  const { data, error, isLoading } = useSWR<ContentSummaryResponse>(
    ["content-summary", startDate, endDate, region],
    () => api.getContentSummary(startDate, endDate, region),
    {
      refreshInterval: 60000,
      revalidateOnFocus: false,
    }
  )

  return {
    data,
    error,
    isLoading,
  }
}

export function useContentStateManagement(region?: string) {
  const { data, error, isLoading } = useSWR<ContentStateManagementResponse>(
    ["content-state-management", region],
    () => api.getContentStateManagement(region),
    {
      refreshInterval: 60000,
      revalidateOnFocus: false,
    }
  )

  return {
    data,
    error,
    isLoading,
  }
}

export function useContentRates(filters: ContentMetricsFilters) {
  const { startDate, endDate, region } = filters
  const { data, error, isLoading } = useSWR<ContentRatesResponse>(
    ["content-rates", startDate, endDate, region],
    () => api.getContentRates(startDate, endDate, region),
    {
      refreshInterval: 60000,
      revalidateOnFocus: false,
    }
  )

  return {
    data,
    error,
    isLoading,
  }
}
