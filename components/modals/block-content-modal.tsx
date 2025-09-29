"use client"

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

interface BlockContentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: any
  onConfirm: (item: any) => void
}

export function BlockContentModal({ open, onOpenChange, item, onConfirm }: BlockContentModalProps) {
  const handleConfirm = async () => {
    try {
      const response = await fetch(`/api/catalog/${item.id}/block`, {
        method: "POST",
      })

      if (response.ok) {
        onConfirm(item)
      }
    } catch (error) {
      console.error("Error blocking content:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Block Content
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to block "{item?.title}"? This action will make the content unavailable to users.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            Block Content
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
