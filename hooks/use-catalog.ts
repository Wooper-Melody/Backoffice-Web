"use client"

import { useState } from "react"
import useSWR from "swr"
import { api, type CatalogItem } from "@/lib/api"

interface UseCatalogOptions {
  search?: string
  type?: string
  status?: string
  page?: number
  limit?: number
}

export function useCatalog(options: UseCatalogOptions = {}) {
  const [filters, setFilters] = useState(options)

  const { data, error, isLoading, mutate } = useSWR(["catalog", filters], () => api.getCatalogItems(filters), {
    revalidateOnFocus: false,
    dedupingInterval: 30000, // 30 seconds
  })

  const updateFilters = (newFilters: Partial<UseCatalogOptions>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }

  const blockContent = async (contentId: string, blockData: any) => {
    try {
      await api.blockContent({ contentId, ...blockData })
      mutate() // Revalidate data
    } catch (error) {
      throw error
    }
  }

  const unblockContent = async (contentId: string, notes?: string) => {
    try {
      await api.unblockContent(contentId, notes)
      mutate() // Revalidate data
    } catch (error) {
      throw error
    }
  }

  return {
    items: data?.items || [],
    total: data?.total || 0,
    isLoading,
    error,
    filters,
    updateFilters,
    blockContent,
    unblockContent,
    refresh: mutate,
  }
}

export function useCatalogItem(id: string) {
  const { data, error, isLoading, mutate } = useSWR(id ? ["catalog-item", id] : null, () => api.getCatalogItem(id), {
    revalidateOnFocus: false,
  })

  const updateItem = async (updates: Partial<CatalogItem>) => {
    try {
      const updated = await api.updateCatalogItem(id, updates)
      mutate(updated, false) // Update cache without revalidation
      return updated
    } catch (error) {
      throw error
    }
  }

  return {
    item: data,
    isLoading,
    error,
    updateItem,
    refresh: mutate,
  }
}
