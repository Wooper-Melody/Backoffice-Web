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
import { ShieldOff } from "lucide-react"

interface UnblockContentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  content: any
  onConfirm: (content: any) => void
}

export function UnblockContentModal({ open, onOpenChange, content, onConfirm }: UnblockContentModalProps) {
  const handleConfirm = async () => {
    try {
      const response = await fetch(`/api/content/${content.id}/unblock`, {
        method: "POST",
      })

      if (response.ok) {
        onConfirm(content)
      }
    } catch (error) {
      console.error("Error unblocking content:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldOff className="h-5 w-5 text-green-500" />
            Unblock Content
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to unblock "{content?.title}"? This will make the content available again in the
            specified regions.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Unblock Content</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
