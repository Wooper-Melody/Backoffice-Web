"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Eye, Filter, Calendar, User, Activity } from "lucide-react"
import { ExportMenu } from "@/components/common/export-menu"
import { AdvancedFiltersModal } from "@/components/modals/advanced-filters-modal"

const auditLogs = [
  {
    id: "1",
    timestamp: "2024-01-20T14:30:00Z",
    action: "Content Blocked",
    entity: "Song: Save Your Tears",
    entityId: "song-123",
    user: "admin@melody.com",
    userAvatar: "/placeholder.svg",
    details: "Blocked globally due to copyright dispute",
    severity: "high",
    category: "content_management",
  },
  {
    id: "2",
    timestamp: "2024-01-20T13:15:00Z",
    action: "User Role Changed",
    entity: "User: john.doe@example.com",
    entityId: "user-456",
    user: "admin@melody.com",
    userAvatar: "/placeholder.svg",
    details: "Role changed from user to moderator",
    severity: "medium",
    category: "user_management",
  },
  {
    id: "3",
    timestamp: "2024-01-20T12:45:00Z",
    action: "Region Configuration Updated",
    entity: "Region: Europe",
    entityId: "region-eu",
    user: "system",
    userAvatar: "/placeholder.svg",
    details: "Added new countries to European region",
    severity: "low",
    category: "system_configuration",
  },
  {
    id: "4",
    timestamp: "2024-01-20T11:20:00Z",
    action: "Content Unblocked",
    entity: "Album: Future Nostalgia",
    entityId: "album-789",
    user: "moderator@melody.com",
    userAvatar: "/placeholder.svg",
    details: "Unblocked after licensing issue resolution",
    severity: "medium",
    category: "content_management",
  },
  {
    id: "5",
    timestamp: "2024-01-20T10:00:00Z",
    action: "User Account Blocked",
    entity: "User: suspicious@example.com",
    entityId: "user-999",
    user: "admin@melody.com",
    userAvatar: "/placeholder.svg",
    details: "Account blocked due to suspicious activity",
    severity: "high",
    category: "user_management",
  },
]

const severityColors = {
  low: "bg-green-500/10 text-green-500 border-green-500/20",
  medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  high: "bg-red-500/10 text-red-500 border-red-500/20",
}

const categoryColors = {
  content_management: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  user_management: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  system_configuration: "bg-orange-500/10 text-orange-500 border-orange-500/20",
}

export default function AuditPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [severityFilter, setSeverityFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [dateRange, setDateRange] = useState("7d")
  const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false)

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSeverity = severityFilter === "all" || log.severity === severityFilter
    const matchesCategory = categoryFilter === "all" || log.category === categoryFilter
    return matchesSearch && matchesSeverity && matchesCategory
  })

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Audit Trail</h1>
          <p className="text-muted-foreground">Track all system activities and administrative actions</p>
        </div>
        <div className="flex items-center space-x-2">
          <ExportMenu
            onExport={(format) => {
              console.log(`Exporting audit logs as ${format}`)
              // Implement export logic for audit logs
            }}
          />
          <Button variant="outline" onClick={() => setAdvancedFiltersOpen(true)}>
            <Filter className="h-4 w-4 mr-2" />
            Advanced Filters
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Severity</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">Requiring attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Performed actions today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">Automated actions</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters and Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by action, entity, user, or details..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All severities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                <SelectItem value="content_management">Content Management</SelectItem>
                <SelectItem value="user_management">User Management</SelectItem>
                <SelectItem value="system_configuration">System Configuration</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1d">Last 24 hours</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Audit Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Audit Logs ({filteredLogs.length})</CardTitle>
          <CardDescription>Chronological record of all system activities and changes</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-sm">{new Date(log.timestamp).toLocaleString()}</TableCell>
                  <TableCell className="font-medium">{log.action}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{log.entity}</div>
                      <div className="text-muted-foreground text-xs">ID: {log.entityId}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={log.userAvatar || "/placeholder.svg"} />
                        <AvatarFallback>{log.user.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{log.user}</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div className="text-sm truncate" title={log.details}>
                      {log.details}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={severityColors[log.severity as keyof typeof severityColors]}>
                      {log.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={categoryColors[log.category as keyof typeof categoryColors]}>
                      {log.category.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AdvancedFiltersModal
        open={advancedFiltersOpen}
        onOpenChange={setAdvancedFiltersOpen}
        onApplyFilters={(filters) => {
          console.log("Applying advanced filters:", filters)
          setAdvancedFiltersOpen(false)
        }}
      />
    </div>
  )
}
