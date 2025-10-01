"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Search,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Shield,
  ShieldOff,
  Users,
  UserCheck,
  UserX,
  Crown,
} from "lucide-react"

import { ExportMenu } from "@/components/common/export-menu"
import { CreateUserModal } from "@/components/modals/create-user-modal"
import { EditUserModal } from "@/components/modals/edit-user-modal"
import { ViewUserModal } from "@/components/modals/view-user-modal"
import { BlockUserModal } from "@/components/modals/block-user-modal"
import { UnblockUserModal } from "@/components/modals/unblock-user-modal"

const users = [
  {
    id: "1",
    email: "john.doe@example.com",
    name: "John Doe",
    avatar: "/placeholder.svg",
    role: "user",
    status: "active",
    lastLogin: "2024-01-20T14:30:00Z",
    registeredAt: "2023-06-15T10:00:00Z",
    country: "United States",
    playlists: 45,
    followers: 1200,
  },
  {
    id: "2",
    email: "jane.smith@example.com",
    name: "Jane Smith",
    avatar: "/placeholder.svg",
    role: "moderator",
    status: "active",
    lastLogin: "2024-01-20T13:15:00Z",
    registeredAt: "2023-03-10T09:30:00Z",
    country: "Canada",
    playlists: 23,
    followers: 890,
  },
  {
    id: "3",
    email: "admin@melody.com",
    name: "System Admin",
    avatar: "/placeholder.svg",
    role: "admin",
    status: "active",
    lastLogin: "2024-01-20T15:00:00Z",
    registeredAt: "2023-01-01T00:00:00Z",
    country: "United States",
    playlists: 5,
    followers: 0,
  },
  {
    id: "4",
    email: "blocked.user@example.com",
    name: "Blocked User",
    avatar: "/placeholder.svg",
    role: "user",
    status: "blocked",
    lastLogin: "2024-01-15T10:00:00Z",
    registeredAt: "2023-08-20T14:00:00Z",
    country: "Germany",
    playlists: 12,
    followers: 45,
  },
]

const roleColors = {
  admin: "bg-red-500/10 text-red-500 border-red-500/20",
  moderator: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  user: "bg-green-500/10 text-green-500 border-green-500/20",
}

const statusColors = {
  active: "bg-green-500/10 text-green-500 border-green-500/20",
  blocked: "bg-red-500/10 text-red-500 border-red-500/20",
  pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
}

const subscriptionColors = {
  free: "bg-gray-500/10 text-gray-500 border-gray-500/20",
  premium: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  admin: "bg-orange-500/10 text-orange-500 border-orange-500/20",
}

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const [createUserOpen, setCreateUserOpen] = useState(false)
  const [editUserOpen, setEditUserOpen] = useState(false)
  const [viewUserOpen, setViewUserOpen] = useState(false)
  const [blockUserOpen, setBlockUserOpen] = useState(false)
  const [unblockUserOpen, setUnblockUserOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.country.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  const handleViewUser = (user: any) => {
    setSelectedUser(user)
    setViewUserOpen(true)
  }

  const handleEditUser = (user: any) => {
    setSelectedUser(user)
    setEditUserOpen(true)
  }

  const handleBlockUser = (user: any) => {
    setSelectedUser(user)
    setBlockUserOpen(true)
  }

  const handleUnblockUser = (user: any) => {
    setSelectedUser(user)
    setUnblockUserOpen(true)
  }

  const handleStatusToggle = (user: any) => {
    if (user.status === "active") {
      handleBlockUser(user)
    } else {
      handleUnblockUser(user)
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">Manage user accounts, roles, and permissions</p>
        </div>
        <div className="flex items-center space-x-2">
          <ExportMenu
            onExport={(format) => {
              console.log(`Exporting users data as ${format}`)
              // Implement export logic for users
            }}
          />
          <Button onClick={() => setCreateUserOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Intl.NumberFormat('en-US').format(users.length)}</div>
            <p className="text-xs text-muted-foreground">Registered accounts</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter((u) => u.status === "active").length}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Premium Users</CardTitle>
            <Crown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blocked Users</CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter((u) => u.status === "blocked").length}</div>
            <p className="text-xs text-muted-foreground">Blocked accounts</p>
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
                  placeholder="Search by name, email, or country..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="moderator">Moderator</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
          <CardDescription>Manage user accounts and their permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Activity</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback>
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={roleColors[user.role as keyof typeof roleColors]}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch checked={user.status === "active"} onCheckedChange={() => handleStatusToggle(user)} />
                      <Badge variant="outline" className={statusColors[user.status as keyof typeof statusColors]}>
                        {user.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>{user.country}</TableCell>
                  <TableCell className="text-sm">{new Date(user.registeredAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-sm">{new Date(user.lastLogin).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{user.playlists} playlists</div>
                      <div className="text-muted-foreground">{user.followers} followers</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleViewUser(user)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditUser(user)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit User
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {user.status === "blocked" ? (
                          <DropdownMenuItem onClick={() => handleUnblockUser(user)}>
                            <ShieldOff className="mr-2 h-4 w-4" />
                            Unblock User
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => handleBlockUser(user)}>
                            <Shield className="mr-2 h-4 w-4" />
                            Block User
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <CreateUserModal
        open={createUserOpen}
        onOpenChange={setCreateUserOpen}
        onCreateUser={(userData) => {
          console.log("Creating user:", userData)
          setCreateUserOpen(false)
        }}
      />

      <EditUserModal
        open={editUserOpen}
        onOpenChange={setEditUserOpen}
        user={selectedUser}
        onSaveUser={(userData) => {
          console.log("Saving user:", userData)
          setEditUserOpen(false)
        }}
      />

      <ViewUserModal open={viewUserOpen} onOpenChange={setViewUserOpen} user={selectedUser} />

      <BlockUserModal
        open={blockUserOpen}
        onOpenChange={setBlockUserOpen}
        user={selectedUser}
        onConfirm={() => {
          console.log("Blocking user:", selectedUser)
          setBlockUserOpen(false)
        }}
      />

      <UnblockUserModal
        open={unblockUserOpen}
        onOpenChange={setUnblockUserOpen}
        user={selectedUser}
        onConfirm={() => {
          console.log("Unblocking user:", selectedUser)
          setUnblockUserOpen(false)
        }}
      />
    </div>
  )
}
