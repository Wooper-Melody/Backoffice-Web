"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ShieldOff, CheckCircle } from "lucide-react"

interface UnblockContentDialogProps {
  contentTitle: string
  contentType: string
  trigger?: React.ReactNode
}

export function UnblockContentDialog({ contentTitle, contentType, trigger }: UnblockContentDialogProps) {
  const [open, setOpen] = useState(false)
  const [notes, setNotes] = useState("")

  const handleUnblock = () => {
    // Here you would implement the actual unblocking logic
    console.log("Unblocking content:", {
      notes,
    })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <ShieldOff className="h-4 w-4 mr-2" />
            Desbloquear
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span>Desbloquear contenido</span>
          </DialogTitle>
          <DialogDescription>
            Vas a desbloquear "{contentTitle}" ({contentType}). El contenido volverá a su estado de disponibilidad
            anterior.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-3">
            <Label htmlFor="unblock-notes" className="text-sm font-medium">
              Notas del desbloqueo
            </Label>
            <Textarea
              id="unblock-notes"
              placeholder="Motivo del desbloqueo o información adicional..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleUnblock}>
            <ShieldOff className="h-4 w-4 mr-2" />
            Confirmar desbloqueo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
