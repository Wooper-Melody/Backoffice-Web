import { type NextRequest, NextResponse } from "next/server"

// Configure API base URL with validation
function getApiBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL
  
  if (!url) {
    console.warn('NEXT_PUBLIC_API_URL is not set, using local fallback')
    return 'http://localhost:30002'
  }
  
  // Validate that the URL is valid
  try {
    new URL(url)
    return url
  } catch (error) {
    console.error('NEXT_PUBLIC_API_URL is not a valid URL:', url)
    return 'http://localhost:30002'
  }
}

const API_BASE_URL = getApiBaseUrl()

export async function POST(request: NextRequest) {
  try {
    const { refreshToken } = await request.json()

    if (!refreshToken) {
      return NextResponse.json(
        { 
          type: "about:blank",
          title: "Bad Request", 
          status: 400,
          detail: "Refresh token is required",
          instance: "/auth/refresh"
        }, 
        { status: 400 }
      )
    }

    // Forward the refresh request to the actual backend API
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken })
    })

    const data = await response.json()

    if (response.ok) {
      // Return the successful response from the backend
      return NextResponse.json(data)
    } else {
      // Forward the error response from the backend
      return NextResponse.json(data, { status: response.status })
    }
  } catch (error) {
    console.error("Refresh token proxy error:", error)
    return NextResponse.json(
      { 
        type: "about:blank",
        title: "Internal Server Error", 
        status: 500,
        detail: "Error interno del servidor",
        instance: "/auth/refresh"
      }, 
      { status: 500 }
    )
  }
}