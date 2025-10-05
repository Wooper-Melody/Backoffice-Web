"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import { validateCreateUserForm, type ValidationResult } from "@/lib/validation"
import type { CreateUserRequest } from "@/types/users"

interface CreateUserModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateUser: (userData: CreateUserRequest) => Promise<any>
}

export function CreateUserModal({ open, onOpenChange, onCreateUser }: CreateUserModalProps) {
  const [formData, setFormData] = useState<CreateUserRequest>({
    email: "",
    password: "",
    username: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    address: "",
    profilePictureUrl: "",
    biography: "",
    contentFilterEnabled: true,
    isBlocked: false,
  })

  const [loading, setLoading] = useState(false)
  const [validation, setValidation] = useState<ValidationResult>({ isValid: true, errors: [] })
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  // Validate form whenever formData changes
  useEffect(() => {
    const result = validateCreateUserForm(formData)
    setValidation(result)
  }, [formData])

  const handleSubmit = async () => {
    const validationResult = validateCreateUserForm(formData)
    
    if (!validationResult.isValid) {
      // Mark all fields as touched to show validation errors
      const allFields = ['email', 'password', 'username', 'firstName', 'lastName', 'phoneNumber', 'address', 'profilePictureUrl', 'biography']
      const newTouched = allFields.reduce((acc, field) => ({ ...acc, [field]: true }), {})
      setTouched(newTouched)
      return
    }

    setLoading(true)
    try {
      await onCreateUser(formData)
      // Reset form
      setFormData({
        email: "",
        password: "",
        username: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        address: "",
        profilePictureUrl: "",
        biography: "",
        contentFilterEnabled: true,
        isBlocked: false,
      })
      setTouched({})
    } catch (error) {
      console.error("Error creating user:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      onOpenChange(false)
    }
  }

  const handleFieldChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  const getFieldError = (fieldName: string) => {
    if (!touched[fieldName]) return null
    return validation.errors.find(error => error.field === fieldName)?.message
  }

  const hasVisibleErrors = validation.errors.some(error => touched[error.field])

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Admin User</DialogTitle>
          <DialogDescription>
            Only users with the admin role can be created.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                placeholder="admin@example.com"
                required
                className={getFieldError('email') ? 'border-red-500' : ''}
              />
              {getFieldError('email') && (
                <p className="text-sm text-red-500">{getFieldError('email')}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username *</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => handleFieldChange('username', e.target.value)}
                placeholder="adminuser"
                required
                className={getFieldError('username') ? 'border-red-500' : ''}
              />
              {getFieldError('username') && (
                <p className="text-sm text-red-500">{getFieldError('username')}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleFieldChange('password', e.target.value)}
              placeholder="••••••••"
              required
              className={getFieldError('password') ? 'border-red-500' : ''}
            />
            {getFieldError('password') && (
              <p className="text-sm text-red-500">{getFieldError('password')}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName || ""}
                onChange={(e) => handleFieldChange('firstName', e.target.value)}
                placeholder="Juan"
                className={getFieldError('firstName') ? 'border-red-500' : ''}
              />
              {getFieldError('firstName') && (
                <p className="text-sm text-red-500">{getFieldError('firstName')}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName || ""}
                onChange={(e) => handleFieldChange('lastName', e.target.value)}
                placeholder="Pérez"
                className={getFieldError('lastName') ? 'border-red-500' : ''}
              />
              {getFieldError('lastName') && (
                <p className="text-sm text-red-500">{getFieldError('lastName')}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber || ""}
                onChange={(e) => handleFieldChange('phoneNumber', e.target.value)}
                placeholder="+54 11 1234-5678"
                className={getFieldError('phoneNumber') ? 'border-red-500' : ''}
              />
              {getFieldError('phoneNumber') && (
                <p className="text-sm text-red-500">{getFieldError('phoneNumber')}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address || ""}
              onChange={(e) => handleFieldChange('address', e.target.value)}
              placeholder="Walker St. 123, NY"
              className={getFieldError('address') ? 'border-red-500' : ''}
            />
            {getFieldError('address') && (
              <p className="text-sm text-red-500">{getFieldError('address')}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="biography">Biography</Label>
            <Textarea
              id="biography"
              value={formData.biography || ""}
              onChange={(e) => handleFieldChange('biography', e.target.value)}
              placeholder="System administrator..."
              rows={2}
              className={getFieldError('biography') ? 'border-red-500' : ''}
            />
            {getFieldError('biography') && (
              <p className="text-sm text-red-500">{getFieldError('biography')}</p>
            )}
          </div>
        </div>
        
        {hasVisibleErrors && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Please fix the errors in the form to continue.
              </AlertDescription>
            </Alert>
          )}

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={loading || !validation.isValid}
          >
            {loading ? "Creating..." : "Create User"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
