"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Search,
  MoreHorizontal,
  Eye,
  Globe,
  Shield,
  ShieldOff,
  Music,
  Video,
  Calendar,
} from "lucide-react"

import { ExportMenu } from "@/components/common/export-menu"
import {
  Pagination,
  PaginationContent,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
  PaginationItem,
  PaginationEllipsis,
} from "@/components/ui/pagination"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { BlockContentModal } from "@/components/modals/block-content-modal"
import { UnblockContentModal } from "@/components/modals/unblock-content-modal"
import { RegionAvailabilityModal } from "@/components/modals/region-availability-modal"
import { useCatalog } from "@/hooks/use-catalog"
import type { ContentAdminResponse, EffectiveState, ContentType } from "@/types/catalog"
import type { DateRange } from "react-day-picker"

const stateColors = {
  PUBLISHED: "bg-green-500/10 text-green-500 border-green-500/20",
  SCHEDULED: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  NOT_AVAILABLE_REGION: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  BLOCKED_ADMIN: "bg-red-500/10 text-red-500 border-red-500/20",
  DRAFT: "bg-gray-500/10 text-gray-500 border-gray-500/20",
}

const stateLabels = {
  PUBLISHED: "Published",
  SCHEDULED: "Scheduled",
  NOT_AVAILABLE_REGION: "Region Unavailable",
  BLOCKED_ADMIN: "Admin Blocked",
  DRAFT: "Draft",
}

const typeLabels = {
  SONG: "Song",
  ALBUM: "Album",
  EP: "EP",
  SINGLE: "Single",
  PLAYLIST: "Playlist",
} as const

// Obtiene el tipo visible según la regla:
// - Si es SONG, mostrar "SONG"
// - Si es colección, usar collectionType (ALBUM/EP/SINGLE/PLAYLIST)
function getVisibleType(item: ContentAdminResponse): keyof typeof typeLabels {
  // Soportar campos nuevos contentType/collectionType y mantener compatibilidad con item.type
  const contentType = (item as any).contentType as ("SONG" | "COLLECTION") | undefined
  const collectionType = (item as any).collectionType as keyof typeof typeLabels | undefined

  if (contentType === "SONG") return "SONG"
  if (contentType === "COLLECTION") return collectionType || (item.type as keyof typeof typeLabels)

  // Fallback para datos antiguos donde 'type' ya es el tipo final
  return item.type as keyof typeof typeLabels
}

