"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Users, Play, Heart, Save, TrendingUp, TrendingDown, Download, ArrowLeft, Calendar, Music, List } from "lucide-react"
import { useArtistDetailedMetrics } from "@/hooks/use-metrics"
import { ExportMenu } from "@/components/common/export-menu"
import { REGION_LABELS } from "@/types/catalog"
import { Badge } from "@/components/ui/badge"
import ArtistGlobe from "@/components/charts/ArtistGlobe"
import type { MarketDatum } from "@/components/charts/ArtistGlobe"
import { ArtistMarketsDetailModal } from "@/components/modals/artist-markets-detail-modal"
import { ArtistKPIDetailModal } from "@/components/modals/artist-kpi-detail-modal"
import { ArtistHistoryDetailModal } from "@/components/modals/artist-history-detail-modal"
import type { MetricWithChange } from "@/types/artist-metrics"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import type { DateRange } from "react-day-picker"

function ArtistMetricsContent() {
  const searchParams = useSearchParams()
  const artistId = searchParams.get("id")
  
  // Period type state
  const [periodType, setPeriodType] = useState<"day" | "week" | "month" | "custom">("month")
  
  // Date range state (default: last month)
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const end = new Date()
    const start = new Date()
    start.setDate(start.getDate() - 30)
    return {
      from: start,
      to: end
    }
  })
  
  const [region, setRegion] = useState<string | undefined>(undefined)
  const [marketsModalOpen, setMarketsModalOpen] = useState(false)
  const [historyModalOpen, setHistoryModalOpen] = useState(false)
  const [kpiModalOpen, setKpiModalOpen] = useState(false)
  const [selectedKPI, setSelectedKPI] = useState<{ name: string; data: MetricWithChange | null | undefined; icon: React.ReactNode } | null>(null)
  
  // Format dates for API
  const startDate = dateRange.from ? dateRange.from.toISOString().split('T')[0] : ''
  const endDate = dateRange.to ? dateRange.to.toISOString().split('T')[0] : ''
  
  // Fetch artist metrics
  const { overview, topSongs, topPlaylists, topCollections, markets, history, isLoading, error } = 
    useArtistDetailedMetrics(artistId, startDate, endDate, region)

  // Redirect if no artist ID
  useEffect(() => {
    if (!artistId) {
      window.location.href = "/users"
    }
  }, [artistId])

  // Handle period selection
  const handlePeriodChange = (value: "day" | "week" | "month" | "custom") => {
    setPeriodType(value)
    
    // Only update dateRange if not custom (custom is handled by DatePicker)
    if (value !== "custom") {
      const end = new Date()
      const start = new Date()
      
      switch (value) {
        case "day":
          start.setDate(start.getDate() - 1)
          break
        case "week":
          start.setDate(start.getDate() - 7)
          break
        case "month":
          start.setDate(start.getDate() - 30)
          break
      }
      
      setDateRange({
        from: start,
        to: end
      })
    }
  }

  // Format number with locale
  const formatNumber = (num: number) => new Intl.NumberFormat('es-ES').format(num)

  // Handle KPI click
  const handleKPIClick = (name: string, data: MetricWithChange | null | undefined, icon: React.ReactNode) => {
    setSelectedKPI({ name, data, icon })
    setKpiModalOpen(true)
  }

  // Render metric change
  const renderMetricChange = (percentageChange: number | null | undefined) => {
    if (percentageChange === null || percentageChange === undefined || isNaN(percentageChange)) {
      return (
        <div className="flex items-center space-x-1 text-xs">
          <span className="text-muted-foreground">N/A</span>
        </div>
      )
    }
    
    const isPositive = percentageChange >= 0
    return (
      <div className="flex items-center space-x-1 text-xs">
        {isPositive ? (
          <TrendingUp className="h-3 w-3 text-green-500" />
        ) : (
          <TrendingDown className="h-3 w-3 text-red-500" />
        )}
        <span className={isPositive ? "text-green-500" : "text-red-500"}>
          {isPositive ? "+" : ""}{percentageChange.toFixed(2)}%
        </span>
      </div>
    )
  }

  // Handle export
  const handleExport = (format: "csv" | "excel") => {
    if (!overview || !topSongs || !topPlaylists || !markets) return
    
    const rows = [
      ["Artist Metrics Report"],
      [""],
      ["Artist", overview.artistName],
      ["Period", `${startDate} to ${endDate}`],
      ["Region", region ? REGION_LABELS[region as keyof typeof REGION_LABELS] || region : "All Regions"],
      ["Last Updated", new Date(overview.lastUpdated).toLocaleString()],
      [""],
      ["KPIs"],
      ["Metric", "Current", "Previous", "Change (%)"],
      ["Listeners", (overview.kpis?.listeners?.current ?? 0).toString(), (overview.kpis?.listeners?.previous ?? 0).toString(), (overview.kpis?.listeners?.percentageChange ?? 0).toFixed(2)],
      ["Total Plays", (overview.kpis?.totalPlays?.current ?? 0).toString(), (overview.kpis?.totalPlays?.previous ?? 0).toString(), (overview.kpis?.totalPlays?.percentageChange ?? 0).toFixed(2)],
      ["Total Likes", (overview.kpis?.totalLikes?.current ?? 0).toString(), (overview.kpis?.totalLikes?.previous ?? 0).toString(), (overview.kpis?.totalLikes?.percentageChange ?? 0).toFixed(2)],
      ["Total Saves", (overview.kpis?.totalSaves?.current ?? 0).toString(), (overview.kpis?.totalSaves?.previous ?? 0).toString(), (overview.kpis?.totalSaves?.percentageChange ?? 0).toFixed(2)],
      ["Followers", (overview.kpis?.totalFollowers?.current ?? 0).toString(), (overview.kpis?.totalFollowers?.previous ?? 0).toString(), (overview.kpis?.totalFollowers?.percentageChange ?? 0).toFixed(2)],
      [""],
      ["Top Songs"],
      ["Rank", "Title", "Plays", "Likes"],
      ...(topSongs.topSongs && topSongs.topSongs.length > 0 ? topSongs.topSongs.map(song => [song.rank.toString(), song.title, song.plays.toString(), song.likes.toString()]) : []),
      [""],
      ["Top Markets"],
      ["Rank", "Region", "Plays", "Percentage"],
      ...(markets.byRegion && markets.byRegion.length > 0 ? markets.byRegion.map(m => [m.rank.toString(), REGION_LABELS[m.region as keyof typeof REGION_LABELS] || m.region, (m.plays?.current ?? 0).toString(), ((m.percentageOfTotal ?? 0).toFixed(2)) + "%"]) : []),
    ]

    const csv = rows.map(row => row.map(cell => `"${cell}"`).join(",")).join("\n")
    const filename = `artist-metrics-${overview.artistName.replace(/\s+/g, '-')}-${Date.now()}.${format === "csv" ? "csv" : "xls"}`
    const blob = new Blob([csv], { 
      type: format === "csv" ? "text/csv;charset=utf-8;" : "application/vnd.ms-excel" 
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  if (!artistId) return null

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center">
              <p className="text-destructive font-semibold">Error loading artist metrics</p>
              <p className="text-sm text-muted-foreground mt-2">Please try again later</p>
              <Button onClick={() => window.location.href = "/users"} className="mt-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Users
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => window.location.href = "/users"}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Artist Metrics</h1>
            <p className="text-muted-foreground">Detailed performance analysis</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
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
              onValueChange={(range) => range && setDateRange(range)}
              placeholder="Select date range"
              className="w-[280px]"
            />
          )}
          <Select value={region || "all"} onValueChange={(val) => setRegion(val === "all" ? undefined : val)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Regions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              {Object.entries(REGION_LABELS).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <ExportMenu onExport={handleExport}  />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          {/* Artist Overview Card Loading */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-64" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* KPIs Loading - 6 columns */}
              <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="text-center p-3 border rounded-lg">
                    <Skeleton className="h-4 w-20 mx-auto mb-2" />
                    <Skeleton className="h-6 w-16 mx-auto mb-1" />
                    <Skeleton className="h-3 w-24 mx-auto" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Globe and History Chart Loading - Side by Side */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Globe Loading */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-80" />
                  </div>
                  <Skeleton className="h-9 w-32" />
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[500px] w-full rounded-lg" />
              </CardContent>
            </Card>

            {/* History Chart Loading */}
            <Card>
              <CardHeader>
                <div className="space-y-2">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-96" />
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[500px] w-full rounded-lg" />
              </CardContent>
            </Card>
          </div>

          {/* Top Songs/Playlists/Collections Loading - Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {[1, 2].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-64" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((j) => (
                      <div key={j} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3 flex-1">
                          <Skeleton className="h-8 w-8 rounded-full" />
                          <div className="space-y-2 flex-1">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-1/2" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-4 w-20" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Globe and History Chart Loading - Side by Side */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Globe Loading */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-64" />
                  </div>
                  <Skeleton className="h-9 w-28" />
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[500px] w-full rounded-lg" />
              </CardContent>
            </Card>

            {/* History Chart Loading */}
            <div className="flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-40" />
                      <Skeleton className="h-4 w-72" />
                    </div>
                    <Skeleton className="h-9 w-28" />
                  </div>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-[360px] w-full rounded-lg" />
                </CardContent>
              </Card>
              
              {/* Summary Cards Skeleton */}
              <div className="flex gap-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="flex-1">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-8 w-20 mb-2" />
                      <Skeleton className="h-4 w-32" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : overview ? (
        <>
          {/* Artist Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={overview.avatarUrl || "/placeholder.svg"} alt={overview.artistName} />
                    <AvatarFallback>{overview.artistName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-bold">{overview.artistName}</h2>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      {overview.primaryGenre && <Badge variant="outline">{overview.primaryGenre}</Badge>}
                      <span>Last updated: {new Date(overview.lastUpdated).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
                <div 
                  className="text-center p-3 border rounded-lg cursor-pointer hover:shadow-md hover:border-primary transition-all"
                  onClick={() => handleKPIClick("Listeners", overview.kpis?.listeners, <Users className="h-5 w-5" />)}
                >
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <Users className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs font-medium">Listeners</span>
                  </div>
                  <div className="text-xl font-bold">{formatNumber(overview.kpis?.listeners?.current ?? 0)}</div>
                  {renderMetricChange(overview.kpis?.listeners?.percentageChange)}
                </div>

                <div 
                  className="text-center p-3 border rounded-lg cursor-pointer hover:shadow-md hover:border-primary transition-all"
                  onClick={() => handleKPIClick("Total Plays", overview.kpis?.totalPlays, <Play className="h-5 w-5" />)}
                >
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <Play className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs font-medium">Total Plays</span>
                  </div>
                  <div className="text-xl font-bold">{formatNumber(overview.kpis?.totalPlays?.current ?? 0)}</div>
                  {renderMetricChange(overview.kpis?.totalPlays?.percentageChange)}
                </div>

                <div 
                  className="text-center p-3 border rounded-lg cursor-pointer hover:shadow-md hover:border-primary transition-all"
                  onClick={() => handleKPIClick("Total Likes", overview.kpis?.totalLikes, <Heart className="h-5 w-5" />)}
                >
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <Heart className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs font-medium">Total Likes</span>
                  </div>
                  <div className="text-xl font-bold">{formatNumber(overview.kpis?.totalLikes?.current ?? 0)}</div>
                  {renderMetricChange(overview.kpis?.totalLikes?.percentageChange)}
                </div>

                <div 
                  className="text-center p-3 border rounded-lg cursor-pointer hover:shadow-md hover:border-primary transition-all"
                  onClick={() => handleKPIClick("Total Saves", overview.kpis?.totalSaves, <Save className="h-5 w-5" />)}
                >
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <Save className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs font-medium">Total Saves</span>
                  </div>
                  <div className="text-xl font-bold">{formatNumber(overview.kpis?.totalSaves?.current ?? 0)}</div>
                  {renderMetricChange(overview.kpis?.totalSaves?.percentageChange)}
                </div>

                <div 
                  className="text-center p-3 border rounded-lg cursor-pointer hover:shadow-md hover:border-primary transition-all"
                  onClick={() => handleKPIClick("Followers", overview.kpis?.totalFollowers, <Users className="h-5 w-5" />)}
                >
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <Users className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs font-medium">Followers</span>
                  </div>
                  <div className="text-xl font-bold">{formatNumber(overview.kpis?.totalFollowers?.current ?? 0)}</div>
                  {renderMetricChange(overview.kpis?.totalFollowers?.percentageChange)}
                </div>

                <div 
                  className="text-center p-3 border rounded-lg cursor-pointer hover:shadow-md hover:border-primary transition-all"
                  onClick={() => handleKPIClick("New Followers", overview.kpis?.newFollowers, <TrendingUp className="h-5 w-5" />)}
                >
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <TrendingUp className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs font-medium">New Followers</span>
                  </div>
                  <div className="text-xl font-bold">{formatNumber(overview.kpis?.newFollowers?.current ?? 0)}</div>
                  {renderMetricChange(overview.kpis?.newFollowers?.percentageChange)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Globe and History Chart - Side by Side */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Top Markets - Globe Visualization */}
            {markets && markets.byRegion && markets.byRegion.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Top Markets</CardTitle>
                      <CardDescription>Interactive global distribution of plays by region</CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setMarketsModalOpen(true)}
                    >
                      View Details
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <ArtistGlobe
                    data={markets.byRegion.map(m => ({
                      region: m.region,
                      plays: m.plays?.current ?? 0,
                      percentageOfTotal: m.percentageOfTotal ?? 0
                    }))}
                    height={500}
                    rotationSpeed={3}
                    cameraDistance={260}
                    autoRotate={true}
                  />
                </CardContent>
              </Card>
            )}

            {/* Play History Chart */}
            {history && history.songs?.length > 0 && (() => {
              const songsData = history.songs.map(d => ({
                date: d.date,
                songs: d.totalPlays
              })).sort((a, b) => a.date.localeCompare(b.date))

              const totalPlays = songsData.reduce((acc, d) => acc + d.songs, 0)
              const avgDailyPlays = Math.round(totalPlays / songsData.length)
              const peakDay = songsData.reduce((max, item) => item.songs > max.songs ? item : max, songsData[0])
              
              const midPoint = Math.floor(songsData.length / 2)
              const firstHalf = songsData.slice(0, midPoint).reduce((acc, d) => acc + d.songs, 0) / midPoint
              const secondHalf = songsData.slice(midPoint).reduce((acc, d) => acc + d.songs, 0) / (songsData.length - midPoint)
              const trendPercentage = ((secondHalf - firstHalf) / firstHalf * 100).toFixed(1)
              const isPositiveTrend = parseFloat(trendPercentage) >= 0
              
              return (
                <div className="flex flex-col gap-6">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Songs Play History</CardTitle>
                          <CardDescription>Daily plays trend for songs</CardDescription>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setHistoryModalOpen(true)}
                        >
                          View Details
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={525}>
                      <LineChart data={songsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(date) => {
                          const d = new Date(date)
                          return `${d.getDate()}/${d.getMonth() + 1}`
                        }}
                      />
                      <YAxis 
                        tickFormatter={(value) => {
                          if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
                          if (value >= 1000) return `${(value / 1000).toFixed(0)}K`
                          return value.toString()
                        }}
                      />
                      <Tooltip 
                        formatter={(value: number) => [formatNumber(value), "Plays"]}
                        labelFormatter={(date) => new Date(date).toLocaleDateString()}
                        contentStyle={{
                          backgroundColor: 'rgba(0, 0, 0, 0.8)',
                          border: 'none',
                          borderRadius: '6px',
                          color: '#fff'
                        }}
                        labelStyle={{
                          color: '#fff',
                          fontWeight: 600
                        }}
                      />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="songs" 
                          name="Songs"
                          stroke="#8884d8" 
                          strokeWidth={2.5}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                    
                    {/* Summary Cards - Songs only */}
                    <div className="flex gap-4 mt-4">
                      {/* Card 1: Total Plays */}
                      <Card className="flex-1">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Total plays</CardTitle>
                          <Music className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div>
                            <div className="text-2xl font-semibold">{formatNumber(totalPlays)}</div>
                            <div className="text-sm text-muted-foreground mt-1">From all songs</div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Card 2: Avg Daily Plays */}
                      <Card className="flex-1">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Daily average</CardTitle>
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div>
                            <div className="text-2xl font-semibold">{formatNumber(avgDailyPlays)}</div>
                            <div className="text-sm text-muted-foreground mt-1">Songs plays per day</div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Card 3: Period Trend */}
                      <Card className="flex-1">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Songs trend</CardTitle>
                          {isPositiveTrend ? (
                            <TrendingUp className="h-4 w-4 text-green-500" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-500" />
                          )}
                        </CardHeader>
                        <CardContent>
                          <div>
                            <div className="text-2xl font-semibold">
                              {isPositiveTrend ? '+' : ''}{trendPercentage}%
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {isPositiveTrend ? 'Growth' : 'Decline'} vs first half
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
                
              </div>
              )
            })()}
          </div>

          {/* Top Songs */}
          {topSongs && topSongs.topSongs && topSongs.topSongs.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Music className="h-5 w-5" />
                  <span>Top Songs</span>
                </CardTitle>
                <CardDescription>Top performing songs by plays and likes</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">Rank</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead className="text-right">Plays</TableHead>
                      <TableHead className="text-right">Likes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topSongs.topSongs.map((song) => (
                      <TableRow 
                        key={song.songId}
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => window.location.href = `/catalog/${song.songId}`}
                      >
                        <TableCell>
                          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                            {song.rank}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{song.title}</div>
                            <div className="text-sm text-muted-foreground">{song.artist}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-1">
                            <Play className="h-4 w-4 text-muted-foreground" />
                            <span>{formatNumber(song.plays)}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-1">
                            <Heart className="h-4 w-4 text-muted-foreground" />
                            <span>{formatNumber(song.likes)}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Top Playlists */}
          {topPlaylists && topPlaylists.topPlaylists && topPlaylists.topPlaylists.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <List className="h-5 w-5" />
                  <span>Top Playlists</span>
                </CardTitle>
                <CardDescription>Playlists featuring artist's songs with most plays</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">Rank</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Curator</TableHead>
                      <TableHead className="text-right">Plays</TableHead>
                      <TableHead className="text-right">Saves</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topPlaylists.topPlaylists.map((playlist) => (
                      <TableRow key={playlist.playlistId}>
                        <TableCell>
                          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                            {playlist.rank}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{playlist.title}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{playlist.curator}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-1">
                            <Play className="h-4 w-4 text-muted-foreground" />
                            <span>{formatNumber(playlist.plays)}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-1">
                            <Save className="h-4 w-4 text-muted-foreground" />
                            <span>{formatNumber(playlist.saves)}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Top Collections */}
          {topCollections && topCollections.topCollections && topCollections.topCollections.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Music className="h-5 w-5" />
                  <span>Top Collections</span>
                </CardTitle>
                <CardDescription>Top performing collections (albums/EPs)</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">Rank</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead className="text-right">Plays</TableHead>
                      <TableHead className="text-right">Saves</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topCollections.topCollections.map((collection) => (
                      <TableRow 
                        key={collection.collectionId}
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => window.location.href = `/catalog?type=collections&id=${collection.collectionId}`}
                      >
                        <TableCell>
                          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                            {collection.rank}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{collection.title}</div>
                            <div className="text-sm text-muted-foreground">{collection.artistName}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-1">
                            <Play className="h-4 w-4 text-muted-foreground" />
                            <span>{formatNumber(collection.plays)}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-1">
                            <Save className="h-4 w-4 text-muted-foreground" />
                            <span>{formatNumber(collection.saves)}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        <Card>
          <CardContent className="flex items-center justify-center p-8">
            <p className="text-muted-foreground">No data available for the selected period</p>
          </CardContent>
        </Card>
      )}

      {/* Markets Detail Modal */}
      {markets && (
        <ArtistMarketsDetailModal
          open={marketsModalOpen}
          onOpenChange={setMarketsModalOpen}
          data={markets}
          artistName={overview?.artistName}
          dateRange={{ startDate, endDate }}
        />
      )}

      {/* KPI Detail Modal */}
      {selectedKPI && (
        <ArtistKPIDetailModal
          open={kpiModalOpen}
          onOpenChange={setKpiModalOpen}
          kpiName={selectedKPI.name}
          kpiData={selectedKPI.data}
          artistName={overview?.artistName}
          dateRange={{ startDate, endDate }}
          icon={selectedKPI.icon}
        />
      )}

      {/* History Detail Modal */}
      {history && (
        <ArtistHistoryDetailModal
          open={historyModalOpen}
          onOpenChange={setHistoryModalOpen}
          data={history}
          artistName={overview?.artistName}
          dateRange={{ startDate, endDate }}
        />
      )}
    </div>
  )
}

export default function ArtistMetricsPage() {
  return (
    <Suspense fallback={
      <div className="p-6">
        <Card>
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-muted-foreground">Loading artist metrics...</div>
          </CardContent>
        </Card>
      </div>
    }>
      <ArtistMetricsContent />
    </Suspense>
  )
}
