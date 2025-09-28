"use client"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: string
  variant?: "default" | "secondary" | "destructive" | "outline"
  className?: string
}

export function StatusBadge({ status, variant, className }: StatusBadgeProps) {
  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case "published":
      case "active":
      case "available":
        return { variant: "default" as const, className: "bg-green-100 text-green-800 hover:bg-green-100" }
      case "scheduled":
      case "pending":
        return { variant: "secondary" as const, className: "bg-blue-100 text-blue-800 hover:bg-blue-100" }
      case "blocked":
      case "unavailable":
      case "suspended":
        return { variant: "destructive" as const, className: "bg-red-100 text-red-800 hover:bg-red-100" }
      case "draft":
      case "inactive":
        return { variant: "outline" as const, className: "bg-gray-100 text-gray-800 hover:bg-gray-100" }
      case "region-unavailable":
        return { variant: "secondary" as const, className: "bg-orange-100 text-orange-800 hover:bg-orange-100" }
      default:
        return { variant: "outline" as const, className: "" }
    }
  }

  const config = getStatusConfig(status)
  const finalVariant = variant || config.variant

  return (
    <Badge variant={finalVariant} className={cn(config.className, className)}>
      {status}
    </Badge>
  )
}
