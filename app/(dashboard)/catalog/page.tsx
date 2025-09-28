"use client"

import { useState } from "react"
import { Search, MoreHorizontal, Eye, Edit, Shield, ShieldOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Mock data
const catalogItems = [
  {
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
  },
  {
    id: "2",
    type: "Collection",
    title: "After Hours",
    artist: "The Weeknd",
    collection: null,
    publishDate: "2020-03-20",
    status: "Published",
    hasVideo: false,
    duration: "56:16",
    cover: "/abstract-soundscape.png",
  },
  {
    id: "3",
    type: "Song",
    title: "Save Your Tears",
    artist: "The Weeknd",
    collection: "After Hours",
    publishDate: "2020-03-20",
    status: "Admin-blocked",
    hasVideo: true,
    duration: "3:35",
    cover: "/abstract-soundscape.png",
  },
  {
    id: "4",
    type: "Song",
    title: "Levitating",
    artist: "Dua Lipa",
    collection: "Future Nostalgia",
    publishDate: "2020-03-27",
    status: "Region-unavailable",
    hasVideo: true,
    duration: "3:23",
    cover: "/abstract-soundscape.png",
  },
  {
    id: "5",
    type: "Song",
    title: "New Song",
    artist: "Artist Name",
    collection: "Upcoming Album",
    publishDate: "2024-12-01",
    status: "Scheduled",
    hasVideo: false,
    duration: "3:45",
    cover: "/abstract-soundscape.png",
  },
]

const statusColors = {
  Published: "bg-green-500/10 text-green-500 border-green-500/20",
  Scheduled: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  "Region-unavailable": "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  "Admin-blocked": "bg-red-500/10 text-red-500 border-red-500/20",
}

export default function CatalogPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredItems = catalogItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.collection && item.collection.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesType = typeFilter === "all" || item.type === typeFilter
    const matchesStatus = statusFilter === "all" || item.status === statusFilter

    return matchesSearch && matchesType && matchesStatus
  })

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Catalog</h1>
          <p className="text-muted-foreground">Browse and manage platform content</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Songs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,847</div>
            <p className="text-xs text-muted-foreground">+180 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,341</div>
            <p className="text-xs text-muted-foreground">+25 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blocked Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">-3 from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">+12 for this week</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters and Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by title, artist or collection..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="Song">Song</SelectItem>
                <SelectItem value="Collection">Collection</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="Published">Published</SelectItem>
                <SelectItem value="Scheduled">Scheduled</SelectItem>
                <SelectItem value="Region-unavailable">Region unavailable</SelectItem>
                <SelectItem value="Admin-blocked">Admin blocked</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Table */}
      <Card>
        <CardHeader>
          <CardTitle>Results ({filteredItems.length})</CardTitle>
          <CardDescription>Content list matching applied filters</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Main Artist</TableHead>
                <TableHead>Collection</TableHead>
                <TableHead>Publish Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={item.cover || "/placeholder.svg"} alt={item.title} />
                      <AvatarFallback>{item.title.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.type}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      <span>{item.title}</span>
                      {item.hasVideo && (
                        <Badge variant="secondary" className="text-xs">
                          Video
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{item.artist}</TableCell>
                  <TableCell>{item.collection || "-"}</TableCell>
                  <TableCell>{item.publishDate}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusColors[item.status as keyof typeof statusColors]}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.duration}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Metadata
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {item.status === "Admin-blocked" ? (
                          <DropdownMenuItem>
                            <ShieldOff className="mr-2 h-4 w-4" />
                            Unblock
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem>
                            <Shield className="mr-2 h-4 w-4" />
                            Block
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
