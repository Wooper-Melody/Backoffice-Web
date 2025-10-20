"use client"

import React, { useState, useEffect } from "react"
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
  User,
  Globe,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"
import { useCatalog } from "@/hooks/use-catalog"
import { RegionAvailabilityModal } from "@/components/modals/region-availability-modal"
import { BlockContentModal } from "@/components/modals/block-content-modal"
import { UnblockContentModal } from "@/components/modals/unblock-content-modal"
import type { 
  SongDetailAdminResponse, 
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

const collectionTypeLabels = {
  ALBUM: "Album",
  EP: "EP",
  SINGLE: "Single",
  PLAYLIST: "Playlist",
}


export default function SongDetailPage() {
  const params = useParams()
  const router = useRouter()
  const songId = params.id as string

  const [activeTab, setActiveTab] = useState("summary")
  const [song, setSong] = useState<SongDetailAdminResponse | null>(null)
  const [availability, setAvailability] = useState<AvailabilityDetailResponse | null>(null)
  const [auditData, setAuditData] = useState<AuditResponse | null>(null)
  const [auditPage, setAuditPage] = useState(0)
  const [auditPageSize] = useState(10)
  const [loadingAudit, setLoadingAudit] = useState(false)
  const [loadingAvailability, setLoadingAvailability] = useState(false)
  const [regionAvailabilityOpen, setRegionAvailabilityOpen] = useState(false)
  const [blockContentOpen, setBlockContentOpen] = useState(false)
  const [unblockContentOpen, setUnblockContentOpen] = useState(false)
  const { 
    loading, 
    fetchSongDetail, 
    fetchAvailabilityDetail, 
    fetchAuditTrail,
    updateAvailability,
    blockContent,
    unblockContent
  } = useCatalog()

  useEffect(() => {
    if (songId) {
      fetchSongDetail(songId).then((data) => {
        if (data) {
          setSong(data)
        }
      })
    }
  }, [songId, fetchSongDetail])

  useEffect(() => {
    if (activeTab === "availability" && songId && !availability) {
      loadAvailabilityDetail()
    }
  }, [activeTab, songId, availability])

  useEffect(() => {
    if (activeTab === "audit" && songId && !auditData) {
      loadAuditTrail()
    }
  }, [activeTab, songId, auditData])

  // Reload audit trail when page changes
  useEffect(() => {
    if (activeTab === "audit" && songId && auditData) {
      loadAuditTrail()
    }
  }, [auditPage])

  const loadAvailabilityDetail = async () => {
    setLoadingAvailability(true)
    try {
      const response = await fetchAvailabilityDetail(songId, "SONG")
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
      const response = await fetchAuditTrail(songId, "SONG", auditPage, auditPageSize)
      if (response) {
        setAuditData(response)
      }
    } finally {
      setLoadingAudit(false)
    }
  }

  const handleUpdateAvailability = async (blockedRegions: string[]) => {
    const success = await updateAvailability(songId, "SONG", blockedRegions)
    if (success) {
      // Set loading state and reload both song details and availability
      setLoadingAvailability(true)
      await Promise.all([
        loadAvailabilityDetail(),
        fetchSongDetail(songId).then((data) => {
          if (data) setSong(data)
        })
      ])
      setLoadingAvailability(false)
    }
    return success
  }

  const handleBlockContent = async (reason: string, comment?: string): Promise<boolean> => {
    const success = await blockContent(songId, "SONG", { blocked: true, reason, comment })
    if (success) {
      setBlockContentOpen(false)
      // Reload song details and availability
      await fetchSongDetail(songId).then((data) => {
        if (data) setSong(data)
      })
      await loadAvailabilityDetail()
    }
    return success
  }

  const handleUnblockContent = async (comment?: string): Promise<boolean> => {
    const success = await unblockContent(songId, "SONG", comment)
    if (success) {
      setUnblockContentOpen(false)
      // Reload song details and availability
      await fetchSongDetail(songId).then((data) => {
        if (data) setSong(data)
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

  if (loading || !song) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-muted-foreground">Loading song details...</div>
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
            <h1 className="text-3xl font-bold tracking-tight">{song.title}</h1>
            <p className="text-muted-foreground">by {song.primaryArtistName}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {song.collectionId && (
            <Button variant="outline" onClick={() => router.push(`/catalog/collections/${song.collectionId}`)}>
              <Eye className="mr-2 h-4 w-4" />
              View Collection
            </Button>
          )}
          <Button variant="outline" onClick={() => setRegionAvailabilityOpen(true)}>
            <Globe className="mr-2 h-4 w-4" />
            Manage Availability
          </Button>
          {song.blockedByAdmin ? (
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

      {/* Region Availability Modal */}
      <RegionAvailabilityModal
        open={regionAvailabilityOpen}
        onOpenChange={setRegionAvailabilityOpen}
        contentId={songId}
        contentType="SONG"
        contentTitle={song.title}
        currentBlockedRegions={availability?.blockedRegions || []}
        onUpdate={handleUpdateAvailability}
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
                    <AvatarImage src={song.coverUrl || "/placeholder.svg"} alt={song.title} />
                    <AvatarFallback className="text-4xl">
                      {song.title.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <Badge variant="outline" className={stateColors[song.effectiveState]}>
                        {stateLabels[song.effectiveState]}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Duration</span>
                      <span className="text-sm">{formatDuration(song.durationSeconds)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Release Date</span>
                      <span className="text-sm">{formatDate(song.releaseDate)}</span>
                    </div>
                    {song.videoUrl && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Video</span>
                        <Badge variant="secondary">
                          <Video className="h-3 w-3 mr-1" />
                          Available
                        </Badge>
                      </div>
                    )}
                    {song.explicit && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Content</span>
                        <Badge variant="secondary">Explicit</Badge>
                      </div>
                    )}
                    {song.likesCount !== undefined && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Likes</span>
                        <span className="text-sm">{song.likesCount.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed info */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Song Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Artist(s)</h4>
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{song.primaryArtistName}</span>
                  </div>
                  {song.collaboratorIds && song.collaboratorIds.length > 0 && (
                    <p className="text-sm text-muted-foreground mt-1">
                      + {song.collaboratorIds.length} collaborator(s)
                    </p>
                  )}
                </div>

                {song.collectionTitle && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Collection</h4>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Music className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{song.collectionTitle}</p>
                          {song.collectionType && (
                            <p className="text-xs text-muted-foreground">
                              {collectionTypeLabels[song.collectionType as keyof typeof collectionTypeLabels]}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {song.positionInCollection && (
                          <Badge variant="outline">Track #{song.positionInCollection}</Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/catalog/collections/${song.collectionId}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {song.genres && song.genres.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Genres</h4>
                    <div className="flex flex-wrap gap-2">
                      {song.genres.map((genre, index) => (
                        <Badge key={index} variant="outline">
                          {genre}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {song.moods && song.moods.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Moods</h4>
                    <div className="flex flex-wrap gap-2">
                      {song.moods.map((mood, index) => (
                        <Badge key={index} variant="secondary">
                          {mood}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <Separator />

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Created</p>
                    <p className="font-medium">{formatDateTime(song.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Last Updated</p>
                    <p className="font-medium">{formatDateTime(song.updatedAt)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
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
                              This content is globally blocked and unavailable to all users in every region.
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
              <CardTitle>Collection Appearances</CardTitle>
              <CardDescription>
                Albums, EPs, Singles, and public Playlists that include this song
              </CardDescription>
            </CardHeader>
            <CardContent>
              {song.collectionId && song.collectionTitle ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <Badge variant="outline">
                          {song.collectionType && collectionTypeLabels[song.collectionType as keyof typeof collectionTypeLabels]}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{song.collectionTitle}</TableCell>
                      <TableCell>{song.positionInCollection || "-"}</TableCell>
                      <TableCell>{song.primaryArtistName}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/catalog/collections/${song.collectionId}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Music className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>This song is not part of any collection</p>
                </div>
              )}
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

      {/* Modals */}
      <RegionAvailabilityModal
        open={regionAvailabilityOpen}
        onOpenChange={setRegionAvailabilityOpen}
        contentId={songId}
        contentType="SONG"
        contentTitle={song.title}
        currentBlockedRegions={availability?.blockedRegions || []}
        onUpdate={handleUpdateAvailability}
      />

      <BlockContentModal
        open={blockContentOpen}
        onOpenChange={setBlockContentOpen}
        content={{
          ...song,
          type: "SONG" as const,
          contentType: "SONG" as const
        }}
        onBlockContent={async (content, reason, comment) => handleBlockContent(reason, comment)}
      />

      <UnblockContentModal
        open={unblockContentOpen}
        onOpenChange={setUnblockContentOpen}
        content={{
          ...song,
          type: "SONG" as const,
          contentType: "SONG" as const
        }}
        onUnblockContent={async (content, comment) => handleUnblockContent(comment)}
      />
    </div>
  )
}
