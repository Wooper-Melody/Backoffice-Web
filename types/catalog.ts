// Types for Catalog Management API based on OpenAPI schema

export type ContentType = "SONG" | "ALBUM" | "EP" | "SINGLE" | "PLAYLIST"
export type EffectiveState = "BLOCKED_ADMIN" | "NOT_AVAILABLE_REGION" | "SCHEDULED" | "PUBLISHED"

export interface ContentAdminResponse {
  id: string
  type: ContentType
  contentType?: "SONG" | "COLLECTION"
  collectionType?: "ALBUM" | "EP" | "SINGLE" | "PLAYLIST"
  title: string
  primaryArtistName: string
  primaryArtistId: string
  collectionTitle?: string
  collectionId?: string
  releaseDate?: string
  scheduledAt?: string
  effectiveState: EffectiveState
  hasVideo?: boolean
  explicit?: boolean
  coverUrl?: string
  durationSeconds?: number
  blockedByAdmin: boolean
  createdAt: string
  updatedAt: string
}

export interface CatalogFilters {
  search?: string
  contentType?: ContentType
  effectiveState?: EffectiveState
  hasVideo?: boolean
  releaseDateFrom?: string
  releaseDateTo?: string
  region?: string
  page?: number
  size?: number
}

export interface CatalogPageData {
  content: ContentAdminResponse[]
  totalElements: number
  totalPages: number
  currentPage: number
  pageSize: number
  first: boolean
  last: boolean
  empty: boolean
}

export interface UpdateBlockStatusRequest {
  blocked: boolean
  reason?: string
  notes?: string
}

export interface RegionalStateInfo {
  region: string
  state: EffectiveState
  reason?: string
}

export interface AvailabilityDetailResponse {
  effectiveState: EffectiveState
  blockedByAdmin: boolean
  blockedRegions: string[]
  scheduledDate?: string
  regionalStates: RegionalStateInfo[]
}

export interface AuditEvent {
  eventId: string
  timestamp: string
  eventType: string
  performedBy: string
  performedByUsername: string
  scope?: string
  region?: string
  details?: string
}

export interface AuditResponse {
  events: AuditEvent[]
}

export interface SongDetailAdminResponse extends ContentAdminResponse {
  durationSeconds: number
  collaboratorIds?: string[]
  collectionType?: "ALBUM" | "EP" | "SINGLE" | "PLAYLIST"
  positionInCollection?: number
  storageReference?: string
  genres?: string[]
  moods?: string[]
  likesCount?: number
  deleted: boolean
}

export interface SongInCollectionInfo {
  songId: string
  title: string
  durationSeconds: number
  positionInCollection: number
  hasVideo: boolean
  explicit: boolean
}

export interface CollectionDetailAdminResponse extends ContentAdminResponse {
  type: "ALBUM" | "EP" | "SINGLE" | "PLAYLIST"
  ownerId?: string
  ownerName?: string
  isPrivate?: boolean
  songs: SongInCollectionInfo[]
  totalDurationSeconds: number
  likesCount?: number
  deleted: boolean
}
