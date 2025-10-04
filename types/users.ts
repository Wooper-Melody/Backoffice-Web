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
  status?: string
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