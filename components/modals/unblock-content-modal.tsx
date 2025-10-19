"use client"

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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ShieldOff } from "lucide-react"
import type { ContentAdminResponse } from "@/types/catalog"

interface UnblockContentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  content: ContentAdminResponse | null
  onUnblockContent: (content: ContentAdminResponse, notes?: string) => Promise<boolean>
}

export function UnblockContentModal({ open, onOpenChange, content, onUnblockContent }: UnblockContentModalProps) {
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    if (!content) return

    setLoading(true)
    try {
      const success = await onUnblockContent(content, notes || undefined)
      if (success) {
        // Reset form
        setNotes("")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!loading) {
      if (!newOpen) {
        // Reset form when closing
        setNotes("")
      }
      onOpenChange(newOpen)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldOff className="h-5 w-5 text-green-500" />
            Unblock Content
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to unblock "{content?.title}"? This will make the content available again to users.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Provide additional details about why this content is being unblocked..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              disabled={loading}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={loading}>
            {loading ? "Unblocking..." : "Unblock Content"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
