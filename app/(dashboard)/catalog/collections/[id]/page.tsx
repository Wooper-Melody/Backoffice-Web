"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Music,
  Calendar,
  Clock,
  Video,
  Edit,
  Shield,
  ShieldOff,
  Eye,
  Globe,
  User,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"
import { useCatalog } from "@/hooks/use-catalog"
import { useCollectionMetrics } from "@/hooks/use-content-metrics"
import { CollectionMetricsOverview } from "@/components/metrics/collection-metrics-overview"
import { RegionAvailabilityModal } from "@/components/modals/region-availability-modal"
import type { DateRange } from "react-day-picker"
import { BlockContentModal } from "@/components/modals/block-content-modal"
import { UnblockContentModal } from "@/components/modals/unblock-content-modal"
import type { 
  CollectionDetailAdminResponse,
  AuditEvent,
  AuditResponse,
  EffectiveState, 
  Region,
  AvailabilityDetailResponse,
  BlockReason
} from "@/types/catalog"
import { REGION_LABELS } from "@/types/catalog"

const stateColors = {
  PUBLISHED: "bg-green-500/10 text-green-500 border-green-500/20",
  SCHEDULED: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  NOT_AVAILABLE_REGION: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  BLOCKED_ADMIN: "bg-red-500/10 text-red-500 border-red-500/20",
  DRAFT: "bg-gray-500/10 text-gray-500 border-gray-500/20",
}

const stateLabels = {
  PUBLISHED: "Published",
  SCHEDULED: "Scheduled",
  NOT_AVAILABLE_REGION: "Region Unavailable",
  BLOCKED_ADMIN: "Admin Blocked",
  DRAFT: "Draft",
}

const typeLabels = {
  ALBUM: "Album",
  EP: "EP",
  SINGLE: "Single",
  PLAYLIST: "Playlist",
}

