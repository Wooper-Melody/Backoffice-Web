"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import type { UserAdminResponse } from "@/types/users"

interface DeleteUserModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: UserAdminResponse | null
  onDeleteUser: (user: UserAdminResponse) => Promise<boolean>
}

export function DeleteUserModal({ open, onOpenChange, user, onDeleteUser }: DeleteUserModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleConfirm = async () => {
    if (!user) return
    
    setIsLoading(true)
    try {
      const success = await onDeleteUser(user)
      if (success) {
        onOpenChange(false)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.username

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Delete User
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to permanently delete the user <strong>{displayName}</strong> ({user?.email})?
            <br />
            <br />
            <span className="text-destructive font-medium">
              This action cannot be undone. All user data will be permanently removed from the platform.
            </span>
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button 
            type="button" 
            variant="destructive" 
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete User"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}