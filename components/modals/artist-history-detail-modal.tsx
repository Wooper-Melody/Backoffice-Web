"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Music, Folder, ListMusic, TrendingUp, TrendingDown, Calendar } from "lucide-react"
import type { ContentTrendsResponse } from "@/types/artist-metrics"

interface ArtistHistoryDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  data: ContentTrendsResponse | null
  artistName?: string
  dateRange?: { startDate: string; endDate: string }
}

export function ArtistHistoryDetailModal({
  open,
  onOpenChange,
  data,
  artistName,
  dateRange,
}: ArtistHistoryDetailModalProps) {
  if (!data) return null

  const formatNumber = (num: number) => new Intl.NumberFormat('es-ES').format(num)

  // Combinar datos
  const allDates = new Set<string>()
  data.songs?.forEach(d => allDates.add(d.date))
  data.collections?.forEach(d => allDates.add(d.date))
  data.playlists?.forEach(d => allDates.add(d.date))
  
  const combinedData = Array.from(allDates).sort().map(date => {
    const songs = data.songs?.find(d => d.date === date)?.totalPlays || 0
    const collections = data.collections?.find(d => d.date === date)?.totalPlays || 0
    const playlists = data.playlists?.find(d => d.date === date)?.totalPlays || 0
    
    return {
      date,
      songs,
      collections,
      playlists,
      total: songs + collections + playlists
    }
  })

  // Calcular estadísticas
  const totalSongs = data.songs?.reduce((acc, d) => acc + d.totalPlays, 0) || 0
  const totalCollections = data.collections?.reduce((acc, d) => acc + d.totalPlays, 0) || 0
  const totalPlaylists = data.playlists?.reduce((acc, d) => acc + d.totalPlays, 0) || 0
  const grandTotal = totalSongs + totalCollections + totalPlaylists

  const avgSongs = data.songs?.length ? totalSongs / data.songs.length : 0
  const avgCollections = data.collections?.length ? totalCollections / data.collections.length : 0
  const avgPlaylists = data.playlists?.length ? totalPlaylists / data.playlists.length : 0

  // Encontrar días picos
  const peakDay = combinedData.reduce((max, item) => 
    item.total > max.total ? item : max
  , combinedData[0])

  const lowestDay = combinedData.reduce((min, item) => 
    item.total < min.total ? item : min
  , combinedData[0])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[70vw] max-w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Play History Details {artistName && `- ${artistName}`}</DialogTitle>
          <DialogDescription>
            Detailed analysis of plays over time for songs, collections, and playlists
            {dateRange && ` (${dateRange.startDate} to ${dateRange.endDate})`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Plays</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(grandTotal)}</div>
                <p className="text-xs text-muted-foreground">Across all content types</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Songs</CardTitle>
                <Music className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(totalSongs)}</div>
                <p className="text-xs text-muted-foreground">
                  {((totalSongs / grandTotal) * 100).toFixed(1)}% of total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Collections</CardTitle>
                <Folder className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(totalCollections)}</div>
                <p className="text-xs text-muted-foreground">
                  {((totalCollections / grandTotal) * 100).toFixed(1)}% of total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Playlists</CardTitle>
                <ListMusic className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(totalPlaylists)}</div>
                <p className="text-xs text-muted-foreground">
                  {((totalPlaylists / grandTotal) * 100).toFixed(1)}% of total
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs with detailed data */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="songs">Songs</TabsTrigger>
              <TabsTrigger value="collections">Collections</TabsTrigger>
              <TabsTrigger value="playlists">Playlists</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Peak Performance Day
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Date:</span>
                        <span className="font-semibold">{new Date(peakDay.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Total Plays:</span>
                        <span className="font-semibold">{formatNumber(peakDay.total)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Songs:</span>
                        <span>{formatNumber(peakDay.songs)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Collections:</span>
                        <span>{formatNumber(peakDay.collections)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Playlists:</span>
                        <span>{formatNumber(peakDay.playlists)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <TrendingDown className="h-4 w-4" />
                      Lowest Performance Day
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Date:</span>
                        <span className="font-semibold">{new Date(lowestDay.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Total Plays:</span>
                        <span className="font-semibold">{formatNumber(lowestDay.total)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Songs:</span>
                        <span>{formatNumber(lowestDay.songs)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Collections:</span>
                        <span>{formatNumber(lowestDay.collections)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Playlists:</span>
                        <span>{formatNumber(lowestDay.playlists)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Daily Averages</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Songs:</span>
                        <span className="font-semibold">{formatNumber(Math.round(avgSongs))}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Collections:</span>
                        <span className="font-semibold">{formatNumber(Math.round(avgCollections))}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Playlists:</span>
                        <span className="font-semibold">{formatNumber(Math.round(avgPlaylists))}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Period Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Total Days:</span>
                        <span className="font-semibold">{combinedData.length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Avg Daily Plays:</span>
                        <span className="font-semibold">{formatNumber(Math.round(grandTotal / combinedData.length))}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {[
              { key: 'songs', data: data.songs, icon: Music, color: '#8884d8' },
              { key: 'collections', data: data.collections, icon: Folder, color: '#82ca9d' },
              { key: 'playlists', data: data.playlists, icon: ListMusic, color: '#ffc658' }
            ].map(({ key, data: itemData, icon: Icon, color }) => (
              <TabsContent key={key} value={key}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon className="h-5 w-5" style={{ color }} />
                      {key.charAt(0).toUpperCase() + key.slice(1)} Daily Data
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">Total Plays</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {itemData?.slice().reverse().map((item) => (
                          <TableRow key={item.date}>
                            <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                            <TableCell className="text-right font-mono">{formatNumber(item.totalPlays)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
