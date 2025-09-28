"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, Clock, Globe, Shield, CheckCircle } from "lucide-react"

const stateTransitions = [
  {
    from: "Scheduled",
    to: "Published",
    trigger: "Automatic on scheduled date/time",
    icon: Clock,
    color: "blue",
  },
  {
    from: "Published",
    to: "Region-unavailable",
    trigger: "Change in territorial configuration",
    icon: Globe,
    color: "yellow",
  },
  {
    from: "Any state",
    to: "Admin-blocked",
    trigger: "Manual admin action",
    icon: Shield,
    color: "red",
  },
  {
    from: "Admin-blocked",
    to: "Previous state",
    trigger: "Manual unblock",
    icon: CheckCircle,
    color: "green",
  },
]

const stateStats = [
  { state: "Published", count: 11847, percentage: 92.2, color: "green" },
  { state: "Scheduled", count: 156, percentage: 1.2, color: "blue" },
  { state: "Region-unavailable", count: 797, percentage: 6.2, color: "yellow" },
  { state: "Admin-blocked", count: 47, percentage: 0.4, color: "red" },
]

export default function CatalogStatesPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
          <div>
          <h1 className="text-3xl font-bold tracking-tight">State Management</h1>
          <p className="text-muted-foreground">View and manage catalog state transitions</p>
        </div>
      </div>

      {/* State Distribution */}
      <Card>
          <CardHeader>
          <CardTitle>State Distribution</CardTitle>
          <CardDescription>Current state across all catalog content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stateStats.map((stat) => (
              <div key={stat.state} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Badge
                    variant="outline"
                    className={`
                      ${stat.color === "green" ? "bg-green-500/10 text-green-500 border-green-500/20" : ""}
                      ${stat.color === "blue" ? "bg-blue-500/10 text-blue-500 border-blue-500/20" : ""}
                      ${stat.color === "yellow" ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" : ""}
                      ${stat.color === "red" ? "bg-red-500/10 text-red-500 border-red-500/20" : ""}
                    `}
                  >
                    {stat.state}
                  </Badge>
                  <span className="font-medium">{stat.count.toLocaleString()} items</span>
                </div>
                <div className="flex items-center space-x-3 min-w-[200px]">
                  <Progress value={stat.percentage} className="flex-1" />
                  <span className="text-sm text-muted-foreground w-12 text-right">{stat.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* State Priority */}
      <Card>
        <CardHeader>
          <CardTitle>State Priority</CardTitle>
          <CardDescription>Order of precedence when multiple states apply to the same content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center space-x-4 py-8">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                Admin-blocked
              </Badge>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                Region-unavailable
              </Badge>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                Scheduled
              </Badge>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                Published
              </Badge>
            </div>
          </div>
          <p className="text-sm text-muted-foreground text-center">More priority ← → Less priority</p>
        </CardContent>
      </Card>

      {/* State Transitions */}
      <Card>
        <CardHeader>
          <CardTitle>Allowed Transitions</CardTitle>
          <CardDescription>Rules for state changes and their triggers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {stateTransitions.map((transition, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div
                      className={`
                      p-2 rounded-lg
                      ${transition.color === "blue" ? "bg-blue-500/10 text-blue-500" : ""}
                      ${transition.color === "yellow" ? "bg-yellow-500/10 text-yellow-500" : ""}
                      ${transition.color === "red" ? "bg-red-500/10 text-red-500" : ""}
                      ${transition.color === "green" ? "bg-green-500/10 text-green-500" : ""}
                    `}
                    >
                      <transition.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {transition.from}
                        </Badge>
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                        <Badge variant="outline" className="text-xs">
                          {transition.to}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{transition.trigger}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
