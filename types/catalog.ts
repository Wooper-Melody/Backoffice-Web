// Types for Catalog Management API based on OpenAPI schema

export type ContentType = "SONG" | "ALBUM" | "EP" | "SINGLE" | "PLAYLIST"
export type EffectiveState = "BLOCKED_ADMIN" | "NOT_AVAILABLE_REGION" | "DRAFT" | "SCHEDULED" | "PUBLISHED"

export type BlockReason =
  | "COPYRIGHT_VIOLATION"
  | "INAPPROPRIATE_CONTENT"
  | "COMMUNITY_GUIDELINES_VIOLATION"
  | "SPAM_OR_MISLEADING"
  | "LEGAL_REQUEST"
  | "LICENSING_ISSUE"
  | "ARTIST_REQUEST"
  | "QUALITY_STANDARDS"
  | "OTHER"

export const BLOCK_REASON_LABELS: Record<BlockReason, string> = {
  COPYRIGHT_VIOLATION: "Copyright Violation",
  INAPPROPRIATE_CONTENT: "Inappropriate Content",
  COMMUNITY_GUIDELINES_VIOLATION: "Community Guidelines Violation",
  SPAM_OR_MISLEADING: "Spam or Misleading",
  LEGAL_REQUEST: "Legal Request",
  LICENSING_ISSUE: "Licensing Issue",
  ARTIST_REQUEST: "Artist Request",
  QUALITY_STANDARDS: "Quality Standards",
  OTHER: "Other"
}

export type Genre = 
  | "ROCK"
  | "ALTERNATIVE_ROCK"
  | "INDIE_ROCK"
  | "HARD_ROCK"
  | "PUNK_ROCK"
  | "POP"
  | "INDIE_POP"
  | "ELECTROPOP"
  | "SYNTHPOP"
  | "ELECTRONIC"
  | "HOUSE"
  | "TECHNO"
  | "DUBSTEP"
  | "AMBIENT"
  | "HIP_HOP"
  | "RAP"
  | "TRAP"
  | "R_AND_B"
  | "REGGAETON"
  | "LATIN_POP"
  | "SALSA"
  | "BACHATA"
  | "JAZZ"
  | "BLUES"
  | "COUNTRY"
  | "FOLK"
  | "CLASSICAL"
  | "SOUNDTRACK"
  | "OTHER"

export type Mood = 
  | "ENERGETIC"
  | "CALM"
  | "RELAXED"
  | "INTENSE"
  | "HAPPY"
  | "SAD"
  | "ROMANTIC"
  | "MELANCHOLIC"
  | "NOSTALGIC"
  | "HOPEFUL"
  | "WORKOUT"
  | "PARTY"
  | "STUDY"
  | "SLEEP"
  | "DRIVING"
  | "FOCUS"
  | "DARK"
  | "UPLIFTING"
  | "DREAMY"
  | "AGGRESSIVE"
  | "PEACEFUL"
  | "OTHER"

// Region codes according to the API
export type Region = 
  | "GLB"  // Global
  | "NAM"  // North America
  | "CAM"  // Central America
  | "SAM"  // South America
  | "EUW"  // Western Europe
  | "EUE"  // Eastern Europe
  | "EUN"  // Northern Europe
  | "AFR"  // Africa
  | "ASW"  // Western Asia
  | "ASE"  // Eastern Asia
  | "ASS"  // Southern Asia
  | "ASC"  // Central Asia
  | "OCE"  // Oceania

export const REGION_LABELS: Record<Region, string> = {
  GLB: "Global",
  NAM: "North America",
  CAM: "Central America",
  SAM: "South America",
  EUW: "Western Europe",
  EUE: "Eastern Europe",
  EUN: "Northern Europe",
  AFR: "Africa",
  ASW: "Western Asia",
  ASE: "Eastern Asia",
  ASS: "Southern Asia",
  ASC: "Central Asia",
  OCE: "Oceania"
}

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
  comment?: string
}

export interface UpdateContentAvailabilityRequest {
  blockedRegions: string[]
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
  releaseDate?: string
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
  page: number
  size: number
  totalElements: number
  totalPages: number
  first: boolean
  last: boolean
}

export interface SongDetailAdminResponse {
  id: string
  title: string
  durationSeconds: number
  primaryArtistName: string
  primaryArtistId: string
  collaboratorIds?: string[]
  collectionTitle?: string
  collectionId?: string
  collectionType?: "ALBUM" | "EP" | "SINGLE" | "PLAYLIST"
  positionInCollection?: number
  releaseDate?: string
  scheduledAt?: string
  videoUrl?: string
  explicit: boolean
  coverUrl?: string
  storageReference?: string
  genres?: Genre[]
  moods?: Mood[]
  blockedByAdmin: boolean
  effectiveState: EffectiveState
  likesCount?: number
  deleted: boolean
  createdAt: string
  updatedAt: string
  // Computed property for UI convenience
  hasVideo?: boolean
}

