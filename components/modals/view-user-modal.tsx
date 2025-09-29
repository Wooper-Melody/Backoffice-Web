"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Calendar, MapPin, Music, Smartphone, Clock } from "lucide-react"

interface ViewUserModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: any
}

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

export function ViewUserModal({ open, onOpenChange, user }: ViewUserModalProps) {
  if (!user) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>User Profile</DialogTitle>
          <DialogDescription>Detailed information about the user account</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Header */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
              <AvatarFallback className="text-lg">
                {user.name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-xl font-semibold">{user.name}</h3>
              <p className="text-muted-foreground">{user.email}</p>
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant="outline" className={roleColors[user.role as keyof typeof roleColors]}>
                  {user.role}
                </Badge>
                <Badge variant="outline" className={statusColors[user.status as keyof typeof statusColors]}>
                  {user.status}
                </Badge>
                <Badge
                  variant="outline"
                  className={subscriptionColors[user.subscription as keyof typeof subscriptionColors]}
                >
                  {user.subscription}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Account Information */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Account Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">User ID</p>
                  <p className="font-mono text-sm">{user.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Registered</p>
                  <p className="text-sm">{new Date(user.registeredAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Login</p>
                  <p className="text-sm">{new Date(user.lastLogin).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  Location & Devices
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">Country</p>
                  <p className="text-sm">{user.country}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Devices</p>
                  <p className="text-sm flex items-center">
                    <Smartphone className="h-3 w-3 mr-1" />
                    {user.devices} devices
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Activity Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center">
                <Music className="h-4 w-4 mr-2" />
                Activity Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{user.playlists}</div>
                  <p className="text-sm text-muted-foreground">Playlists</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{user.followers}</div>
                  <p className="text-sm text-muted-foreground">Followers</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{user.devices}</div>
                  <p className="text-sm text-muted-foreground">Devices</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span>Last login</span>
                  <span className="text-muted-foreground">{new Date(user.lastLogin).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Account status</span>
                  <Badge variant="outline" className={statusColors[user.status as keyof typeof statusColors]}>
                    {user.status}
                  </Badge>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Subscription type</span>
                  <Badge
                    variant="outline"
                    className={subscriptionColors[user.subscription as keyof typeof subscriptionColors]}
                  >
                    {user.subscription}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
