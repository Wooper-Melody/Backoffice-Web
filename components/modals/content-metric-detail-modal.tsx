"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import type { MetricValue } from "@/types/catalog"

interface ContentMetricDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  type: "songs-released" | "albums-released" | "total-plays" | "total-likes" | "total-saves"
  data: MetricValue | null
  period?: string
  region?: string
}

export function ContentMetricDetailModal({ 
  open, 
  onOpenChange, 
  type, 
  data, 
  period = "Last Month",
  region 
}: ContentMetricDetailModalProps) {
  if (!data) return null

  const renderChangePercentage = (change: number | null | undefined) => {
    // Handle null, undefined, or 0
    if (change == null || change === 0) {
      return (
        <div className="flex items-center space-x-1">
          <Minus className="h-4 w-4 text-gray-500" />
          <span className="text-gray-500">0.00%</span>
        </div>
      )
    }
    
    const isPositive = change > 0
    return (
      <div className="flex items-center space-x-1">
        {isPositive ? (
          <TrendingUp className="h-4 w-4 text-green-500" />
        ) : (
          <TrendingDown className="h-4 w-4 text-red-500" />
        )}
        <span className={isPositive ? "text-green-500" : "text-red-500"}>
          {isPositive ? "+" : ""}
          {change.toFixed(2)}%
        </span>
      </div>
    )
  }

  const getTitle = () => {
    switch (type) {
      case "songs-released":
        return "Songs Released"
      case "albums-released":
        return "Albums Released"
      case "total-plays":
        return "Total Plays"
      case "total-likes":
        return "Total Likes"
      case "total-saves":
        return "Total Saves"
      default:
        return "Metric Details"
    }
  }

  const getDescription = () => {
    const regionText = region ? ` in ${region}` : ""
    return `Detailed breakdown for ${period}${regionText}`
  }

  const getMetricDescription = () => {
    switch (type) {
      case "songs-released":
        return "Total number of songs released during the selected period"
      case "albums-released":
        return "Total number of albums and collections released during the selected period"
      case "total-plays":
        return "Cumulative number of plays across all content in the selected period"
      case "total-likes":
        return "Total number of likes received across all content in the selected period"
      case "total-saves":
        return "Total number of saves (playlists and collections) in the selected period"
      default:
        return ""
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription>{getDescription()}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Overview Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Overview</CardTitle>
              <CardDescription>{getMetricDescription()}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Current Period</p>
                  <p className="text-3xl font-bold">{data.current.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Previous Period</p>
                  <p className="text-3xl font-bold text-muted-foreground">{data.previous.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Change vs Previous Period</span>
                  {renderChangePercentage(data.changePercent)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comparison Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Period Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Absolute Change</p>
                    <p className="text-xs text-muted-foreground">Difference between periods</p>
                  </div>
                  <p className="text-xl font-bold">
                    {data.changePercent > 0 ? "+" : ""}
                    {(data.current - data.previous).toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Relative Change</p>
                    <p className="text-xs text-muted-foreground">Percentage difference</p>
                  </div>
                  <div className="text-xl font-bold">
                    {renderChangePercentage(data.changePercent)}
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Growth Rate</p>
                    <p className="text-xs text-muted-foreground">
                      {data.changePercent > 0 ? "Increasing" : data.changePercent < 0 ? "Decreasing" : "Stable"}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    data.changePercent > 10 
                      ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                      : data.changePercent > 0 
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                      : data.changePercent < -10
                      ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                      : data.changePercent < 0
                      ? "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300"
                      : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  }`}>
                    {data.changePercent > 10 
                      ? "Strong Growth"
                      : data.changePercent > 0 
                      ? "Moderate Growth"
                      : data.changePercent < -10
                      ? "Significant Decline"
                      : data.changePercent < 0
                      ? "Slight Decline"
                      : "No Change"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
