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

interface BlockUserModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: UserAdminResponse | null
  onBlockUser: (user: UserAdminResponse) => Promise<boolean>
}

export function BlockUserModal({ open, onOpenChange, user, onBlockUser }: BlockUserModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleConfirm = async () => {
    if (!user) return
    
    setIsLoading(true)
    try {
      const success = await onBlockUser(user)
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
            Block User
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to block user <strong>{displayName}</strong> ({user?.email})?
            <br />
            <br />
            This action will restrict their access to the platform and can be reverted later.
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            type="button" 
            variant="destructive" 
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Blocking..." : "Confirm Block"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
