"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Globe, Check, X, ShieldOff, ShieldCheck } from "lucide-react"
import { REGION_LABELS, type Region } from "@/types/catalog"

interface RegionAvailabilityModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contentId: string
  contentType: "SONG" | "COLLECTION"
  contentTitle: string
  currentBlockedRegions: string[]
  onUpdate: (blockedRegions: string[]) => Promise<boolean>
}

export function RegionAvailabilityModal({
  open,
  onOpenChange,
  contentId,
  contentType,
  contentTitle,
  currentBlockedRegions,
  onUpdate,
}: RegionAvailabilityModalProps) {
  const [blockedRegions, setBlockedRegions] = useState<Set<string>>(new Set())
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize with current blocked regions when modal opens
  useEffect(() => {
    if (open) {
      setBlockedRegions(new Set(currentBlockedRegions))
    }
  }, [open, currentBlockedRegions])

  const handleToggleRegion = (region: string) => {
    const newBlockedRegions = new Set(blockedRegions)
    if (newBlockedRegions.has(region)) {
      newBlockedRegions.delete(region)
    } else {
      newBlockedRegions.add(region)
    }
    setBlockedRegions(newBlockedRegions)
  }

  const handleSelectAll = () => {
    // Get all regions including GLB
    const allRegions = Object.keys(REGION_LABELS)
    setBlockedRegions(new Set(allRegions))
  }

  const handleClearAll = () => {
    setBlockedRegions(new Set())
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    const success = await onUpdate(Array.from(blockedRegions))
    setIsSubmitting(false)
    
    if (success) {
      onOpenChange(false)
    }
  }

  const totalRegions = Object.keys(REGION_LABELS).length // Include GLB
  const blockedCount = blockedRegions.size
  const availableCount = totalRegions - blockedCount
  const hasChanges = JSON.stringify(Array.from(blockedRegions).sort()) !== JSON.stringify(currentBlockedRegions.sort())

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-h-[90vh] flex flex-col sm:!max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Regional Availability Management
          </DialogTitle>
          <DialogDescription>
            Configure regional restrictions for <strong>{contentTitle}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-y-auto width-full">
          {/* Status Summary Card */}
          <div className="grid grid-cols-2 gap-3">
            <div className="border rounded-lg p-4 bg-green-50 dark:bg-green-950/20">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium text-green-900 dark:text-green-100">Available</span>
                </div>
                <Badge variant="outline" className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700">
                  {availableCount} regions
                </Badge>
              </div>
              <p className="text-xs text-green-700 dark:text-green-300">
                Content accessible in these regions
              </p>
            </div>

            <div className="border rounded-lg p-4 bg-red-50 dark:bg-red-950/20">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <ShieldOff className="h-4 w-4 text-red-600 dark:text-red-400" />
                  <span className="text-sm font-medium text-red-900 dark:text-red-100">Blocked</span>
                </div>
                <Badge variant="outline" className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700">
                  {blockedCount} regions
                </Badge>
              </div>
              <p className="text-xs text-red-700 dark:text-red-300">
                Content restricted in these regions
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">
              Select regions to block ({blockedCount} of {totalRegions})
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleClearAll}
                disabled={blockedCount === 0}
                className="gap-2"
              >
                <Check className="h-3 w-3" />
                Allow All
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
                disabled={blockedCount === totalRegions}
                className="gap-2"
              >
                <X className="h-3 w-3" />
                Block All
              </Button>
            </div>
          </div>

          {/* Regions Grid */}
          <div className="border rounded-lg p-3">
            {/* Global Region - Destacada */}
            <div className="mb-4">
              <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                Unspecified Region
              </div>
              {(() => {
                const isBlocked = blockedRegions.has("GLB")
                return (
                  <div
                    key="GLB"
                    className={`flex items-center space-x-3 p-4 rounded-md border-2 transition-all ${
                      isBlocked
                        ? "border-red-400 bg-red-50 dark:bg-red-950/30 dark:border-red-600 shadow-sm"
                        : "border-green-400 bg-green-50 dark:bg-green-950/30 dark:border-green-600 shadow-sm"
                    } hover:shadow-md cursor-pointer`}
                    onClick={() => handleToggleRegion("GLB")}
                  >
                    <Checkbox
                      id="region-GLB"
                      checked={isBlocked}
                      onCheckedChange={() => handleToggleRegion("GLB")}
                      className="pointer-events-none"
                    />
                    <Label
                      htmlFor="region-GLB"
                      className="flex-1 text-sm font-semibold cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        <div className="flex flex-col">
                          <span>{REGION_LABELS["GLB"]}</span>
                          <span className="text-xs text-muted-foreground font-normal">GLB - Users without a specified region</span>
                        </div>
                      </div>
                    </Label>
                    {isBlocked ? (
                      <X className="h-5 w-5 text-red-600 dark:text-red-400" />
                    ) : (
                      <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                    )}
                  </div>
                )
              })()}
            </div>

            {/* Regional Regions */}
            <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
              Regional Regions
            </div>
            <div className="grid grid-cols-4 gap-3">
              {Object.entries(REGION_LABELS)
                .filter(([code]) => code !== "GLB")
                .sort(([, a], [, b]) => a.localeCompare(b))
                .map(([code, label]) => {
                  const isBlocked = blockedRegions.has(code)
                  return (
                    <div
                      key={code}
                      className={`flex items-center space-x-3 p-3 rounded-md border-2 transition-all ${
                        isBlocked
                          ? "border-red-300 bg-red-50 dark:bg-red-950/20 dark:border-red-700"
                          : "border-green-300 bg-green-50 dark:bg-green-950/20 dark:border-green-700"
                      } hover:shadow-sm cursor-pointer`}
                      onClick={() => handleToggleRegion(code)}
                    >
                      <Checkbox
                        id={`region-${code}`}
                        checked={isBlocked}
                        onCheckedChange={() => handleToggleRegion(code)}
                        className="pointer-events-none"
                      />
                      <Label
                        htmlFor={`region-${code}`}
                        className="flex-1 text-sm font-medium cursor-pointer select-none"
                      >
                        <div className="flex flex-col">
                          <span>{label}</span>
                          <span className="text-xs text-muted-foreground font-normal">{code}</span>
                        </div>
                      </Label>
                      {isBlocked ? (
                        <X className="h-4 w-4 text-red-600 dark:text-red-400" />
                      ) : (
                        <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                      )}
                    </div>
                  )
                })}
            </div>
          </div>

          {/* Changes Indicator */}
          {hasChanges && (
            <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
              <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <AlertDescription className="text-amber-900 dark:text-amber-100">
                You have unsaved changes. Click "Save Changes" to apply the new regional configuration.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || !hasChanges}
            className="gap-2"
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin">⏳</span>
                Saving...
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
