"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Calendar, MapPin, Music, Smartphone, Clock } from "lucide-react"
import { useState } from "react"

interface ViewUserModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: any
}

const roleColors = {
  admin: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  artist: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  listener: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  undefined: "bg-neutral-500/10 text-neutral-500 border-neutral-500/20",
}

const blockedBadge = "bg-red-500/10 text-red-500 border-red-500/20"
const activeBadge = "bg-green-500/10 text-green-500 border-green-500/20"

export function ViewUserModal({ open, onOpenChange, user }: ViewUserModalProps) {
  if (!user) return null
  const [bioExpanded, setBioExpanded] = useState(false)
  const MAX_BIO_LENGTH = 50

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.profileImageUrl || user.avatar || "/placeholder.svg"} alt={user.username || user.email} />
              <AvatarFallback className="text-lg">
                {(user.firstName || user.username || user.name || "")
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-xl font-semibold">{user.username ?? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()}</h3>
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant="outline" className={roleColors[user.role as keyof typeof roleColors]}>
                  {user.role.toLowerCase()}
                </Badge>
                <Badge variant="outline" className={user.isBlocked ? blockedBadge : activeBadge}>
                  {user.isBlocked ? "blocked" : "active"}
                </Badge>
              </div>
              {user.bio && (
                <p className="mt-2 text-sm text-muted-foreground">
                  {bioExpanded || user.bio.length <= MAX_BIO_LENGTH
                    ? user.bio
                    : `${user.bio.slice(0, MAX_BIO_LENGTH).trimEnd()}...`}
                  {user.bio.length > MAX_BIO_LENGTH && (
                    <button
                      type="button"
                      onClick={() => setBioExpanded((v) => !v)}
                      className="ml-2 text-xs font-medium text-primary hover:underline"
                    >
                      {bioExpanded ? "Show less" : "Read more"}
                    </button>
                  )}
                </p>
              )}
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card className="gap-4">
              <CardHeader>
                <CardTitle className="text-sm font-medium flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Account Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">ID</p>
                  <p className="font-mono text-sm">{user.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="text-sm">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Username</p>
                  <p className="text-sm">{user.username}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created At</p>
                  <p className="text-sm">{new Date(user.createdAt).toLocaleString('en-US')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Login</p>
                  <p className="text-sm">{user.lastLogin ? new Date(user.lastLogin).toLocaleString('en-US') : "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Content Filter</p>
                  <p className="text-sm">{user.contentFilter ? "Enabled" : "Disabled"}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="gap-4">
              <CardHeader>
                <CardTitle className="text-sm font-medium flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">Full name</p>
                  <p className="text-sm">{[user.firstName, user.lastName].filter(Boolean).join(" ")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="text-sm">{user.phone ?? "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="text-sm">{user.address ?? "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Country</p>
                  <p className="text-sm">{user.country}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center">
                <Music className="h-4 w-4 mr-2" />
                Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{user.followersCount ?? user.followers ?? 0}</div>
                  <p className="text-sm text-muted-foreground">Followers</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{user.followingCount ?? 0}</div>
                  <p className="text-sm text-muted-foreground">Following</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{user.likedSongs ?? 0}</div>
                  <p className="text-sm text-muted-foreground">Liked songs</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{user.playlists ?? 0}</div>
                  <p className="text-sm text-muted-foreground">Playlists</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
