// API client for Melody backoffice

// Types for User Management API
import type {
  UserAdminResponse,
  CreateUserRequest,
  UpdateUserRequest,
  Page,
  UsersFilters,
  UsersPageData
} from "@/types/users"

import type {
  AuthResponse,
  RefreshTokenRequest,
  LoginRequest,
  AuthTokens
} from "@/types/auth"

// Configure API base URL with validation
function getApiBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL
  
  if (!url) {
    console.warn('NEXT_PUBLIC_API_URL is not set, using local fallback')
    return '/api'
  }
  
  // Validate that the URL is valid
  try {
    new URL(url)
    return url
  } catch (error) {
    console.error('NEXT_PUBLIC_API_URL is not a valid URL:', url)
    return '/api'
  }
}

export const API_BASE_URL = getApiBaseUrl()

// Development logging
if (process.env.NODE_ENV === 'development') {
  console.log('API Base URL set to:', API_BASE_URL)
}

export interface CatalogItem {
  id: string
  type: "Song" | "Collection"
  title: string
  artist: string
  collection?: string
  publishDate: string
  status: "Published" | "Scheduled" | "Unavailable-region" | "Blocked-admin"
  hasVideo: boolean
  duration: string
  cover?: string
  explicit?: boolean
  genres?: string[]
  isrc?: string
  label?: string
}

export interface AvailabilityPolicy {
  id: string
  contentId: string
  type: "allow" | "deny"
  regions: string[]
  schedule?: {
    startDate?: Date
    endDate?: Date
    startTime?: string
    endTime?: string
  }
}

export interface BlockAction {
  contentId: string
  scope: "global" | "regions"
  regions?: string[]
  reasonCode: string
  additionalNotes?: string
}

export interface MetricsData {
  users: {
    total: number
    activeDaily: number
    activeMonthly: number
    newRegistrations: number
    retention: number[]
  }
  content: {
    totalSongs: number
    totalAlbums: number
    totalPlays: number
    averageEngagement: number
  }
  artists: {
    id: string
    name: string
    monthlyListeners: number
    followers: number
    plays: number
    likes: number
    shares: number
  }[]
}

class ApiClient {
  private refreshPromise: Promise<AuthTokens> | null = null

  private isTokenExpiringSoon(): boolean {
    if (typeof window === 'undefined') return false
    
    try {
      const expiresAt = sessionStorage.getItem('admin_expires_at')
      if (!expiresAt) return false
      
      const timeUntilExpiry = parseInt(expiresAt) - Date.now()
      const fiveMinutesInMs = 5 * 60 * 1000
      return timeUntilExpiry <= fiveMinutesInMs
    } catch (e) {
      return false
    }
  }

  private async refreshToken(): Promise<AuthTokens> {
    // Prevent multiple simultaneous refresh attempts
    if (this.refreshPromise) {
      return this.refreshPromise
    }

    this.refreshPromise = this._performTokenRefresh()

    try {
      const result = await this.refreshPromise
      return result
    } finally {
      this.refreshPromise = null
    }
  }

