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
    // Get the access token from the request headers
    const authHeader = request.headers.get('authorization')
    const xAccessToken = request.headers.get('x-access-token')
    
    const token = xAccessToken || (authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null)

    if (!token) {
      // Even if no token is provided, we'll return success to allow client-side cleanup
      return NextResponse.json({
        success: true,
        message: "Logout successful",
      })
    }

    // Forward the logout request to the actual backend API
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token
      }
    })

    if (response.ok) {
      // Return success regardless of backend response for logout
      return NextResponse.json({
        success: true,
        message: "Logout successful",
      })
    } else {
      // Even if backend logout fails, we'll return success to allow client-side cleanup
      console.warn('Backend logout failed but continuing with client-side cleanup')
      return NextResponse.json({
        success: true,
        message: "Logout successful",
      })
    }
  } catch (error) {
    console.error("Logout proxy error:", error)
    // Even if there's an error, we'll return success to allow client-side cleanup
    return NextResponse.json({
      success: true,
      message: "Logout successful",
    })
  }
}
