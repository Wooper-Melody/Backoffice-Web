import { type NextRequest, NextResponse } from "next/server"

// Mock data - in a real app this would come from a database
const mockCatalogItem = {
  id: "1",
  type: "Canción",
  title: "Blinding Lights",
  artist: "The Weeknd",
  collection: "After Hours",
  collectionYear: 2020,
  position: 2,
  duration: "3:20",
  publishDate: "2019-11-29",
  status: "Publicado",
  hasVideo: true,
  explicit: false,
  cover: "/placeholder.svg?key=s8s96",
  genres: ["Pop", "Synthwave", "R&B"],
  label: "XO/Republic Records",
  isrc: "USUG11902646",
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params

  // In a real app, fetch from database
  // For now, return mock data
  return NextResponse.json(mockCatalogItem)
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params
  const updates = await request.json()

  // In a real app, update in database
  // For now, return updated mock data
  const updatedItem = { ...mockCatalogItem, ...updates }

  return NextResponse.json(updatedItem)
}
