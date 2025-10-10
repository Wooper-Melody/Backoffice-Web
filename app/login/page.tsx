"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from '@/components/auth/auth-provider'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Music, Eye, EyeOff, Loader2, AlertTriangle } from "lucide-react"
import { validateLoginForm, type ValidationResult } from "@/lib/validation"
import { api } from "@/lib/api"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [validation, setValidation] = useState<ValidationResult>({ isValid: true, errors: [] })
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const router = useRouter()
  const { login } = useAuth()

  // Validate form whenever email or password changes
  useEffect(() => {
    const result = validateLoginForm({ email, password })
    setValidation(result)
  }, [email, password])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form before submission
    const validationResult = validateLoginForm({ email, password })
    
    if (!validationResult.isValid) {
      // Mark all fields as touched to show validation errors
      setTouched({ email: true, password: true })
      return
    }

    setIsLoading(true)
    setError("")
    console.log('Attempting login with email:', email);
    try {
      // Use the centralized API client instead of direct fetch
      const data = await api.login({ email, password })

      // Check if we received both access token and refresh token
      if (data.token && data.refreshToken && data.user) {
        // Use auth context so provider updates app state and performs navigation
        try {
          login(data.token, data.refreshToken, data.user)
        } catch (err) {
          // Fallback: store tokens and navigate
          sessionStorage.setItem("admin_token", data.token)
          sessionStorage.setItem("admin_refresh_token", data.refreshToken)
          sessionStorage.setItem("admin_user", JSON.stringify(data.user))
          router.push("/catalog")
        }
      } else {
        setError("Invalid response from server - missing required tokens or expiration")
      }
    } catch (error) {
      console.error("Login error:", error)
      // Extract error message from API client error
      const errorMessage = error instanceof Error ? error.message : "Error while connecting. Please try again."
      setError(errorMessage.includes("API Error") ? errorMessage.split(" - ")[1] || "Invalid credentials" : errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFieldChange = (field: string, value: string) => {
    if (field === 'email') {
      setEmail(value)
    } else if (field === 'password') {
      setPassword(value)
    }
    setTouched((prev) => ({ ...prev, [field]: true }))
    // Clear server error when user starts typing
    if (error) setError("")
  }

  const getFieldError = (fieldName: string) => {
    if (!touched[fieldName]) return null
    return validation.errors.find(error => error.field === fieldName)?.message
  }

  const hasVisibleErrors = validation.errors.some(error => touched[error.field])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-lg">
              <Music className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Admin Melody Panel</CardTitle>
          <CardDescription>Access the admin panel of the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                autoComplete="email"
                type="email"
                placeholder="admin@melody.com"
                value={email}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                required
                disabled={isLoading}
                className={getFieldError('email') ? 'border-red-500' : ''}
              />
              {getFieldError('email') && (
                <p className="text-sm text-red-500">{getFieldError('email')}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  autoComplete="current-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => handleFieldChange('password', e.target.value)}
                  required
                  disabled={isLoading}
                  className={getFieldError('password') ? 'border-red-500' : ''}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {getFieldError('password') && (
                <p className="text-sm text-red-500">{getFieldError('password')}</p>
              )}
            </div>

            {hasVisibleErrors && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Please fix the errors in the form to continue.
                </AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || !validation.isValid}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Log in"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
