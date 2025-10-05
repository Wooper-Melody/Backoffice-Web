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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import { validateUpdateUserForm, type ValidationResult } from "@/lib/validation"
import { useAuth } from "@/components/auth/auth-provider"
import type { UserAdminResponse, UpdateUserRequest } from "@/types/users"

interface EditUserModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: UserAdminResponse | null
  onSaveUser: (userData: UpdateUserRequest) => Promise<any>
}

export function EditUserModal({ open, onOpenChange, user, onSaveUser }: EditUserModalProps) {
  const [formData, setFormData] = useState<UpdateUserRequest>({
    email: "",
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
  const { user: currentUser } = useAuth()

  // Check if editing current logged-in user
  const isCurrentUser = user && currentUser && user.id === currentUser.id

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || "",
        username: user.username || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phoneNumber: user.phoneNumber || "",
        address: user.address || "",
        profilePictureUrl: user.profilePictureUrl || "",
        biography: user.bio || "",
        contentFilterEnabled: user.contentFilterEnabled ?? true,
        isBlocked: user.isBlocked ?? false,
      })
      // Reset validation when user changes
      setTouched({})
    }
  }, [user])

  // Validate form whenever formData changes
  useEffect(() => {
    const result = validateUpdateUserForm(formData)
    setValidation(result)
  }, [formData])

  const handleSubmit = async () => {
    if (!user) return

    const validationResult = validateUpdateUserForm(formData)
    
    if (!validationResult.isValid) {
      // Mark all fields as touched to show validation errors
      const allFields = ['email', 'username', 'firstName', 'lastName', 'phoneNumber', 'address', 'profilePictureUrl', 'biography']
      const newTouched = allFields.reduce((acc, field) => ({ ...acc, [field]: true }), {})
      setTouched(newTouched)
      return
    }

    setLoading(true)
    try {
      await onSaveUser(formData)
    } catch (error) {
      console.error("Error updating user:", error)
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

  if (!user) return null

  const roleColors = {
    ADMIN: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    ARTIST: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    LISTENER: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    UNDECLARED: "bg-neutral-500/10 text-neutral-500 border-neutral-500/20",
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update user account information. User role cannot be changed.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.profilePictureUrl || "/placeholder-user.jpg"} alt={user.username ?? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()} />
              <AvatarFallback>
                {((user.firstName ?? user.username ?? "") as string)
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">
                {[user.firstName, user.lastName].filter(Boolean).join(' ') || user.username}
                {isCurrentUser && (
                  <span className="text-xs text-muted-foreground px-2 py-1 rounded-md">
                    (You)
                  </span>
                )}
              </h3>
              <p className="text-sm text-muted-foreground">ID: {user.id}</p>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="outline" className={roleColors[user.role]}>
                  {user.role === 'LISTENER' ? 'Listener' : 
                   user.role === 'ARTIST' ? 'Artist' : 
                   user.role === 'ADMIN' ? 'Admin' : 
                   'Undeclared'}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Registered: {new Date(user.createdAt).toLocaleDateString('es-ES')}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ""}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                placeholder="user@example.com"
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
                value={formData.username || ""}
                onChange={(e) => handleFieldChange('username', e.target.value)}
                placeholder="username"
                className={getFieldError('username') ? 'border-red-500' : ''}
              />
              {getFieldError('username') && (
                <p className="text-sm text-red-500">{getFieldError('username')}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName || ""}
                onChange={(e) => handleFieldChange('firstName', e.target.value)}
                placeholder="John"
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
                placeholder="Doe"
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
            <div className="space-y-2">
              <Label htmlFor="profilePictureUrl">Profile Picture URL</Label>
              <Input
                id="profilePictureUrl"
                value={formData.profilePictureUrl || ""}
                onChange={(e) => handleFieldChange('profilePictureUrl', e.target.value)}
                placeholder="https://example.com/avatar.jpg"
                className={getFieldError('profilePictureUrl') ? 'border-red-500' : ''}
              />
              {getFieldError('profilePictureUrl') && (
                <p className="text-sm text-red-500">{getFieldError('profilePictureUrl')}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address || ""}
              onChange={(e) => handleFieldChange('address', e.target.value)}
              placeholder="1234 Corrientes Ave, CABA"
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
              placeholder="User biography..."
              rows={3}
              className={getFieldError('biography') ? 'border-red-500' : ''}
            />
            {getFieldError('biography') && (
              <p className="text-sm text-red-500">{getFieldError('biography')}</p>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="contentFilter"
                checked={formData.contentFilterEnabled}
                onCheckedChange={(checked) => 
                  setFormData((prev) => ({ ...prev, contentFilterEnabled: checked }))
                }
              />
              <Label htmlFor="contentFilter">Content filter enabled</Label>
            </div>

            {!isCurrentUser && (
              <div className="flex items-center space-x-2">
                <Switch
                  id="isBlocked"
                  checked={formData.isBlocked}
                  onCheckedChange={(checked) => 
                    setFormData((prev) => ({ ...prev, isBlocked: checked }))
                  }
                />
                <Label htmlFor="isBlocked">User blocked</Label>
              </div>
            )}
          </div>

          <div className="text-sm text-muted-foreground">
            <strong>Note:</strong> User role cannot be modified from this screen.
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
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
