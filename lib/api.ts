// API client for Melody backoffice

// Types for User Management API
import type {
  UserAdminResponse,
  CreateUserRequest,
  UpdateUserRequest,
  Page,
  UsersFilters,
  UsersPageData,
  MetricPeriod,
  TotalUsersMetrics,
  RoleDistributionMetrics,
  RecentSignUpsMetrics,
  NewSignUpsMetrics,
  BlockedUsersMetrics,
  ActiveUsersMetrics
} from "@/types/users"

import type {
  AuthResponse,
  RefreshTokenRequest,
  LoginRequest,
  AuthTokens
} from "@/types/auth"

import type {
  ContentAdminResponse,
  CatalogFilters,
  CatalogPageData,
  UpdateBlockStatusRequest,
  UpdateContentAvailabilityRequest,
  AvailabilityDetailResponse,
  AuditResponse,
  SongDetailAdminResponse,
  CollectionDetailAdminResponse
} from "@/types/catalog"

// Configure API base URLs based on environment
function getApiBaseUrls() {
  const env = process.env.NODE_ENV || 'production'
  // Allow forcing the use of the API gateway even when Next is running in dev mode.
  // Next's dev server forces NODE_ENV to 'development' so setting NODE_ENV in
  // `.env.local` won't change that when running `next dev`. Use one of the
  // override variables below to force gateway behavior during development:
  // - NEXT_PUBLIC_USE_GATEWAY=true
  // - NEXT_PUBLIC_FORCE_PROD=true
  const forceGateway = (process.env.NEXT_PUBLIC_USE_GATEWAY === 'true') || (process.env.NEXT_PUBLIC_FORCE_PROD === 'true')

  console.log(`API Client running in ${env} mode (forceGateway=${forceGateway})`)

  // If we're in development and the user didn't request the gateway, use local
  // service URLs (defaults provided). If forceGateway is true, fallthrough
  // to use NEXT_PUBLIC_API_URL as if in production.
  if (env === 'development' && !forceGateway) {
    return {
      users: process.env.USER_SERVICE || 'http://localhost:8080',
      catalog: process.env.CATALOG_SERVICE || 'http://localhost:30003',
      auth: process.env.AUTH_SERVICE || 'http://localhost:8080', // Auth is part of users service
    }
  }

  // Production/Staging or forced-gateway mode - use API Gateway URL
  const gatewayUrl = process.env.NEXT_PUBLIC_API_URL
  if (!gatewayUrl) {
    throw new Error('NEXT_PUBLIC_API_URL environment variable is required for production or when NEXT_PUBLIC_USE_GATEWAY is enabled')
  }

  // Validate that the URL is valid and normalize it
  try {
    new URL(gatewayUrl)
    const baseUrl = gatewayUrl.replace(/\/$/, '')
    return {
      users: baseUrl,
      catalog: baseUrl,
      auth: baseUrl,
    }
  } catch (error) {
    throw new Error(`NEXT_PUBLIC_API_URL is not a valid URL: ${gatewayUrl}`)
  }
}

export const API_BASE_URLS = getApiBaseUrls()

