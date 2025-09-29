import { type NextRequest, NextResponse } from "next/server"

// Mock data for search results
const mockData = [
  {
    id: "1",
    type: "song",
    title: "Blinding Lights",
    artist: "The Weeknd",
    collection: "After Hours",
  },
  {
    id: "2",
    type: "song",
    title: "Save Your Tears",
    artist: "The Weeknd",
    collection: "After Hours",
  },
  {
    id: "3",
    type: "artist",
    title: "The Weeknd",
    description: "Canadian singer-songwriter",
  },
  {
    id: "4",
    type: "collection",
    title: "After Hours",
    artist: "The Weeknd",
  },
  {
    id: "5",
    type: "user",
    title: "john.doe@example.com",
    description: "Premium User",
  },
  {
    id: "6",
    type: "song",
    title: "Levitating",
    artist: "Dua Lipa",
    collection: "Future Nostalgia",
  },
  {
    id: "7",
    type: "artist",
    title: "Dua Lipa",
    description: "British singer-songwriter",
  },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")

  if (!query) {
    return NextResponse.json([])
  }

  // Simulate search logic
  const results = mockData
    .filter(
      (item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        (item.artist && item.artist.toLowerCase().includes(query.toLowerCase())) ||
        (item.description && item.description.toLowerCase().includes(query.toLowerCase())),
    )
    .slice(0, 8) // Limit to 8 results

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200))

  return NextResponse.json(results)
}