// Types for User Management API based on OpenAPI schema

export interface UserAdminResponse {
  id: string
  email: string
  username: string
  role: "LISTENER" | "ARTIST" | "ADMIN" | "UNDECLARED"
  isBlocked: boolean
  firstName?: string
  lastName?: string
  phoneNumber?: string
  address?: string
  profilePictureUrl?: string
  followersCount: number
  followingCount: number
  bio?: string
  createdAt: string
  contentFilterEnabled: boolean
  lastLogin?: string
}

export interface CreateUserRequest {
  email: string
  password: string
  username: string
  isBlocked?: boolean
  firstName?: string
  lastName?: string
  phoneNumber?: string
  address?: string
  profilePictureUrl?: string
  biography?: string
  contentFilterEnabled?: boolean
}

export interface UpdateUserRequest {
  email?: string
  username?: string
  isBlocked?: boolean
  firstName?: string
  lastName?: string
  phoneNumber?: string
  address?: string
  profilePictureUrl?: string
  biography?: string
  contentFilterEnabled?: boolean
}

export interface UpdateUserStatusRequest {
  isBlocked: boolean
}

export interface PageableObject {
  paged: boolean
  pageSize: number
  unpaged: boolean
  pageNumber: number
  offset: number
  sort: SortObject
}

export interface SortObject {
  sorted: boolean
  unsorted: boolean
  empty: boolean
}

export interface Page<T> {
  totalElements: number
  totalPages: number
  pageable: PageableObject
  numberOfElements: number
  size: number
  content: T[]
  number: number
  sort: SortObject
  first: boolean
  last: boolean
  empty: boolean
}

export interface ErrorDetail {
  errorType: string
}

export interface ErrorResponse {
  type: string
  title: string
  status: number
  detail: string
  instance: string
  errors?: ErrorDetail[]
}

export interface UsersFilters {
  search?: string
  role?: string
  status?: string // Frontend uses 'all', 'blocked', 'active' - mapped to isBlocked boolean in API
  page?: number
  size?: number
}

export interface UsersPageData {
  users: UserAdminResponse[]
  totalElements: number
  totalPages: number
  currentPage: number
  pageSize: number
  first: boolean
  last: boolean
  empty: boolean
}

// User Metrics Types
export type MetricPeriod = "LAST_DAY" | "LAST_WEEK" | "LAST_MONTH"

export interface RegionalMetric {
  region: string
  count: number
}

export interface TotalUsersMetrics {
  totalUsers: number
  regionalBreakdown: RegionalMetric[]
  changePercentage: number
}

export interface RoleMetric {
  role: "LISTENER" | "ARTIST" | "ADMIN" | "UNDECLARED"
  count: number
}

export interface RoleRegionalMetric {
  role: "LISTENER" | "ARTIST" | "ADMIN" | "UNDECLARED"
  region: string
  count: number
}

export interface RoleDistributionMetrics {
  totalRoleDistribution: RoleMetric[]
  regionalRoleDistribution: RoleRegionalMetric[]
  changePercentage: number
}

export interface RecentSignUp {
  id: string
  username: string
  email: string
  createdAt: string
}

export interface RecentSignUpsMetrics {
  lastArtist: RecentSignUp | null
  lastListener: RecentSignUp | null
}

export interface NewSignUpsMetrics {
  newSignUps: number
  changePercentage: number
}

export interface BlockedUsersMetrics {
  totalBlockedUsers: number
  regionalBreakdown: RegionalMetric[]
  changePercentage: number
}

export interface ActiveUsersMetrics {
  activeUsers: number
  changePercentage: number
}