"use client"

import { useState, useEffect, useCallback } from "react"
import { api } from "@/lib/api"
import { getFirebaseStorageUrl } from "@/lib/storage"
import { useToast } from "@/hooks/use-toast"
import type {
  UserAdminResponse,
  CreateUserRequest,
  UpdateUserRequest,
  UsersFilters,
  UsersPageData
} from "@/types/users"

export function useUsers() {
  const [loading, setLoading] = useState(false)
  const [usersData, setUsersData] = useState<UsersPageData | null>(null)
  const [selectedUser, setSelectedUser] = useState<UserAdminResponse | null>(null)
  const [currentFilters, setCurrentFilters] = useState<UsersFilters>()
  const { toast } = useToast()

  const showError = useCallback((message: string, error?: any) => {
    console.error("Users API error:", error)

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

  const fetchUsers = useCallback(async (filters?: UsersFilters) => {
    setLoading(true)
    try {
      const data = await api.getAllUsers(filters)
      // Normalizar profilePictureUrl para cada usuario
      if (data?.users) {
        data.users = data.users.map(u => ({
          ...u,
          profilePictureUrl: getFirebaseStorageUrl(u.profilePictureUrl) || u.profilePictureUrl
        }))
      }
      setUsersData(data)
      // Store the filters for future refreshes
      if (filters) {
        setCurrentFilters(filters)
      }
    } catch (error) {
      showError("Error while fetching users", error)
    } finally {
      setLoading(false)
    }
  }, [showError])

  const fetchUser = useCallback(async (userId: string) => {
    setLoading(true)
    try {
      const user = await api.getUserById(userId)
      // Normalizar profilePictureUrl
      if (user) {
        user.profilePictureUrl = getFirebaseStorageUrl(user.profilePictureUrl) || user.profilePictureUrl
      }
      setSelectedUser(user)
      return user
    } catch (error) {
      showError("Error while fetching user", error)
      return null
    } finally {
      setLoading(false)
    }
  }, [showError])

  const createUser = useCallback(async (userData: CreateUserRequest) => {
    setLoading(true)
    try {
      const newUser = await api.createUser(userData)
      showSuccess("User created successfully")
      // Refresh the list
      await fetchUsers(currentFilters)
      return true
    } catch (error) {
      showError("Error while creating user", error)
      return false
    } finally {
      setLoading(false)
    }
  }, [showError, showSuccess, fetchUsers, currentFilters])

  const updateUser = useCallback(async (userId: string, userData: UpdateUserRequest) => {
    setLoading(true)
    try {
      const updatedUser = await api.updateUser(userId, userData)
      showSuccess("User updated successfully")
      // Update the selected user if it's the same
      if (selectedUser?.id === userId) {
        setSelectedUser(updatedUser)
      }
      // Refresh the list
      await fetchUsers(currentFilters)
      return true
    } catch (error) {
      showError("Error while updating user", error)
      return false
    } finally {
      setLoading(false)
    }
  }, [showError, showSuccess, fetchUsers, selectedUser, currentFilters])

  const blockUser = useCallback(async (userId: string) => {
    setLoading(true)
    try {
      const blockedUser = await api.blockUser(userId)
      showSuccess("User blocked successfully")
      
      // Update the selected user if it's the same
      if (selectedUser?.id === userId) {
        setSelectedUser(blockedUser)
      }
      
      // Update the user in the local list immediately for instant UI feedback
      if (usersData?.users) {
        const updatedUsers = usersData.users.map(user => 
          user.id === userId ? { ...user, isBlocked: true } : user
        )
        setUsersData({
          ...usersData,
          users: updatedUsers
        })
      }
      
      // Refresh the list from the server to ensure consistency
      await fetchUsers(currentFilters)
      return true
    } catch (error) {
      showError("Error while blocking user", error)
      return false
    } finally {
      setLoading(false)
    }
  }, [showError, showSuccess, fetchUsers, selectedUser, usersData, currentFilters])

  const unblockUser = useCallback(async (userId: string) => {
    setLoading(true)
    try {
      const unblockedUser = await api.unblockUser(userId)
      showSuccess("User unblocked successfully")
      
      // Update the selected user if it's the same
      if (selectedUser?.id === userId) {
        setSelectedUser(unblockedUser)
      }
      
      // Update the user in the local list immediately for instant UI feedback
      if (usersData?.users) {
        const updatedUsers = usersData.users.map(user => 
          user.id === userId ? { ...user, isBlocked: false } : user
        )
        setUsersData({
          ...usersData,
          users: updatedUsers
        })
      }
      
      // Refresh the list from the server to ensure consistency
      await fetchUsers(currentFilters)
      return true
    } catch (error) {
      showError("Error while unblocking user", error)
      return false
    } finally {
      setLoading(false)
    }
  }, [showError, showSuccess, fetchUsers, selectedUser, usersData, currentFilters])

  const deleteUser = useCallback(async (userId: string) => {
    setLoading(true)
    try {
      await api.deleteUser(userId)
      showSuccess("User deleted successfully")
      // Clear selected user if it was deleted
      if (selectedUser?.id === userId) {
        setSelectedUser(null)
      }
      // Refresh the list
      await fetchUsers(currentFilters)
      return true
    } catch (error) {
      showError("Error while deleting user", error)
      return false
    } finally {
      setLoading(false)
    }
  }, [showError, showSuccess, fetchUsers, selectedUser, currentFilters])

  return {
    loading,
    usersData,
    selectedUser,
    setSelectedUser,
    fetchUsers,
    fetchUser,
    createUser,
    updateUser,
    blockUser,
    unblockUser,
    deleteUser,
  }
}