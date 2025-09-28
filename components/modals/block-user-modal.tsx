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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle } from "lucide-react"

interface BlockUserModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: {
    id: string
    name: string
    email: string
  } | null
  onConfirm: (data: { reason: string; scope: string; notes?: string }) => void
}

export function BlockUserModal({ open, onOpenChange, user, onConfirm }: BlockUserModalProps) {
  const [reason, setReason] = useState("")
  const [scope, setScope] = useState("")
  const [notes, setNotes] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reason || !scope) return

    setIsLoading(true)
    try {
      await onConfirm({ reason, scope, notes })
      onOpenChange(false)
      setReason("")
      setScope("")
      setNotes("")
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
            You are about to block user <strong>{user?.name}</strong> ({user?.email}). This action will restrict their
            access to the platform.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Reason *</Label>
            <Select value={reason} onValueChange={setReason} required>
              <SelectTrigger>
                <SelectValue placeholder="Select blocking reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="violation">Terms of Service Violation</SelectItem>
                <SelectItem value="spam">Spam Activity</SelectItem>
                <SelectItem value="abuse">Abusive Behavior</SelectItem>
                <SelectItem value="copyright">Copyright Infringement</SelectItem>
                <SelectItem value="fraud">Fraudulent Activity</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="scope">Block Scope *</Label>
            <Select value={scope} onValueChange={setScope} required>
              <SelectTrigger>
                <SelectValue placeholder="Select block scope" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="temporary">Temporary (7 days)</SelectItem>
                <SelectItem value="extended">Extended (30 days)</SelectItem>
                <SelectItem value="permanent">Permanent</SelectItem>
                <SelectItem value="content-only">Content Upload Only</SelectItem>
                <SelectItem value="comment-only">Comments Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Optional notes about this blocking action..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="destructive" disabled={!reason || !scope || isLoading}>
              {isLoading ? "Blocking..." : "Block User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
