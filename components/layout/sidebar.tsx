"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Music, BarChart3, Eye, ChevronLeft, ChevronRight, Users } from "lucide-react"

const navigation = [
  {
    name: "Metrics",
    href: "/metrics",
    icon: BarChart3,
    children: [
      { name: "General Dashboard", href: "/metrics" },
      { name: "User Metrics", href: "/metrics/users" },
      { name: "Artist Metrics", href: "/metrics/artists" },
      { name: "Content Metrics", href: "/metrics/content" },
    ],
  },
  {
    name: "Catalog",
    href: "/catalog",
    icon: Music,
  },
  {
    name: "Users",
    href: "/users",
    icon: Users,
  },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div
      className={cn(
        "flex flex-col border-r bg-card transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        className,
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Music className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg">Melody Admin</span>
          </div>
        )}
        <Button variant="ghost" size="sm" onClick={() => setCollapsed(!collapsed)} className="h-8 w-8 p-0">
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname.startsWith(item.href)

            return (
              <div key={item.name}>
                <Link href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn("w-full justify-start", collapsed && "px-2")}
                  >
                    <item.icon className={cn("h-4 w-4", !collapsed && "mr-2")} />
                    {!collapsed && item.name}
                  </Button>
                </Link>

                {/* Subnav */}
                {!collapsed && item.children && isActive && (
                  <div className="ml-6 mt-2 space-y-1">
                    {item.children.map((child) => (
                      <Link key={child.href} href={child.href}>
                        <Button
                          variant={pathname === child.href ? "secondary" : "ghost"}
                          size="sm"
                          className="w-full justify-start text-sm"
                        >
                          {child.name}
                        </Button>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </nav>
      </ScrollArea>
    </div>
  )
}
