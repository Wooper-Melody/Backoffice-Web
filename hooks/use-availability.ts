"use client"

import useSWR from "swr"
import { api, type AvailabilityPolicy } from "@/lib/api"

export function useAvailability(contentId: string) {
  const { data, error, isLoading, mutate } = useSWR(
    contentId ? ["availability", contentId] : null,
    () => api.getAvailabilityPolicies(contentId),
    {
      revalidateOnFocus: false,
    },
  )

  const createPolicy = async (policy: Omit<AvailabilityPolicy, "id">) => {
    try {
      const created = await api.createAvailabilityPolicy(policy)
      mutate() // Revalidate data
      return created
    } catch (error) {
      throw error
    }
  }

  const updatePolicy = async (id: string, updates: Partial<AvailabilityPolicy>) => {
    try {
      const updated = await api.updateAvailabilityPolicy(id, updates)
      mutate() // Revalidate data
      return updated
    } catch (error) {
      throw error
    }
  }

  const deletePolicy = async (id: string) => {
    try {
      await api.deleteAvailabilityPolicy(id)
      mutate() // Revalidate data
    } catch (error) {
      throw error
    }
  }

  return {
    policies: data || [],
    isLoading,
    error,
    createPolicy,
    updatePolicy,
    deletePolicy,
    refresh: mutate,
  }
}
