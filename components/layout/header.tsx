"use client"

import { useState, useEffect } from "react"
import { Bell, Search, User, LogOut, Music, Users, Album } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/components/auth/auth-provider"
import { useRouter } from "next/navigation"

// Mock search results
const mockSearchResults = [
  {
    id: "1",
    type: "song",
    title: "Blinding Lights",
    artist: "The Weeknd",
    collection: "After Hours",
    icon: Music,
  },
  {
    id: "2",
    type: "artist",
    title: "The Weeknd",
    description: "Canadian singer-songwriter",
    icon: Users,
  },
  {
    id: "3",
    type: "collection",
    title: "After Hours",
    artist: "The Weeknd",
    icon: Album,
  },
  {
    id: "4",
    type: "listener",
    title: "john.doe@example.com",
    description: "Listener",
    icon: User,
  },
]

export function Header() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [showResults, setShowResults] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const { user, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchQuery.trim()) {
        performSearch(searchQuery)
      } else {
        setSearchResults([])
        setShowResults(false)
      }
    }, 300)

    return () => clearTimeout(delayedSearch)
  }, [searchQuery])

  const performSearch = async (query: string) => {
    setIsSearching(true)
    try {
      // In real app, this would be an API call
      const response = await fetch(`/search?q=${encodeURIComponent(query)}`)
      if (response.ok) {
        const results = await response.json()
        setSearchResults(results)
      } else {
        // Use mock data for demo
        const filtered = mockSearchResults.filter(
          (item) =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            (item.artist && item.artist.toLowerCase().includes(query.toLowerCase())) ||
            (item.description && item.description.toLowerCase().includes(query.toLowerCase())),
        )
        setSearchResults(filtered)
      }
      setShowResults(true)
    } catch (error) {
      console.error("Search error:", error)
      // Fallback to mock data
      const filtered = mockSearchResults.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          (item.artist && item.artist.toLowerCase().includes(query.toLowerCase())) ||
          (item.description && item.description.toLowerCase().includes(query.toLowerCase())),
      )
      setSearchResults(filtered)
      setShowResults(true)
    } finally {
      setIsSearching(false)
    }
  }

  const handleResultClick = (result: any) => {
    setShowResults(false)
    setSearchQuery("")

    // Navigate based on result type
    switch (result.type) {
      case "song":
        router.push(`/catalog/[id]?id=${result.id}`)
        break
      case "collection":
        router.push(`/catalog/[id]?id=${result.id}`)
        break
      case "artist":
        router.push(`/users?search=${encodeURIComponent(result.title)}`)
        break
      case "listener":
        router.push(`/users?search=${encodeURIComponent(result.title)}`)
        break
      default:
        router.push(`/catalog?search=${encodeURIComponent(result.title)}`)
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "song":
        return "bg-blue-300/10 text-blue-300 border-blue-300/20"
      case "artist":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20"
      case "collection":
        return "bg-green-300/10 text-green-300 border-green-300/20"
      case "listener":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  const handleProfileClick = () => {
    router.push("/profile")
  }

  const handleLogout = () => {
    logout()
  }

  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-6">
      {/* Search */}
      <div className="flex items-center space-x-4 flex-1 max-w-md relative">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search content, artists, collections, users..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery && setShowResults(true)}
            onBlur={() => setTimeout(() => setShowResults(false), 200)}
          />
          {isSearching && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="animate-spin h-4 w-4 border-2 border-muted-foreground border-t-transparent rounded-full" />
            </div>
          )}
        </div>

        {/* Search Results Dropdown */}
        {showResults && searchResults.length > 0 && (
          <Card className="absolute top-full left-0 right-0 mt-1 z-50 max-h-96 overflow-y-auto">
            <CardContent className="p-2">
              {searchResults.map((result, index) => {
                const IconComponent = result.icon
                return (
                  <div key={result.id}>
                    <div
                      className="flex items-center space-x-3 p-2 hover:bg-muted rounded-md cursor-pointer"
                      onClick={() => handleResultClick(result)}
                    >
                      <IconComponent className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium truncate">{result.title}</p>
                          <Badge variant="outline" className={`text-xs ${getTypeColor(result.type)}`}>
                            {result.type}
                          </Badge>
                        </div>
                        {(result.artist || result.description) && (
                          <p className="text-xs text-muted-foreground truncate">
                            {result.artist || result.description}
                          </p>
                        )}
                      </div>
                    </div>
                    {index < searchResults.length - 1 && <Separator className="my-1" />}
                  </div>
                )
              })}
            </CardContent>
          </Card>
        )}

        {showResults && searchQuery && searchResults.length === 0 && !isSearching && (
          <Card className="absolute top-full left-0 right-0 mt-1 z-50">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground">No results found for "{searchQuery}"</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 h-2 w-2 bg-destructive rounded-full" />
        </Button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-user.jpg" alt="Admin" />
                <AvatarFallback>{user?.username?.charAt(0) || "AD"}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.username || "Admin"}</p>
                <p className="text-xs leading-none text-muted-foreground">{user?.email || "admin@melody.com"}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleProfileClick}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
