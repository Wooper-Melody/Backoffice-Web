"use client"

import { useState, useEffect, useCallback } from "react"
import { api } from "@/lib/api"
import { getFirebaseStorageUrl } from "@/lib/storage"
import { useToast } from "@/hooks/use-toast"
import type {
  ContentAdminResponse,
  CatalogFilters,
  CatalogPageData,
  UpdateBlockStatusRequest,
  SongDetailAdminResponse,
  CollectionDetailAdminResponse
} from "@/types/catalog"

export function useCatalog() {
  const [loading, setLoading] = useState(false)
  const [catalogData, setCatalogData] = useState<CatalogPageData | null>(null)
  const [selectedContent, setSelectedContent] = useState<ContentAdminResponse | null>(null)
  const [currentFilters, setCurrentFilters] = useState<CatalogFilters>()
  const { toast } = useToast()

  const showError = useCallback((message: string, error?: any) => {
    console.error("Catalog API error:", error)

    let detail: string | undefined
    try {
      if (!error) {
        detail = undefined
      } else if (typeof error === 'string') {
        detail = error
      } else if (error?.response?.data) {
        // axios-like
        const data = error.response.data
        detail = data.detail || data.message || data.title || JSON.stringify(data)
      } else if (error?.message) {
        detail = error.message
      } else {
        detail = String(error)
      }
    } catch (e) {
      detail = "Error parsing error details"
    }

    const maxDetailLength = 200
    let displayDetail = detail
    if (detail && detail.length > maxDetailLength) {
      displayDetail = detail.substring(0, maxDetailLength) + "..."
    }

    toast({
      title: "Error",
      description: displayDetail ? `${message}: ${displayDetail}` : message,
      variant: "destructive",
    })
  }, [toast])

  const showSuccess = useCallback((message: string) => {
    toast({
      title: "Success",
      description: message,
      variant: "default",
    })
  }, [toast])

  const fetchCatalogContent = useCallback(async (filters?: CatalogFilters) => {
    setLoading(true)
    try {
      const data = await api.getAllCatalogContent(filters)
      // Normalizar coverUrl para cada contenido
      if (data?.content) {
        data.content = data.content.map(c => ({
          ...c,
          coverUrl: getFirebaseStorageUrl(c.coverUrl) || c.coverUrl
        }))
      }
      setCatalogData(data)
      // Store the filters for future refreshes
      if (filters) {
        setCurrentFilters(filters)
      }
    } catch (error) {
      showError("Error while fetching catalog content", error)
    } finally {
      setLoading(false)
    }
  }, [showError])

  const fetchSongDetail = useCallback(async (songId: string) => {
    setLoading(true)
    try {
      const song = await api.getSongDetail(songId)
      // Normalizar coverUrl
      if (song) {
        song.coverUrl = getFirebaseStorageUrl(song.coverUrl) || song.coverUrl
      }
      setSelectedContent(song)
      return song
    } catch (error) {
      showError("Error while fetching song details", error)
      return null
    } finally {
      setLoading(false)
    }
  }, [showError])

  const fetchCollectionDetail = useCallback(async (collectionId: string) => {
    setLoading(true)
    try {
      const collection = await api.getCollectionDetail(collectionId)
      // Normalizar coverUrl
      if (collection) {
        collection.coverUrl = getFirebaseStorageUrl(collection.coverUrl) || collection.coverUrl
      }
      setSelectedContent(collection)
      return collection
    } catch (error) {
      showError("Error while fetching collection details", error)
      return null
    } finally {
      setLoading(false)
    }
  }, [showError])

  const blockContent = useCallback(async (contentId: string, data: UpdateBlockStatusRequest) => {
    setLoading(true)
    try {
      await api.updateContentBlockStatus(contentId, { ...data, blocked: true })
      showSuccess("Content blocked successfully")
      
      // Update the content in the local list immediately for instant UI feedback
      if (catalogData?.content) {
        const updatedContent = catalogData.content.map(item => 
          item.id === contentId ? { ...item, blockedByAdmin: true, effectiveState: "BLOCKED_ADMIN" as const } : item
        )
        setCatalogData({
          ...catalogData,
          content: updatedContent
        })
      }
      
      // Refresh the list from the server to ensure consistency
      await fetchCatalogContent(currentFilters)
      return true
    } catch (error) {
      showError("Error while blocking content", error)
      return false
    } finally {
      setLoading(false)
    }
  }, [showError, showSuccess, fetchCatalogContent, catalogData, currentFilters])

  const unblockContent = useCallback(async (contentId: string, notes?: string) => {
    setLoading(true)
    try {
      await api.updateContentBlockStatus(contentId, { blocked: false, notes })
      showSuccess("Content unblocked successfully")
      
      // Update the content in the local list immediately for instant UI feedback
      if (catalogData?.content) {
        const updatedContent = catalogData.content.map(item => 
          item.id === contentId ? { ...item, blockedByAdmin: false } : item
        )
        setCatalogData({
          ...catalogData,
          content: updatedContent
        })
      }
      
      // Refresh the list from the server to ensure consistency
      await fetchCatalogContent(currentFilters)
      return true
    } catch (error) {
      showError("Error while unblocking content", error)
      return false
    } finally {
      setLoading(false)
    }
  }, [showError, showSuccess, fetchCatalogContent, catalogData, currentFilters])

  return {
    loading,
    catalogData,
    selectedContent,
    setSelectedContent,
    fetchCatalogContent,
    fetchSongDetail,
    fetchCollectionDetail,
    blockContent,
    unblockContent,
  }
}