export default function CollectionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const collectionId = params.id as string

  const [activeTab, setActiveTab] = useState("summary")
  const [collection, setCollection] = useState<CollectionDetailAdminResponse | null>(null)
  const [availability, setAvailability] = useState<AvailabilityDetailResponse | null>(null)
  const [auditData, setAuditData] = useState<AuditResponse | null>(null)
  const [auditPage, setAuditPage] = useState(0)
  const [auditPageSize] = useState(10)

  // Metrics state
  const [metricsPeriod, setMetricsPeriod] = useState<"day" | "week" | "month" | "custom">("month")
  const [metricsDateRange, setMetricsDateRange] = useState<DateRange | undefined>()
  const [metricsRegion, setMetricsRegion] = useState<string | undefined>()
  const [loadingAudit, setLoadingAudit] = useState(false)
  const [loadingAvailability, setLoadingAvailability] = useState(false)
  const [regionAvailabilityOpen, setRegionAvailabilityOpen] = useState(false)
  const [blockContentOpen, setBlockContentOpen] = useState(false)
  const [unblockContentOpen, setUnblockContentOpen] = useState(false)
  const { 
    loading, 
    fetchCollectionDetail, 
    fetchAvailabilityDetail,
    fetchAuditTrail,
    updateAvailability,
    blockContent,
    unblockContent
  } = useCatalog()

  // Calculate date range for metrics based on selected period
  const metricsFilters = useMemo(() => {
    if (metricsPeriod === "custom" && metricsDateRange?.from && metricsDateRange?.to) {
      return {
        startDate: metricsDateRange.from.toISOString().split('T')[0],
        endDate: metricsDateRange.to.toISOString().split('T')[0],
        region: metricsRegion as Region | undefined
      }
    }

    const endDate = new Date()
    const startDate = new Date()
    
    switch (metricsPeriod) {
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
      region: metricsRegion as Region | undefined
    }
  }, [metricsPeriod, metricsDateRange, metricsRegion])

  // Fetch collection metrics
  const { 
    data: metricsData, 
    isLoading: metricsLoading 
  } = useCollectionMetrics(collectionId, metricsFilters)

  const handlePeriodChange = (period: "day" | "week" | "month" | "custom") => {
    setMetricsPeriod(period)
    // If not custom, clear custom date range
    if (period !== "custom") {
      setMetricsDateRange(undefined)
    }
  }

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setMetricsDateRange(range)
  }

  const handleRegionChange = (region: string | undefined) => {
    setMetricsRegion(region)
  }

  useEffect(() => {
    if (collectionId) {
      fetchCollectionDetail(collectionId).then((data) => {
        if (data) {
          setCollection(data)
        }
      })
    }
  }, [collectionId, fetchCollectionDetail])

  useEffect(() => {
    if (activeTab === "availability" && collectionId && !availability) {
      loadAvailabilityDetail()
    }
  }, [activeTab, collectionId, availability])

  useEffect(() => {
    if (activeTab === "audit" && collectionId && !auditData) {
      loadAuditTrail()
    }
  }, [activeTab, collectionId, auditData])

  // Reload audit trail when page changes
  useEffect(() => {
    if (activeTab === "audit" && collectionId && auditData) {
      loadAuditTrail()
    }
  }, [auditPage])

  const loadAvailabilityDetail = async () => {
    setLoadingAvailability(true)
    try {
      const response = await fetchAvailabilityDetail(collectionId, "COLLECTION")
      if (response) {
        setAvailability(response)
      }
    } finally {
      setLoadingAvailability(false)
    }
  }

  const loadAuditTrail = async () => {
    setLoadingAudit(true)
    try {
      const response = await fetchAuditTrail(collectionId, "COLLECTION", auditPage, auditPageSize)
      if (response) {
        setAuditData(response)
      }
    } finally {
      setLoadingAudit(false)
    }
  }

  const handleUpdateAvailability = async (blockedRegions: string[]) => {
    const success = await updateAvailability(collectionId, "COLLECTION", blockedRegions)
    if (success) {
      // Set loading state and reload both collection details and availability
      setLoadingAvailability(true)
      await Promise.all([
        loadAvailabilityDetail(),
        fetchCollectionDetail(collectionId).then((data) => {
          if (data) setCollection(data)
        })
      ])
      setLoadingAvailability(false)
    }
    return success
  }

  const handleBlockContent = async (reason: string, comment?: string): Promise<boolean> => {
    const success = await blockContent(collectionId, "COLLECTION", { blocked: true, reason, comment })
    if (success) {
      setBlockContentOpen(false)
      // Reload collection details and availability
      await fetchCollectionDetail(collectionId).then((data) => {
        if (data) setCollection(data)
      })
      await loadAvailabilityDetail()
    }
    return success
  }

  const handleUnblockContent = async (comment?: string): Promise<boolean> => {
    const success = await unblockContent(collectionId, "COLLECTION", comment)
    if (success) {
      setUnblockContentOpen(false)
      // Reload collection details and availability
      await fetchCollectionDetail(collectionId).then((data) => {
        if (data) setCollection(data)
      })
      await loadAvailabilityDetail()
    }
    return success
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "-"
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  if (loading || !collection) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-muted-foreground">Loading collection details...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/catalog")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{collection.title}</h1>
            <p className="text-muted-foreground">
              {typeLabels[collection.type]} by {collection.primaryArtistName}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => setRegionAvailabilityOpen(true)}>
            <Globe className="mr-2 h-4 w-4" />
            Manage Availability
          </Button>
          {collection.blockedByAdmin ? (
            <Button variant="outline" onClick={() => setUnblockContentOpen(true)}>
              <ShieldOff className="mr-2 h-4 w-4" />
              Unblock
            </Button>
          ) : (
            <Button variant="outline" onClick={() => setBlockContentOpen(true)}>
              <Shield className="mr-2 h-4 w-4" />
              Block
            </Button>
          )}
        </div>
      </div>

      {/* Modals */}
      <RegionAvailabilityModal
        open={regionAvailabilityOpen}
        onOpenChange={setRegionAvailabilityOpen}
        contentId={collectionId}
        contentType="COLLECTION"
        contentTitle={collection.title}
        currentBlockedRegions={collection.blockedRegions || []}
        onUpdate={handleUpdateAvailability}
      />

      <BlockContentModal
        open={blockContentOpen}
        onOpenChange={setBlockContentOpen}
        content={{
          ...collection,
          type: collection.type,
          contentType: "COLLECTION" as const,
          collectionType: collection.type,
          primaryArtistName: collection.primaryArtistName || collection.title,
          primaryArtistId: collection.primaryArtistId || ""
        }}
        onBlockContent={async (content, reason, notes) => handleBlockContent(reason, notes)}
      />

      <UnblockContentModal
        open={unblockContentOpen}
        onOpenChange={setUnblockContentOpen}
        content={{
          ...collection,
          type: collection.type,
          contentType: "COLLECTION" as const,
          collectionType: collection.type,
          primaryArtistName: collection.primaryArtistName || collection.title,
          primaryArtistId: collection.primaryArtistId || ""
        }}
        onUnblockContent={async (content, notes) => handleUnblockContent(notes)}
      />

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
          <TabsTrigger value="appearances">Appearances</TabsTrigger>
          <TabsTrigger value="audit">Audit</TabsTrigger>
        </TabsList>

        {/* Summary Tab */}
        <TabsContent value="summary" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Cover and basic info */}
            <Card className="md:col-span-1">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <Avatar className="h-48 w-48 mx-auto">
                    <AvatarImage src={collection.coverUrl || "/placeholder.svg"} alt={collection.title} />
                    <AvatarFallback className="text-4xl">
                      {collection.title.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Type</span>
                      <Badge variant="outline">{typeLabels[collection.type]}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <Badge variant="outline" className={stateColors[collection.effectiveState]}>
                        {stateLabels[collection.effectiveState]}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Release Date</span>
                      <span className="text-sm">{formatDate(collection.actualReleaseDate || collection.scheduledReleaseDate || "")}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total Duration</span>
                      <span className="text-sm">{formatDuration(collection.durationSeconds || 0)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Songs</span>
                      <span className="text-sm">{collection.songs.length}</span>
                    </div>
                    {collection.likesCount !== undefined && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Likes</span>
                        <span className="text-sm">{collection.likesCount.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Song list */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Songs</CardTitle>
                <CardDescription>Track list in this {collection.type.toLowerCase()}</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead className="w-20">Flags</TableHead>
                      <TableHead className="w-20 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {collection.songs.map((song) => (
                      <TableRow key={song.songId}>
                        <TableCell className="font-medium">{song.position}</TableCell>
                        <TableCell>{song.title}</TableCell>
                        <TableCell>{formatDuration(song.durationSeconds)}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            {song.videoUrl && <Video className="h-3 w-3 text-muted-foreground" />}
                            {song.explicit && <Badge variant="secondary" className="text-xs px-1">E</Badge>}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/catalog/${song.songId}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Collection Metrics Overview */}
          <CollectionMetricsOverview 
            metrics={metricsData} 
            isLoading={metricsLoading}
            onPeriodChange={handlePeriodChange}
            onDateRangeChange={handleDateRangeChange}
            onRegionChange={handleRegionChange}
            currentPeriod={metricsPeriod}
            currentDateRange={metricsDateRange}
            currentRegion={metricsRegion}
          />
        </TabsContent>

        {/* Availability Tab */}
        <TabsContent value="availability" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Availability Status</CardTitle>
                  <CardDescription className="mt-1.5">
                    Priority: Admin Block → Regional Restriction → Draft → Scheduled → Published
                  </CardDescription>
                </div>
                {availability && (
                  <Badge 
                    variant="outline" 
                    className={`${stateColors[availability.effectiveState]} text-base px-4 py-2 font-medium`}
                  >
                    {stateLabels[availability.effectiveState]}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {loadingAvailability ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-50 animate-spin" />
                  <p>Loading availability details...</p>
                </div>
              ) : availability ? (
                <>
                  {/* Status Alerts */}
                  <div className="space-y-3">
                    {availability.blockedByAdmin && (
                      <div className="p-4 border border-red-500/20 bg-red-500/5 rounded-lg">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-full bg-red-500/10">
                            <Shield className="h-4 w-4 text-red-600 dark:text-red-400" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-red-600 dark:text-red-400">Admin Blocked</p>
                            <p className="text-sm text-muted-foreground mt-0.5">
                              This collection is globally blocked and unavailable to all users in every region.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {availability.releaseDate && (
                      <div className="p-4 border border-blue-500/20 bg-blue-500/5 rounded-lg">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-full bg-blue-500/10">
                            <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-blue-600 dark:text-blue-400">Scheduled Release</p>
                            <p className="text-sm text-muted-foreground mt-0.5">
                              Publishing scheduled for <span className="font-medium text-foreground">{formatDateTime(availability.releaseDate)}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {availability.blockedRegions && availability.blockedRegions.length > 0 && (
                      <div className="p-4 border border-amber-500/20 bg-amber-500/5 rounded-lg">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-full bg-amber-500/10">
                            <Globe className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-amber-600 dark:text-amber-400">
                              Regional Restrictions ({availability.blockedRegions.length})
                            </p>
                            <p className="text-sm text-muted-foreground mt-0.5">
                              Blocked in: <span className="font-medium text-foreground">
                                {availability.blockedRegions.map(r => REGION_LABELS[r as Region] || r).join(", ")}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Regional Availability Grid */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-semibold">Regional Availability</h3>
                      <span className="text-sm text-muted-foreground">
                        {availability.regionalStates.length} regions
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {availability.regionalStates.map((regionalState) => {
                        const regionLabel = REGION_LABELS[regionalState.region as Region] || regionalState.region
                        
                        return (
                          <div
                            key={regionalState.region}
                            className={`relative p-3 border rounded-lg transition-all ${stateColors[regionalState.state]}`}
                          >
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <span className="text-sm font-medium">{regionLabel}</span>
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${stateColors[regionalState.state]} shrink-0`}
                              >
                                {stateLabels[regionalState.state]}
                              </Badge>
                            </div>
                            {regionalState.state === "SCHEDULED" && availability.releaseDate && (
                              <p className="text-xs text-muted-foreground mt-1">
                                <Calendar className="h-3 w-3 inline mr-1" />
                                {formatDateTime(availability.releaseDate)}
                              </p>
                            )}
                            {regionalState.reason && (
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2" title={regionalState.reason}>
                                {regionalState.reason}
                              </p>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="font-medium">Unable to load availability details</p>
                  <p className="text-sm mt-1">Please try refreshing the page</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearances Tab */}
        <TabsContent value="appearances" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Playlist Appearances</CardTitle>
              <CardDescription>
                Public playlists that contain songs from this {collection.type.toLowerCase()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Music className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Playlist appearance data will be displayed here</p>
                <p className="text-sm mt-2">Shows playlists containing songs from this collection</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audit Tab */}
        <TabsContent value="audit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Audit Trail</span>
                {auditData && auditData.totalElements > 0 && (
                  <Badge variant="secondary" className="text-sm font-normal">
                    {auditData.totalElements} {auditData.totalElements === 1 ? 'event' : 'events'}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Administrative changes history including blocks/unblocks and regional availability modifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loadingAudit ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-50 animate-spin" />
                  <p>Loading audit trail...</p>
                </div>
              ) : auditData && auditData.events.length > 0 ? (
                <>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[180px]">Timestamp</TableHead>
                          <TableHead className="w-[150px]">Event</TableHead>
                          <TableHead className="w-[120px]">User</TableHead>
                          <TableHead className="w-[140px]">Scope/Region</TableHead>
                          <TableHead>Details</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {auditData.events.map((event: AuditEvent) => (
                          <TableRow key={event.eventId}>
                            <TableCell className="text-sm font-mono">
                              {formatDateTime(event.timestamp)}
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant="outline"
                                className={
                                  event.eventType.includes('BLOCK') 
                                    ? 'border-red-500/50 text-red-700 dark:text-red-400' 
                                    : event.eventType.includes('UNBLOCK')
                                    ? 'border-green-500/50 text-green-700 dark:text-green-400'
                                    : 'border-blue-500/50 text-blue-700 dark:text-blue-400'
                                }
                              >
                                {event.eventType.replace(/_/g, ' ')}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm">
                              <div className="flex items-center gap-2">
                                <User className="h-3 w-3 text-muted-foreground" />
                                {event.performedByUsername}
                              </div>
                            </TableCell>
                            <TableCell className="text-sm">
                              {event.region ? (
                                <div className="flex items-center gap-1">
                                  <Globe className="h-3 w-3 text-muted-foreground" />
                                  {REGION_LABELS[event.region as Region] || event.region}
                                </div>
                              ) : event.scope ? (
                                <Badge variant="secondary" className="text-xs">
                                  {event.scope}
                                </Badge>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground max-w-md">
                              <div className="truncate" title={event.details || ''}>
                                {event.details || '-'}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination Controls */}
                  {auditData.totalPages > 1 && (
                    <div className="flex items-center justify-between px-2">
                      <div className="text-sm text-muted-foreground">
                        Showing {auditData.page * auditData.size + 1} to{' '}
                        {Math.min((auditData.page + 1) * auditData.size, auditData.totalElements)} of{' '}
                        {auditData.totalElements} events
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setAuditPage(0)}
                          disabled={auditData.first || loadingAudit}
                          className="h-8 w-8 p-0"
                        >
                          <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setAuditPage(auditPage - 1)}
                          disabled={auditData.first || loadingAudit}
                          className="h-8 w-8 p-0"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <div className="flex items-center gap-1 px-2">
                          <span className="text-sm font-medium">{auditData.page + 1}</span>
                          <span className="text-sm text-muted-foreground">of {auditData.totalPages}</span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setAuditPage(auditPage + 1)}
                          disabled={auditData.last || loadingAudit}
                          className="h-8 w-8 p-0"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setAuditPage(auditData.totalPages - 1)}
                          disabled={auditData.last || loadingAudit}
                          className="h-8 w-8 p-0"
                        >
                          <ChevronsRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="font-medium">No audit events recorded</p>
                  <p className="text-sm mt-2">Administrative changes will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
