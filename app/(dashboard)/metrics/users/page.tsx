"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts"
import { Users, UserPlus, UserCheck, UserX, Download, TrendingUp, TrendingDown, Loader2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useAdminUserMetrics } from "@/hooks/use-metrics"
import type { MetricPeriod } from "@/types/users"
import { MetricDetailModal } from "@/components/modals/metric-detail-modal"
import UserGlobe from "@/components/charts/UserGlobe"
import type { RegionDatum } from "@/components/charts/UserGlobe"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  exportTotalUsersMetrics,
  exportRoleDistributionMetrics,
  exportBlockedUsersMetrics,
  exportActiveUsersMetrics,
  exportNewSignUpsMetrics,
  exportRecentSignUpsMetrics,
  exportAllUserMetrics,
} from "@/lib/export-metrics"

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300"]

const roleNames: Record<string, string> = {
  LISTENER: "Listener",
  ARTIST: "Artist",
  ADMIN: "Admin",
  UNDECLARED: "Undeclared",
}

export default function UserMetricsPage() {
  const {
    period,
    setPeriod,
    isLoading,
    error,
    totalUsers,
    roleDistribution,
    recentSignUps,
    newSignUps,
    blockedUsers,
    activeUsers,
  } = useAdminUserMetrics("LAST_MONTH")

  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [detailModalType, setDetailModalType] = useState<
    | "total-users"
    | "role-distribution"
    | "blocked-users"
    | "active-users"
    | "new-signups"
    | "recent-signups"
    | null
  >(null)
  const [detailModalData, setDetailModalData] = useState<any>(null)

  const handleCardClick = (
    type:
      | "total-users"
      | "role-distribution"
      | "blocked-users"
      | "active-users"
      | "new-signups"
      | "recent-signups",
    data: any
  ) => {
    setDetailModalType(type)
    setDetailModalData(data)
    setDetailModalOpen(true)
  }

  const handleExportMetric = (
    type:
      | "total-users"
      | "role-distribution"
      | "blocked-users"
      | "active-users"
      | "new-signups"
      | "recent-signups",
    format: "csv" | "excel"
  ) => {
    switch (type) {
      case "total-users":
        if (totalUsers) exportTotalUsersMetrics(totalUsers, period, format)
        break
      case "role-distribution":
        if (roleDistribution) exportRoleDistributionMetrics(roleDistribution, period, format)
        break
      case "blocked-users":
        if (blockedUsers) exportBlockedUsersMetrics(blockedUsers, period, format)
        break
      case "active-users":
        if (activeUsers) exportActiveUsersMetrics(activeUsers, period, format)
        break
      case "new-signups":
        if (newSignUps) exportNewSignUpsMetrics(newSignUps, period, format)
        break
      case "recent-signups":
        if (recentSignUps) exportRecentSignUpsMetrics(recentSignUps, format)
        break
    }
  }

  const handleExportAll = (format: "csv" | "excel") => {
    exportAllUserMetrics(
      totalUsers || null,
      roleDistribution || null,
      blockedUsers || null,
      activeUsers || null,
      newSignUps || null,
      recentSignUps || null,
      period,
      format
    )
  }

  const renderChangePercentage = (change: number) => {
    const isPositive = change >= 0
    return (
      <div className="flex items-center space-x-1 text-xs">
        {isPositive ? (
          <TrendingUp className="h-3 w-3 text-green-500" />
        ) : (
          <TrendingDown className="h-3 w-3 text-red-500" />
        )}
        <span className={isPositive ? "text-green-500" : "text-red-500"}>
          {isPositive ? "+" : ""}
          {change.toFixed(2)}%
        </span>
        <span className="text-muted-foreground">vs previous period</span>
      </div>
    )
  }

  const getPeriodLabel = (p: MetricPeriod) => {
    switch (p) {
      case "LAST_DAY":
        return "Last Day"
      case "LAST_WEEK":
        return "Last Week"
      case "LAST_MONTH":
        return "Last Month"
      default:
        return p
    }
  }

  // Memoize chart data to avoid recalculations on every render
  const roleDistributionChartData = useMemo(() => {
    return roleDistribution?.totalRoleDistribution.map((r) => ({
      name: roleNames[r.role] || r.role,
      value: r.count,
    })) || []
  }, [roleDistribution])

  // Calculate role percentages for cards
  const rolePercentages = useMemo(() => {
    if (!roleDistribution?.totalRoleDistribution) return null
    
    const total = roleDistribution.totalRoleDistribution.reduce((sum, r) => sum + r.count, 0)
    if (total === 0) return null
    
    const listener = roleDistribution.totalRoleDistribution.find((r) => r.role === "LISTENER")
    const artist = roleDistribution.totalRoleDistribution.find((r) => r.role === "ARTIST")
    const admin = roleDistribution.totalRoleDistribution.find((r) => r.role === "ADMIN")
    
    return {
      listener: { count: listener?.count || 0, percentage: ((listener?.count || 0) / total) * 100 },
      artist: { count: artist?.count || 0, percentage: ((artist?.count || 0) / total) * 100 },
      admin: { count: admin?.count || 0, percentage: ((admin?.count || 0) / total) * 100 },
    }
  }, [roleDistribution])

  // Prepare data for UserGlobe component with blocked data from blockedUsers endpoint
  const globeData: RegionDatum[] = useMemo(() => {
    if (!totalUsers?.regionalBreakdown) return []
    
    return totalUsers.regionalBreakdown.map((r) => {
      // Find blocked count for this region from blockedUsers data
      const blockedInRegion = blockedUsers?.regionalBreakdown.find((b) => b.region === r.region)
      
      return {
        region: r.region,
        users: r.count,
        blocked: blockedInRegion?.count || 0,
      }
    })
  }, [totalUsers, blockedUsers])

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
          <p className="font-semibold">Error loading metrics</p>
          <p className="text-sm">{error.message || "Failed to fetch user metrics"}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Metrics</h1>
          <p className="text-muted-foreground">Detailed analysis of user behavior and growth</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select
            value={period}
            onValueChange={(value) => setPeriod(value as MetricPeriod)}
            disabled={isLoading}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LAST_DAY">Last Day</SelectItem>
              <SelectItem value="LAST_WEEK">Last Week</SelectItem>
              <SelectItem value="LAST_MONTH">Last Month</SelectItem>
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" disabled={isLoading}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Export Format</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleExportAll("csv")}>
                Export All as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExportAll("excel")}>
                Export All as Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          {/* Stats Cards Loading */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-4 w-32" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-24 mb-2" />
                  <Skeleton className="h-4 w-40" />
                </CardContent>
              </Card>
            ))}
          </div>
          {/* Charts Loading */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[300px] w-full" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[300px] w-full" />
              </CardContent>
            </Card>
          </div>
          {/* Recent Signups Loading */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64 mt-2" />
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card
              className="cursor-pointer hover:shadow-lg hover:border-primary transition-all"
              onClick={() => totalUsers && handleCardClick("total-users", totalUsers)}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {totalUsers ? totalUsers.totalUsers.toLocaleString() : "-"}
                </div>
                {totalUsers && renderChangePercentage(totalUsers.changePercentage)}
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-lg hover:border-primary transition-all"
              onClick={() => newSignUps && handleCardClick("new-signups", newSignUps)}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">New Sign-ups</CardTitle>
                <UserPlus className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {newSignUps ? newSignUps.newSignUps.toLocaleString() : "-"}
                </div>
                {newSignUps && renderChangePercentage(newSignUps.changePercentage)}
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-lg hover:border-primary transition-all"
              onClick={() => activeUsers && handleCardClick("active-users", activeUsers)}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {activeUsers ? activeUsers.activeUsers.toLocaleString() : "-"}
                </div>
                {activeUsers && renderChangePercentage(activeUsers.changePercentage)}
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-lg hover:border-primary transition-all"
              onClick={() => blockedUsers && handleCardClick("blocked-users", blockedUsers)}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Blocked Users</CardTitle>
                <UserX className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {blockedUsers ? blockedUsers.totalBlockedUsers.toLocaleString() : "-"}
                </div>
                {blockedUsers && renderChangePercentage(blockedUsers.changePercentage)}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Users by Region - Globe Visualization */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Users by Region</CardTitle>
                    <CardDescription>Interactive global distribution of users</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => totalUsers && handleCardClick("total-users", totalUsers)}
                    >
                      View Details
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleExportMetric("total-users", "csv")}>
                          CSV
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleExportMetric("total-users", "excel")}>
                          Excel
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {globeData.length > 0 ? (
                  <UserGlobe
                    data={globeData}
                    height={500}
                    rotationSpeed={3}
                    cameraDistance={260}
                    autoRotate={true}
                  />
                ) : (
                  <div className="flex items-center justify-center h-[500px] text-muted-foreground">
                    No data available
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Role Distribution */}
            <Card
              className="cursor-pointer hover:shadow-lg  hover:border-primary transition-all"
              onClick={() => roleDistribution && handleCardClick("role-distribution", roleDistribution)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Role Distribution</CardTitle>
                    <CardDescription>User distribution by role</CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          handleExportMetric("role-distribution", "csv")
                        }}
                      >
                        CSV
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          handleExportMetric("role-distribution", "excel")
                        }}
                      >
                        Excel
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col justify-between h-[calc(100%-5rem)]">
                <div className="flex-1 flex items-center justify-center">
                  {roleDistributionChartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%" minHeight={500}>
                      <PieChart>
                        <Pie
                          data={roleDistributionChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={(entry) => `${entry.name}: ${entry.value}`}
                          outerRadius={130}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {roleDistributionChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center text-muted-foreground">
                      No data available
                    </div>
                  )}
                </div>

                {/* Role Percentage Cards - pegadas al fondo */}
                {rolePercentages && (
                  <div className="grid gap-4 grid-cols-3 mt-6">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Listeners</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold" style={{ color: COLORS[0] }}>
                            {rolePercentages.listener.percentage.toFixed(1)}%
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {rolePercentages.listener.count.toLocaleString()} users
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Artists</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold" style={{ color: COLORS[1] }}>
                            {rolePercentages.artist.percentage.toFixed(1)}%
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {rolePercentages.artist.count.toLocaleString()} users
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Admins</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold" style={{ color: COLORS[2] }}>
                            {rolePercentages.admin.percentage.toFixed(1)}%
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {rolePercentages.admin.count.toLocaleString()} users
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  )}
              </CardContent>
            </Card>
          </div>

          <Card
            className="cursor-pointer hover:shadow-lg  hover:border-primary transition-all"
            onClick={() => recentSignUps && handleCardClick("recent-signups", recentSignUps)}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Sign-ups</CardTitle>
                  <CardDescription>Most recent artist and listener registrations</CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation()
                        handleExportMetric("recent-signups", "csv")
                      }}
                    >
                      CSV
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation()
                        handleExportMetric("recent-signups", "excel")
                      }}
                    >
                      Excel
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Last Artist</h4>
                  {recentSignUps?.lastArtist ? (
                    <div className="space-y-1">
                      <p className="text-sm">
                        <span className="font-medium">{recentSignUps.lastArtist.username}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">{recentSignUps.lastArtist.email}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(recentSignUps.lastArtist.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No artist sign-ups yet</p>
                  )}
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Last Listener</h4>
                  {recentSignUps?.lastListener ? (
                    <div className="space-y-1">
                      <p className="text-sm">
                        <span className="font-medium">{recentSignUps.lastListener.username}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">{recentSignUps.lastListener.email}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(recentSignUps.lastListener.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No listener sign-ups yet</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {detailModalType && (
        <MetricDetailModal
          open={detailModalOpen}
          onOpenChange={setDetailModalOpen}
          type={detailModalType}
          data={detailModalData}
          period={getPeriodLabel(period)}
        />
      )}
    </div>
  )
}
