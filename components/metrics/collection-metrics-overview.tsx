"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { ExportMenu } from "@/components/common/export-menu"
import { TrendingUp, TrendingDown, Minus, Play, Save } from "lucide-react"
import { MetricsChart } from "@/components/charts/metrics-chart"
import { exportCollectionMetrics } from "@/lib/export-content-metrics"
import type { CollectionOverviewResponse, MetricValue } from "@/types/catalog"
import { REGION_LABELS } from "@/types/catalog"
import type { DateRange } from "react-day-picker"

interface CollectionMetricsOverviewProps {
  metrics: CollectionOverviewResponse | undefined
  isLoading: boolean
  onPeriodChange?: (period: "day" | "week" | "month" | "custom") => void
  onDateRangeChange?: (range: DateRange | undefined) => void
  onRegionChange?: (region: string | undefined) => void
  currentPeriod?: "day" | "week" | "month" | "custom"
  currentDateRange?: DateRange
  currentRegion?: string
}

function MetricCard({ 
  title, 
  value, 
  metric, 
  icon: Icon,
  description 
}: { 
  title: string
  value: number
  metric: MetricValue
  icon: React.ElementType
  description: string
}) {
  const getTrendIcon = () => {
    if (metric.changePercent > 0) return <TrendingUp className="h-4 w-4 text-green-500" />
    if (metric.changePercent < 0) return <TrendingDown className="h-4 w-4 text-red-500" />
    return <Minus className="h-4 w-4 text-gray-500" />
  }

  const getTrendColor = () => {
    if (metric.changePercent > 0) return "text-green-500"
    if (metric.changePercent < 0) return "text-red-500"
    return "text-gray-500"
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-2xl font-bold">{value.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">{description}</p>
          <div className="flex items-center space-x-2 text-sm">
            <div className="flex items-center space-x-1">
              {getTrendIcon()}
              <span className={getTrendColor()}>
                {Math.abs(metric.changePercent).toFixed(1)}%
              </span>
            </div>
            <span className="text-muted-foreground">vs previous period</span>
          </div>
          <div className="pt-2 border-t">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Current period:</span>
              <span className="font-medium text-foreground">{metric.current.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Previous period:</span>
              <span className="font-medium text-foreground">{metric.previous.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function CollectionMetricsOverview({ 
  metrics, 
  isLoading,
  onPeriodChange,
  onDateRangeChange,
  onRegionChange,
  currentPeriod = "month",
  currentDateRange,
  currentRegion
}: CollectionMetricsOverviewProps) {
  const [periodType, setPeriodType] = useState<"day" | "week" | "month" | "custom">(currentPeriod)

  const handlePeriodChange = (value: "day" | "week" | "month" | "custom") => {
    setPeriodType(value)
    if (onPeriodChange) {
      onPeriodChange(value)
    }
  }

  const handleRegionChange = (value: string) => {
    if (onRegionChange) {
      onRegionChange(value === "all" ? undefined : value)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div>
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    )
  }

  if (!metrics) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground text-center">
            No metrics available for the selected period.
          </p>
        </CardContent>
      </Card>
    )
  }

  const dateRangeText = `${new Date(metrics.dateRange.current.start).toLocaleDateString()} - ${new Date(metrics.dateRange.current.end).toLocaleDateString()}`

  // Prepare data for comparison chart
  const comparisonData = [
    {
      name: 'Previous Period',
      Plays: metrics.periodPlays.previous,
      Saves: metrics.periodSaves.previous,
    },
    {
      name: 'Current Period',
      Plays: metrics.periodPlays.current,
      Saves: metrics.periodSaves.current,
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
            <div>
                <h3 className="text-lg font-semibold">Performance Metrics</h3>
                <p className="text-sm text-muted-foreground">
                Viewing metrics for {dateRangeText}
                {metrics.region && ` • Region: ${metrics.region}`}
                </p>
            </div>
          
            {/* Period and Region Filters */}
            <div className="flex flex-wrap items-center gap-4">
            <Select onValueChange={handlePeriodChange} value={periodType}>
                <SelectTrigger className="w-[180px]">
                <SelectValue />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="day">Last Day</SelectItem>
                <SelectItem value="week">Last Week</SelectItem>
                <SelectItem value="month">Last Month</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
            </Select>
            
            {periodType === "custom" && onDateRangeChange && (
                <DatePickerWithRange
                value={currentDateRange}
                onValueChange={onDateRangeChange}
                placeholder="Select date range"
                className="w-[280px]"
                />
            )}
            
            <Select value={currentRegion || "all"} onValueChange={handleRegionChange}>
                <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Regions" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                {Object.entries(REGION_LABELS).map(([code, label]) => (
                    <SelectItem key={code} value={code}>{label}</SelectItem>
                ))}
                </SelectContent>
            </Select>
            <ExportMenu onExport={(format) => exportCollectionMetrics(metrics, format)} />
            </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <MetricCard
          title="Total Plays"
          value={metrics.totalPlays}
          metric={metrics.periodPlays}
          icon={Play}
          description="All-time plays for this collection"
        />
        <MetricCard
          title="Total Saves"
          value={metrics.totalSaves}
          metric={metrics.periodSaves}
          icon={Save}
          description="All-time saves for this collection"
        />
      </div>
    </div>
  )
}
