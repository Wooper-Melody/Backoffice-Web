import { type NextRequest, NextResponse } from "next/server"

// Mock regions data
const mockRegions = [
  {
    id: "1",
    name: "North America",
    code: "NA",
    countries: ["United States", "Canada", "Mexico"],
    isActive: true,
    description: "North American region including US, Canada, and Mexico",
    contentCount: 15420,
    createdAt: "2023-01-01T00:00:00Z",
  },
  {
    id: "2",
    name: "Europe",
    code: "EU",
    countries: ["Germany", "France", "United Kingdom", "Spain", "Italy"],
    isActive: true,
    description: "European Union and associated countries",
    contentCount: 18750,
    createdAt: "2023-01-01T00:00:00Z",
  },
  {
    id: "3",
    name: "Asia Pacific",
    code: "APAC",
    countries: ["Japan", "South Korea", "Australia", "Singapore"],
    isActive: false,
    description: "Asia Pacific region - currently under maintenance",
    contentCount: 12300,
    createdAt: "2023-01-01T00:00:00Z",
  },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get("search")
  const status = searchParams.get("status")

  let filteredRegions = [...mockRegions]

  if (search) {
    filteredRegions = filteredRegions.filter(
      (region) =>
        region.name.toLowerCase().includes(search.toLowerCase()) ||
        region.code.toLowerCase().includes(search.toLowerCase()),
    )
  }

  if (status && status !== "all") {
    const isActive = status === "active"
    filteredRegions = filteredRegions.filter((region) => region.isActive === isActive)
  }

  return NextResponse.json({ regions: filteredRegions })
}

export async function POST(request: NextRequest) {
  const body = await request.json()

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const newRegion = {
    id: Date.now().toString(),
    ...body,
    contentCount: 0,
    createdAt: new Date().toISOString(),
  }

  return NextResponse.json({
    success: true,
    message: "Region created successfully",
    data: newRegion,
  })
}
