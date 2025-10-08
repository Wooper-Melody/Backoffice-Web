"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Play, Heart, Share, Download, Calendar, Globe, Music, Eye, Edit, Shield } from "lucide-react"

interface ContentDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  content: {
    id: string
    type: string
    title: string
    artist: string
    collection?: string
    publishDate: string
    status: string
    hasVideo: boolean
    duration: string
    cover?: string
  } | null
}

export function ContentDetailsModal({ isOpen, onClose, content }: ContentDetailsModalProps) {
  if (!content) return null

  const mockMetrics = {
    totalPlays: 45000000,
    uniqueListeners: 12000000,
    likes: 2300000,
    shares: 450000,
    downloads: 890000,
    skipRate: 12.5,
    completionRate: 87.5,
  }

  const mockRegionalData = [
    { region: "North America", plays: 18000000, percentage: 40 },
    { region: "Europe", plays: 13500000, percentage: 30 },
    { region: "Asia Pacific", plays: 9000000, percentage: 20 },
    { region: "Latin America", plays: 4500000, percentage: 10 },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Content Details</DialogTitle>
          <DialogDescription>Complete information and analytics for {content.title}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Content Header */}
          <div className="flex items-start space-x-4">
            <Avatar className="h-20 w-20 rounded-lg">
              <AvatarImage src={content.cover || "/placeholder.svg"} alt={content.title} />
              <AvatarFallback className="text-lg rounded-lg">{content.title.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-xl font-semibold">{content.title}</h3>
              <p className="text-muted-foreground">{content.artist}</p>
              {content.collection && <p className="text-sm text-muted-foreground">from {content.collection}</p>}
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant="outline">{content.type}</Badge>
                <Badge variant={content.status === "Published" ? "default" : "secondary"}>{content.status}</Badge>
                {content.hasVideo && <Badge variant="secondary">Video</Badge>}
                <span className="text-sm text-muted-foreground">{content.duration}</span>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Play className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" size="sm">
                <Shield className="h-4 w-4 mr-2" />
                Block
              </Button>
            </div>
          </div>

          <Separator />

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="metadata">Metadata</TabsTrigger>
              <TabsTrigger value="availability">Availability</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Performance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Play className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Total Plays</span>
                      </div>
                      <span className="font-medium">{(mockMetrics.totalPlays / 1000000).toFixed(1)}M</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Unique Listeners</span>
                      </div>
                      <span className="font-medium">{(mockMetrics.uniqueListeners / 1000000).toFixed(1)}M</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Heart className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Likes</span>
                      </div>
                      <span className="font-medium">{(mockMetrics.likes / 1000000).toFixed(1)}M</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Engagement</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Share className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Shares</span>
                      </div>
                      <span className="font-medium">{(mockMetrics.shares / 1000).toFixed(0)}K</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Download className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Downloads</span>
                      </div>
                      <span className="font-medium">{(mockMetrics.downloads / 1000).toFixed(0)}K</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Completion Rate</span>
                      <span className="font-medium">{mockMetrics.completionRate}%</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Published {new Date(content.publishDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Music className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Duration: {content.duration}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Available globally</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Regional Performance</CardTitle>
                  <CardDescription>Plays by geographic region</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockRegionalData.map((region, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-blue-500 rounded-full" />
                          <span className="font-medium">{region.region}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-muted-foreground">
                            {(region.plays / 1000000).toFixed(1)}M plays
                          </span>
                          <span className="text-sm font-medium">{region.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="metadata" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Content Metadata</CardTitle>
                  <CardDescription>Technical and descriptive information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="font-medium mb-2">Basic Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Title</span>
                          <span className="font-medium">{content.title}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Artist</span>
                          <span className="font-medium">{content.artist}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Collection</span>
                          <span className="font-medium">{content.collection || "N/A"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Duration</span>
                          <span className="font-medium">{content.duration}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Technical Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Format</span>
                          <span className="font-medium">MP3</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Bitrate</span>
                          <span className="font-medium">320 kbps</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Sample Rate</span>
                          <span className="font-medium">44.1 kHz</span>
                        </div>
                        <div className="flex justify-between">
                          <span>File Size</span>
                          <span className="font-medium">8.2 MB</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="availability" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Availability Settings</CardTitle>
                  <CardDescription>Regional and platform availability configuration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Regional Availability</h4>
                    <div className="grid gap-2 md:grid-cols-2">
                      {["North America", "Europe", "Asia Pacific", "Latin America"].map((region) => (
                        <div key={region} className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">{region}</span>
                          <Badge variant="default">Available</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-2">Platform Features</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Streaming</span>
                        <Badge variant="default">Enabled</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Download</span>
                        <Badge variant="default">Enabled</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Offline Mode</span>
                        <Badge variant="default">Enabled</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
