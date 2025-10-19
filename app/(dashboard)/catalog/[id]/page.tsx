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
} from "lucide-react"
import { useCatalog } from "@/hooks/use-catalog"
import { api } from "@/lib/api"
import type { SongDetailAdminResponse, AuditEvent, EffectiveState, Region } from "@/types/catalog"
import { REGION_LABELS } from "@/types/catalog"

const stateColors = {
  PUBLISHED: "bg-green-500/10 text-green-500 border-green-500/20",
  SCHEDULED: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  NOT_AVAILABLE_REGION: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  BLOCKED_ADMIN: "bg-red-500/10 text-red-500 border-red-500/20",
}

const stateLabels = {
  PUBLISHED: "Published",
  SCHEDULED: "Scheduled",
  NOT_AVAILABLE_REGION: "Region Unavailable",
  BLOCKED_ADMIN: "Admin Blocked",
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
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([])
  const [loadingAudit, setLoadingAudit] = useState(false)
  const { loading, fetchSongDetail } = useCatalog()

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
    if (activeTab === "audit" && songId && auditEvents.length === 0) {
      loadAuditTrail()
    }
  }, [activeTab, songId])

  const loadAuditTrail = async () => {
    setLoadingAudit(true)
    try {
      const response = await api.getContentAuditTrail(songId)
      setAuditEvents(response.events || [])
    } catch (error) {
      console.error("Error loading audit trail:", error)
    } finally {
      setLoadingAudit(false)
    }
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-"
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "-"
    return new Date(dateString).toLocaleString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Edit Metadata
          </Button>
          {song.collectionId && (
            <Button variant="outline" onClick={() => router.push(`/catalog/collections/${song.collectionId}`)}>
              <Eye className="mr-2 h-4 w-4" />
              View Collection
            </Button>
          )}
          {song.blockedByAdmin ? (
            <Button variant="outline">
              <ShieldOff className="mr-2 h-4 w-4" />
              Unblock
            </Button>
          ) : (
            <Button variant="outline">
              <Shield className="mr-2 h-4 w-4" />
              Block
            </Button>
          )}
        </div>
      </div>

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
                    {song.hasVideo && (
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
              <CardTitle>Availability Status</CardTitle>
              <CardDescription>
                Effective state following priority: Blocked-admin &gt; Not-available-region &gt; Scheduled &gt; Published
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="text-sm font-medium">Effective State</p>
                  <p className="text-2xl font-bold">{stateLabels[song.effectiveState]}</p>
                </div>
                <Badge variant="outline" className={`${stateColors[song.effectiveState]} text-lg px-4 py-2`}>
                  {stateLabels[song.effectiveState]}
                </Badge>
              </div>

              {song.blockedByAdmin && (
                <div className="p-4 border border-red-500/20 bg-red-500/10 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Shield className="h-5 w-5 text-red-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-red-500">Blocked by Admin</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        This content is currently blocked and not available to users.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {song.scheduledAt && (
                <div className="p-4 border border-blue-500/20 bg-blue-500/10 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Calendar className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-500">Scheduled Release</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Will be published on: {formatDateTime(song.scheduledAt)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-4">Regional Availability</h3>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground mb-4">
                    Content availability status per region
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {Object.entries(REGION_LABELS).map(([code, label]) => (
                      <div
                        key={code}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <span className="text-sm font-medium">{label}</span>
                        <Badge variant="outline" className="text-xs">
                          {song.effectiveState === "BLOCKED_ADMIN" ? "Blocked" : "Available"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
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
              <CardTitle>Audit Trail</CardTitle>
              <CardDescription>
                Administrative changes history (blocks/unblocks and regional availability changes)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingAudit ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-50 animate-spin" />
                  <p>Loading audit trail...</p>
                </div>
              ) : auditEvents.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Event</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Scope/Region</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditEvents.map((event) => (
                      <TableRow key={event.eventId}>
                        <TableCell className="text-sm">{formatDateTime(event.timestamp)}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{event.eventType}</Badge>
                        </TableCell>
                        <TableCell className="text-sm">{event.performedByUsername}</TableCell>
                        <TableCell className="text-sm">
                          {event.region ? REGION_LABELS[event.region as Region] || event.region : event.scope || "-"}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {event.details || "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No audit events recorded</p>
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
