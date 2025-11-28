"use client"

import useSWR from "swr"
import { api } from "@/lib/api"
import type { 
  SongOverviewResponse, 
  CollectionOverviewResponse,
  PlaylistOverviewResponse 
} from "@/types/catalog"

export interface ContentMetricsFilters {
  startDate: string
  endDate: string
  region?: string
}

export function useSongMetrics(songId: string | null, filters: ContentMetricsFilters) {
  const shouldFetch = !!songId && !!filters.startDate && !!filters.endDate

  const { data, error, isLoading, mutate } = useSWR<SongOverviewResponse>(
    shouldFetch ? ["song-metrics", songId, filters.startDate, filters.endDate, filters.region] : null,
    () => api.getSongOverview(songId!, filters.startDate, filters.endDate, filters.region),
    {
      refreshInterval: 60000,
      revalidateOnFocus: false,
    }
  )

  return {
    data,
    isLoading,
    error,
    mutate,
  }
}

export function useCollectionMetrics(collectionId: string | null, filters: ContentMetricsFilters) {
  const shouldFetch = !!collectionId && !!filters.startDate && !!filters.endDate

  const { data, error, isLoading, mutate } = useSWR<CollectionOverviewResponse>(
    shouldFetch ? ["collection-metrics", collectionId, filters.startDate, filters.endDate, filters.region] : null,
    () => api.getCollectionOverview(collectionId!, filters.startDate, filters.endDate, filters.region),
    {
      refreshInterval: 60000,
      revalidateOnFocus: false,
    }
  )

  return {
    data,
    isLoading,
    error,
    mutate,
  }
}

export function usePlaylistMetrics(playlistId: string | null, filters: ContentMetricsFilters) {
  const shouldFetch = !!playlistId && !!filters.startDate && !!filters.endDate

  const { data, error, isLoading, mutate } = useSWR<PlaylistOverviewResponse>(
    shouldFetch ? ["playlist-metrics", playlistId, filters.startDate, filters.endDate, filters.region] : null,
    () => api.getPlaylistOverview(playlistId!, filters.startDate, filters.endDate, filters.region),
    {
      refreshInterval: 60000,
      revalidateOnFocus: false,
    }
  )

  return {
    data,
    isLoading,
    error,
    mutate,
  }
}