export interface SongInCollectionInfo {
  songId: string
  title: string
  position: number
  durationSeconds: number
  explicit: boolean
  videoUrl?: string
  // Computed property for UI convenience
  hasVideo?: boolean
}

export interface CollectionDetailAdminResponse {
  id: string
  title: string
  description?: string
  coverUrl?: string
  type: "ALBUM" | "EP" | "SINGLE" | "PLAYLIST"
  primaryArtistId: string
  primaryArtistName?: string
  durationSeconds?: number
  scheduledReleaseDate?: string
  actualReleaseDate?: string
  blockedByAdmin: boolean
  blockedRegions: string[]
  availableRegions?: string[]
  effectiveState: EffectiveState
  songs: SongInCollectionInfo[]
  createdAt: string
  updatedAt: string
  // Computed properties for UI convenience (deprecated)
  totalDurationSeconds?: number  // Use durationSeconds instead
  likesCount?: number
  deleted?: boolean
  releaseDate?: string
  scheduledAt?: string
}

// ============================================================
// CONTENT METRICS TYPES
// ============================================================

export interface DateRange {
  start: string  // ISO 8601 format (YYYY-MM-DD)
  end: string    // ISO 8601 format (YYYY-MM-DD)
}

export interface DateRangeComparison {
  current: DateRange
  previous: DateRange
}

export interface MetricValue {
  current: number
  previous: number
  changePercent: number
}

export interface SongOverviewResponse {
  songId: string
  title: string
  artist: string
  artistId: string
  totalPlays: number
  totalLikes: number
  periodPlays: MetricValue
  periodLikes: MetricValue
  dateRange: DateRangeComparison
  region?: string
}

export interface CollectionOverviewResponse {
  collectionId: string
  title: string
  curator: string
  artistId: string
  totalPlays: number
  totalSaves: number
  periodPlays: MetricValue
  periodSaves: MetricValue
  dateRange: DateRangeComparison
  region?: string
}

export interface PlaylistOverviewResponse {
  playlistId: string
  title: string
  curator: string
  totalPlays: number
  totalSaves: number
  periodPlays: MetricValue
  periodSaves: MetricValue
  dateRange: DateRangeComparison
  region?: string
}

// Content Metrics Dashboard Types
export interface TrendDataPoint {
  date: string
  totalPlays: number
}

export interface ContentTrendsResponse {
  songs: TrendDataPoint[]
  collections: TrendDataPoint[]
  playlists: TrendDataPoint[]
  dateRange: DateRange
}

export interface TopSong {
  rank: number
  songId: string
  title: string
  artist: string
  plays: number
  likes: number
}

export interface TopSongsResponse {
  topSongs: TopSong[]
  dateRange: DateRange
}

export interface TopPlaylist {
  rank: number
  playlistId: string
  title: string
  curator: string
  ownerId: string
  plays: number
  saves: number
}

export interface TopPlaylistsResponse {
  topPlaylists: TopPlaylist[]
  dateRange: DateRange
}

export interface TopCollection {
  rank: number
  collectionId: string
  title: string
  artistName: string
  artistId: string
  plays: number
  saves: number
}

export interface TopCollectionsResponse {
  topCollections: TopCollection[]
  dateRange: DateRange
}

export interface TopArtist {
  rank: number
  artistId: string
  artistName: string
  plays: number
  likes: number
}

export interface TopArtistsContentResponse {
  topArtists: TopArtist[]
  dateRange: DateRange
}

export interface ContentSummaryResponse {
  songsReleased: MetricValue
  albumsReleased: MetricValue
  totalPlays: MetricValue
  totalLikes: MetricValue
  totalSaves: MetricValue
  dateRange: DateRangeComparison
}

export interface SongsStateDistribution {
  published: number
  scheduled: number
  regionUnavailable: number
  adminBlocked: number
  total: number
}

export interface CollectionsStateDistribution {
  published: number
  scheduled: number
  regionUnavailable: number
  adminBlocked: number
  total: number
}

export interface ContentStateManagementResponse {
  songs: SongsStateDistribution
  collections: CollectionsStateDistribution
  region?: string
}

export interface RateMetric {
  description: string
  current: number
  previous: number
  changePercent: number
}

export interface ContentRatesResponse {
  averagePlaysPerSong: MetricValue
  likeRate: RateMetric
  saveRatePlaylists: RateMetric
  saveRateCollections: RateMetric
  dateRange: DateRangeComparison
}
