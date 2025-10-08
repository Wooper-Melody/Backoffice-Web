import { type NextRequest, NextResponse } from "next/server"

// Mock data - in a real app this would come from a database
const mockCatalogItems = [
  {
    id: "1",
    type: "Canción",
    title: "Blinding Lights",
    artist: "The Weeknd",
    collection: "After Hours",
    publishDate: "2019-11-29",
    status: "Publicado",
    hasVideo: true,
    duration: "3:20",
    cover: "/placeholder.svg?key=s8s96",
    explicit: false,
    genres: ["Pop", "Synthwave", "R&B"],
    isrc: "USUG11902646",
    label: "XO/Republic Records",
  },
  {
    id: "2",
    type: "Colección",
    title: "After Hours",
    artist: "The Weeknd",
    collection: null,
    publishDate: "2020-03-20",
    status: "Publicado",
    hasVideo: false,
    duration: "56:16",
    cover: "/placeholder.svg?key=k47fx",
  },
  // Add more mock items as needed
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get("search")
  const type = searchParams.get("type")
  const status = searchParams.get("status")
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "10")

  let filteredItems = mockCatalogItems

  // Apply filters
  if (search) {
    filteredItems = filteredItems.filter(
      (item) =>
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.artist.toLowerCase().includes(search.toLowerCase()) ||
        (item.collection && item.collection.toLowerCase().includes(search.toLowerCase())),
    )
  }

  if (type && type !== "all") {
    filteredItems = filteredItems.filter((item) => item.type === type)
  }

  if (status && status !== "all") {
    filteredItems = filteredItems.filter((item) => item.status === status)
  }

  // Pagination
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedItems = filteredItems.slice(startIndex, endIndex)

  return NextResponse.json({
    items: paginatedItems,
    total: filteredItems.length,
    page,
    limit,
    totalPages: Math.ceil(filteredItems.length / limit),
  })
}
