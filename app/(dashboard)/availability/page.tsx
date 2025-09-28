"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Shield, Plus, Edit, Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"

const availabilityStats = [
  { label: "Active Policies", value: 1247, change: "+23", color: "blue" },
  { label: "Scheduled Content", value: 156, change: "+12", color: "yellow" },
  { label: "Active Blocks", value: 47, change: "-3", color: "red" },
  { label: "Configured Regions", value: 12, change: "0", color: "green" },
]

export default function AvailabilityPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Availability</h1>
          <p className="text-muted-foreground">Manage territorial and temporal content availability</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {availabilityStats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">{stat.change} from last month</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="regions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="regions">Regional Configuration</TabsTrigger>
          <TabsTrigger value="scheduling">Time Windows</TabsTrigger>
          <TabsTrigger value="blocks">Blocks</TabsTrigger>
        </TabsList>

        <TabsContent value="regions">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Configured Regions</CardTitle>
                    <CardDescription>
                      Manage available regions to configure content policies
                    </CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Region
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <RegionsTable />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="scheduling">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Scheduled Content</CardTitle>
                    <CardDescription>Content with scheduled publication dates</CardDescription>
                  </div>
                  <Link href="/availability/scheduling/new">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Schedule Content
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <ScheduledContentTable />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="blocks">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Blocked Content</CardTitle>
                    <CardDescription>Administratively blocked content</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <BlockedContentTable />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function RegionsTable() {
  const regions = [
    { id: "1", name: "Global", code: "GLOBAL", countries: 195, status: "Active" },
    { id: "2", name: "United States", code: "US", countries: 1, status: "Active" },
    { id: "3", name: "Europe", code: "EU", countries: 27, status: "Active" },
    { id: "4", name: "Asia", code: "ASIA", countries: 48, status: "Active" },
    { id: "5", name: "Latin America", code: "LATAM", countries: 20, status: "Active" },
  ]

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Code</TableHead>
          <TableHead>Included Countries</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {regions.map((region) => (
          <TableRow key={region.id}>
            <TableCell className="font-medium">{region.name}</TableCell>
            <TableCell>
              <Badge variant="outline">{region.code}</Badge>
            </TableCell>
            <TableCell>{region.countries} countries</TableCell>
            <TableCell>
              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                {region.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end space-x-2">
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                {region.code !== "GLOBAL" && (
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function ScheduledContentTable() {
  const scheduledContent = [
    {
      id: "1",
      title: "New Album Release",
      artist: "Artist Name",
      type: "Collection",
      scheduledDate: "2024-01-15T10:00:00Z",
      regions: ["Global"],
      status: "Scheduled",
    },
    {
      id: "2",
      title: "Single Preview",
      artist: "Another Artist",
      type: "Song",
      scheduledDate: "2024-01-20T15:30:00Z",
      regions: ["US", "EU"],
      status: "Scheduled",
    },
  ]

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Content</TableHead>
          <TableHead>Artist</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Scheduled Date</TableHead>
          <TableHead>Regions</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {scheduledContent.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">{item.title}</TableCell>
            <TableCell>{item.artist}</TableCell>
            <TableCell>
              <Badge variant="outline">{item.type}</Badge>
            </TableCell>
            <TableCell>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{new Date(item.scheduledDate).toLocaleString()}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {item.regions.map((region) => (
                  <Badge key={region} variant="secondary" className="text-xs">
                    {region}
                  </Badge>
                ))}
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                {item.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end space-x-2">
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function BlockedContentTable() {
  const blockedContent = [
    {
      id: "1",
      title: "Blocked Song",
      artist: "Artist Name",
      type: "Song",
      blockedDate: "2024-01-10T14:30:00Z",
      reason: "Copyright violation",
      scope: "Global",
      blockedBy: "admin@melody.com",
    },
    {
      id: "2",
      title: "Regional Block",
      artist: "Another Artist",
      type: "Song",
      blockedDate: "2024-01-08T09:15:00Z",
      reason: "Legal request",
      scope: "EU",
      blockedBy: "moderator@melody.com",
    },
  ]

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Content</TableHead>
          <TableHead>Artist</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Block Date</TableHead>
          <TableHead>Reason</TableHead>
          <TableHead>Scope</TableHead>
          <TableHead>Blocked By</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {blockedContent.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">{item.title}</TableCell>
            <TableCell>{item.artist}</TableCell>
            <TableCell>
              <Badge variant="outline">{item.type}</Badge>
            </TableCell>
            <TableCell>{new Date(item.blockedDate).toLocaleString()}</TableCell>
            <TableCell>{item.reason}</TableCell>
            <TableCell>
              <Badge variant="secondary">{item.scope}</Badge>
            </TableCell>
            <TableCell>{item.blockedBy}</TableCell>
            <TableCell className="text-right">
              <Button variant="outline" size="sm">
                <Shield className="h-4 w-4 mr-2" />
                Unblock
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
