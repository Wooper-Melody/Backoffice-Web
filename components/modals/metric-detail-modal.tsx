"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TrendingUp, TrendingDown } from "lucide-react"
import type {
  TotalUsersMetrics,
  RoleDistributionMetrics,
  BlockedUsersMetrics,
  ActiveUsersMetrics,
  NewSignUpsMetrics,
  RecentSignUpsMetrics,
} from "@/types/users"
import { REGION_LABELS } from "@/types/catalog"

interface MetricDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  type:
    | "total-users"
    | "role-distribution"
    | "blocked-users"
    | "active-users"
    | "new-signups"
    | "recent-signups"
  data:
    | TotalUsersMetrics
    | RoleDistributionMetrics
    | BlockedUsersMetrics
    | ActiveUsersMetrics
    | NewSignUpsMetrics
    | RecentSignUpsMetrics
    | null
  period?: string
}

const regionNames = REGION_LABELS

const roleNames: Record<string, string> = {
  LISTENER: "Listener",
  ARTIST: "Artist",
  ADMIN: "Admin",
  UNDECLARED: "Undeclared",
}

// Helper function to get region name safely
function getRegionName(regionCode: string): string {
  return regionNames[regionCode as keyof typeof regionNames] || regionCode
}

export function MetricDetailModal({ open, onOpenChange, type, data, period }: MetricDetailModalProps) {
  if (!data) return null

  const renderChangePercentage = (change: number) => {
    const isPositive = change >= 0
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
      case "total-users":
        return "Total Users Details"
      case "role-distribution":
        return "Role Distribution Details"
      case "blocked-users":
        return "Blocked Users Details"
      case "active-users":
        return "Active Users Details"
      case "new-signups":
        return "New Sign-ups Details"
      case "recent-signups":
        return "Recent Sign-ups Details"
      default:
        return "Metric Details"
    }
  }

  const getDescription = () => {
    const periodText = period ? ` (${period})` : ""
    return `Detailed breakdown of the metric${periodText}`
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription>{getDescription()}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Total Users Metric */}
          {type === "total-users" && "totalUsers" in data && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Total Count</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">{data.totalUsers.toLocaleString()}</div>
                  <div className="mt-2">{renderChangePercentage(data.changePercentage)}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Regional Breakdown</CardTitle>
                  <CardDescription>Users by region</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Region</TableHead>
                        <TableHead className="text-right">Count</TableHead>
                        <TableHead className="text-right">Percentage</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.regionalBreakdown.map((region) => (
                        <TableRow key={region.region}>
                          <TableCell className="font-medium">
                            {getRegionName(region.region)}
                          </TableCell>
                          <TableCell className="text-right">{region.count.toLocaleString()}</TableCell>
                          <TableCell className="text-right">
                            {((region.count / data.totalUsers) * 100).toFixed(2)}%
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </>
          )}

          {/* Role Distribution Metric */}
          {type === "role-distribution" && "totalRoleDistribution" in data && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Overall Change</CardTitle>
                </CardHeader>
                <CardContent>{renderChangePercentage(data.changePercentage)}</CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Total Distribution</CardTitle>
                  <CardDescription>Users by role</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Role</TableHead>
                        <TableHead className="text-right">Count</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.totalRoleDistribution.map((role) => (
                        <TableRow key={role.role}>
                          <TableCell className="font-medium">
                            <Badge variant="outline">{roleNames[role.role] || role.role}</Badge>
                          </TableCell>
                          <TableCell className="text-right">{role.count.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Regional Distribution</CardTitle>
                  <CardDescription>Users by role and region</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Role</TableHead>
                        <TableHead>Region</TableHead>
                        <TableHead className="text-right">Count</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.regionalRoleDistribution.map((item, idx) => (
                        <TableRow key={idx}>
                          <TableCell>
                            <Badge variant="outline">{roleNames[item.role] || item.role}</Badge>
                          </TableCell>
                          <TableCell>{getRegionName(item.region)}</TableCell>
                          <TableCell className="text-right">{item.count.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </>
          )}

          {/* Blocked Users Metric */}
          {type === "blocked-users" && "totalBlockedUsers" in data && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Total Blocked Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">{data.totalBlockedUsers.toLocaleString()}</div>
                  <div className="mt-2">{renderChangePercentage(data.changePercentage)}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Regional Breakdown</CardTitle>
                  <CardDescription>Blocked users by region</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Region</TableHead>
                        <TableHead className="text-right">Count</TableHead>
                        <TableHead className="text-right">Percentage</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.regionalBreakdown.map((region) => (
                        <TableRow key={region.region}>
                          <TableCell className="font-medium">
                            {getRegionName(region.region)}
                          </TableCell>
                          <TableCell className="text-right">{region.count.toLocaleString()}</TableCell>
                          <TableCell className="text-right">
                            {((region.count / data.totalBlockedUsers) * 100).toFixed(2)}%
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </>
          )}

          {/* Active Users Metric */}
          {type === "active-users" && "activeUsers" in data && (
            <Card>
              <CardHeader>
                <CardTitle>Active Users Count</CardTitle>
                <CardDescription>Users with recent activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{data.activeUsers.toLocaleString()}</div>
                <div className="mt-2">{renderChangePercentage(data.changePercentage)}</div>
              </CardContent>
            </Card>
          )}

          {/* New SignUps Metric */}
          {type === "new-signups" && "newSignUps" in data && (
            <Card>
              <CardHeader>
                <CardTitle>New Sign-ups Count</CardTitle>
                <CardDescription>New user registrations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{data.newSignUps.toLocaleString()}</div>
                <div className="mt-2">{renderChangePercentage(data.changePercentage)}</div>
              </CardContent>
            </Card>
          )}

          {/* Recent SignUps Metric */}
          {type === "recent-signups" && "lastArtist" in data && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Last Artist Sign-up</CardTitle>
                </CardHeader>
                <CardContent>
                  {data.lastArtist ? (
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-muted-foreground">Username:</span>{" "}
                        <span className="font-medium">{data.lastArtist.username}</span>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Email:</span>{" "}
                        <span className="font-medium">{data.lastArtist.email}</span>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Created At:</span>{" "}
                        <span className="font-medium">
                          {new Date(data.lastArtist.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No artist sign-ups yet</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Last Listener Sign-up</CardTitle>
                </CardHeader>
                <CardContent>
                  {data.lastListener ? (
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-muted-foreground">Username:</span>{" "}
                        <span className="font-medium">{data.lastListener.username}</span>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Email:</span>{" "}
                        <span className="font-medium">{data.lastListener.email}</span>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Created At:</span>{" "}
                        <span className="font-medium">
                          {new Date(data.lastListener.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No listener sign-ups yet</p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
