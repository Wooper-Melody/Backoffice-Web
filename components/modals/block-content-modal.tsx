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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle } from "lucide-react"
import type { ContentAdminResponse } from "@/types/catalog"

interface BlockContentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  content: ContentAdminResponse | null
  onBlockContent: (content: ContentAdminResponse, reason: string, notes?: string) => Promise<boolean>
}

export function BlockContentModal({ open, onOpenChange, content, onBlockContent }: BlockContentModalProps) {
  const [reason, setReason] = useState("COPYRIGHT_VIOLATION")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    if (!content) return

    setLoading(true)
    try {
      const success = await onBlockContent(content, reason, notes || undefined)
      if (success) {
        // Reset form
        setReason("COPYRIGHT_VIOLATION")
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
        setReason("COPYRIGHT_VIOLATION")
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
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Block Content
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to block "{content?.title}"? This action will make the content unavailable to all users.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Reason Code *</Label>
            <Select value={reason} onValueChange={setReason} disabled={loading}>
              <SelectTrigger id="reason">
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="COPYRIGHT_VIOLATION">Copyright Violation</SelectItem>
                <SelectItem value="INAPPROPRIATE_CONTENT">Inappropriate Content</SelectItem>
                <SelectItem value="LEGAL_REQUEST">Legal Request</SelectItem>
                <SelectItem value="QUALITY_ISSUES">Quality Issues</SelectItem>
                <SelectItem value="ARTIST_REQUEST">Artist Request</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Provide additional details about why this content is being blocked..."
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
          <Button variant="destructive" onClick={handleConfirm} disabled={loading}>
            {loading ? "Blocking..." : "Block Content"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
