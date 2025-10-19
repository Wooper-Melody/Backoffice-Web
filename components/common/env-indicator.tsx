"use client"

import { Badge } from "@/components/ui/badge"
import { API_BASE_URLS } from "@/lib/api"

/**
 * Component to display the current API environment mode
 * Only visible in development
 */
export function EnvIndicator() {
  const env = process.env.NODE_ENV || 'production'
  
  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <Badge 
        variant={env === 'development' ? 'default' : 'secondary'}
        className="text-xs font-mono"
      >
        {env === 'development' ? 'DEV Mode' : 'PROD Mode'}
      </Badge>
      {env === 'development' && (
        <div className="mt-1 text-xs font-mono text-muted-foreground bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-2 rounded border">
          <div>Users: {API_BASE_URLS.users}</div>
          <div>Catalog: {API_BASE_URLS.catalog}</div>
        </div>
      )}
    </div>
  )
}