  private async _performTokenRefresh(): Promise<AuthTokens> {
    const refreshToken = sessionStorage.getItem('admin_refresh_token')
    
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    try {
      const response = await fetch('/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      })

      if (!response.ok) {
        throw new Error(`Refresh failed: ${response.status}`)
      }

      const authResponse: AuthResponse = await response.json()
      
      // Update stored tokens
      sessionStorage.setItem('admin_token', authResponse.token)
      sessionStorage.setItem('admin_refresh_token', authResponse.refreshToken)
      sessionStorage.setItem('admin_user', JSON.stringify(authResponse.user))

      // Dispatch custom event to notify auth context of token update
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('tokenRefreshed', {
          detail: {
            token: authResponse.token,
            refreshToken: authResponse.refreshToken,
            user: authResponse.user,
            expiresIn: authResponse.expiresIn
          }
        }))
      }

      return {
        accessToken: authResponse.token,
        refreshToken: authResponse.refreshToken,
        expiresIn: authResponse.expiresIn
      }
    } catch (error) {
      // Clear invalid tokens
      sessionStorage.removeItem('admin_token')
      sessionStorage.removeItem('admin_refresh_token')
      sessionStorage.removeItem('admin_user')
      
      // Redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
      
      throw error
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    // Check if token is expiring soon and refresh proactively
    if (typeof window !== 'undefined' && 
        endpoint.indexOf('/auth/login') === -1 && 
        endpoint.indexOf('/auth/refresh') === -1 &&
        this.isTokenExpiringSoon()) {
      
      try {
        await this.refreshToken()
      } catch (error) {
        // If proactive refresh fails, continue with request and let reactive refresh handle it
        console.warn('Proactive token refresh failed, falling back to reactive refresh:', error)
      }
    }

    const makeRequest = async (useRefreshedToken = false): Promise<T> => {
      // If running in the browser and API_BASE_URL points to a different origin,
      // use a relative path so the request goes to the Next server (which will proxy
      // to the external API via rewrites). This avoids CORS in development.
      let url: string
      if (typeof window !== 'undefined') {
        try {
          const apiOrigin = new URL(API_BASE_URL).origin
          const currentOrigin = window.location.origin
          if (apiOrigin !== currentOrigin) {
            // Use relative endpoint to hit Next server which will proxy
            url = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
          } else {
            url = `${API_BASE_URL}${endpoint}`
          }
        } catch (e) {
          // If API_BASE_URL isn't a valid URL, fallback to relative
          url = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
        }
      } else {
        // On server side, use absolute API base
        url = `${API_BASE_URL}${endpoint}`
      }

      const config: RequestInit = {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      }

      // Inject admin token into requests as x-access-token when running in the browser
      // Do not attach for the login and refresh routes to avoid sending empty/old tokens
      try {
        if (typeof window !== "undefined" && 
            endpoint.indexOf('/auth/login') === -1 && 
            endpoint.indexOf('/auth/refresh') === -1) {
          const adminToken = sessionStorage.getItem('admin_token')
          if (adminToken) {
            // Prefer x-access-token as required by backend, but keep existing Authorization if present
            ;(config.headers as Record<string, string>)['x-access-token'] = adminToken
          }
        }
      } catch (e) {
        // sessionStorage may throw in some strict environments; fail silently and continue
        if (process.env.NODE_ENV === 'development') {
          console.warn('Could not read admin_token from sessionStorage', e)
        }
      }

      try {
        const response = await fetch(url, config)

        if (!response.ok) {
          const errorData = await response.text().catch(() => 'Unknown error')
          
          // If we get a 401 Unauthorized error and haven't already tried refreshing the token
          if (response.status === 401 && !useRefreshedToken && 
              endpoint.indexOf('/auth/login') === -1 && 
              endpoint.indexOf('/auth/refresh') === -1) {
            
            try {
              // Attempt to refresh the token
              await this.refreshToken()
              // Retry the original request with the new token
              return makeRequest(true)
            } catch (refreshError) {
              // Token refresh failed, throw the original 401 error
              throw new Error(`API Error [${response.status}]: ${response.statusText} - ${errorData}`)
            }
          }
          
          throw new Error(`API Error [${response.status}]: ${response.statusText} - ${errorData}`)
        }

        // Handle empty responses
        const contentType = response.headers.get('content-type')
        if (contentType && contentType.includes('application/json')) {
          return response.json()
        } else {
          return response.text() as unknown as T
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('API request error:', {
            url,
            error: error instanceof Error ? error.message : error,
            config
          })
        }
        throw error
      }
    }

    return makeRequest()
  }

