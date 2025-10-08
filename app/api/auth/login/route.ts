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
    const { email, password } = await request.json()

    // Forward the login request to the actual backend API
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
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
    console.error("Login proxy error:", error)
    return NextResponse.json(
      { 
        type: "about:blank",
        title: "Internal Server Error", 
        status: 500,
        detail: "Error interno del servidor",
        instance: "/auth/login"
      }, 
      { status: 500 }
    )
  }
}
