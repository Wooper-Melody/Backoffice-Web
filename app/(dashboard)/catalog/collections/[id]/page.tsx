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
  Lock,
  Unlock,
  Eye,
} from "lucide-react"
import { useCatalog } from "@/hooks/use-catalog"
import type { CollectionDetailAdminResponse, EffectiveState, Region } from "@/types/catalog"
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
  const { loading, fetchCollectionDetail } = useCatalog()

  useEffect(() => {
    if (collectionId) {
      fetchCollectionDetail(collectionId).then((data) => {
        if (data) {
          setCollection(data)
        }
      })
    }
  }, [collectionId, fetchCollectionDetail])

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
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Edit Metadata
          </Button>
          {collection.blockedByAdmin ? (
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
                      <span className="text-sm">{formatDate(collection.releaseDate)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total Duration</span>
                      <span className="text-sm">{formatDuration(collection.totalDurationSeconds)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Songs</span>
                      <span className="text-sm">{collection.songs.length}</span>
                    </div>
                    {collection.type === "PLAYLIST" && (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Owner</span>
                          <span className="text-sm">{collection.ownerName || "-"}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Privacy</span>
                          <Badge variant="secondary">
                            {collection.isPrivate ? <Lock className="h-3 w-3 mr-1" /> : <Unlock className="h-3 w-3 mr-1" />}
                            {collection.isPrivate ? "Private" : "Public"}
                          </Badge>
                        </div>
                      </>
                    )}
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
                        <TableCell className="font-medium">{song.positionInCollection}</TableCell>
                        <TableCell>{song.title}</TableCell>
                        <TableCell>{formatDuration(song.durationSeconds)}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            {song.hasVideo && <Video className="h-3 w-3 text-muted-foreground" />}
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
                  <p className="text-2xl font-bold">{stateLabels[collection.effectiveState]}</p>
                </div>
                <Badge variant="outline" className={`${stateColors[collection.effectiveState]} text-lg px-4 py-2`}>
                  {stateLabels[collection.effectiveState]}
                </Badge>
              </div>

              {collection.blockedByAdmin && (
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

              {collection.scheduledAt && (
                <div className="p-4 border border-blue-500/20 bg-blue-500/10 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Calendar className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-500">Scheduled Release</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Will be published on: {formatDateTime(collection.scheduledAt)}
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
                          {collection.effectiveState === "BLOCKED_ADMIN" ? "Blocked" : "Available"}
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
              <CardTitle>Audit Trail</CardTitle>
              <CardDescription>
                History of administrative changes (blocks/unblocks and availability changes)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No audit trail available for collections</p>
                <p className="text-sm mt-2">According to requirements, only songs have audit trails</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
