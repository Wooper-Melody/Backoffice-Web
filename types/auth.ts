// Auth-related type definitions

export interface AuthResponse {
  token: string
  tokenType: string
  refreshToken: string
  user: UserResponse
}

export interface UserResponse {
  id: string
  email: string
  username: string
  role: "LISTENER" | "ARTIST" | "ADMIN" | "UNDECLARED"
  isBlocked: boolean
  createdAt: string
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}