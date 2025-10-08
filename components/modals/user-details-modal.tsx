"use client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Calendar, MapPin, Music, Users, Play, Heart, Shield } from "lucide-react"

interface UserDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  user: {
    id: string
    email: string
    name: string
    avatar?: string
    role: string
    status: string
    lastLogin: string
    registeredAt: string
    subscription: string
    country: string
    devices: number
    playlists: number
    followers: number
  } | null
}

export function UserDetailsModal({ isOpen, onClose, user }: UserDetailsModalProps) {
  if (!user) return null

  const mockActivity = [
    { action: "Created playlist", details: "Summer Vibes 2024", timestamp: "2024-01-20T14:30:00Z" },
    { action: "Followed artist", details: "The Weeknd", timestamp: "2024-01-20T13:15:00Z" },
    { action: "Liked song", details: "Blinding Lights", timestamp: "2024-01-20T12:45:00Z" },
    { action: "Shared playlist", details: "My Favorites", timestamp: "2024-01-20T11:20:00Z" },
  ]

  const mockPlaylists = [
    { name: "Summer Vibes 2024", songs: 45, plays: 1200, isPublic: true },
    { name: "Workout Mix", songs: 32, plays: 890, isPublic: false },
    { name: "Chill Evening", songs: 28, plays: 567, isPublic: true },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>Complete information and activity for {user.name}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Header */}
          <div className="flex items-start space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
              <AvatarFallback className="text-lg">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-xl font-semibold">{user.name}</h3>
              <p className="text-muted-foreground">{user.email}</p>
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant="outline">{user.role}</Badge>
                <Badge variant={user.status === "active" ? "default" : "destructive"}>{user.status}</Badge>
                <Badge variant="secondary">{user.subscription}</Badge>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Shield className="h-4 w-4 mr-2" />
                Block User
              </Button>
              <Button variant="outline" size="sm">
                Edit Profile
              </Button>
            </div>
          </div>

          <Separator />

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="playlists">Playlists</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Account Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Joined {new Date(user.registeredAt).toLocaleDateString('en-US')}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{user.country}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">Last login: {new Date(user.lastLogin).toLocaleDateString('en-US')}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">Active devices: {user.devices}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Activity Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Music className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Playlists</span>
                      </div>
                      <span className="font-medium">{user.playlists}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Followers</span>
                      </div>
                      <span className="font-medium">{user.followers}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Play className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Total plays</span>
                      </div>
                      <span className="font-medium">12.4K</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Heart className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Liked songs</span>
                      </div>
                      <span className="font-medium">234</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="activity" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest user actions and interactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockActivity.map((activity, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.action}</p>
                          <p className="text-xs text-muted-foreground">{activity.details}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(activity.timestamp).toLocaleString('en-US')}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="playlists" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>User Playlists</CardTitle>
                  <CardDescription>Playlists created by this user</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockPlaylists.map((playlist, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg" />
                          <div>
                            <p className="font-medium">{playlist.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {playlist.songs} songs • {playlist.plays} plays
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={playlist.isPublic ? "default" : "secondary"}>
                            {playlist.isPublic ? "Public" : "Private"}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>User preferences and account configuration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="font-medium mb-2">Privacy Settings</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Profile visibility</span>
                          <Badge variant="secondary">Public</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Playlist sharing</span>
                          <Badge variant="secondary">Enabled</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Activity tracking</span>
                          <Badge variant="secondary">Enabled</Badge>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Notification Settings</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Email notifications</span>
                          <Badge variant="secondary">Enabled</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Push notifications</span>
                          <Badge variant="secondary">Enabled</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Marketing emails</span>
                          <Badge variant="outline">Disabled</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
