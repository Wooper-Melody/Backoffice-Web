"use client"

import { useState, useEffect } from "react"
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
import {
  Pagination,
  PaginationContent,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
  PaginationItem,
  PaginationEllipsis,
} from "@/components/ui/pagination"
import { CreateUserModal } from "@/components/modals/create-user-modal"
import { EditUserModal } from "@/components/modals/edit-user-modal"
import { ViewUserModal } from "@/components/modals/view-user-modal"
import { BlockUserModal } from "@/components/modals/block-user-modal"
import { UnblockUserModal } from "@/components/modals/unblock-user-modal"

const users = [
  {
    id: "1",
    uuid: "1",
    email: "john.doe@example.com",
    username: "johndoe",
    firstName: "John",
    lastName: "Doe",
    phone: "+1-555-1234",
    address: "123 Main St, City",
    country: "United States",
    bio: "Music lover and playlist curator.",
    profileImageUrl: "/placeholder.svg",
    role: "listener",
    isBlocked: false,
    contentFilter: true,
    createdAt: "2023-06-15T10:00:00Z",
    lastLogin: "2024-01-20T14:30:00Z",
    status: "active",
    avatar: "/placeholder.svg",
    playlists: 45,
    followers: 1200,
    followersCount: 1200,
    followingCount: 150,
  },
  {
    id: "2",
    uuid: "2",
    email: "jane.smith@example.com",
    username: "janesmith",
    firstName: "Jane",
    lastName: "Smith",
    phone: "+1-555-9876",
    address: "456 Oak Ave, Town",
    country: "Canada",
    bio: "Jane Smith is an independent musician and composer whose work blends electronic textures with organic instrumentation. Over the past decade she has released multiple critically acclaimed EPs, scored short films, and collaborated with international artists. Her practice focuses on storytelling through sound and community-driven performances across festivals.",
    profileImageUrl: "/placeholder.svg",
    role: "artist",
    isBlocked: false,
    contentFilter: false,
    createdAt: "2023-03-10T09:30:00Z",
    lastLogin: "2024-01-20T13:15:00Z",
    status: "active",
    avatar: "/placeholder.svg",
    playlists: 23,
    followers: 890,
    followersCount: 890,
    followingCount: 200,
  },
  {
    id: "3",
    uuid: "3",
    email: "admin@melody.com",
    username: "sysadmin",
    firstName: "System",
    lastName: "Admin",
    phone: null,
    address: null,
    country: "United States",
    bio: null,
    profileImageUrl: "/placeholder.svg",
    role: "admin",
    isBlocked: false,
    contentFilter: false,
    createdAt: "2023-01-01T00:00:00Z",
    lastLogin: "2024-01-20T15:00:00Z",
    status: "active",
    avatar: "/placeholder.svg",
    playlists: 5,
    followers: 0,
    followersCount: 0,
    followingCount: 0,
  },
  {
    id: "4",
    uuid: "4",
    email: "blocked.user@example.com",
    username: "blockeduser",
    firstName: "Blocked",
    lastName: "User",
    phone: "+49-555-000",
    address: "Somewhere in Germany",
    country: "Germany",
    bio: "This user was blocked for testing.",
    profileImageUrl: "/placeholder.svg",
    role: "listener",
    isBlocked: true,
    contentFilter: true,
    createdAt: "2023-08-20T14:00:00Z",
    lastLogin: "2024-01-15T10:00:00Z",
    status: "blocked",
    avatar: "/placeholder.svg",
    playlists: 12,
    followers: 45,
    followersCount: 45,
    followingCount: 5,
  },
  {
    id: "5",
    uuid: "5",
    email: "alice.wong@example.com",
    username: "alicew",
    firstName: "Alice",
    lastName: "Wong",
    phone: "+1-555-2222",
    address: "789 Pine Rd, City",
    country: "United States",
    bio: "Product manager and part-time DJ. Loves discovering new artists and curating themed playlists.",
    profileImageUrl: "/placeholder.svg",
    role: "listener",
    isBlocked: false,
    contentFilter: false,
    createdAt: "2023-07-01T09:00:00Z",
    lastLogin: "2024-01-18T11:20:00Z",
    status: "active",
    avatar: "/placeholder.svg",
    playlists: 8,
    followers: 210,
    followersCount: 210,
    followingCount: 34,
  },
  {
    id: "6",
    uuid: "6",
    email: "carlos.martinez@example.com",
    username: "carlosm",
    firstName: "Carlos",
    lastName: "Martinez",
    phone: "+34-600-123-456",
    address: "Calle Falsa 123, Madrid",
    country: "Spain",
    bio: "Electronic music producer and sound designer. Runs a small label focused on experimental beats.",
    profileImageUrl: "/placeholder.svg",
    role: "artist",
    isBlocked: false,
    contentFilter: false,
    createdAt: "2022-11-12T08:30:00Z",
    lastLogin: "2024-01-19T09:40:00Z",
    status: "active",
    avatar: "/placeholder.svg",
    playlists: 30,
    followers: 540,
    followersCount: 540,
    followingCount: 120,
  },
  {
    id: "7",
    uuid: "7",
    email: "laura.chen@example.com",
    username: "laurachen",
    firstName: "Laura",
    lastName: "Chen",
    phone: "+44-20-5555-6666",
    address: "10 Downing St, London",
    country: "United Kingdom",
    bio: "Community manager passionate about music education and outreach.",
    profileImageUrl: "/placeholder.svg",
    role: "admin",
    isBlocked: false,
    contentFilter: true,
    createdAt: "2023-02-02T12:00:00Z",
    lastLogin: "2024-01-16T16:45:00Z",
    status: "active",
    avatar: "/placeholder.svg",
    playlists: 3,
    followers: 75,
    followersCount: 75,
    followingCount: 10,
  },
  {
    id: "8",
    uuid: "8",
    email: "michael.kim@example.com",
    username: "mikekim",
    firstName: "Michael",
    lastName: "Kim",
    phone: "+82-10-5555-7777",
    address: "Seoul, Korea",
    country: "Korea",
    bio: "Music teacher and arranger. Enjoys collaborating with students to produce original tracks.",
    profileImageUrl: "/placeholder.svg",
    role: "listener",
    isBlocked: false,
    contentFilter: false,
    createdAt: "2022-05-20T07:15:00Z",
    lastLogin: "2024-01-10T08:00:00Z",
    status: "active",
    avatar: "/placeholder.svg",
    playlists: 14,
    followers: 320,
    followersCount: 320,
    followingCount: 60,
  },
  {
    id: "9",
    uuid: "9",
    email: "sophia.lee@example.com",
    username: "sophial",
    firstName: "Sophia",
    lastName: "Lee",
    phone: "+1-555-4444",
    address: "22 Market St, City",
    country: "United States",
    bio: "Curator at a local radio station. Loves deep dives into classic and contemporary albums.",
    profileImageUrl: "/placeholder.svg",
    role: "listener",
    isBlocked: false,
    contentFilter: false,
    createdAt: "2021-09-30T10:10:00Z",
    lastLogin: "2024-01-17T12:00:00Z",
    status: "active",
    avatar: "/placeholder.svg",
    playlists: 27,
    followers: 410,
    followersCount: 410,
    followingCount: 88,
  },
  {
    id: "10",
    uuid: "10",
    email: "tom.owens@example.com",
    username: "tomowens",
    firstName: "Tom",
    lastName: "Owens",
    phone: "+61-2-5555-8888",
    address: "Sydney, Australia",
    country: "Australia",
    bio: "Live sound engineer and occasional producer.",
    profileImageUrl: "/placeholder.svg",
    role: "listener",
    isBlocked: false,
    contentFilter: false,
    createdAt: "2020-12-01T09:00:00Z",
    lastLogin: "2024-01-12T14:30:00Z",
    status: "active",
    avatar: "/placeholder.svg",
    playlists: 9,
    followers: 64,
    followersCount: 64,
    followingCount: 12,
  },
  {
    id: "11",
    uuid: "11",
    email: "olga.nikiforova@example.com",
    username: "olgan",
    firstName: "Olga",
    lastName: "Nikiforova",
    phone: "+7-495-555-9999",
    address: "Moscow, Russia",
    country: "Russia",
    bio: "Classical guitarist and teacher.",
    profileImageUrl: "/placeholder.svg",
    role: "listener",
    isBlocked: false,
    contentFilter: false,
    createdAt: "2019-04-22T11:11:00Z",
    lastLogin: "2024-01-14T10:10:00Z",
    status: "active",
    avatar: "/placeholder.svg",
    playlists: 16,
    followers: 210,
    followersCount: 210,
    followingCount: 40,
  },
]

