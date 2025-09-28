import { type NextRequest, NextResponse } from "next/server"

// Mock audit data
const mockAuditLogs = [
  {
    id: "1",
    timestamp: "2024-01-15T10:30:00Z",
    user: "admin@melody.com",
    action: "Content Blocked",
    resource: 'Song: "Example Track"',
    details: "Blocked due to copyright claim",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0...",
    severity: "High",
  },
  {
    id: "2",
    timestamp: "2024-01-15T09:15:00Z",
    user: "moderator@melody.com",
    action: "User Suspended",
    resource: "User: john.doe@example.com",
    details: "Suspended for 7 days due to spam activity",
    ipAddress: "192.168.1.101",
    userAgent: "Mozilla/5.0...",
    severity: "Medium",
  },
  {
    id: "3",
    timestamp: "2024-01-15T08:45:00Z",
    user: "admin@melody.com",
    action: "Region Updated",
    resource: "Region: Europe (EU)",
    details: "Added new countries to region configuration",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0...",
    severity: "Low",
  },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get("search")
  const action = searchParams.get("action")
  const severity = searchParams.get("severity")
  const startDate = searchParams.get("startDate")
  const endDate = searchParams.get("endDate")
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "10")

  let filteredLogs = [...mockAuditLogs]

  // Apply filters
  if (search) {
    filteredLogs = filteredLogs.filter(
      (log) =>
        log.user.toLowerCase().includes(search.toLowerCase()) ||
        log.action.toLowerCase().includes(search.toLowerCase()) ||
        log.resource.toLowerCase().includes(search.toLowerCase()),
    )
  }

  if (action && action !== "all") {
    filteredLogs = filteredLogs.filter((log) => log.action.toLowerCase().includes(action.toLowerCase()))
  }

  if (severity && severity !== "all") {
    filteredLogs = filteredLogs.filter((log) => log.severity.toLowerCase() === severity.toLowerCase())
  }

  if (startDate) {
    filteredLogs = filteredLogs.filter((log) => new Date(log.timestamp) >= new Date(startDate))
  }

  if (endDate) {
    filteredLogs = filteredLogs.filter((log) => new Date(log.timestamp) <= new Date(endDate))
  }

  // Pagination
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedLogs = filteredLogs.slice(startIndex, endIndex)

  return NextResponse.json({
    logs: paginatedLogs,
    pagination: {
      page,
      limit,
      total: filteredLogs.length,
      totalPages: Math.ceil(filteredLogs.length / limit),
    },
  })
}
