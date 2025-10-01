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

interface BlockUserModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: {
    id: string
    name: string
    email: string
  } | null
  onConfirm: () => void
}

export function BlockUserModal({ open, onOpenChange, user, onConfirm }: BlockUserModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleConfirm = async () => {
    setIsLoading(true)
    try {
      await onConfirm()
      onOpenChange(false)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Block User
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to block user <strong>{user?.name}</strong> ({user?.email})?
            <br />
            <br />
            This action will restrict their access to the platform and cannot be undone immediately.
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
