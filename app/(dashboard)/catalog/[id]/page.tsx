"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { ArrowLeft, Edit, Shield, ShieldOff, Play, Calendar, Clock, MapPin, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { EditMetadataModal } from "@/components/modals/edit-metadata-modal"
import { BlockContentModal } from "@/components/modals/block-content-modal"

// Mock data - in real app this would come from API
const mockItem = {
  id: "1",
  type: "Song",
  title: "Blinding Lights",
  artist: "The Weeknd",
  collection: "After Hours",
  publishDate: "2019-11-29",
  status: "Published",
  hasVideo: true,
  duration: "3:20",
  cover: "/abstract-soundscape.png",
  genre: "Synthpop",
  description: "A synthpop and electropop song that features 1980s-style synthesizers and lush instrumentation.",
  tags: "synthpop, electropop, 80s, dance",
  plays: "2.1B",
  likes: "15.2M",
  regions: ["US", "CA", "UK", "AU", "DE"],
  blockedRegions: ["CN", "RU"],
  releaseDate: "2019-11-29",
  lastModified: "2024-01-15",
  modifiedBy: "admin@melody.com",
}

export default function StateManagementPage() {
  const searchParams = useSearchParams()
  const itemId = searchParams.get("id")
  const [item, setItem] = useState(mockItem)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [blockModalOpen, setBlockModalOpen] = useState(false)

  const statusColors = {
    Published: "bg-green-500/10 text-green-500 border-green-500/20",
    Scheduled: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    "Region-unavailable": "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    "Admin-blocked": "bg-red-500/10 text-red-500 border-red-500/20",
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Catalog
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Content Details</h1>
            <p className="text-muted-foreground">Detailed view and management</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => setEditModalOpen(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Metadata
          </Button>
          {item.status === "Admin-blocked" ? (
            <Button variant="outline">
              <ShieldOff className="h-4 w-4 mr-2" />
              Unblock
            </Button>
          ) : (
            <Button variant="outline" onClick={() => setBlockModalOpen(true)}>
              <Shield className="h-4 w-4 mr-2" />
              Block
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Content Info */}
        <div className="md:col-span-2 space-y-6">
          {/* Basic Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start space-x-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={item.cover || "/placeholder.svg"} alt={item.title} />
                  <AvatarFallback className="text-lg">{item.title.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center space-x-2">
                    <h2 className="text-2xl font-bold">{item.title}</h2>
                    <Badge variant="outline">{item.type}</Badge>
                    {item.hasVideo && <Badge variant="secondary">Video</Badge>}
                  </div>
                  <p className="text-lg text-muted-foreground">by {item.artist}</p>
                  {item.collection && <p className="text-sm text-muted-foreground">from {item.collection}</p>}
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{item.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{item.publishDate}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Metadata Card */}
          <Card>
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Genre</h4>
                <Badge variant="outline">{item.genre}</Badge>
              </div>
              <div>
                <h4 className="font-medium mb-2">Tags</h4>
                <div className="flex flex-wrap gap-1">
                  {item.tags.split(", ").map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Regional Availability */}
          <Card>
            <CardHeader>
              <CardTitle>Regional Availability</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2 text-green-600">Available Regions</h4>
                  <div className="flex flex-wrap gap-1">
                    {item.regions.map((region) => (
                      <Badge key={region} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        {region}
                      </Badge>
                    ))}
                  </div>
                </div>
                {item.blockedRegions.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 text-red-600">Blocked Regions</h4>
                    <div className="flex flex-wrap gap-1">
                      {item.blockedRegions.map((region) => (
                        <Badge key={region} variant="outline" className="bg-red-50 text-red-700 border-red-200">
                          {region}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="outline" className={statusColors[item.status as keyof typeof statusColors]}>
                {item.status}
              </Badge>
            </CardContent>
          </Card>

          {/* Statistics Card */}
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Play className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Plays</span>
                </div>
                <span className="font-medium">{item.plays}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Likes</span>
                </div>
                <span className="font-medium">{item.likes}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Regions</span>
                </div>
                <span className="font-medium">{item.regions.length}</span>
              </div>
            </CardContent>
          </Card>

          {/* Audit Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Audit Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">Last Modified:</span>
                <p className="font-medium">{item.lastModified}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Modified By:</span>
                <p className="font-medium">{item.modifiedBy}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Release Date:</span>
                <p className="font-medium">{item.releaseDate}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <EditMetadataModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        item={item}
        onSave={(updatedItem) => {
          setItem(updatedItem)
          setEditModalOpen(false)
        }}
      />

      <BlockContentModal
        open={blockModalOpen}
        onOpenChange={setBlockModalOpen}
        item={item}
        onConfirm={(item) => {
          setItem((prev) => ({ ...prev, status: "Admin-blocked" }))
          setBlockModalOpen(false)
        }}
      />
    </div>
  )
}
