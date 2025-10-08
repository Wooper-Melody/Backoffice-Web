import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const userId = params.id

  // Mock detailed user data
  const mockUserDetails = {
    id: userId,
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Admin",
    status: "Active",
    lastLogin: "2024-01-15T10:30:00Z",
    createdAt: "2023-06-01T00:00:00Z",
    country: "United States",
    subscription: "Premium",
    totalPlaylists: 15,
    totalFollowers: 1250,
    totalStreams: 45680,
    favoriteGenres: ["Rock", "Jazz", "Electronic"],
    recentActivity: [
      { action: "Created playlist", timestamp: "2024-01-15T10:30:00Z" },
      { action: "Followed artist", timestamp: "2024-01-14T15:20:00Z" },
      { action: "Liked song", timestamp: "2024-01-14T12:45:00Z" },
    ],
    deviceInfo: {
      lastDevice: "iPhone 15 Pro",
      platform: "iOS",
      appVersion: "2.1.0",
    },
  }

  return NextResponse.json(mockUserDetails)
}
