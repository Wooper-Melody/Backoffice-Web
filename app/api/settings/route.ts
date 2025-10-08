import { type NextRequest, NextResponse } from "next/server"

// Mock settings data
const mockSettings = {
  general: {
    siteName: "Melody Admin",
    siteDescription: "Music streaming platform administration",
    supportEmail: "support@melody.com",
    maintenanceMode: false,
  },
  content: {
    autoModeration: true,
    requireApproval: false,
    maxUploadSize: 50, // MB
    allowedFormats: ["mp3", "wav", "flac"],
    copyrightProtection: true,
  },
  users: {
    allowRegistration: true,
    emailVerification: true,
    maxPlaylistsPerUser: 100,
    inactivityTimeout: 30, // days
  },
  regions: {
    defaultRegion: "NA",
    autoDetectRegion: true,
    restrictedCountries: ["Country1", "Country2"],
  },
  notifications: {
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    adminAlerts: true,
  },
}

export async function GET() {
  return NextResponse.json(mockSettings)
}

export async function POST(request: NextRequest) {
  const body = await request.json()

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return NextResponse.json({
    success: true,
    message: "Settings updated successfully",
    data: body,
  })
}
