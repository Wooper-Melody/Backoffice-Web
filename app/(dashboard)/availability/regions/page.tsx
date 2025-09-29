"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Search, Plus, Edit, Trash2, Globe, MapPin } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const regions = [
  {
    id: "1",
    name: "North America",
    code: "NA",
    countries: ["United States", "Canada", "Mexico"],
    status: "active",
    contentCount: 12847,
    restrictions: 23,
  },
  {
    id: "2",
    name: "Europe",
    code: "EU",
    countries: ["Germany", "France", "Spain", "Italy", "United Kingdom"],
    status: "active",
    contentCount: 11234,
    restrictions: 45,
  },
  {
    id: "3",
    name: "Asia Pacific",
    code: "APAC",
    countries: ["Japan", "South Korea", "Australia", "Singapore"],
    status: "active",
    contentCount: 8956,
    restrictions: 67,
  },
  {
    id: "4",
    name: "Latin America",
    code: "LATAM",
    countries: ["Brazil", "Argentina", "Chile", "Colombia"],
    status: "inactive",
    contentCount: 5432,
    restrictions: 12,
  },
]

export default function RegionalConfigurationPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedRegion, setSelectedRegion] = useState<any>(null)
  const { toast } = useToast()

  const [regionForm, setRegionForm] = useState({
    name: "",
    code: "",
    countries: "",
  })

  const filteredRegions = regions.filter((region) => {
    const matchesSearch =
      region.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      region.code.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || region.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleStatusToggle = async (regionId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active"
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Status Updated",
        description: `The region has been successfully ${newStatus === "active" ? "activated" : "deactivated"}.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update the region status.",
        variant: "destructive",
      })
    }
  }

  const handleCreateRegion = async () => {
    try {
      // Validate form
      if (!regionForm.name || !regionForm.code || !regionForm.countries) {
        toast({
          title: "Error",
          description: "Please complete all fields.",
          variant: "destructive",
        })
        return
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Region Created",
        description: "The region has been successfully created.",
      })

      // Reset form and close dialog
      setRegionForm({ name: "", code: "", countries: "" })
      setIsCreateDialogOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create the region.",
        variant: "destructive",
      })
    }
  }

  const handleEditRegion = (region: any) => {
    setSelectedRegion(region)
    setRegionForm({
      name: region.name,
      code: region.code,
      countries: region.countries.join(", "),
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateRegion = async () => {
    try {
      // Validate form
      if (!regionForm.name || !regionForm.code || !regionForm.countries) {
        toast({
          title: "Error",
          description: "Please complete all fields.",
          variant: "destructive",
        })
        return
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Region Updated",
        description: "The region has been successfully updated.",
      })

      // Reset form and close dialog
      setRegionForm({ name: "", code: "", countries: "" })
      setSelectedRegion(null)
      setIsEditDialogOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update the region.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteRegion = (region: any) => {
    setSelectedRegion(region)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Region Deleted",
        description: "The region has been successfully deleted.",
      })

      setSelectedRegion(null)
      setIsDeleteDialogOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the region.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Regional Configuration</h1>
          <p className="text-muted-foreground">Manage content availability by geographic regions</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Region
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Region</DialogTitle>
              <DialogDescription>Define a new geographic region for content availability management.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  placeholder="Region name"
                  className="col-span-3"
                  value={regionForm.name}
                  onChange={(e) => setRegionForm({ ...regionForm, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="code" className="text-right">
                  Code
                </Label>
                <Input
                  id="code"
                  placeholder="Region code"
                  className="col-span-3"
                  value={regionForm.code}
                  onChange={(e) => setRegionForm({ ...regionForm, code: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="countries" className="text-right">
                  Countries
                </Label>
                <Textarea
                  id="countries"
                  placeholder="List countries separated by commas"
                  className="col-span-3"
                  value={regionForm.countries}
                  onChange={(e) => setRegionForm({ ...regionForm, countries: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleCreateRegion}>
                Create Region
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Regions</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{regions.length}</div>
            <p className="text-xs text-muted-foreground">Active regions configured</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Countries Covered</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {regions.reduce((acc, region) => acc + region.countries.length, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Countries with availability rules</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Content Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {regions.reduce((acc, region) => acc + region.contentCount, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Total content items managed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Restrictions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{regions.reduce((acc, region) => acc + region.restrictions, 0)}</div>
            <p className="text-xs text-muted-foreground">Regional content restrictions</p>
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
                  placeholder="Search by region name or code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Regions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Regions ({filteredRegions.length})</CardTitle>
          <CardDescription>Geographic regions configured for content availability</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Region</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Countries</TableHead>
                <TableHead>Content Items</TableHead>
                <TableHead>Restrictions</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRegions.map((region) => (
                <TableRow key={region.id}>
                  <TableCell className="font-medium">{region.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{region.code}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {region.countries.slice(0, 3).map((country) => (
                        <Badge key={country} variant="secondary" className="text-xs">
                          {country}
                        </Badge>
                      ))}
                      {region.countries.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{region.countries.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{region.contentCount.toLocaleString()}</TableCell>
                  <TableCell>{region.restrictions}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={region.status === "active"}
                        onCheckedChange={() => handleStatusToggle(region.id, region.status)}
                      />
                      <Badge variant={region.status === "active" ? "default" : "secondary"}>{region.status}</Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEditRegion(region)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteRegion(region)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Region</DialogTitle>
            <DialogDescription>Update the geographic region information.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Name
              </Label>
              <Input
                id="edit-name"
                placeholder="Region name"
                className="col-span-3"
                value={regionForm.name}
                onChange={(e) => setRegionForm({ ...regionForm, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-code" className="text-right">
                Code
              </Label>
              <Input
                id="edit-code"
                placeholder="Region code"
                className="col-span-3"
                value={regionForm.code}
                onChange={(e) => setRegionForm({ ...regionForm, code: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-countries" className="text-right">
                Countries
              </Label>
              <Textarea
                id="edit-countries"
                placeholder="List countries separated by commas"
                className="col-span-3"
                value={regionForm.countries}
                onChange={(e) => setRegionForm({ ...regionForm, countries: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateRegion}>Update Region</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the region "{selectedRegion?.name}" and
              may affect content availability in that region.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
