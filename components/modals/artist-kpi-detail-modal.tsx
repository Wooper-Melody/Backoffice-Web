"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { TrendingUp, TrendingDown } from "lucide-react"
import type { MetricWithChange } from "@/types/artist-metrics"

interface ArtistKPIDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  kpiName: string
  kpiData: MetricWithChange | null | undefined
  artistName?: string
  dateRange?: { startDate: string; endDate: string }
  icon?: React.ReactNode
}

export function ArtistKPIDetailModal({
  open,
  onOpenChange,
  kpiName,
  kpiData,
  artistName,
  dateRange,
  icon,
}: ArtistKPIDetailModalProps) {
  if (!kpiData) return null

  const formatNumber = (num: number) => new Intl.NumberFormat('es-ES').format(num)

  const renderChangePercentage = (change: number | null | undefined) => {
    if (change === null || change === undefined || isNaN(change)) {
      return <span className="text-muted-foreground text-sm">N/A</span>
    }

    const isPositive = change >= 0
    return (
      <div className="flex items-center justify-center space-x-1">
        {isPositive ? (
          <TrendingUp className="h-5 w-5 text-green-500" />
        ) : (
          <TrendingDown className="h-5 w-5 text-red-500" />
        )}
        <span className={`text-lg font-semibold ${isPositive ? "text-green-500" : "text-red-500"}`}>
          {isPositive ? "+" : ""}
          {change.toFixed(2)}%
        </span>
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full sm:max-w-[600px] max-w-[95vw]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {icon}
            <span>{kpiName} Details</span>
          </DialogTitle>
          <DialogDescription>
            {artistName && `Metrics for ${artistName}`}
            {dateRange && ` • ${dateRange.startDate} to ${dateRange.endDate}`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Period */}
          <div className="border rounded-lg p-4 bg-muted/50">
            <h3 className="text-sm font-medium text-muted-foreground mb-2 text-center">Current Period</h3>
            <div className="text-4xl font-bold text-center">
              {formatNumber(kpiData.current)}
            </div>
          </div>

          {/* Comparison */}
          <div className="grid grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Previous Period</h3>
              <div className="text-2xl font-bold text-center">
                {formatNumber(kpiData.previous)}
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Absolute Change</h3>
              <div className="text-2xl font-bold text-center">
                {kpiData.absoluteChange >= 0 ? "+" : ""}
                {formatNumber(kpiData.absoluteChange)}
              </div>
            </div>
          </div>

          {/* Percentage Change */}
          <div className="border rounded-lg p-4 bg-primary/5">
            <h3 className="text-sm font-medium text-muted-foreground mb-3 text-center">Percentage Change</h3>
            {renderChangePercentage(kpiData.percentageChange)}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
