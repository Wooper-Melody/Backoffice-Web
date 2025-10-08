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
import { CheckCircle } from "lucide-react"
import type { UserAdminResponse } from "@/types/users"

interface UnblockUserModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: UserAdminResponse | null
  onUnblockUser: (user: UserAdminResponse) => Promise<boolean>
}

export function UnblockUserModal({ open, onOpenChange, user, onUnblockUser }: UnblockUserModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleConfirm = async () => {
    if (!user) return
    
    setIsLoading(true)
    try {
      const success = await onUnblockUser(user)
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
            <CheckCircle className="h-5 w-5 text-green-600" />
            Unblock User
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to unblock user <strong>{displayName}</strong> ({user?.email})?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={isLoading}
            className="bg-green-900 hover:bg-green-700 text-white"
          >
            {isLoading ? "Unblocking..." : "Unblock"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
