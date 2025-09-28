"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Search, Users, Play, Heart, Share, TrendingUp, Download } from "lucide-react"

const topArtists = [
  {
    id: "1",
    name: "The Weeknd",
    monthlyListeners: 85000000,
    followers: 12000000,
    plays: 450000000,
    likes: 23000000,
    shares: 4500000,
    change: "+12.5%",
    trend: "up",
    avatar: "/placeholder.svg?key=weeknd",
  },
  {
    id: "2",
    name: "Dua Lipa",
    monthlyListeners: 72000000,
    followers: 9800000,
    plays: 380000000,
    likes: 19000000,
    shares: 3800000,
    change: "+8.7%",
    trend: "up",
    avatar: "/placeholder.svg?key=dualipa",
  },
  {
    id: "3",
    name: "Bad Bunny",
    monthlyListeners: 68000000,
    followers: 11500000,
    plays: 420000000,
    likes: 21000000,
    shares: 4200000,
    change: "+15.2%",
    trend: "up",
    avatar: "/placeholder.svg?key=badbunny",
  },
  {
    id: "4",
    name: "Taylor Swift",
    monthlyListeners: 65000000,
    followers: 15200000,
    plays: 390000000,
    likes: 25000000,
    shares: 5100000,
    change: "+6.3%",
    trend: "up",
    avatar: "/placeholder.svg?key=taylor",
  },
]

const artistGrowthData = [
  { month: "Ene", listeners: 78000000 },
  { month: "Feb", listeners: 81000000 },
  { month: "Mar", listeners: 83000000 },
  { month: "Abr", listeners: 85000000 },
]

const topMarkets = [
  { country: "Estados Unidos", listeners: 24500000, percentage: 28.8 },
  { country: "Brasil", listeners: 12800000, percentage: 15.1 },
  { country: "México", listeners: 9200000, percentage: 10.8 },
  { country: "Reino Unido", listeners: 7600000, percentage: 8.9 },
  { country: "Canadá", listeners: 6400000, percentage: 7.5 },
]

const topSongs = [
  { title: "Blinding Lights", plays: 45000000, saves: 2300000 },
  { title: "Save Your Tears", plays: 32000000, saves: 1600000 },
  { title: "After Hours", plays: 28000000, saves: 1400000 },
  { title: "Can't Feel My Face", plays: 25000000, saves: 1250000 },
]

export default function ArtistMetricsPage() {
  const [selectedArtist, setSelectedArtist] = useState("1")
  const [timeRange, setTimeRange] = useState("30d")
  const [searchTerm, setSearchTerm] = useState("")

  const currentArtist = topArtists.find((artist) => artist.id === selectedArtist) || topArtists[0]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Métricas de Artistas</h1>
          <p className="text-muted-foreground">Análisis detallado del rendimiento de artistas</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Últimos 7 días</SelectItem>
              <SelectItem value="30d">Últimos 30 días</SelectItem>
              <SelectItem value="90d">Últimos 90 días</SelectItem>
              <SelectItem value="1y">Último año</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Artist Search */}
      <Card>
        <CardHeader>
          <CardTitle>Buscar artista</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre de artista..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedArtist} onValueChange={setSelectedArtist}>
              <SelectTrigger className="w-[250px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {topArtists.map((artist) => (
                  <SelectItem key={artist.id} value={artist.id}>
                    {artist.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Artist Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={currentArtist.avatar || "/placeholder.svg"} alt={currentArtist.name} />
              <AvatarFallback>{currentArtist.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold">{currentArtist.name}</h2>
              <p className="text-muted-foreground">Panel de métricas</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="text-center p-4 border rounded-lg">
              <div className="flex items-center justify-center space-x-1 mb-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Oyentes mensuales</span>
              </div>
              <div className="text-2xl font-bold">{(currentArtist.monthlyListeners / 1000000).toFixed(1)}M</div>
              <div className="flex items-center justify-center space-x-1 text-xs">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-green-500">{currentArtist.change}</span>
              </div>
            </div>

            <div className="text-center p-4 border rounded-lg">
              <div className="flex items-center justify-center space-x-1 mb-2">
                <Heart className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Seguidores</span>
              </div>
              <div className="text-2xl font-bold">{(currentArtist.followers / 1000000).toFixed(1)}M</div>
            </div>

            <div className="text-center p-4 border rounded-lg">
              <div className="flex items-center justify-center space-x-1 mb-2">
                <Play className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Reproducciones</span>
              </div>
              <div className="text-2xl font-bold">{(currentArtist.plays / 1000000).toFixed(0)}M</div>
            </div>

            <div className="text-center p-4 border rounded-lg">
              <div className="flex items-center justify-center space-x-1 mb-2">
                <Heart className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Me gusta</span>
              </div>
              <div className="text-2xl font-bold">{(currentArtist.likes / 1000000).toFixed(1)}M</div>
            </div>

            <div className="text-center p-4 border rounded-lg">
              <div className="flex items-center justify-center space-x-1 mb-2">
                <Share className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Compartidos</span>
              </div>
              <div className="text-2xl font-bold">{(currentArtist.shares / 1000000).toFixed(1)}M</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Growth Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Crecimiento de oyentes</CardTitle>
            <CardDescription>Evolución mensual de oyentes únicos</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={artistGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`${((value as number) / 1000000).toFixed(1)}M`, "Oyentes"]} />
                <Bar dataKey="listeners" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Markets */}
        <Card>
          <CardHeader>
            <CardTitle>Principales mercados</CardTitle>
            <CardDescription>Países con mayor número de oyentes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topMarkets.map((market, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold">
                      {index + 1}
                    </div>
                    <span className="font-medium">{market.country}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{(market.listeners / 1000000).toFixed(1)}M</div>
                    <div className="text-xs text-muted-foreground">{market.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Songs */}
      <Card>
        <CardHeader>
          <CardTitle>Canciones más populares</CardTitle>
          <CardDescription>Top canciones del artista por reproducciones</CardDescription>
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
                    <p className="text-sm text-muted-foreground">{currentArtist.name}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center space-x-1">
                    <Play className="h-4 w-4 text-muted-foreground" />
                    <span>{(song.plays / 1000000).toFixed(1)}M</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Heart className="h-4 w-4 text-muted-foreground" />
                    <span>{(song.saves / 1000000).toFixed(1)}M</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
