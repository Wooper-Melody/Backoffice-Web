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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"

interface RegionConfigModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  region?: {
    id: string
    name: string
    code: string
    countries: string[]
    isActive: boolean
    description?: string
  } | null
  onConfirm: (data: any) => void
}

export function RegionConfigModal({ open, onOpenChange, region, onConfirm }: RegionConfigModalProps) {
  const [name, setName] = useState(region?.name || "")
  const [code, setCode] = useState(region?.code || "")
  const [description, setDescription] = useState(region?.description || "")
  const [countries, setCountries] = useState<string[]>(region?.countries || [])
  const [newCountry, setNewCountry] = useState("")
  const [isActive, setIsActive] = useState(region?.isActive ?? true)
  const [isLoading, setIsLoading] = useState(false)

  const addCountry = () => {
    if (newCountry.trim() && !countries.includes(newCountry.trim())) {
      setCountries([...countries, newCountry.trim()])
      setNewCountry("")
    }
  }

  const removeCountry = (country: string) => {
    setCountries(countries.filter((c) => c !== country))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !code || countries.length === 0) return

    setIsLoading(true)
    try {
      await onConfirm({
        name,
        code: code.toUpperCase(),
        description,
        countries,
        isActive,
      })
      onOpenChange(false)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{region ? "Edit Region" : "Create New Region"}</DialogTitle>
          <DialogDescription>Configure regional availability settings for content distribution.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Region Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., North America"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">Region Code *</Label>
              <Input
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g., NA"
                maxLength={4}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description of this region..."
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>Countries *</Label>
            <div className="flex gap-2">
              <Input
                value={newCountry}
                onChange={(e) => setNewCountry(e.target.value)}
                placeholder="Add country..."
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addCountry())}
              />
              <Button type="button" onClick={addCountry} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {countries.map((country) => (
                <Badge key={country} variant="secondary" className="flex items-center gap-1">
                  {country}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeCountry(country)} />
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="active" checked={isActive} onCheckedChange={setIsActive} />
            <Label htmlFor="active">Active Region</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!name || !code || countries.length === 0 || isLoading}>
              {isLoading ? "Saving..." : region ? "Update Region" : "Create Region"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