const roleColors = {
  admin: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  artist: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  listener: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  undefined: "bg-neutral-500/10 text-neutral-500 border-neutral-500/20",
}

const statusColors = {
  active: "bg-green-500/10 text-green-500 border-green-500/20",
  blocked: "bg-red-500/10 text-red-500 border-red-500/20",
}

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 5

  const [createUserOpen, setCreateUserOpen] = useState(false)
  const [editUserOpen, setEditUserOpen] = useState(false)
  const [viewUserOpen, setViewUserOpen] = useState(false)
  const [blockUserOpen, setBlockUserOpen] = useState(false)
  const [unblockUserOpen, setUnblockUserOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)

  const filteredUsers = users.filter((user) => {
    const lower = searchTerm.toLowerCase()
    const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
    const matchesSearch =
      (user.username && user.username.toLowerCase().includes(lower)) ||
      (fullName && fullName.toLowerCase().includes(lower)) ||
      (user.email && user.email.toLowerCase().includes(lower)) ||
      (user.country && user.country.toLowerCase().includes(lower))
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize))
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  // reset to first page when filters/search change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, roleFilter, statusFilter])

  // compact page list for large number of pages
  const pageList = (() => {
    // If there are few pages, show them all
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1)

    const pages = new Set<number>()
    pages.add(1)
    pages.add(totalPages)

    // If current is near the start, show 2 and 3
    if (currentPage < 2) {
      pages.add(2)
      return Array.from(pages).filter((p) => p <= totalPages).sort((a, b) => a - b)
    }

    // If current is near the end, show last-2 and last-1
    if (currentPage >= totalPages - 1) {
      pages.add(totalPages - 2)
      pages.add(totalPages - 1)
      return Array.from(pages).filter((p) => p >= 1).sort((a, b) => a - b)
    }

    // Otherwise show left, current and right
    pages.add(currentPage - 1)
    pages.add(currentPage)
    pages.add(currentPage + 1)

    return Array.from(pages).sort((a, b) => a - b)
  })()

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

  // artist/listener stats
  const listenersCount = users.filter((u) => u.role === "listener").length
  const artistsCount = users.filter((u) => u.role === "artist").length
  const artistListenerRatio = artistsCount === 0 ? null : listenersCount / Math.max(1, artistsCount)

  // most recent signup (safe parse)
  const mostRecentUser = users
    .slice()
    .sort((a, b) => (new Date(b.createdAt || 0).getTime() as number) - (new Date(a.createdAt || 0).getTime() as number))[0] || null

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
            <CardTitle className="text-sm font-medium">Artist / Listener Ratio</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('en-US').format(listenersCount)} / {new Intl.NumberFormat('en-US').format(artistsCount)}
            </div>
            <p className="text-xs text-muted-foreground">
              {artistListenerRatio === null ? 'No artists' : `${artistListenerRatio.toFixed(2)} : 1 (listeners per artist)`}
            </p>
          </CardContent>
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Recent Signup</CardTitle>
            <Plus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {mostRecentUser ? (
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={mostRecentUser.profileImageUrl || mostRecentUser.avatar || "/placeholder.svg"} alt={mostRecentUser.username ?? `${mostRecentUser.firstName ?? ''} ${mostRecentUser.lastName ?? ''}`.trim()} />
                  <AvatarFallback>
                    {((mostRecentUser.firstName ?? mostRecentUser.username ?? '') as string)
                      .split(' ')
                      .map((n: string) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{[mostRecentUser.firstName, mostRecentUser.lastName].filter(Boolean).join(' ') || mostRecentUser.username}</div>
                  <div className="text-xs text-muted-foreground">{new Date(mostRecentUser.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">No signups</div>
            )}
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
                <SelectItem value="listener">Listener</SelectItem>
                <SelectItem value="artist">Artist</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
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
              {paginatedUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.profileImageUrl || user.avatar || "/placeholder.svg"} alt={user.username ?? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()} />
                        <AvatarFallback>
                          {((user.firstName ?? user.username ?? "") as string)
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{[user.firstName, user.lastName].filter(Boolean).join(" ") ?? user.username}</div>
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
                      <Badge variant="outline" className={statusColors[user.status as keyof typeof statusColors]}>
                        {user.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>{user.country}</TableCell>
                  <TableCell className="text-sm">{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-sm">{new Date(user.lastLogin).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{user.playlists} playlists</div>
                      <div className="text-muted-foreground">{user.followersCount ?? user.followers ?? 0} followers</div>
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

      {/* Pagination Controls */}
      <div className="flex items-center justify-center">
        <Pagination aria-label="Users pagination">
          <PaginationContent>
            <PaginationPrevious
              onClick={(e) => {
                e.preventDefault()
                setCurrentPage((p) => Math.max(1, p - 1))
              }}
              aria-disabled={currentPage === 1}
            />

            {pageList.map((page, idx) => {
              const prev = pageList[idx - 1]
              const gap = prev && page - prev > 1
              return (
                <>
                  {gap ? (
                    <PaginationItem key={`gap-${page}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : null}
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      isActive={page === currentPage}
                      onClick={(e) => {
                        e.preventDefault()
                        setCurrentPage(page)
                      }}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                </>
              )
            })}

            <PaginationNext
              onClick={(e) => {
                e.preventDefault()
                setCurrentPage((p) => Math.min(totalPages, p + 1))
              }}
              aria-disabled={currentPage === totalPages}
            />
          </PaginationContent>
        </Pagination>
      </div>

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
