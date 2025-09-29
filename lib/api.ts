// API client for Melody backoffice

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

const API_BASE_URL = getApiBaseUrl()

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
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        const errorData = await response.text().catch(() => 'Unknown error')
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
}

export const api = new ApiClient()
