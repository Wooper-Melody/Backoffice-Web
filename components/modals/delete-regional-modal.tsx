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

interface DeleteRegionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  region: any
  onConfirm: (region: any) => void
}

export function DeleteRegionModal({ open, onOpenChange, region, onConfirm }: DeleteRegionModalProps) {
  const handleConfirm = async () => {
    try {
      const response = await fetch(`/api/regions/${region.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        onConfirm(region)
      }
    } catch (error) {
      console.error("Error deleting region:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Delete Region
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the region "{region?.name}"? This action cannot be undone and may affect
            content availability policies.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            Delete Region
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
