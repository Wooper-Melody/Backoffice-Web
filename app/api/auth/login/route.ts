import { type NextRequest, NextResponse } from "next/server"

// Mock admin credentials - in production this would connect to a real database
const ADMIN_CREDENTIALS = {
  email: "admin@melody.com",
  password: "admin123",
  name: "Administrator",
  role: "admin",
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validate credentials
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      // Generate a simple token (in production, use JWT or similar)
      const token = btoa(`${email}:${Date.now()}`)

      return NextResponse.json({
        success: true,
        token,
        user: {
          email: ADMIN_CREDENTIALS.email,
          name: ADMIN_CREDENTIALS.name,
          role: ADMIN_CREDENTIALS.role,
        },
      })
    } else {
      return NextResponse.json({ success: false, message: "Credenciales inválidas" }, { status: 401 })
    }
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ success: false, message: "Error interno del servidor" }, { status: 500 })
  }
}
