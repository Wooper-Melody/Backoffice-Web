"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
  UserX,
  Trash,
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
import { DeleteUserModal } from "@/components/modals/delete-user-modal"
import { useUsers } from "@/hooks/use-users"
import { useAuth } from "@/components/auth/auth-provider"
import type { UserAdminResponse } from "@/types/users"

const roleColors = {
  ADMIN: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  ARTIST: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  LISTENER: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  UNDECLARED: "bg-neutral-500/10 text-neutral-500 border-neutral-500/20",
}

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  // Separate state for applied filters (what gets sent to API)
  const [appliedFilters, setAppliedFilters] = useState({
    search: "",
    role: "all",
    status: "all"
  })

  const [createUserOpen, setCreateUserOpen] = useState(false)
  const [editUserOpen, setEditUserOpen] = useState(false)
  const [viewUserOpen, setViewUserOpen] = useState(false)
  const [blockUserOpen, setBlockUserOpen] = useState(false)
  const [unblockUserOpen, setUnblockUserOpen] = useState(false)
  const [deleteUserOpen, setDeleteUserOpen] = useState(false)

  const {
    loading,
    usersData,
    selectedUser,
    setSelectedUser,
    fetchUsers,
    fetchUser,
    createUser,
    updateUser,
    blockUser,
    unblockUser,
    deleteUser,
  } = useUsers()

  const { user: currentUser } = useAuth()

  // Check if a user is the current logged-in user
  const isCurrentUser = (user: UserAdminResponse) => {
    return currentUser?.id === user.id
  }

  // Fetch users on component mount and when applied filters change
  useEffect(() => {
    fetchUsers({
      page: currentPage - 1, // API uses 0-based pagination
      size: pageSize,
      search: appliedFilters.search || undefined,
      role: appliedFilters.role !== "all" ? appliedFilters.role : undefined,
      status: appliedFilters.status !== "all" ? appliedFilters.status : undefined,
    })
  }, [currentPage, appliedFilters, fetchUsers])

  // Reset to first page when applied filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [appliedFilters])

  // Handle search button click
  const handleSearch = () => {
    setAppliedFilters({
      search: searchTerm,
      role: roleFilter,
      status: statusFilter
    })
  }

  // Handle clear filters
  const handleClearFilters = () => {
    setSearchTerm("")
    setRoleFilter("all")
    setStatusFilter("all")
    setAppliedFilters({
      search: "",
      role: "all",
      status: "all"
    })
  }

  // Since we're now filtering server-side, use the results directly
  const filteredUsers = usersData?.users || []

  const totalPages = usersData?.totalPages || 1
  const totalElements = usersData?.totalElements || 0

  // Compact page list for large number of pages
  const pageList = (() => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1)

    const pages = new Set<number>()
    pages.add(1)
    pages.add(totalPages)

    if (currentPage < 2) {
      pages.add(2)
      return Array.from(pages).filter((p) => p <= totalPages).sort((a, b) => a - b)
    }

    if (currentPage >= totalPages - 1) {
      pages.add(totalPages - 2)
      pages.add(totalPages - 1)
      return Array.from(pages).filter((p) => p >= 1).sort((a, b) => a - b)
    }

    pages.add(currentPage - 1)
    pages.add(currentPage)
    pages.add(currentPage + 1)

    return Array.from(pages).sort((a, b) => a - b)
  })()

  const handleViewUser = async (user: UserAdminResponse) => {
    const fullUser = await fetchUser(user.id)
    if (fullUser) {
      setViewUserOpen(true)
    }
  }

  const handleEditUser = async (user: UserAdminResponse) => {
    const fullUser = await fetchUser(user.id)
    if (fullUser) {
      setEditUserOpen(true)
    }
  }

  const handleBlockUserClick = (user: UserAdminResponse) => {
    setSelectedUser(user)
    setBlockUserOpen(true)
  }

  const handleUnblockUserClick = (user: UserAdminResponse) => {
    setSelectedUser(user)
    setUnblockUserOpen(true)
  }

  const handleCreateUser = async (userData: any) => {
    const success = await createUser(userData)
    if (success) {
      setCreateUserOpen(false)
    }
  }

  const handleUpdateUser = async (userData: any) => {
    if (selectedUser) {
      const success = await updateUser(selectedUser.id, userData)
      if (success) {
        setEditUserOpen(false)
      }
    }
  }

  const handleBlockUser = async (user: UserAdminResponse): Promise<boolean> => {
    const success = await blockUser(user.id)
    if (success) {
      setBlockUserOpen(false)
    }
    return success
  }

  const handleUnblockUser = async (user: UserAdminResponse): Promise<boolean> => {
    const success = await unblockUser(user.id)
    if (success) {
      setUnblockUserOpen(false)
    }
    return success
  }

  const handleDeleteUserClick = (user: UserAdminResponse) => {
    setSelectedUser(user)
    setDeleteUserOpen(true)
  }

  const handleDeleteUser = async (user: UserAdminResponse): Promise<boolean> => {
    const success = await deleteUser(user.id)
    if (success) {
      setDeleteUserOpen(false)
    }
    return success
  }

  // Statistics
  const listenersCount = filteredUsers.filter((u) => u.role === "LISTENER").length
  const artistsCount = filteredUsers.filter((u) => u.role === "ARTIST").length
  const adminCount = filteredUsers.filter((u) => u.role === "ADMIN").length
  const blockedCount = filteredUsers.filter((u) => u.isBlocked).length

  // Most recent signup
  const mostRecentUser = [...filteredUsers]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0] || null

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
            <div className="text-2xl font-bold">{new Intl.NumberFormat('es-ES').format(totalElements)}</div>
            <p className="text-xs text-muted-foreground">Accounts registered</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Role Distribution</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('es-ES').format(listenersCount)} / {new Intl.NumberFormat('es-ES').format(artistsCount)} / {new Intl.NumberFormat('es-ES').format(adminCount)}
            </div>
            <p className="text-xs text-muted-foreground">Listeners / Artists / Admins</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blocked Users</CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{blockedCount}</div>
            <p className="text-xs text-muted-foreground">Blocked Accounts</p>
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
                  <AvatarImage src={mostRecentUser.profilePictureUrl || "/placeholder-user.jpg"} alt={mostRecentUser.username ?? `${mostRecentUser.firstName ?? ''} ${mostRecentUser.lastName ?? ''}`.trim()} />
                  <AvatarFallback>
                    {((mostRecentUser.firstName ?? mostRecentUser.username ?? '') as string)
                      .split(' ')
                      .map((n: string) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{[mostRecentUser.firstName, mostRecentUser.lastName].filter(Boolean).join(' ') || mostRecentUser.username}</div>
                  <div className="text-xs text-muted-foreground">{new Date(mostRecentUser.createdAt).toLocaleDateString('es-ES')}</div>
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">No records</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters and Search</CardTitle>
          <CardDescription>Search users by name, username, email or apply filters. Click Search to apply filters.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, username, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSearch()
                      }
                    }}
                  />
                </div>
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="LISTENER">Listener</SelectItem>
                  <SelectItem value="ARTIST">Artist</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="UNDECLARED">Undeclared</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button onClick={handleSearch} className="flex items-center space-x-2">
                <Search className="h-4 w-4" />
                <span>Search</span>
              </Button>
              <Button 
                variant="outline" 
                onClick={handleClearFilters}
                disabled={appliedFilters.search === "" && appliedFilters.role === "all" && appliedFilters.status === "all"}
              >
                Clear Filters
              </Button>
              {appliedFilters.search || appliedFilters.role !== "all" || appliedFilters.status !== "all" ? (
                <div className="text-sm text-muted-foreground">
                  Active filters: {[
                    appliedFilters.search && `Search: "${appliedFilters.search}"`,
                    appliedFilters.role !== "all" && `Role: ${appliedFilters.role.charAt(0).toUpperCase() + appliedFilters.role.slice(1).toLowerCase()}`,
                    appliedFilters.status !== "all" && `Status: ${appliedFilters.status.charAt(0).toUpperCase() + appliedFilters.status.slice(1).toLowerCase()}`
                  ].filter(Boolean).join(", ")}
                </div>
              ) : null}
            </div>
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
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-muted-foreground">Loading users...</div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-center text-muted-foreground">Users not found</div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
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
                          <AvatarImage src={user.profilePictureUrl || "/placeholder-user.jpg"} alt={user.username ?? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()} />
                          <AvatarFallback>
                            {((user.firstName ?? user.username ?? "") as string)
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {[user.firstName, user.lastName].filter(Boolean).join(" ") ?? user.username}
                            {isCurrentUser(user) && (
                              <span className="text-xs text-muted-foreground  px-2 py-1 rounded-md">
                                (You)
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={roleColors[user.role as keyof typeof roleColors]}>
                        {user.role === 'LISTENER' ? 'Listener' : 
                         user.role === 'ARTIST' ? 'Artist' : 
                         user.role === 'ADMIN' ? 'Admin' : 
                         'Undeclared'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant="outline" 
                          className={user.isBlocked ? 
                            "bg-red-500/10 text-red-500 border-red-500/20" : 
                            "bg-green-500/10 text-green-500 border-green-500/20"
                          }
                        >
                          {user.isBlocked ? 'Blocked' : 'Active'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{new Date(user.createdAt).toLocaleDateString('es-ES')}</TableCell>
                    <TableCell className="text-sm">
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('es-ES') : '-'}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{user.followersCount} followers</div>
                        <div className="text-muted-foreground">{user.followingCount} following</div>
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
                          {!isCurrentUser(user) && (
                            <>
                              <DropdownMenuSeparator />
                              {user.isBlocked ? (
                                <DropdownMenuItem onClick={() => handleUnblockUserClick(user)}>
                                  <ShieldOff className="mr-2 h-4 w-4" />
                                  Unblock User
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem onClick={() => handleBlockUserClick(user)}>
                                  <Shield className="mr-2 h-4 w-4" />
                                  Block User
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleDeleteUserClick(user)}
                                className="text-destructive focus:text-destructive focus:bg-destructive/10"
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                Delete User
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
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
                <React.Fragment key={page}>
                  {gap ? (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : null}
                  <PaginationItem>
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
                </React.Fragment>
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
        onCreateUser={handleCreateUser}
      />

      <EditUserModal
        open={editUserOpen}
        onOpenChange={setEditUserOpen}
        user={selectedUser}
        onSaveUser={handleUpdateUser}
      />

      <ViewUserModal open={viewUserOpen} onOpenChange={setViewUserOpen} user={selectedUser} />

      <BlockUserModal
        open={blockUserOpen}
        onOpenChange={setBlockUserOpen}
        user={selectedUser}
        onBlockUser={handleBlockUser}
      />

      <UnblockUserModal
        open={unblockUserOpen}
        onOpenChange={setUnblockUserOpen}
        user={selectedUser}
        onUnblockUser={handleUnblockUser}
      />

      <DeleteUserModal
        open={deleteUserOpen}
        onOpenChange={setDeleteUserOpen}
        user={selectedUser}
        onDeleteUser={handleDeleteUser}
      />
    </div>
  )
}