// Legacy export for backward compatibility
export const API_BASE_URL = API_BASE_URLS.users

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
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
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
            user: authResponse.user
          }
        }))
      }

      return {
        accessToken: authResponse.token,
        refreshToken: authResponse.refreshToken
      }
    } catch (error) {
      console.error('Token refresh failed:', error)
      // Clear invalid tokens
      sessionStorage.removeItem('admin_token')
      sessionStorage.removeItem('admin_refresh_token')
      sessionStorage.removeItem('admin_user')
      
      // Notify auth context to logout
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('authLogout'))
      }
      
      throw error
    }
  }

  private getServiceUrl(endpoint: string): string {
    // Determine which service to use based on the endpoint
    if (endpoint.startsWith('/catalog/')) {
      return API_BASE_URLS.catalog
    } else if (endpoint.startsWith('/auth/')) {
      return API_BASE_URLS.auth
    } else if (endpoint.startsWith('/users/')) {
      return API_BASE_URLS.users
    } else {
      // Default to users service for other endpoints
      return API_BASE_URLS.users
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const makeRequest = async (useRefreshedToken = false): Promise<T> => {
      // Determine the base URL based on the endpoint
      const baseUrl = this.getServiceUrl(endpoint)
      
      // Build full URL
      const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`

      if (process.env.NODE_ENV === 'development') {
        console.log('API Request:', { endpoint, baseUrl, finalUrl: url })
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
          let errorMessage = 'Unknown error'
          
          try {
            const errorData = await response.text()
            // Try to parse as JSON to extract the detail field
            const errorJson = JSON.parse(errorData)
            errorMessage = errorJson.detail || errorJson.message || errorData || 'Unknown error'
          } catch (parseError) {
            // If not JSON, use the raw text
            errorMessage = await response.text().catch(() => 'Unknown error')
          }

          // If we get a 401 Unauthorized error and haven't already tried refreshing the token
          if (response.status === 401 && !useRefreshedToken && 
              endpoint.indexOf('/auth/login') === -1 && 
              endpoint.indexOf('/auth/refresh') === -1) {
            
            console.log('Received 401, attempting token refresh...')
            try {
              // Attempt to refresh the token
              await this.refreshToken()
              // Retry the original request with the new token
              console.log('Token refreshed, retrying original request...')
              return makeRequest(true)
            } catch (refreshError) {
              console.error('Token refresh failed, request will fail with 401:', refreshError)
              // Token refresh failed, throw the original 401 error
              throw new Error(errorMessage)
            }
          }
          
          throw new Error(errorMessage)
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

  // Catalog Admin API
  async getAllCatalogContent(filters?: CatalogFilters): Promise<CatalogPageData> {
    const searchParams = new URLSearchParams()
    if (filters?.page !== undefined) searchParams.set("page", filters.page.toString())
    if (filters?.size !== undefined) searchParams.set("size", filters.size.toString())
    if (filters?.search) searchParams.set("search", filters.search)
    if (filters?.contentType) searchParams.set("contentType", filters.contentType)
    if (filters?.effectiveState) searchParams.set("effectiveState", filters.effectiveState)
    if (filters?.hasVideo !== undefined) searchParams.set("hasVideo", filters.hasVideo.toString())
    if (filters?.releaseDateFrom) searchParams.set("releaseDateFrom", filters.releaseDateFrom)
    if (filters?.releaseDateTo) searchParams.set("releaseDateTo", filters.releaseDateTo)
    if (filters?.region) searchParams.set("region", filters.region)

    const response: any = await this.request(`/catalog/admin?${searchParams}`)
    
    return {
      content: response.content,
      totalElements: response.totalElements,
      totalPages: response.totalPages,
      currentPage: response.number,
      pageSize: response.size,
      first: response.first,
      last: response.last,
      empty: response.empty
    }
  }

  async getSongDetail(songId: string): Promise<SongDetailAdminResponse> {
    return this.request(`/catalog/admin/songs/${songId}`)
  }

  async getCollectionDetail(collectionId: string): Promise<CollectionDetailAdminResponse> {
    return this.request(`/catalog/admin/collections/${collectionId}`)
  }

  async getContentAvailabilityDetail(contentId: string, contentType: "SONG" | "COLLECTION"): Promise<AvailabilityDetailResponse> {
    return this.request(`/catalog/admin/${contentId}/availability?contentType=${contentType}`)
  }

  async updateContentBlockStatus(contentId: string, contentType: "SONG" | "COLLECTION", data: UpdateBlockStatusRequest): Promise<void> {
    return this.request(`/catalog/admin/${contentId}/block?contentType=${contentType}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  }

  async updateContentAvailability(contentId: string, contentType: "SONG" | "COLLECTION", data: UpdateContentAvailabilityRequest): Promise<void> {
    return this.request(`/catalog/admin/${contentId}/availability?contentType=${contentType}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  }

  async getContentAuditTrail(contentId: string, contentType: "SONG" | "COLLECTION" = "SONG", page = 0, size = 10): Promise<AuditResponse> {
    return this.request(`/catalog/admin/${contentId}/audit?contentType=${contentType}&page=${page}&size=${size}`)
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

  // User Metrics Admin API
  async getTotalUsersMetrics(period: MetricPeriod): Promise<TotalUsersMetrics> {
    return this.request(`/users/admin/metrics/total-users?period=${period}`)
  }

  async getRoleDistributionMetrics(period: MetricPeriod): Promise<RoleDistributionMetrics> {
    return this.request(`/users/admin/metrics/role-distribution?period=${period}`)
  }

  async getRecentSignUpsMetrics(): Promise<RecentSignUpsMetrics> {
    return this.request("/users/admin/metrics/recent-signups")
  }

  async getNewSignUpsMetrics(period: MetricPeriod): Promise<NewSignUpsMetrics> {
    return this.request(`/users/admin/metrics/new-signups?period=${period}`)
  }

  async getBlockedUsersMetrics(period: MetricPeriod): Promise<BlockedUsersMetrics> {
    return this.request(`/users/admin/metrics/blocked-users?period=${period}`)
  }

  async getActiveUsersMetrics(period: MetricPeriod): Promise<ActiveUsersMetrics> {
    return this.request(`/users/admin/metrics/active-users?period=${period}`)
  }
}

export const api = new ApiClient()
