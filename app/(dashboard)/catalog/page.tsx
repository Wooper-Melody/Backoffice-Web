"use client"

import { useState } from "react"
import { MoreHorizontal, Eye, Edit, Shield, ShieldOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DataTable } from "@/components/data-table/data-table"
import { EditMetadataModal } from "@/components/modals/edit-metadata-modal"
import { BlockContentModal } from "@/components/modals/block-content-modal"
import { ExportMenu } from "@/components/common/export-menu"

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
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [blockModalOpen, setBlockModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)

  const handleViewDetails = (item: any) => {
    // Navigate to state management page with item details
    window.location.href = `/catalog/[id]?id=${item.id}`
  }

  const handleEditMetadata = (item: any) => {
    setSelectedItem(item)
    setEditModalOpen(true)
  }

  const handleBlock = (item: any) => {
    setSelectedItem(item)
    setBlockModalOpen(true)
  }

  const handleUnblock = async (item: any) => {
    try {
      const response = await fetch(`/api/catalog/${item.id}/unblock`, {
        method: "POST",
      })
      if (response.ok) {
        // Refresh data or update state
        console.log("Content unblocked successfully")
      }
    } catch (error) {
      console.error("Error unblocking content:", error)
    }
  }

  const columns = [
    {
      key: "cover",
      label: "",
      render: (value: string, row: any) => (
        <Avatar className="h-10 w-10">
          <AvatarImage src={row.cover || "/placeholder.svg"} alt={row.title} />
          <AvatarFallback>{row.title.charAt(0)}</AvatarFallback>
        </Avatar>
      ),
    },
    {
      key: "type",
      label: "Type",
      sortable: true,
      render: (value: string) => <Badge variant="outline">{value}</Badge>,
    },
    {
      key: "title",
      label: "Title",
      sortable: true,
      render: (value: string, row: any) => (
        <div className="flex items-center space-x-2">
          <span className="font-medium">{value}</span>
          {row.hasVideo && (
            <Badge variant="secondary" className="text-xs">
              Video
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: "artist",
      label: "Main Artist",
      sortable: true,
    },
    {
      key: "collection",
      label: "Collection",
      sortable: true,
      render: (value: string) => value || "-",
    },
    {
      key: "publishDate",
      label: "Publish Date",
      sortable: true,
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (value: string) => (
        <Badge variant="outline" className={statusColors[value as keyof typeof statusColors]}>
          {value}
        </Badge>
      ),
    },
    {
      key: "duration",
      label: "Duration",
      sortable: true,
    },
    {
      key: "actions",
      label: "Actions",
      render: (value: any, row: any) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => handleViewDetails(row)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEditMetadata(row)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Metadata
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {row.status === "Admin-blocked" ? (
              <DropdownMenuItem onClick={() => handleUnblock(row)}>
                <ShieldOff className="mr-2 h-4 w-4" />
                Unblock
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => handleBlock(row)}>
                <Shield className="mr-2 h-4 w-4" />
                Block
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  const filterOptions = [
    {
      key: "type",
      label: "Type",
      options: [
        { value: "Song", label: "Song" },
        { value: "Collection", label: "Collection" },
      ],
    },
    {
      key: "status",
      label: "Status",
      options: [
        { value: "Published", label: "Published" },
        { value: "Scheduled", label: "Scheduled" },
        { value: "Region-unavailable", label: "Region unavailable" },
        { value: "Admin-blocked", label: "Admin blocked" },
      ],
    },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Catalog</h1>
          <p className="text-muted-foreground">Browse and manage platform content</p>
        </div>
        <ExportMenu
          onExport={(format) => {
            console.log(`Exporting catalog data as ${format}`)
            // Implement export logic
          }}
        />
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

      <DataTable
        title="Content Catalog"
        description="Browse and manage all platform content"
        data={catalogItems}
        columns={columns}
        searchable={true}
        searchPlaceholder="Search by title, artist or collection..."
        filterable={true}
        filterOptions={filterOptions}
        pageSize={10}
      />

      <EditMetadataModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        item={selectedItem}
        onSave={(updatedItem) => {
          console.log("Saving metadata:", updatedItem)
          setEditModalOpen(false)
        }}
      />

      <BlockContentModal
        open={blockModalOpen}
        onOpenChange={setBlockModalOpen}
        item={selectedItem}
        onConfirm={(item) => {
          console.log("Blocking content:", item)
          setBlockModalOpen(false)
        }}
      />
    </div>
  )
}
