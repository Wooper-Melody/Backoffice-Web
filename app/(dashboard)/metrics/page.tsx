"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, TrendingDown, Users, Music, Play, Heart, Share, Download } from "lucide-react"

const overviewStats = [
  {
    label: "Monthly Active Users",
    value: "2.4M",
    change: "+12.5%",
    trend: "up",
    icon: Users,
  },
  {
    label: "Total Plays",
    value: "847M",
    change: "+8.2%",
    trend: "up",
    icon: Play,
  },
  {
    label: "Songs in Catalog",
    value: "12.8K",
    change: "+180",
    trend: "up",
    icon: Music,
  },
  {
    label: "Average Listen Time",
    value: "45min",
    change: "-2.1%",
    trend: "down",
    icon: TrendingUp,
  },
]

const monthlyData = [
  { month: "Jan", users: 2100000, plays: 780000000 },
  { month: "Feb", users: 2200000, plays: 820000000 },
  { month: "Mar", users: 2300000, plays: 847000000 },
  { month: "Apr", users: 2400000, plays: 890000000 },
]

const topContent = [
  { title: "Blinding Lights", artist: "The Weeknd", plays: 45000000, likes: 2300000, shares: 450000 },
  { title: "Levitating", artist: "Dua Lipa", plays: 38000000, likes: 1900000, shares: 380000 },
  { title: "Save Your Tears", artist: "The Weeknd", plays: 32000000, likes: 1600000, shares: 320000 },
  { title: "Good 4 U", artist: "Olivia Rodrigo", plays: 28000000, likes: 1400000, shares: 280000 },
]

const genreData = [
  { name: "Pop", value: 35, color: "#8884d8" },
  { name: "Hip Hop", value: 25, color: "#82ca9d" },
  { name: "Rock", value: 20, color: "#ffc658" },
  { name: "Electronic", value: 12, color: "#ff7300" },
  { name: "Others", value: 8, color: "#00ff88" },
]

export default function MetricsPage() {
  const [timeRange, setTimeRange] = useState("30d")

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Metrics Dashboard</h1>
          <p className="text-muted-foreground">General platform performance analysis</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {overviewStats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center space-x-1 text-xs">
                {stat.trend === "up" ? (
                  <TrendingUp className="h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500" />
                )}
                <span className={stat.trend === "up" ? "text-green-500" : "text-red-500"}>{stat.change}</span>
                <span className="text-muted-foreground">vs previous month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Monthly Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Trends</CardTitle>
            <CardDescription>Active users and plays per month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => [
                    name === "users"
                      ? `${((value as number) / 1000000).toFixed(1)}M users`
                      : `${((value as number) / 1000000).toFixed(0)}M plays`,
                    name === "users" ? "Users" : "Plays",
                  ]}
                />
                <Line type="monotone" dataKey="users" stroke="#8884d8" strokeWidth={2} />
                <Line type="monotone" dataKey="plays" stroke="#82ca9d" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Genre Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Genre Distribution</CardTitle>
            <CardDescription>Percentage of plays by music genre</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={genreData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {genreData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Content */}
      <Card>
        <CardHeader>
          <CardTitle>Most Popular Content</CardTitle>
          <CardDescription>Best performing songs in the selected period</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topContent.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.artist}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center space-x-1">
                    <Play className="h-4 w-4 text-muted-foreground" />
                    <span>{(item.plays / 1000000).toFixed(1)}M</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Heart className="h-4 w-4 text-muted-foreground" />
                    <span>{(item.likes / 1000000).toFixed(1)}M</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Share className="h-4 w-4 text-muted-foreground" />
                    <span>{(item.shares / 1000).toFixed(0)}K</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Real-time Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Real-time Activity</CardTitle>
          <CardDescription>Live updated metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-500">1,247</div>
              <p className="text-sm text-muted-foreground">Connected Users</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-500">8,934</div>
              <p className="text-sm text-muted-foreground">Plays/hour</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-500">156</div>
              <p className="text-sm text-muted-foreground">New registrations/day</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
