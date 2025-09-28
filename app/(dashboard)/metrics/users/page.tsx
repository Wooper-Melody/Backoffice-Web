"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
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
import { Users, UserPlus, UserCheck, Clock, Download, TrendingUp, TrendingDown } from "lucide-react"

const userStats = [
  {
    label: "Total users",
    value: "2.4M",
    change: "+12.5%",
    trend: "up",
    icon: Users,
  },
  {
    label: "New signups (month)",
    value: "45.2K",
    change: "+8.7%",
    trend: "up",
    icon: UserPlus,
  },
  {
    label: "Daily active users",
    value: "847K",
    change: "+5.3%",
    trend: "up",
    icon: UserCheck,
  },
  {
    label: "Avg session time",
    value: "45min",
    change: "-2.1%",
    trend: "down",
    icon: Clock,
  },
]

const dailyActiveUsers = [
  { date: "01/01", users: 820000 },
  { date: "02/01", users: 835000 },
  { date: "03/01", users: 847000 },
  { date: "04/01", users: 852000 },
  { date: "05/01", users: 847000 },
  { date: "06/01", users: 863000 },
  { date: "07/01", users: 871000 },
]

const retentionData = [
  { day: "Day 1", retention: 100 },
  { day: "Day 7", retention: 65 },
  { day: "Day 14", retention: 45 },
  { day: "Day 30", retention: 32 },
  { day: "Day 60", retention: 28 },
  { day: "Day 90", retention: 25 },
]

const demographicsData = [
  { age: "18-24", value: 28, color: "#8884d8" },
  { age: "25-34", value: 35, color: "#82ca9d" },
  { age: "35-44", value: 22, color: "#ffc658" },
  { age: "45-54", value: 10, color: "#ff7300" },
  { age: "55+", value: 5, color: "#00ff88" },
]

const topCountries = [
  { country: "United States", users: 680000, percentage: 28.3 },
  { country: "Brazil", users: 456000, percentage: 19.0 },
  { country: "Mexico", users: 312000, percentage: 13.0 },
  { country: "Spain", users: 240000, percentage: 10.0 },
  { country: "Argentina", users: 192000, percentage: 8.0 },
]

export default function UserMetricsPage() {
  const [timeRange, setTimeRange] = useState("30d")

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Metrics</h1>
          <p className="text-muted-foreground">Detailed analysis of user behavior and growth</p>
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
            Export CSV
          </Button>
        </div>
      </div>

      {/* User Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {userStats.map((stat) => (
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
                <span className="text-muted-foreground">vs previous period</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Daily Active Users */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Active Users</CardTitle>
            <CardDescription>Daily active users evolution in the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyActiveUsers}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [`${((value as number) / 1000).toFixed(0)}K users`, "Active users"]}
                />
                <Line type="monotone" dataKey="users" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Demographics */}
        <Card>
          <CardHeader>
            <CardTitle>Age Demographics</CardTitle>
            <CardDescription>User distribution by age range</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={demographicsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(props: any) => {
                    const { age, percent } = props as any
                    return `${age} ${(percent * 100).toFixed(0)}%`
                  }}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {demographicsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Retention Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Retention Analysis</CardTitle>
          <CardDescription>Percentage of users returning after signup</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={retentionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value}%`, "Retention"]} />
              <Bar dataKey="retention" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Countries */}
      <Card>
          <CardHeader>
            <CardTitle>Top Markets</CardTitle>
            <CardDescription>Countries with the highest number of active users</CardDescription>
          </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topCountries.map((country, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium">{country.country}</h4>
                    <p className="text-sm text-muted-foreground">{country.users.toLocaleString()} users</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="secondary">{country.percentage}%</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* User Behavior */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Average Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-500">3.2</div>
              <p className="text-sm text-muted-foreground">sessions per day</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Songs per session</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500">12.8</div>
              <p className="text-sm text-muted-foreground">average songs</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conversion rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-500">4.2%</div>
              <p className="text-sm text-muted-foreground">visitor → user</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
