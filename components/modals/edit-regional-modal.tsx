"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"

interface EditRegionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  region: any
  onSave: (region: any) => void
}

const availableCountries = [
  "United States",
  "Canada",
  "United Kingdom",
  "Germany",
  "France",
  "Spain",
  "Italy",
  "Japan",
  "Australia",
  "Brazil",
  "Mexico",
  "Argentina",
  "India",
  "China",
  "South Korea",
  "Netherlands",
  "Sweden",
  "Norway",
  "Denmark",
  "Finland",
]

export function EditRegionModal({ open, onOpenChange, region, onSave }: EditRegionModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    countries: [] as string[],
  })

  useEffect(() => {
    if (region) {
      setFormData({
        name: region.name || "",
        code: region.code || "",
        description: region.description || "",
        countries: region.countries || [],
      })
    } else {
      setFormData({
        name: "",
        code: "",
        description: "",
        countries: [],
      })
    }
  }, [region])

  const handleSave = async () => {
    try {
      const endpoint = region ? `/api/regions/${region.id}` : "/api/regions"
      const method = region ? "PUT" : "POST"

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        onSave({ ...region, ...formData })
      }
    } catch (error) {
      console.error("Error saving region:", error)
    }
  }

  const handleCountryToggle = (country: string) => {
    setFormData((prev) => ({
      ...prev,
      countries: prev.countries.includes(country)
        ? prev.countries.filter((c) => c !== country)
        : [...prev.countries, country],
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>{region ? "Edit Region" : "Create New Region"}</DialogTitle>
          <DialogDescription>
            {region ? "Update region configuration" : "Configure a new region for content distribution"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Region Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Europe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">Region Code</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value.toUpperCase() }))}
                placeholder="e.g., EU"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Optional description for this region"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>Countries ({formData.countries.length} selected)</Label>
            <ScrollArea className="h-48 border rounded-md p-4">
              <div className="grid grid-cols-2 gap-2">
                {availableCountries.map((country) => (
                  <div key={country} className="flex items-center space-x-2">
                    <Checkbox
                      id={country}
                      checked={formData.countries.includes(country)}
                      onCheckedChange={() => handleCountryToggle(country)}
                    />
                    <Label htmlFor={country} className="text-sm">
                      {country}
                    </Label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>{region ? "Save Changes" : "Create Region"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
