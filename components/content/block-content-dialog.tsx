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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Shield, AlertTriangle } from "lucide-react"

const regions = [
  { id: "global", name: "Global" },
  { id: "us", name: "Estados Unidos" },
  { id: "eu", name: "Europa" },
  { id: "asia", name: "Asia" },
  { id: "latam", name: "América Latina" },
]

const reasonCodes = [
  { value: "copyright", label: "Violación de derechos de autor" },
  { value: "content_policy", label: "Violación de políticas de contenido" },
  { value: "legal_request", label: "Solicitud legal" },
  { value: "quality_issues", label: "Problemas de calidad" },
  { value: "licensing", label: "Problemas de licenciamiento" },
  { value: "other", label: "Otro motivo" },
]

interface BlockContentDialogProps {
  contentTitle: string
  contentType: string
  trigger?: React.ReactNode
}

export function BlockContentDialog({ contentTitle, contentType, trigger }: BlockContentDialogProps) {
  const [open, setOpen] = useState(false)
  const [scope, setScope] = useState<"global" | "regions">("global")
  const [selectedRegions, setSelectedRegions] = useState<string[]>([])
  const [reasonCode, setReasonCode] = useState("")
  const [additionalNotes, setAdditionalNotes] = useState("")

  const handleRegionChange = (regionId: string, checked: boolean) => {
    if (checked) {
      setSelectedRegions([...selectedRegions, regionId])
    } else {
      setSelectedRegions(selectedRegions.filter((id) => id !== regionId))
    }
  }

  const handleBlock = () => {
    // Here you would implement the actual blocking logic
    console.log("Blocking content:", {
      scope,
      regions: scope === "regions" ? selectedRegions : ["global"],
      reasonCode,
      additionalNotes,
    })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="destructive" size="sm">
            <Shield className="h-4 w-4 mr-2" />
            Bloquear
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <span>Bloquear contenido</span>
          </DialogTitle>
          <DialogDescription>
            Vas a bloquear "{contentTitle}" ({contentType}). Esta acción tendrá efecto inmediato.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Scope Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Alcance del bloqueo</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="global"
                  name="scope"
                  value="global"
                  checked={scope === "global"}
                  onChange={(e) => setScope(e.target.value as "global")}
                  className="h-4 w-4"
                />
                <Label htmlFor="global">Global (todas las regiones)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="regions"
                  name="scope"
                  value="regions"
                  checked={scope === "regions"}
                  onChange={(e) => setScope(e.target.value as "regions")}
                  className="h-4 w-4"
                />
                <Label htmlFor="regions">Regiones específicas</Label>
              </div>
            </div>
          </div>

          {/* Region Selection */}
          {scope === "regions" && (
            <div className="space-y-3">
              <Label className="text-sm font-medium">Seleccionar regiones</Label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {regions
                  .filter((r) => r.id !== "global")
                  .map((region) => (
                    <div key={region.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={region.id}
                        checked={selectedRegions.includes(region.id)}
                        onCheckedChange={(checked) => handleRegionChange(region.id, checked as boolean)}
                      />
                      <Label htmlFor={region.id} className="text-sm">
                        {region.name}
                      </Label>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Reason Code */}
          <div className="space-y-3">
            <Label htmlFor="reason" className="text-sm font-medium">
              Motivo del bloqueo *
            </Label>
            <Select value={reasonCode} onValueChange={setReasonCode}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un motivo" />
              </SelectTrigger>
              <SelectContent>
                {reasonCodes.map((reason) => (
                  <SelectItem key={reason.value} value={reason.value}>
                    {reason.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Additional Notes */}
          <div className="space-y-3">
            <Label htmlFor="notes" className="text-sm font-medium">
              Notas adicionales
            </Label>
            <Textarea
              id="notes"
              placeholder="Información adicional sobre el bloqueo..."
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleBlock}
            disabled={!reasonCode || (scope === "regions" && selectedRegions.length === 0)}
          >
            <Shield className="h-4 w-4 mr-2" />
            Confirmar bloqueo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