  // Auth API
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    })
  }

  async refreshAccessToken(refreshTokenRequest: RefreshTokenRequest): Promise<AuthResponse> {
    return this.request("/auth/refresh", {
      method: "POST",
      body: JSON.stringify(refreshTokenRequest),
    })
  }

  async logout(): Promise<void> {
    return this.request("/auth/logout", {
      method: "POST",
    })
  }

  // Catalog API
  async getCatalogItems(params?: {
    search?: string
    type?: string
    status?: string
    page?: number
    limit?: number
  }): Promise<{ items: CatalogItem[]; total: number }> {
    const searchParams = new URLSearchParams()
    if (params?.search) searchParams.set("search", params.search)
    if (params?.type) searchParams.set("type", params.type)
    if (params?.status) searchParams.set("status", params.status)
    if (params?.page) searchParams.set("page", params.page.toString())
    if (params?.limit) searchParams.set("limit", params.limit.toString())

    return this.request(`/catalog?${searchParams}`)
  }

  async getCatalogItem(id: string): Promise<CatalogItem> {
    return this.request(`/catalog/${id}`)
  }

  async updateCatalogItem(id: string, data: Partial<CatalogItem>): Promise<CatalogItem> {
    return this.request(`/catalog/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  // Availability API
  async getAvailabilityPolicies(contentId: string): Promise<AvailabilityPolicy[]> {
    return this.request(`/availability/${contentId}`)
  }

  async createAvailabilityPolicy(policy: Omit<AvailabilityPolicy, "id">): Promise<AvailabilityPolicy> {
    return this.request("/availability", {
      method: "POST",
      body: JSON.stringify(policy),
    })
  }

  async updateAvailabilityPolicy(id: string, policy: Partial<AvailabilityPolicy>): Promise<AvailabilityPolicy> {
    return this.request(`/availability/${id}`, {
      method: "PUT",
      body: JSON.stringify(policy),
    })
  }

  async deleteAvailabilityPolicy(id: string): Promise<void> {
    return this.request(`/availability/${id}`, {
      method: "DELETE",
    })
  }

  // Blocking API
  async blockContent(action: BlockAction): Promise<void> {
    return this.request("/content/block", {
      method: "POST",
      body: JSON.stringify(action),
    })
  }

  async unblockContent(contentId: string, notes?: string): Promise<void> {
    return this.request("/content/unblock", {
      method: "POST",
      body: JSON.stringify({ contentId, notes }),
    })
  }

  // Metrics API
  async getMetrics(timeRange = "30d"): Promise<MetricsData> {
    return this.request(`/metrics?timeRange=${timeRange}`)
  }

  async getUserMetrics(timeRange = "30d"): Promise<MetricsData["users"]> {
    return this.request(`/metrics/users?timeRange=${timeRange}`)
  }

  async getContentMetrics(timeRange = "30d"): Promise<MetricsData["content"]> {
    return this.request(`/metrics/content?timeRange=${timeRange}`)
  }

  async getArtistMetrics(artistId?: string, timeRange = "30d"): Promise<MetricsData["artists"]> {
    const params = new URLSearchParams({ timeRange })
    if (artistId) params.set("artistId", artistId)
    return this.request(`/metrics/artists?${params}`)
  }

  // Audit API
  async getAuditLog(contentId: string): Promise<any[]> {
    return this.request(`/audit/${contentId}`)
  }

  // Users Admin API
  async getAllUsers(filters?: UsersFilters): Promise<UsersPageData> {
    const searchParams = new URLSearchParams()
    if (filters?.page !== undefined) searchParams.set("page", filters.page.toString())
    if (filters?.size !== undefined) searchParams.set("size", filters.size.toString())
    if (filters?.search) searchParams.set("search", filters.search)
    if (filters?.role && filters.role !== "all") searchParams.set("role", filters.role)
    if (filters?.status && filters.status !== "all") {
      // Map frontend status values to API isBlocked boolean
      const isBlocked = filters.status === "blocked"
      searchParams.set("isBlocked", isBlocked.toString())
    }

    const response: Page<UserAdminResponse> = await this.request(`/users/admin?${searchParams}`)
    
    return {
      users: response.content,
      totalElements: response.totalElements,
      totalPages: response.totalPages,
      currentPage: response.number,
      pageSize: response.size,
      first: response.first,
      last: response.last,
      empty: response.empty
    }
  }

  async getUserById(userId: string): Promise<UserAdminResponse> {
    return this.request(`/users/admin/${userId}`)
  }

  async createUser(userData: CreateUserRequest): Promise<UserAdminResponse> {
    return this.request("/users/admin", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  }

  async updateUser(userId: string, userData: UpdateUserRequest): Promise<UserAdminResponse> {
    return this.request(`/users/admin/${userId}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    })
  }

  async blockUser(userId: string): Promise<UserAdminResponse> {
    return this.request(`/users/admin/${userId}/block`, {
      method: "POST",
    })
  }

  async unblockUser(userId: string): Promise<UserAdminResponse> {
    return this.request(`/users/admin/${userId}/unblock`, {
      method: "POST",
    })
  }

  async deleteUser(userId: string): Promise<void> {
    return this.request(`/users/admin/${userId}`, {
      method: "DELETE",
    })
  }
}

export const api = new ApiClient()
