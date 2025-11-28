"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { Music, Album, Play, Heart, TrendingUp, TrendingDown, Download } from "lucide-react"

const contentStats = [
  {
    label: "Total songs",
    value: "12.8K",
    change: "+180",
    trend: "up",
    icon: Music,
  },
  {
    label: "Total albums",
    value: "2.3K",
    change: "+25",
    trend: "up",
    icon: Album,
  },
  {
    label: "Average plays",
    value: "847K",
    change: "+5.3%",
    trend: "up",
    icon: Play,
  },
  {
    label: "Engagement rate",
    value: "12.4%",
    change: "-0.8%",
    trend: "down",
    icon: Heart,
  },
]

const performanceData = [
  { month: "Jan", songs: 780000, albums: 120000 },
  { month: "Feb", songs: 820000, albums: 135000 },
  { month: "Mar", songs: 847000, albums: 142000 },
  { month: "Apr", songs: 890000, albums: 158000 },
]

const topSongs = [
  {
    title: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
    plays: 45000000,
    likes: 2300000,
    shares: 450000,
    releaseDate: "2019-11-29",
  },
  {
    title: "Levitating",
    artist: "Dua Lipa",
    album: "Future Nostalgia",
    plays: 38000000,
    likes: 1900000,
    shares: 380000,
    releaseDate: "2020-03-27",
  },
  {
    title: "Save Your Tears",
    artist: "The Weeknd",
    album: "After Hours",
    plays: 32000000,
    likes: 1600000,
    shares: 320000,
    releaseDate: "2020-03-20",
  },
]

const topAlbums = [
  {
    title: "After Hours",
    artist: "The Weeknd",
    plays: 180000000,
    likes: 8500000,
    shares: 1200000,
    tracks: 14,
    releaseDate: "2020-03-20",
  },
  {
    title: "Future Nostalgia",
    artist: "Dua Lipa",
    plays: 165000000,
    likes: 7800000,
    shares: 1100000,
    tracks: 11,
    releaseDate: "2020-03-27",
  },
  {
    title: "Sour",
    artist: "Olivia Rodrigo",
    plays: 142000000,
    likes: 6900000,
    shares: 980000,
    tracks: 11,
    releaseDate: "2021-05-21",
  },
]

export default function ContentMetricsPage() {
  const [timeRange, setTimeRange] = useState("30d")
  const [contentType, setContentType] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Content Metrics</h1>
            <p className="text-muted-foreground">Performance analysis of songs and albums</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={contentType} onValueChange={setContentType}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All content</SelectItem>
              <SelectItem value="songs">Songs only</SelectItem>
              <SelectItem value="albums">Albums only</SelectItem>
            </SelectContent>
          </Select>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-6">
          {/* Stats Cards Loading */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
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
            {[1, 2].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-48 mt-2" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3].map((j) => (
                      <Skeleton key={j} className="h-20 w-full" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {/* Analysis Loading */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64 mt-2" />
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <>
      {/* Content Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {contentStats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center space-x-1 text-xs">
                {stat.trend === "up" ? (
                  <TrendingUp className="h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500" />
                )}
                <span className={stat.trend === "up" ? "text-green-500" : "text-red-500"}>{stat.change}</span>
                <span className="text-muted-foreground">vs previous period</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Trends</CardTitle>
          <CardDescription>Average plays by content type</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                formatter={(value, name) => [
                  `${((value as number) / 1000).toFixed(0)}K`,
                  name === "songs" ? "Songs" : "Albums",
                ]}
              />
              <Line type="monotone" dataKey="songs" stroke="#8884d8" strokeWidth={2} name="songs" />
              <Line type="monotone" dataKey="albums" stroke="#82ca9d" strokeWidth={2} name="albums" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Top Songs */}
        <Card>
          <CardHeader>
            <CardTitle>Top Songs</CardTitle>
            <CardDescription>Top songs by plays in the period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topSongs.map((song, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium">{song.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {song.artist} • {song.album}
                      </p>
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    <div className="flex items-center space-x-1 mb-1">
                      <Play className="h-3 w-3 text-muted-foreground" />
                      <span>{(song.plays / 1000000).toFixed(1)}M</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Heart className="h-3 w-3 text-muted-foreground" />
                      <span>{(song.likes / 1000000).toFixed(1)}M</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Albums */}
        <Card>
          <CardHeader>
            <CardTitle>Top Albums</CardTitle>
            <CardDescription>Top albums by total plays</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topAlbums.map((album, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-secondary-foreground font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium">{album.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {album.artist} • {album.tracks} tracks
                      </p>
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    <div className="flex items-center space-x-1 mb-1">
                      <Play className="h-3 w-3 text-muted-foreground" />
                      <span>{(album.plays / 1000000).toFixed(0)}M</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Heart className="h-3 w-3 text-muted-foreground" />
                      <span>{(album.likes / 1000000).toFixed(1)}M</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Performance Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Analysis</CardTitle>
          <CardDescription>Detailed metrics of engagement and popularity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-500">3.2M</div>
              <p className="text-sm text-muted-foreground">Average plays per song</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-500">8.7%</div>
              <p className="text-sm text-muted-foreground">Like rate</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-500">2.1%</div>
              <p className="text-sm text-muted-foreground">Share rate</p>
            </div>
          </div>
        </CardContent>
      </Card>
      </>
      )}
    </div>
  )
}
