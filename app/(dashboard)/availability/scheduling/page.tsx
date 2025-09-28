"use client"

import { useState } from "react"
import { Calendar, Clock, Globe, Search } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { enUS } from "date-fns/locale"

const upcomingReleases = [
  {
    id: "1",
    title: "New Album",
    artist: "The Weeknd",
    type: "Colección",
    scheduledDate: new Date("2024-01-15T10:00:00Z"),
    regions: ["Global"],
    timeUntilRelease: "5 días",
  },
  {
    id: "2",
    title: "Single Drop",
    artist: "Dua Lipa",
    type: "Canción",
    scheduledDate: new Date("2024-01-20T15:30:00Z"),
    regions: ["US", "EU"],
    timeUntilRelease: "10 días",
  },
  {
    id: "3",
    title: "EP Release",
    artist: "Bad Bunny",
    type: "Colección",
    scheduledDate: new Date("2024-01-25T12:00:00Z"),
    regions: ["LATAM", "US"],
    timeUntilRelease: "15 días",
  },
]

export default function SchedulingPage() {
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [searchTerm, setSearchTerm] = useState("")

  const filteredReleases = upcomingReleases.filter(
    (release) =>
      release.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      release.artist.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Content Scheduling</h1>
          <p className="text-muted-foreground">Manage content publication dates and times</p>
        </div>
        <Button>
          <Clock className="h-4 w-4 mr-2" />
          Schedule new content
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Calendar */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Release Calendar</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              locale={enUS}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        {/* Upcoming Releases */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Próximos lanzamientos</CardTitle>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar contenido..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </div>
            <CardDescription>Content scheduled for automatic publication</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredReleases.map((release) => (
                <div key={release.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-medium">{release.title}</h3>
                      <Badge variant="outline">{release.type}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{release.artist}</p>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{format(release.scheduledDate, "PPp", { locale: enUS })}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Globe className="h-4 w-4" />
                        <span>{release.regions.join(", ")}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" className="mb-2">
                      {release.timeUntilRelease}
                    </Badge>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm">
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Time Zone Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Time Zone Settings</CardTitle>
          <CardDescription>Configure time zones for automatic publishing by region</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              { region: "United States", timezone: "EST (UTC-5)", time: "12:00 AM" },
              { region: "Europe", timezone: "CET (UTC+1)", time: "12:00 AM" },
              { region: "Asia", timezone: "JST (UTC+9)", time: "12:00 AM" },
              { region: "Latin America", timezone: "ART (UTC-3)", time: "12:00 AM" },
            ].map((tz) => (
              <div key={tz.region} className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">{tz.region}</h4>
                <p className="text-sm text-muted-foreground mb-1">{tz.timezone}</p>
                <p className="text-sm">Publish time: {tz.time}</p>
                <Button variant="ghost" size="sm" className="mt-2">
                  Configure
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
