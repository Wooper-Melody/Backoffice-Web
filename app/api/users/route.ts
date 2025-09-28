import { type NextRequest, NextResponse } from "next/server"

// Mock user data
const mockUsers = [
  {
    id: "1",
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
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "User",
    status: "Blocked",
    lastLogin: "2024-01-10T15:45:00Z",
    createdAt: "2023-08-15T00:00:00Z",
    country: "Canada",
    subscription: "Free",
    totalPlaylists: 8,
    totalFollowers: 320,
    blockReason: "Terms of Service Violation",
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    role: "Moderator",
    status: "Active",
    lastLogin: "2024-01-14T09:20:00Z",
    createdAt: "2023-09-20T00:00:00Z",
    country: "United Kingdom",
    subscription: "Premium",
    totalPlaylists: 22,
    totalFollowers: 890,
  },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get("search")
  const status = searchParams.get("status")
  const role = searchParams.get("role")
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "10")

  let filteredUsers = [...mockUsers]

  // Apply filters
  if (search) {
    filteredUsers = filteredUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()),
    )
  }

  if (status && status !== "all") {
    filteredUsers = filteredUsers.filter((user) => user.status.toLowerCase() === status.toLowerCase())
  }

  if (role && role !== "all") {
    filteredUsers = filteredUsers.filter((user) => user.role.toLowerCase() === role.toLowerCase())
  }

  // Pagination
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex)

  return NextResponse.json({
    users: paginatedUsers,
    pagination: {
      page,
      limit,
      total: filteredUsers.length,
      totalPages: Math.ceil(filteredUsers.length / limit),
    },
  })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { action, userId, ...data } = body

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  if (action === "block") {
    return NextResponse.json({
      success: true,
      message: `User ${userId} has been blocked successfully`,
      data: { userId, ...data },
    })
  }

  if (action === "unblock") {
    return NextResponse.json({
      success: true,
      message: `User ${userId} has been unblocked successfully`,
      data: { userId, ...data },
    })
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 })
}
