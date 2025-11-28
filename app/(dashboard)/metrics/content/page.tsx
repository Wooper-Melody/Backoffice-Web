"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { ExportMenu } from "@/components/common/export-menu"
import { MetricsChart } from "@/components/charts/metrics-chart"
import { ContentMetricDetailModal } from "@/components/modals/content-metric-detail-modal"
import { Badge } from "@/components/ui/badge"
import { Music, Album, Play, Heart, TrendingUp, TrendingDown, Save } from "lucide-react"
import { REGION_LABELS, type Region } from "@/types/catalog"
import type { DateRange } from "react-day-picker"
import {
  useContentTrends,
  useTopSongs,
  useTopCollections,
  useTopPlaylists,
  useTopArtists,
  useContentSummary,
  useContentStateManagement,
  useContentRates,
} from "@/hooks/use-content-metrics-dashboard"
import {
  exportContentSummary,
  exportTopSongs,
  exportTopCollections,
  exportTopPlaylists,
  exportTopArtists,
  exportContentStateManagement,
  exportContentRates,
} from "@/lib/export-content-dashboard"

export default function ContentMetricsPage() {
  const router = useRouter()
  const [periodType, setPeriodType] = useState<"day" | "week" | "month" | "custom">("month")
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [region, setRegion] = useState<string | undefined>()
  const [selectedMetricType, setSelectedMetricType] = useState<"songs-released" | "albums-released" | "total-plays" | "total-likes" | "total-saves" | null>(null)
  const [isMetricModalOpen, setIsMetricModalOpen] = useState(false)

  // Calculate filters based on period
  const filters = useMemo(() => {
    if (periodType === "custom" && dateRange?.from && dateRange?.to) {
      return {
        startDate: dateRange.from.toISOString().split('T')[0],
        endDate: dateRange.to.toISOString().split('T')[0],
        region: region as Region | undefined
      }
    }

    const endDate = new Date()
    const startDate = new Date()
    
    switch (periodType) {
      case "day":
        startDate.setDate(startDate.getDate() - 1)
        break
      case "week":
        startDate.setDate(startDate.getDate() - 7)
        break
      case "month":
        startDate.setDate(startDate.getDate() - 30)
        break
    }
    
    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      region: region as Region | undefined
    }
  }, [periodType, dateRange, region])

  // Fetch all metrics
  const { data: trendsData, isLoading: trendsLoading } = useContentTrends(filters)
  const { data: topSongsData, isLoading: topSongsLoading } = useTopSongs(filters)
  const { data: topCollectionsData, isLoading: topCollectionsLoading } = useTopCollections(filters)
  const { data: topPlaylistsData, isLoading: topPlaylistsLoading } = useTopPlaylists(filters)
  const { data: topArtistsData, isLoading: topArtistsLoading } = useTopArtists(filters)
  const { data: summaryData, isLoading: summaryLoading } = useContentSummary(filters)
  const { data: stateData, isLoading: stateLoading } = useContentStateManagement(region)
  const { data: ratesData, isLoading: ratesLoading } = useContentRates(filters)

  const isLoading = 
    trendsLoading || 
    topSongsLoading || 
    topCollectionsLoading || 
    topPlaylistsLoading || 
    topArtistsLoading || 
    summaryLoading || 
    stateLoading || 
    ratesLoading

  const handlePeriodChange = (value: "day" | "week" | "month" | "custom") => {
    setPeriodType(value)
    if (value !== "custom") {
      setDateRange(undefined)
    }
  }

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range)
  }

  const handleRegionChange = (value: string) => {
    setRegion(value === "all" ? undefined : value)
  }

  const handleExport = (format: "csv" | "excel") => {
    if (summaryData) exportContentSummary(summaryData, format)
  }

  const handleMetricClick = (type: "songs-released" | "albums-released" | "total-plays" | "total-likes" | "total-saves") => {
    setSelectedMetricType(type)
    setIsMetricModalOpen(true)
  }

  const getSelectedMetricData = () => {
    if (!summaryData || !selectedMetricType) return null
    switch (selectedMetricType) {
      case "songs-released":
        return summaryData.songsReleased
      case "albums-released":
        return summaryData.albumsReleased
      case "total-plays":
        return summaryData.totalPlays
      case "total-likes":
        return summaryData.totalLikes
      case "total-saves":
        return summaryData.totalSaves
      default:
        return null
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const getTrendIcon = (changePercent: number) => {
    if (changePercent > 0) return <TrendingUp className="h-3 w-3 text-green-500" />
    if (changePercent < 0) return <TrendingDown className="h-3 w-3 text-red-500" />
    return null
  }

  const getTrendColor = (changePercent: number) => {
    if (changePercent > 0) return "text-green-500"
    if (changePercent < 0) return "text-red-500"
    return "text-muted-foreground"
  }

  // Prepare trend chart data
  const trendChartData = useMemo(() => {
    if (!trendsData) return []
    
    const dateMap = new Map<string, { date: string; songs: number; collections: number; playlists: number }>()
    
    trendsData.songs.forEach(point => {
      const existing = dateMap.get(point.date) || { date: point.date, songs: 0, collections: 0, playlists: 0 }
      existing.songs = point.totalPlays
      dateMap.set(point.date, existing)
    })
    
    trendsData.collections.forEach(point => {
      const existing = dateMap.get(point.date) || { date: point.date, songs: 0, collections: 0, playlists: 0 }
      existing.collections = point.totalPlays
      dateMap.set(point.date, existing)
    })
    
    trendsData.playlists.forEach(point => {
      const existing = dateMap.get(point.date) || { date: point.date, songs: 0, collections: 0, playlists: 0 }
      existing.playlists = point.totalPlays
      dateMap.set(point.date, existing)
    })
    
    return Array.from(dateMap.values()).sort((a, b) => a.date.localeCompare(b.date))
  }, [trendsData])

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Content Metrics</h1>
          <p className="text-muted-foreground">Performance analysis of songs, collections, and playlists</p>
        </div>
        {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <Select onValueChange={handlePeriodChange} value={periodType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Last Day</SelectItem>
            <SelectItem value="week">Last Week</SelectItem>
            <SelectItem value="month">Last Month</SelectItem>
            <SelectItem value="custom">Custom Range</SelectItem>
          </SelectContent>
        </Select>
        
        {periodType === "custom" && (
          <DatePickerWithRange
            value={dateRange}
            onValueChange={handleDateRangeChange}
            placeholder="Select date range"
            className="w-[280px]"
          />
        )}
        
        <Select value={region || "all"} onValueChange={handleRegionChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Regions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Regions</SelectItem>
            {Object.entries(REGION_LABELS).map(([code, label]) => (
              <SelectItem key={code} value={code}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <ExportMenu onExport={handleExport} />
      </div>

      
      </div>

      {isLoading ? (
        <div className="space-y-6">
          {/* Stats Cards Loading */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {[1, 2, 3, 4, 5].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-4 w-32" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-24 mb-2" />
                  <Skeleton className="h-4 w-40" />
                </CardContent>
              </Card>
            ))}
          </div>
          {/* Chart Loading */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64 mt-2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
          {/* Top Items Loading */}
          <div className="grid gap-6 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-48 mt-2" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((j) => (
                      <Skeleton key={j} className="h-16 w-full" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Content Summary Stats */}
          {summaryData && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              <Card className="cursor-pointer hover:shadow-md hover:border-primary transition-all" onClick={() => handleMetricClick("songs-released")}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Songs Released</CardTitle>
                  <Music className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatNumber(summaryData.songsReleased.current)}</div>
                  <div className="flex items-center space-x-1 text-xs">
                    {getTrendIcon(summaryData.songsReleased.changePercent)}
                    <span className={getTrendColor(summaryData.songsReleased.changePercent)}>
                      {Math.abs(summaryData.songsReleased.changePercent).toFixed(1)}%
                    </span>
                    <span className="text-muted-foreground">vs previous period</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md hover:border-primary transition-all" onClick={() => handleMetricClick("albums-released")}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Albums Released</CardTitle>
                  <Album className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatNumber(summaryData.albumsReleased.current)}</div>
                  <div className="flex items-center space-x-1 text-xs">
                    {getTrendIcon(summaryData.albumsReleased.changePercent)}
                    <span className={getTrendColor(summaryData.albumsReleased.changePercent)}>
                      {Math.abs(summaryData.albumsReleased.changePercent).toFixed(1)}%
                    </span>
                    <span className="text-muted-foreground">vs previous period</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md hover:border-primary transition-all" onClick={() => handleMetricClick("total-plays")}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Plays</CardTitle>
                  <Play className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatNumber(summaryData.totalPlays.current)}</div>
                  <div className="flex items-center space-x-1 text-xs">
                    {getTrendIcon(summaryData.totalPlays.changePercent)}
                    <span className={getTrendColor(summaryData.totalPlays.changePercent)}>
                      {Math.abs(summaryData.totalPlays.changePercent).toFixed(1)}%
                    </span>
                    <span className="text-muted-foreground">vs previous period</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md hover:border-primary transition-all" onClick={() => handleMetricClick("total-likes")}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
                  <Heart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatNumber(summaryData.totalLikes.current)}</div>
                  <div className="flex items-center space-x-1 text-xs">
                    {getTrendIcon(summaryData.totalLikes.changePercent)}
                    <span className={getTrendColor(summaryData.totalLikes.changePercent)}>
                      {Math.abs(summaryData.totalLikes.changePercent).toFixed(1)}%
                    </span>
                    <span className="text-muted-foreground">vs previous period</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md hover:border-primary transition-all" onClick={() => handleMetricClick("total-saves")}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Saves</CardTitle>
                  <Save className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatNumber(summaryData.totalSaves.current)}</div>
                  <div className="flex items-center space-x-1 text-xs">
                    {getTrendIcon(summaryData.totalSaves.changePercent)}
                    <span className={getTrendColor(summaryData.totalSaves.changePercent)}>
                      {Math.abs(summaryData.totalSaves.changePercent).toFixed(1)}%
                    </span>
                    <span className="text-muted-foreground">vs previous period</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Performance Trends Chart */}
          {trendsData && trendChartData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>Daily plays by content type</CardDescription>
              </CardHeader>
              <CardContent>
                <MetricsChart
                  data={trendChartData}
                  lines={[
                    { dataKey: "songs", name: "Songs", color: "#8884d8" },
                    { dataKey: "collections", name: "Collections", color: "#82ca9d" },
                    { dataKey: "playlists", name: "Playlists", color: "#ffc658" }
                  ]}
                  xAxisKey="date"
                  height={300}
                />
              </CardContent>
            </Card>
          )}

          {/* Top Content Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Top Songs */}
            {topSongsData && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Top Performing Songs</CardTitle>
                      <CardDescription>Ranked by plays in the selected period</CardDescription>
                    </div>
                    <ExportMenu onExport={(format) => exportTopSongs(topSongsData.topSongs, format)} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topSongsData.topSongs.map((song) => (
                      <div
                        key={song.songId}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                        onClick={() => router.push(`/catalog/${song.songId}`)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">
                            {song.rank}
                          </div>
                          <div>
                            <p className="font-medium">{song.title}</p>
                            <p className="text-sm text-muted-foreground">{song.artist}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatNumber(song.plays)} plays</p>
                          <p className="text-sm text-muted-foreground">{formatNumber(song.likes)} likes</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Top Collections */}
            {topCollectionsData && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Top Performing Collections</CardTitle>
                      <CardDescription>Ranked by plays in the selected period</CardDescription>
                    </div>
                    <ExportMenu onExport={(format) => exportTopCollections(topCollectionsData.topCollections, format)} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topCollectionsData.topCollections.map((collection) => (
                      <div
                        key={collection.collectionId}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                        onClick={() => router.push(`/catalog/collections/${collection.collectionId}`)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">
                            {collection.rank}
                          </div>
                          <div>
                            <p className="font-medium">{collection.title}</p>
                            <p className="text-sm text-muted-foreground">{collection.artistName}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatNumber(collection.plays)} plays</p>
                          <p className="text-sm text-muted-foreground">{formatNumber(collection.saves)} saves</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Top Playlists */}
            {topPlaylistsData && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Top Performing Playlists</CardTitle>
                      <CardDescription>Ranked by plays in the selected period</CardDescription>
                    </div>
                    <ExportMenu onExport={(format) => exportTopPlaylists(topPlaylistsData.topPlaylists, format)} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topPlaylistsData.topPlaylists.map((playlist) => (
                      <div
                        key={playlist.playlistId}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">
                            {playlist.rank}
                          </div>
                          <div>
                            <p className="font-medium">{playlist.title}</p>
                            <p className="text-sm text-muted-foreground">{playlist.curator}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatNumber(playlist.plays)} plays</p>
                          <p className="text-sm text-muted-foreground">{formatNumber(playlist.saves)} saves</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Top Artists */}
            {topArtistsData && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Top Performing Artists</CardTitle>
                      <CardDescription>Ranked by total plays from all songs</CardDescription>
                    </div>
                    <ExportMenu onExport={(format) => exportTopArtists(topArtistsData.topArtists, format)} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topArtistsData.topArtists.map((artist) => (
                      <div
                        key={artist.artistId}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                        onClick={() => router.push(`/metrics/artists?artistId=${artist.artistId}`)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">
                            {artist.rank}
                          </div>
                          <div>
                            <p className="font-medium">{artist.artistName}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatNumber(artist.plays)} plays</p>
                          <p className="text-sm text-muted-foreground">{formatNumber(artist.likes)} likes</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Engagement Rates and State Management */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Engagement Rates */}
            {ratesData && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Engagement Rates</CardTitle>
                      <CardDescription>Average engagement metrics with period comparison</CardDescription>
                    </div>
                    <ExportMenu onExport={(format) => exportContentRates(ratesData, format)} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 border rounded-lg">
                      <p className="text-sm font-medium text-muted-foreground">Avg Plays per Song</p>
                      <div className="flex items-baseline justify-between mt-1">
                        <p className="text-2xl font-bold">{formatNumber(ratesData.averagePlaysPerSong.current)}</p>
                        <div className="flex items-center space-x-1 text-sm">
                          {getTrendIcon(ratesData.averagePlaysPerSong.changePercent)}
                          <span className={getTrendColor(ratesData.averagePlaysPerSong.changePercent)}>
                            {Math.abs(ratesData.averagePlaysPerSong.changePercent).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 border rounded-lg">
                      <p className="text-sm font-medium text-muted-foreground">Like Rate</p>
                      <p className="text-xs text-muted-foreground mb-1">{ratesData.likeRate.description}</p>
                      <div className="flex items-baseline justify-between">
                        <p className="text-2xl font-bold">{ratesData.likeRate.current.toFixed(2)}</p>
                        <div className="flex items-center space-x-1 text-sm">
                          {getTrendIcon(ratesData.likeRate.changePercent)}
                          <span className={getTrendColor(ratesData.likeRate.changePercent)}>
                            {Math.abs(ratesData.likeRate.changePercent).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 border rounded-lg">
                      <p className="text-sm font-medium text-muted-foreground">Playlist Save Rate</p>
                      <p className="text-xs text-muted-foreground mb-1">{ratesData.saveRatePlaylists.description}</p>
                      <div className="flex items-baseline justify-between">
                        <p className="text-2xl font-bold">{ratesData.saveRatePlaylists.current.toFixed(2)}</p>
                        <div className="flex items-center space-x-1 text-sm">
                          {getTrendIcon(ratesData.saveRatePlaylists.changePercent)}
                          <span className={getTrendColor(ratesData.saveRatePlaylists.changePercent)}>
                            {Math.abs(ratesData.saveRatePlaylists.changePercent).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 border rounded-lg">
                      <p className="text-sm font-medium text-muted-foreground">Collection Save Rate</p>
                      <p className="text-xs text-muted-foreground mb-1">{ratesData.saveRateCollections.description}</p>
                      <div className="flex items-baseline justify-between">
                        <p className="text-2xl font-bold">{ratesData.saveRateCollections.current.toFixed(2)}</p>
                        <div className="flex items-center space-x-1 text-sm">
                          {getTrendIcon(ratesData.saveRateCollections.changePercent)}
                          <span className={getTrendColor(ratesData.saveRateCollections.changePercent)}>
                            {Math.abs(ratesData.saveRateCollections.changePercent).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Content State Management */}
            {stateData && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Content State Distribution</CardTitle>
                      <CardDescription>
                        Current state of all content {stateData.region && `in ${stateData.region}`}
                      </CardDescription>
                    </div>
                    <ExportMenu onExport={(format) => exportContentStateManagement(stateData, format)} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium mb-2">Songs ({stateData.songs.total.toLocaleString()} total)</p>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800">
                            Published
                          </Badge>
                          <span className="text-sm font-medium">{stateData.songs.published.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800">
                            Scheduled
                          </Badge>
                          <span className="text-sm font-medium">{stateData.songs.scheduled.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800">
                            Region Unavailable
                          </Badge>
                          <span className="text-sm font-medium">{stateData.songs.regionUnavailable.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800">
                            Blocked
                          </Badge>
                          <span className="text-sm font-medium">{stateData.songs.adminBlocked.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <p className="text-sm font-medium mb-2">Collections ({stateData.collections.total.toLocaleString()} total)</p>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800">
                            Published
                          </Badge>
                          <span className="text-sm font-medium">{stateData.collections.published.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800">
                            Scheduled
                          </Badge>
                          <span className="text-sm font-medium">{stateData.collections.scheduled.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800">
                            Region Unavailable
                          </Badge>
                          <span className="text-sm font-medium">{stateData.collections.regionUnavailable.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800">
                            Blocked
                          </Badge>
                          <span className="text-sm font-medium">{stateData.collections.adminBlocked.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </>
      )}

      {/* Metric Detail Modal */}
      <ContentMetricDetailModal
        open={isMetricModalOpen}
        onOpenChange={setIsMetricModalOpen}
        type={selectedMetricType!}
        data={getSelectedMetricData()}
        period={periodType === "custom" ? "Custom Range" : periodType === "day" ? "Last Day" : periodType === "week" ? "Last Week" : "Last Month"}
        region={region ? REGION_LABELS[region as keyof typeof REGION_LABELS] : undefined}
      />
    </div>
  )
}
