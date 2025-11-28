// Types for Artist Metrics API based on OpenAPI schema

export interface MetricWithChange {
  current: number
  previous: number
  absoluteChange: number
  percentageChange: number
}

export interface ArtistKPIs {
  listeners: MetricWithChange
  totalPlays: MetricWithChange
  totalLikes: MetricWithChange
  totalSaves: MetricWithChange
  totalFollowers: MetricWithChange
  newFollowers: MetricWithChange
}

export interface PeriodInfo {
  startDate: string // ISO-8601 UTC
  endDate: string // ISO-8601 UTC
  previousPeriodStart: string // ISO-8601 UTC
  previousPeriodEnd: string // ISO-8601 UTC
}

export interface AppliedFilters {
  region?: string
}

export interface ArtistOverviewResponse {
  artistId: string
  artistName: string
  avatarUrl?: string
  primaryGenre?: string
  kpis: ArtistKPIs
  period: PeriodInfo
  appliedFilters?: AppliedFilters
  lastUpdated: string // ISO-8601 UTC
}

export interface TopSong {
  rank: number
  songId: string
  title: string
  artist: string
  plays: number
  likes: number
}

export interface DateRange {
  startDate: string
  endDate: string
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

export interface RegionDistribution {
  region: string
  percentageOfTotal: number
  rank: number
  plays: MetricWithChange
}

export interface OtherMarketsTotal {
  listeners: number
  percentageOfTotal: number
  marketCount: number
}

export interface ArtistMarketDistributionResponse {
  artistId: string
  period: PeriodInfo
  totalMarkets: number
  byRegion: RegionDistribution[]
  otherMarketsTotal: OtherMarketsTotal
  lastUpdated: string // ISO-8601 UTC
}

export interface TrendDataPoint {
  date: string // YYYY-MM-DD in ISO 8601 format
  totalPlays: number
}

export interface ContentTrendsResponse {
  songs: TrendDataPoint[]
  collections: TrendDataPoint[]
  playlists: TrendDataPoint[]
  dateRange: DateRange
}

export interface ArtistMetricsFilters {
  startDate: string // YYYY-MM-DD
  endDate: string // YYYY-MM-DD
  region?: string
}