export default function CatalogPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [stateFilter, setStateFilter] = useState("all")
  const [videoFilter, setVideoFilter] = useState("all")
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  // Separate state for applied filters (what gets sent to API)
  const [appliedFilters, setAppliedFilters] = useState({
    search: "",
    type: "all",
    state: "all",
    video: "all",
    dateRange: undefined as DateRange | undefined
  })

  const [blockContentOpen, setBlockContentOpen] = useState(false)
  const [unblockContentOpen, setUnblockContentOpen] = useState(false)
  const [regionAvailabilityOpen, setRegionAvailabilityOpen] = useState(false)

  const {
    loading,
    catalogData,
    selectedContent,
    setSelectedContent,
    fetchCatalogContent,
    blockContent,
    unblockContent,
    updateAvailability,
  } = useCatalog()

  // Fetch content on component mount and when applied filters change
  useEffect(() => {
    // Format dates to ISO-8601 format (YYYY-MM-DD) if dateRange is set
    const releaseDateFrom = appliedFilters.dateRange?.from 
      ? appliedFilters.dateRange.from.toISOString().split('T')[0]
      : undefined
    const releaseDateTo = appliedFilters.dateRange?.to 
      ? appliedFilters.dateRange.to.toISOString().split('T')[0]
      : undefined

    fetchCatalogContent({
      page: currentPage - 1, // API uses 0-based pagination
      size: pageSize,
      search: appliedFilters.search || undefined,
      contentType: appliedFilters.type !== "all" ? appliedFilters.type as ContentType : undefined,
      effectiveState: appliedFilters.state !== "all" ? appliedFilters.state as EffectiveState : undefined,
      hasVideo: appliedFilters.video !== "all" ? appliedFilters.video === "yes" : undefined,
      releaseDateFrom,
      releaseDateTo,
    })
  }, [currentPage, appliedFilters, fetchCatalogContent])

  // Reset to first page when applied filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [appliedFilters])

  // Handle search button click
  const handleSearch = () => {
    setAppliedFilters({
      search: searchTerm,
      type: typeFilter,
      state: stateFilter,
      video: videoFilter,
      dateRange: dateRange
    })
  }

  // Handle clear filters
  const handleClearFilters = () => {
    setSearchTerm("")
    setTypeFilter("all")
    setStateFilter("all")
    setVideoFilter("all")
    setDateRange(undefined)
    setAppliedFilters({
      search: "",
      type: "all",
      state: "all",
      video: "all",
      dateRange: undefined
    })
  }

  // Since we're now filtering server-side, use the results directly
  const filteredContent = catalogData?.content || []

  const totalPages = catalogData?.totalPages || 1
  const totalElements = catalogData?.totalElements || 0

  // Compact page list for large number of pages
  const pageList = (() => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1)

    const pages = new Set<number>()
    pages.add(1)
    pages.add(totalPages)

    if (currentPage < 2) {
      pages.add(2)
      return Array.from(pages).filter((p) => p <= totalPages).sort((a, b) => a - b)
    }

    if (currentPage >= totalPages - 1) {
      pages.add(totalPages - 2)
      pages.add(totalPages - 1)
      return Array.from(pages).filter((p) => p >= 1).sort((a, b) => a - b)
    }

    pages.add(currentPage - 1)
    pages.add(currentPage)
    pages.add(currentPage + 1)

    return Array.from(pages).sort((a, b) => a - b)
  })()

  const handleViewDetails = (content: ContentAdminResponse) => {
    // Determine if it's a song or collection
    const visibleType = getVisibleType(content)
    const isSong = visibleType === "SONG"
    
    // Navigate to appropriate details page
    if (isSong) {
      window.location.href = `/catalog/${content.id}`
    } else {
      // It's a collection (ALBUM, EP, SINGLE, PLAYLIST)
      window.location.href = `/catalog/collections/${content.id}`
    }
  }

  const handleEditMetadata = (content: ContentAdminResponse) => {
    setSelectedContent(content)
    setRegionAvailabilityOpen(true)
  }

  const handleUpdateAvailability = async (blockedRegions: string[]) => {
    if (!selectedContent) return false
    
    const contentType = selectedContent.contentType === "SONG" ? "SONG" : "COLLECTION"
    const success = await updateAvailability(selectedContent.id, contentType, blockedRegions)
    
    if (success) {
      // Refresh the catalog to show updated data
      const releaseDateFrom = appliedFilters.dateRange?.from 
        ? appliedFilters.dateRange.from.toISOString().split('T')[0]
        : undefined
      const releaseDateTo = appliedFilters.dateRange?.to 
        ? appliedFilters.dateRange.to.toISOString().split('T')[0]
        : undefined

      await fetchCatalogContent({
        page: currentPage - 1,
        size: pageSize,
        search: appliedFilters.search || undefined,
        contentType: appliedFilters.type !== "all" ? appliedFilters.type as ContentType : undefined,
        effectiveState: appliedFilters.state !== "all" ? appliedFilters.state as EffectiveState : undefined,
        hasVideo: appliedFilters.video !== "all" ? appliedFilters.video === "yes" : undefined,
        releaseDateFrom,
        releaseDateTo,
      })
    }
    
    return success
  }

  const handleBlockContentClick = (content: ContentAdminResponse) => {
    setSelectedContent(content)
    setBlockContentOpen(true)
  }

  const handleUnblockContentClick = (content: ContentAdminResponse) => {
    setSelectedContent(content)
    setUnblockContentOpen(true)
  }

  const handleBlockContent = async (content: ContentAdminResponse, reason: string, comment?: string): Promise<boolean> => {
    const contentType = content.contentType === "SONG" ? "SONG" : "COLLECTION"
    const success = await blockContent(content.id, contentType, { blocked: true, reason, comment })
    if (success) {
      setBlockContentOpen(false)
    }
    return success
  }

  const handleUnblockContent = async (content: ContentAdminResponse, comment?: string): Promise<boolean> => {
    const contentType = content.contentType === "SONG" ? "SONG" : "COLLECTION"
    const success = await unblockContent(content.id, contentType, comment)
    if (success) {
      setUnblockContentOpen(false)
    }
    return success
  }

  // Statistics
  const songsCount = filteredContent.filter((c) => (c as any).contentType === "SONG" || c.type === "SONG").length
  const albumsCount = filteredContent.filter((c) => getVisibleType(c) === "ALBUM").length
  const collectionsCount = filteredContent.filter((c) => {
    const vt = getVisibleType(c)
    return vt === "ALBUM" || vt === "EP" || vt === "SINGLE" || vt === "PLAYLIST"
  }).length
  const blockedCount = filteredContent.filter((c) => c.blockedByAdmin).length
  const scheduledCount = filteredContent.filter((c) => c.effectiveState === "SCHEDULED").length

  // Format duration from seconds to MM:SS
  const formatDuration = (seconds?: number) => {
    if (!seconds) return "-"
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "-"
    return new Date(dateString).toLocaleDateString("es-ES")
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Catalog</h1>
          <p className="text-muted-foreground">Browse and manage platform content</p>
        </div>
        <div className="flex items-center space-x-2">
          <ExportMenu
            onExport={(format) => {
              console.log(`Exporting catalog data as ${format}`)
              // Implement export logic for catalog
            }}
          />
        </div>
      </div>

      {loading ? (
        <div className="space-y-6">
          {/* Stats Cards Loading */}
          <div className="grid gap-4 md:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-4 w-32" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-24 mb-2" />
                  <Skeleton className="h-3 w-16" />
                </CardContent>
              </Card>
            ))}
          </div>
          {/* Filters Loading */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-96 mt-2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex space-x-4">
                  <Skeleton className="h-10 flex-1" />
                  <Skeleton className="h-10 w-40" />
                  <Skeleton className="h-10 w-40" />
                  <Skeleton className="h-10 w-40" />
                </div>
                <Skeleton className="h-10 w-64" />
              </div>
            </CardContent>
          </Card>
          {/* Table Loading */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <>
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Content</CardTitle>
            <Music className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Intl.NumberFormat('es-ES').format(totalElements)}</div>
            <p className="text-xs text-muted-foreground">Songs and Collections</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Content Distribution</CardTitle>
            <Music className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('es-ES').format(songsCount)} / {new Intl.NumberFormat('es-ES').format(collectionsCount)}
            </div>
            <p className="text-xs text-muted-foreground">Songs / Collections</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blocked Content</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{blockedCount}</div>
            <p className="text-xs text-muted-foreground">Admin Blocked</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scheduledCount}</div>
            <p className="text-xs text-muted-foreground">Upcoming Releases</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters and Search</CardTitle>
          <CardDescription>Search content by title, artist or apply filters. Click Search to apply filters.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-3">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by title, artist, or collection..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSearch()
                      }
                    }}
                  />
                </div>
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="md:w-[160px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="SONG">Song</SelectItem>
                  <SelectItem value="ALBUM">Album</SelectItem>
                  <SelectItem value="EP">EP</SelectItem>
                  <SelectItem value="SINGLE">Single</SelectItem>
                </SelectContent>
              </Select>
              <Select value={stateFilter} onValueChange={setStateFilter}>
                <SelectTrigger className="md:w-[160px]">
                  <SelectValue placeholder="State" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All States</SelectItem>
                  <SelectItem value="PUBLISHED">Published</SelectItem>
                  <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                  <SelectItem value="NOT_AVAILABLE_REGION">Region Unavailable</SelectItem>
                  <SelectItem value="BLOCKED_ADMIN">Admin Blocked</SelectItem>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                </SelectContent>
              </Select>
              <DatePickerWithRange
                className="md:w-[280px]"
                value={dateRange}
                onValueChange={setDateRange}
                placeholder="Release date"
              />
              <Select value={videoFilter} onValueChange={setVideoFilter}>
                <SelectTrigger className="md:w-[120px]">
                  <SelectValue placeholder="Video" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="yes">With Video</SelectItem>
                  <SelectItem value="no">No Video</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button onClick={handleSearch} className="flex items-center space-x-2">
                <Search className="h-4 w-4" />
                <span>Search</span>
              </Button>
              <Button 
                variant="outline" 
                onClick={handleClearFilters}
                disabled={
                  appliedFilters.search === "" && 
                  appliedFilters.type === "all" && 
                  appliedFilters.state === "all" && 
                  appliedFilters.video === "all" &&
                  !appliedFilters.dateRange
                }
              >
                Clear Filters
              </Button>
              {(appliedFilters.search || appliedFilters.type !== "all" || appliedFilters.state !== "all" || appliedFilters.video !== "all" || appliedFilters.dateRange) ? (
                <div className="text-sm text-muted-foreground">
                  Active filters: {[
                    appliedFilters.search && `Search: "${appliedFilters.search}"`,
                    appliedFilters.type !== "all" && `Type: ${typeLabels[appliedFilters.type as ContentType]}`,
                    appliedFilters.state !== "all" && `State: ${stateLabels[appliedFilters.state as EffectiveState]}`,
                    appliedFilters.video !== "all" && `Video: ${appliedFilters.video === "yes" ? "Yes" : "No"}`,
                    appliedFilters.dateRange?.from && `Release Date: ${appliedFilters.dateRange.from.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}${appliedFilters.dateRange.to ? ` - ${appliedFilters.dateRange.to.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}` : ''}`
                  ].filter(Boolean).join(", ")}
                </div>
              ) : null}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Table */}
      <Card>
        <CardHeader>
          <CardTitle>Content ({filteredContent.length})</CardTitle>
          <CardDescription>Manage catalog content and their availability</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-muted-foreground">Loading content...</div>
            </div>
          ) : filteredContent.length === 0 ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-center text-muted-foreground">No content found</div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Content</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Artist</TableHead>
                  <TableHead>Collection</TableHead>
                  <TableHead>Release Date</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContent.map((content) => (
                  <TableRow key={content.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={content.coverUrl || "/placeholder.svg"} alt={content.title} />
                          <AvatarFallback>
                            {content.title.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium flex items-center space-x-2">
                            <span>{content.title}</span>
                            {content.hasVideo && (
                              <Video className="h-3 w-3 text-muted-foreground" />
                            )}
                            {content.explicit && (
                              <Badge variant="secondary" className="text-xs">E</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {typeLabels[getVisibleType(content)]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{content.primaryArtistName}</TableCell>
                    <TableCell className="text-sm">{content.collectionTitle || "-"}</TableCell>
                    <TableCell className="text-sm">{formatDate(content.releaseDate)}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={stateColors[content.effectiveState]}
                      >
                        {stateLabels[content.effectiveState]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{formatDuration(content.durationSeconds)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleViewDetails(content)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditMetadata(content)}>
                            <Globe className="mr-2 h-4 w-4" />
                            Manage Regions
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {content.blockedByAdmin ? (
                            <DropdownMenuItem onClick={() => handleUnblockContentClick(content)}>
                              <ShieldOff className="mr-2 h-4 w-4" />
                              Unblock Content
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => handleBlockContentClick(content)}>
                              <Shield className="mr-2 h-4 w-4" />
                              Block Content
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Pagination Controls */}
      <div className="flex items-center justify-center">
        <Pagination aria-label="Catalog pagination">
          <PaginationContent>
            <PaginationPrevious
              onClick={(e) => {
                e.preventDefault()
                setCurrentPage((p) => Math.max(1, p - 1))
              }}
              aria-disabled={currentPage === 1}
            />

            {pageList.map((page, idx) => {
              const prev = pageList[idx - 1]
              const gap = prev && page - prev > 1
              return (
                <React.Fragment key={page}>
                  {gap ? (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : null}
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      isActive={page === currentPage}
                      onClick={(e) => {
                        e.preventDefault()
                        setCurrentPage(page)
                      }}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                </React.Fragment>
              )
            })}

            <PaginationNext
              onClick={(e) => {
                e.preventDefault()
                setCurrentPage((p) => Math.min(totalPages, p + 1))
              }}
              aria-disabled={currentPage === totalPages}
            />
          </PaginationContent>
        </Pagination>
      </div>
      </>
      )}

      <BlockContentModal
        open={blockContentOpen}
        onOpenChange={setBlockContentOpen}
        content={selectedContent}
        onBlockContent={handleBlockContent}
      />

      <UnblockContentModal
        open={unblockContentOpen}
        onOpenChange={setUnblockContentOpen}
        content={selectedContent}
        onUnblockContent={handleUnblockContent}
      />

      <RegionAvailabilityModal
        open={regionAvailabilityOpen}
        onOpenChange={setRegionAvailabilityOpen}
        contentId={selectedContent?.id || ""}
        contentType={selectedContent?.contentType === "SONG" ? "SONG" : "COLLECTION"}
        contentTitle={selectedContent?.title || ""}
        currentBlockedRegions={[]}
        onUpdate={handleUpdateAvailability}
      />
    </div>
  )
}
