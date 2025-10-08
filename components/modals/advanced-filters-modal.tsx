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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface AdvancedFiltersModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onApplyFilters: (filters: any) => void
}

export function AdvancedFiltersModal({ open, onOpenChange, onApplyFilters }: AdvancedFiltersModalProps) {
  const [filters, setFilters] = useState({
    dateRange: null as any,
    users: [] as string[],
    actions: [] as string[],
    entities: [] as string[],
    severities: [] as string[],
    categories: [] as string[],
    entityId: "",
    ipAddress: "",
    userAgent: "",
  })

  const toggleArrayFilter = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => {
      const currentArray = prev[key] as string[]
      const newArray = currentArray.includes(value)
        ? currentArray.filter((item) => item !== value)
        : [...currentArray, value]
      return { ...prev, [key]: newArray }
    })
  }

  const removeFilter = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: (prev[key] as string[]).filter((item) => item !== value),
    }))
  }

  const handleApply = () => {
    onApplyFilters(filters)
  }

  const handleReset = () => {
    setFilters({
      dateRange: null,
      users: [],
      actions: [],
      entities: [],
      severities: [],
      categories: [],
      entityId: "",
      ipAddress: "",
      userAgent: "",
    })
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.dateRange) count++
    if (filters.users.length > 0) count++
    if (filters.actions.length > 0) count++
    if (filters.entities.length > 0) count++
    if (filters.severities.length > 0) count++
    if (filters.categories.length > 0) count++
    if (filters.entityId) count++
    if (filters.ipAddress) count++
    if (filters.userAgent) count++
    return count
  }

  const availableActions = [
    "Content Blocked",
    "Content Unblocked",
    "User Role Changed",
    "User Account Blocked",
    "User Account Unblocked",
    "Region Configuration Updated",
    "System Configuration Changed",
    "Bulk Content Update",
    "API Key Generated",
    "Login Attempt Failed",
  ]

  const availableUsers = [
    "admin@melody.com",
    "moderator@melody.com",
    "system",
    "john.doe@example.com",
    "jane.smith@example.com",
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Advanced Filters</DialogTitle>
          <DialogDescription>
            Apply detailed filters to narrow down audit log results
            {getActiveFiltersCount() > 0 && (
              <span className="ml-2">
                <Badge variant="secondary">{getActiveFiltersCount()} active filters</Badge>
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Active Filters Summary */}
          {getActiveFiltersCount() > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Active Filters</Label>
              <div className="flex flex-wrap gap-2">
                {filters.users.map((user) => (
                  <Badge key={user} variant="outline" className="gap-1">
                    User: {user}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeFilter("users", user)} />
                  </Badge>
                ))}
                {filters.actions.map((action) => (
                  <Badge key={action} variant="outline" className="gap-1">
                    Action: {action}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeFilter("actions", action)} />
                  </Badge>
                ))}
                {filters.severities.map((severity) => (
                  <Badge key={severity} variant="outline" className="gap-1">
                    Severity: {severity}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeFilter("severities", severity)} />
                  </Badge>
                ))}
                {filters.categories.map((category) => (
                  <Badge key={category} variant="outline" className="gap-1">
                    Category: {category}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeFilter("categories", category)} />
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Date Range */}
          <div className="space-y-2">
            <Label>Date Range</Label>
            <DatePickerWithRange />
          </div>

          <Separator />

          {/* User Filters */}
          <div className="space-y-3">
            <Label className="text-base font-medium">User Filters</Label>
            <div className="grid gap-3">
              <div className="space-y-2">
                <Label>Specific Users ({filters.users.length} selected)</Label>
                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                  {availableUsers.map((user) => (
                    <div key={user} className="flex items-center space-x-2">
                      <Checkbox
                        id={`user-${user}`}
                        checked={filters.users.includes(user)}
                        onCheckedChange={() => toggleArrayFilter("users", user)}
                      />
                      <Label htmlFor={`user-${user}`} className="text-sm truncate">
                        {user}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ipAddress">IP Address</Label>
                  <Input
                    id="ipAddress"
                    placeholder="192.168.1.1"
                    value={filters.ipAddress}
                    onChange={(e) => setFilters((prev) => ({ ...prev, ipAddress: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="userAgent">User Agent</Label>
                  <Input
                    id="userAgent"
                    placeholder="Browser/OS info"
                    value={filters.userAgent}
                    onChange={(e) => setFilters((prev) => ({ ...prev, userAgent: e.target.value }))}
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Action Filters */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Action Filters ({filters.actions.length} selected)</Label>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
              {availableActions.map((action) => (
                <div key={action} className="flex items-center space-x-2">
                  <Checkbox
                    id={`action-${action}`}
                    checked={filters.actions.includes(action)}
                    onCheckedChange={() => toggleArrayFilter("actions", action)}
                  />
                  <Label htmlFor={`action-${action}`} className="text-sm">
                    {action}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Severity & Category */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Severity Levels ({filters.severities.length} selected)</Label>
              <div className="space-y-2">
                {["Low", "Medium", "High"].map((severity) => (
                  <div key={severity} className="flex items-center space-x-2">
                    <Checkbox
                      id={`severity-${severity}`}
                      checked={filters.severities.includes(severity)}
                      onCheckedChange={() => toggleArrayFilter("severities", severity)}
                    />
                    <Label htmlFor={`severity-${severity}`} className="text-sm">
                      {severity}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Categories ({filters.categories.length} selected)</Label>
              <div className="space-y-2">
                {["Content Management", "User Management", "System Configuration"].map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category}`}
                      checked={filters.categories.includes(category)}
                      onCheckedChange={() => toggleArrayFilter("categories", category)}
                    />
                    <Label htmlFor={`category-${category}`} className="text-sm">
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Separator />

          {/* Entity Filters */}
          <div className="space-y-2">
            <Label htmlFor="entityId">Entity ID</Label>
            <Input
              id="entityId"
              placeholder="song-123, user-456, album-789, etc."
              value={filters.entityId}
              onChange={(e) => setFilters((prev) => ({ ...prev, entityId: e.target.value }))}
            />
            <p className="text-xs text-muted-foreground">
              Filter by specific entity identifiers (supports partial matches)
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleReset}>
            Reset All Filters
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleApply}>
            Apply Filters {getActiveFiltersCount() > 0 && `(${getActiveFiltersCount()})`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
