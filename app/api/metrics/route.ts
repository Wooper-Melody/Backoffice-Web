import { type NextRequest, NextResponse } from "next/server"

// Mock metrics data
const mockMetricsData = {
  users: {
    total: 2400000,
    activeDaily: 847000,
    activeMonthly: 2400000,
    newRegistrations: 45200,
    retention: [100, 65, 45, 32, 28, 25],
  },
  content: {
    totalSongs: 12800,
    totalAlbums: 2300,
    totalPlays: 847000000,
    averageEngagement: 12.4,
  },
  artists: [
    {
      id: "1",
      name: "The Weeknd",
      monthlyListeners: 85000000,
      followers: 12000000,
      plays: 450000000,
      likes: 23000000,
      shares: 4500000,
    },
    {
      id: "2",
      name: "Dua Lipa",
      monthlyListeners: 72000000,
      followers: 9800000,
      plays: 380000000,
      likes: 19000000,
      shares: 3800000,
    },
  ],
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const timeRange = searchParams.get("timeRange") || "30d"

  // In a real app, filter data based on timeRange
  // For now, return mock data
  return NextResponse.json(mockMetricsData)
}
