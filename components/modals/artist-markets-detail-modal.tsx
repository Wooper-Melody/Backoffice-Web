"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TrendingUp, TrendingDown } from "lucide-react"
import { REGION_LABELS } from "@/types/catalog"
import type { ArtistMarketDistributionResponse } from "@/types/artist-metrics"

interface ArtistMarketsDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  data: ArtistMarketDistributionResponse | null
  artistName?: string
  dateRange?: { startDate: string; endDate: string }
}

export function ArtistMarketsDetailModal({
  open,
  onOpenChange,
  data,
  artistName,
  dateRange,
}: ArtistMarketsDetailModalProps) {
  if (!data) return null

  const formatNumber = (num: number) => new Intl.NumberFormat('es-ES').format(num)

  const renderChangePercentage = (change: number | null | undefined) => {
    if (change === null || change === undefined || isNaN(change)) {
      return <span className="text-muted-foreground text-sm">N/A</span>
    }

    const isPositive = change >= 0
    return (
      <div className="flex items-center justify-end space-x-1">
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[50vw] max-w-[95vw] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Top Markets Details</DialogTitle>
          <DialogDescription>
            {artistName && `Markets for ${artistName}`}
            {dateRange && ` • ${dateRange.startDate} to ${dateRange.endDate}`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Markets by Region Table */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Markets by Region</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Rank</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead className="text-right">Current Plays</TableHead>
                  <TableHead className="text-right">Previous Plays</TableHead>
                  <TableHead className="text-right">Change</TableHead>
                  <TableHead className="text-right">% of Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.byRegion && data.byRegion.length > 0 ? (
                  data.byRegion.map((market) => (
                    <TableRow key={market.region}>
                      <TableCell>
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                          {market.rank}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {REGION_LABELS[market.region as keyof typeof REGION_LABELS] || market.region}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatNumber(market.plays?.current ?? 0)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatNumber(market.plays?.previous ?? 0)}
                      </TableCell>
                      <TableCell className="text-right">
                        {renderChangePercentage(market.plays?.percentageChange)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {(market.percentageOfTotal ?? 0).toFixed(2)}%
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Other Markets Summary */}
          {data.otherMarketsTotal && (data.otherMarketsTotal.marketCount ?? 0) > 0 && (
            <div className="border rounded-lg p-4 bg-muted/50">
              <h3 className="text-lg font-semibold mb-3">Other Markets Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Markets</p>
                  <p className="text-2xl font-bold">{data.otherMarketsTotal.marketCount}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Listeners</p>
                  <p className="text-2xl font-bold">{formatNumber(data.otherMarketsTotal.listeners ?? 0)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">% of Total</p>
                  <p className="text-2xl font-bold">{(data.otherMarketsTotal.percentageOfTotal ?? 0).toFixed(2)}%</p>
                </div>
              </div>
            </div>
          )}

          {/* Summary Statistics */}
          <div className="border rounded-lg p-4 bg-muted/50">
            <h3 className="text-lg font-semibold mb-3">Summary</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Regions Tracked</p>
                <p className="text-xl font-semibold">
                  {(data.byRegion?.length ?? 0) + (data.otherMarketsTotal?.marketCount ?? 0)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Top Market Share</p>
                <p className="text-xl font-semibold">
                  {data.byRegion && data.byRegion.length > 0
                    ? `${(data.byRegion[0].percentageOfTotal ?? 0).toFixed(2)}%`
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
