"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Search, Eye, RotateCcw, Shield, ShieldOff, AlertTriangle } from "lucide-react"

const blocks = [
  {
    id: "1",
    contentId: "song-123",
    contentTitle: "Save Your Tears",
    contentArtist: "The Weeknd",
    blockType: "admin",
    scope: "global",
    reason: "Copyright dispute",
    blockedBy: "admin@melody.com",
    blockedAt: "2024-01-15T10:30:00Z",
    status: "active",
  },
  {
    id: "2",
    contentId: "album-456",
    contentTitle: "Future Nostalgia",
    contentArtist: "Dua Lipa",
    blockType: "regional",
    scope: "EU",
    reason: "Licensing restrictions",
    blockedBy: "system",
    blockedAt: "2024-01-10T14:20:00Z",
    status: "active",
  },
  {
    id: "3",
    contentId: "song-789",
    contentTitle: "Watermelon Sugar",
    contentArtist: "Harry Styles",
    blockType: "temporary",
    scope: "APAC",
    reason: "Content review pending",
    blockedBy: "moderator@melody.com",
    blockedAt: "2024-01-20T09:15:00Z",
    status: "expired",
  },
]

const blockTypeColors = {
  admin: "bg-red-500/10 text-red-500 border-red-500/20",
  regional: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  temporary: "bg-blue-500/10 text-blue-500 border-blue-500/20",
}

const statusColors = {
  active: "bg-red-500/10 text-red-500 border-red-500/20",
  expired: "bg-gray-500/10 text-gray-500 border-gray-500/20",
  removed: "bg-green-500/10 text-green-500 border-green-500/20",
}

export default function BlocksPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const filteredBlocks = blocks.filter((block) => {
    const matchesSearch =
      block.contentTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      block.contentArtist.toLowerCase().includes(searchTerm.toLowerCase()) ||
      block.reason.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || block.blockType === typeFilter
    const matchesStatus = statusFilter === "all" || block.status === statusFilter
    return matchesSearch && matchesType && matchesStatus
  })

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Content Blocks</h1>
          <p className="text-muted-foreground">Manage blocked content and access restrictions</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Shield className="h-4 w-4 mr-2" />
              Block Content
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Block Content</DialogTitle>
              <DialogDescription>
                Block content from being accessed by users with specified scope and reason.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="contentId" className="text-right">
                  Content ID
                </Label>
                <Input id="contentId" placeholder="Enter content ID" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="blockType" className="text-right">
                  Block Type
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select block type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin Block</SelectItem>
                    <SelectItem value="regional">Regional Block</SelectItem>
                    <SelectItem value="temporary">Temporary Block</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="scope" className="text-right">
                  Scope
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select scope" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="global">Global</SelectItem>
                    <SelectItem value="NA">North America</SelectItem>
                    <SelectItem value="EU">Europe</SelectItem>
                    <SelectItem value="APAC">Asia Pacific</SelectItem>
                    <SelectItem value="LATAM">Latin America</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="reason" className="text-right">
                  Reason
                </Label>
                <Textarea id="reason" placeholder="Explain the reason for blocking" className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" variant="destructive">
                Block Content
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Blocks</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{blocks.filter((b) => b.status === "active").length}</div>
            <p className="text-xs text-muted-foreground">Currently blocked content</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admin Blocks</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{blocks.filter((b) => b.blockType === "admin").length}</div>
            <p className="text-xs text-muted-foreground">Manual admin interventions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Regional Blocks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{blocks.filter((b) => b.blockType === "regional").length}</div>
            <p className="text-xs text-muted-foreground">Geographic restrictions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expired Blocks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{blocks.filter((b) => b.status === "expired").length}</div>
            <p className="text-xs text-muted-foreground">Blocks that have expired</p>
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
                  placeholder="Search by content title, artist, or reason..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Block Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="admin">Admin Block</SelectItem>
                <SelectItem value="regional">Regional Block</SelectItem>
                <SelectItem value="temporary">Temporary Block</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="removed">Removed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Blocks Table */}
      <Card>
        <CardHeader>
          <CardTitle>Content Blocks ({filteredBlocks.length})</CardTitle>
          <CardDescription>List of blocked content with details and management options</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Content</TableHead>
                <TableHead>Block Type</TableHead>
                <TableHead>Scope</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Blocked By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBlocks.map((block) => (
                <TableRow key={block.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{block.contentTitle}</div>
                      <div className="text-sm text-muted-foreground">{block.contentArtist}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={blockTypeColors[block.blockType as keyof typeof blockTypeColors]}
                    >
                      {block.blockType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{block.scope}</Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{block.reason}</TableCell>
                  <TableCell className="text-sm">{block.blockedBy}</TableCell>
                  <TableCell className="text-sm">{new Date(block.blockedAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusColors[block.status as keyof typeof statusColors]}>
                      {block.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      {block.status === "active" && (
                        <Button variant="ghost" size="sm">
                          <ShieldOff className="h-4 w-4" />
                        </Button>
                      )}
                      {block.status === "expired" && (
                        <Button variant="ghost" size="sm">
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
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
