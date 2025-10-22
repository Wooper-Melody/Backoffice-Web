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
import type { ContentAdminResponse, BlockReason } from "@/types/catalog"
import { BLOCK_REASON_LABELS } from "@/types/catalog"

interface BlockContentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  content: ContentAdminResponse | null
  onBlockContent: (content: ContentAdminResponse, reason: BlockReason, comment?: string) => Promise<boolean>
}

export function BlockContentModal({ open, onOpenChange, content, onBlockContent }: BlockContentModalProps) {
  const [reason, setReason] = useState<BlockReason>("COPYRIGHT_VIOLATION")
  const [comment, setcomment] = useState("")
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    if (!content) return

    setLoading(true)
    try {
      const success = await onBlockContent(content, reason, comment || undefined)
      if (success) {
        // Reset form
        setReason("COPYRIGHT_VIOLATION")
        setcomment("")
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
        setcomment("")
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
            <Select value={reason} onValueChange={(value) => setReason(value as BlockReason)} disabled={loading}>
              <SelectTrigger id="reason">
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="COPYRIGHT_VIOLATION">{BLOCK_REASON_LABELS.COPYRIGHT_VIOLATION}</SelectItem>
                <SelectItem value="INAPPROPRIATE_CONTENT">{BLOCK_REASON_LABELS.INAPPROPRIATE_CONTENT}</SelectItem>
                <SelectItem value="COMMUNITY_GUIDELINES_VIOLATION">{BLOCK_REASON_LABELS.COMMUNITY_GUIDELINES_VIOLATION}</SelectItem>
                <SelectItem value="SPAM_OR_MISLEADING">{BLOCK_REASON_LABELS.SPAM_OR_MISLEADING}</SelectItem>
                <SelectItem value="LEGAL_REQUEST">{BLOCK_REASON_LABELS.LEGAL_REQUEST}</SelectItem>
                <SelectItem value="LICENSING_ISSUE">{BLOCK_REASON_LABELS.LICENSING_ISSUE}</SelectItem>
                <SelectItem value="ARTIST_REQUEST">{BLOCK_REASON_LABELS.ARTIST_REQUEST}</SelectItem>
                <SelectItem value="QUALITY_STANDARDS">{BLOCK_REASON_LABELS.QUALITY_STANDARDS}</SelectItem>
                <SelectItem value="OTHER">{BLOCK_REASON_LABELS.OTHER}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Additional comment (Optional)</Label>
            <Textarea
              id="comment"
              placeholder="Provide additional details about why this content is being blocked..."
              value={comment}
              onChange={(e) => setcomment(e.target.value)}
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
