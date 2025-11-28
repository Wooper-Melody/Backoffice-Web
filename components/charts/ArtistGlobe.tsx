"use client"

import React, { useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"
import { Region, REGION_LABELS } from "@/types/catalog"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

export interface ArtistGlobeProps {
  height?: number // px
  rotationSpeed?: number // degrees per second
  cameraDistance?: number // camera distance (higher = further)
  colors?: Record<string, string>
  autoRotate?: boolean
  /** Width in px for the right-hand summary panel. The globe will adapt to remaining space. */
  summaryWidth?: number
  /** External data to use instead of fetching from API (required) */
  data: MarketDatum[]
}

export interface MarketDatum {
  region: string
  plays: number
  percentageOfTotal: number
}

export interface GlobePoint {
  id?: string
  region?: string
  plays?: number
  percentage?: number
  lat: number
  lng: number
  size?: number
  color?: string
  alt?: number
}

// Representative coordinates for each region (centroids). These are approximate and intended for visualization only.
const REGION_COORDS: Record<Region, { lat: number; lng: number }> = {
  GLB: { lat: 0, lng: 0 },
  NAM: { lat: 40, lng: -100 },
  CAM: { lat: 15, lng: -90 },
  SAM: { lat: -15, lng: -60 },
  EUW: { lat: 50, lng: 0 },
  EUE: { lat: 50, lng: 20 },
  EUN: { lat: 60, lng: 10 },
  AFR: { lat: 0, lng: 20 },
  ASW: { lat: 30, lng: 45 },
  ASE: { lat: 35, lng: 110 },
  ASS: { lat: 20, lng: 80 },
  ASC: { lat: 45, lng: 60 },
  OCE: { lat: -25, lng: 140 },
}

// Default color palette per region code (can be overridden via props.colors)
const DEFAULT_COLORS: Record<string, string> = {
  GLB: "#888888",
  NAM: "#1f77b4",
  CAM: "#ff7f0e",
  SAM: "#2ca02c",
  EUW: "#d62728",
  EUE: "#9467bd",
  EUN: "#8c564b",
  AFR: "#e377c2",
  ASW: "#7f7f7f",
  ASE: "#bcbd22",
  ASS: "#17becf",
  ASC: "#aec7e8",
  OCE: "#ffbb78",
}

// Simple linear scale helper
function linearScale(domain: [number, number], range: [number, number]) {
  const [d0, d1] = domain
  const [r0, r1] = range
  const m = (r1 - r0) / (d1 - d0 || 1)
  return (v: number) => r0 + (v - d0) * m
}

/**
 * ArtistGlobe: Interactive 3D globe showing artist's top markets by region
 * Shows plays distribution across regions with size-proportional markers
 */
export default function ArtistGlobe({
  height = 500,
  rotationSpeed = 0.5,
  cameraDistance = 260,
  colors = {},
  autoRotate = true,
  summaryWidth = 300,
  data = [],
}: ArtistGlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const globeRef = useRef<any>(null)
  const rafRef = useRef<number | null>(null)

  const [hovered, setHovered] = useState<GlobePoint | null>(null)
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null)
  const [summary, setSummary] = useState<{
    topMarket: { code: string; plays: number; percentage: number } | null
    totalPlays: number
    regionCount: number
  }>({
    topMarket: null,
    totalPlays: 0,
    regionCount: 0,
  })

  // track mouse position globally for tooltip
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMove)
    return () => window.removeEventListener("mousemove", handleMove)
  }, [])

  // Flag to prevent multiple simultaneous refreshData calls
  const isRefreshingRef = useRef(false)

  // merge colors
  const palette = { ...DEFAULT_COLORS, ...colors }

  useEffect(() => {
    let mounted = true
    let Globe: any
    let globe: any

    async function init() {
      const mod = await import("globe.gl")
      Globe = mod.default || mod
      if (!containerRef.current || !mounted) return

      const initialWidth = (wrapperRef.current && wrapperRef.current.offsetWidth) || (containerRef.current && containerRef.current.offsetWidth) || 800
      globe = Globe()(containerRef.current)
        .width(initialWidth)
        .height(height)
        // earth texture; using public CDN from three-globe examples
        .globeImageUrl("https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg")
        .backgroundImageUrl(null)
        .showAtmosphere(true)
        .atmosphereColor("#3a3a3a")
        .atmosphereAltitude(0.25)

      // initial camera distance
      globe.camera().position.z = cameraDistance

      // point renderers
      globe
        .pointsData([])
        .pointLat((d: any) => d.lat)
        .pointLng((d: any) => d.lng)
        .pointColor((d: any) => d.color || "#ff0000")
        .pointRadius((d: any) => d.size || 0.5)
        .pointAltitude((d: any) => d.alt || 0.01)

      globe.onPointHover((p: any) => setHovered(p))

      globeRef.current = globe

      // auto-rotation animation loop
      let last = performance.now()
      function animate(now = performance.now()) {
        const dt = (now - last) / 1000
        last = now
        if (globe && autoRotate && !(globe as any)._autoRotatePaused) {
          const rot = (rotationSpeed * Math.PI) / 180 * dt
          // preserve user's latitude (tilt) while auto-rotating longitude
          const pov = globe.pointOfView() || { lat: 0, lng: 0 }
          const newLat = pov.lat
          const newLng = ((pov.lng || 0) + (rotationSpeed * dt)) % 360
          globe.pointOfView({ lat: newLat, lng: newLng }, 0)
        }
        rafRef.current = requestAnimationFrame(animate)
      }
      rafRef.current = requestAnimationFrame(animate)

      // Configure controls to allow full vertical rotation (tilt)
      try {
        const controls = globe.controls()
        if (controls) {
          // enable rotate and allow full polar range (0..PI) so users can tilt globe vertically
          controls.enableRotate = true
          controls.minPolarAngle = 0 // allow looking from north pole
          controls.maxPolarAngle = Math.PI // allow looking from south pole
          // disable automatic orbit controls autoRotate (we handle manual pointOfView animation)
          controls.autoRotate = false

          // Pause auto-rotation temporarily while user interacts
          let interactionTimeout: any = null
          const pauseAutoRotate = () => {
            ;(globe as any)._autoRotatePaused = true
            if (interactionTimeout) clearTimeout(interactionTimeout)
          }
          const resumeAutoRotate = () => {
            if (interactionTimeout) clearTimeout(interactionTimeout)
            interactionTimeout = setTimeout(() => {
              ;(globe as any)._autoRotatePaused = false
            }, 2000)
          }

          // pointer events on the container
          const container = containerRef.current
          container?.addEventListener("pointerdown", pauseAutoRotate)
          container?.addEventListener("pointerup", resumeAutoRotate)
          container?.addEventListener("pointerleave", resumeAutoRotate)

          // cleanup hook attachment
          ;(container as any)._globeControlsCleanup = () => {
            container?.removeEventListener("pointerdown", pauseAutoRotate)
            container?.removeEventListener("pointerup", resumeAutoRotate)
            container?.removeEventListener("pointerleave", resumeAutoRotate)
            if (interactionTimeout) clearTimeout(interactionTimeout)
          }
        }
      } catch (e) {
        console.error("ArtistGlobe: could not configure controls", e)
      }

      // initial load with provided data
      if (data && data.length > 0) {
        refreshData()
      }
    }

    init()

    return () => {
      mounted = false
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      const container = containerRef.current as any
      if (container && container._globeControlsCleanup) {
        container._globeControlsCleanup()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function refreshData() {
    if (isRefreshingRef.current) return
    isRefreshingRef.current = true
    try {
      const globe = globeRef.current
      if (!globe) return

      // Use provided data
      const markets = data || []

      // Compute total plays and summary
      const totalPlays = markets.reduce((sum, m) => sum + m.plays, 0)
      const regionCount = markets.length

      const topMarket = markets.length > 0
        ? markets.reduce((max, m) => m.plays > max.plays ? m : max, markets[0])
        : null

      setSummary({
        topMarket: topMarket ? { code: topMarket.region, plays: topMarket.plays, percentage: topMarket.percentageOfTotal } : null,
        totalPlays,
        regionCount,
      })

      // Build globe points for each market
      const points: GlobePoint[] = []

      // Scale marker size based on plays (min 0.5, max 2.0)
      const playsValues = markets.map(m => m.plays).filter(p => p > 0)
      const minPlays = Math.min(...playsValues, 0)
      const maxPlays = Math.max(...playsValues, 1)
      const sizeScale = linearScale([minPlays, maxPlays], [0.5, 2.0])

      for (const market of markets) {
        const regionCode = market.region as Region
        const coord = REGION_COORDS[regionCode]
        if (!coord) continue

        const color = palette[regionCode] || "#888888"
        const size = sizeScale(market.plays)
        const alt = 0.01 + (size / 2) * 0.02 // altitude proportional to size

        points.push({
          id: `market-${regionCode}`,
          region: regionCode,
          plays: market.plays,
          percentage: market.percentageOfTotal,
          lat: coord.lat,
          lng: coord.lng,
          size,
          color,
          alt,
        })
      }

      globe.pointsData(points)
    } catch (e) {
      console.error("ArtistGlobe: failed to load data", e)
      return []
    } finally {
      isRefreshingRef.current = false
    }
  }

  // refresh data when external data prop changes
  // Use a serialized version of data to avoid infinite loops
  const dataKey = React.useMemo(() => {
    if (!data || data.length === 0) return null
    return JSON.stringify(data.map(d => ({ region: d.region, plays: d.plays, percentage: d.percentageOfTotal })))
  }, [data])

  useEffect(() => {
    if (dataKey) {
      refreshData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataKey])

  // responsive resize observer - adjust globe width when container resizes
  useEffect(() => {
    const obsTarget = wrapperRef.current || containerRef.current
    if (!obsTarget) return
    let globe = globeRef.current
    let ro: ResizeObserver | null = null
    try {
      ro = new ResizeObserver(() => {
        if (!globe) globe = globeRef.current
        if (!globe || !obsTarget) return
        const w = obsTarget.offsetWidth
        globe.width(w)
        globe.height(height)
      })
      ro.observe(obsTarget)
    } catch (e) {
      // ResizeObserver not supported — fallback to window resize
      const onResize = () => {
        if (!globe) globe = globeRef.current
        if (!globe || !obsTarget) return
        const w = obsTarget.offsetWidth
        globe.width(w)
        globe.height(height)
      }
      window.addEventListener("resize", onResize)
      return () => window.removeEventListener("resize", onResize)
    }
    return () => ro && ro.disconnect()
  }, [height])

  return (
    <div style={{ position: "relative" }} className="flex flex-col gap-6">
      {/* Left: globe area */}
      <div ref={wrapperRef} style={{ flex: '1 1 0%', minWidth: 0 }} className="flex justify-center items-start">
        <div style={{ width: "100%" }} className="rounded-md overflow-hidden">
          <div ref={containerRef} style={{ width: "100%", height: `${height}px`, borderRadius: 8, overflow: "hidden" }} />
        </div>
      </div>

      {/* Summary row */}
      <div style={{ width: "100%" }} className="w-full mt-4">
        <div className="flex gap-4">
          {/* Card 1: Total plays */}
          <Card className="flex-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total plays</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div>
                <div className="text-2xl font-semibold">{summary.totalPlays.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground mt-1">Across all markets</div>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Top market */}
          <Card className="flex-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top market</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div>
                <div className="text-2xl font-semibold">
                  {summary.topMarket ? `${REGION_LABELS[(summary.topMarket.code as Region) || "GLB"] || summary.topMarket.code}` : "—"}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {summary.topMarket ? `${summary.topMarket.plays.toLocaleString()} plays (${summary.topMarket.percentage.toFixed(1)}%)` : "—"}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Markets count */}
          <Card className="flex-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active markets</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div>
                <div className="text-2xl font-semibold">{summary.regionCount}</div>
                <div className="text-sm text-muted-foreground mt-1">Regions with plays</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tooltip */}
      {hovered && mousePos ? (
        <div
          style={{
            position: "fixed",
            left: mousePos.x + 12,
            top: mousePos.y + 12,
            pointerEvents: "none",
            background: "rgba(0,0,0,0.8)",
            color: "white",
            padding: "8px 10px",
            borderRadius: 6,
            fontSize: 12,
            zIndex: 9999,
            maxWidth: 260,
          }}
        >
          <div style={{ fontWeight: 600 }}>{REGION_LABELS[((hovered.region as Region) || "GLB") as Region] || hovered.region || "Market"}</div>
          {typeof hovered.plays === "number" ? (
            <>
              <div style={{ opacity: 0.9 }}>{hovered.plays.toLocaleString()} plays</div>
              {typeof hovered.percentage === "number" && (
                <div style={{ opacity: 0.9 }}>{hovered.percentage.toFixed(2)}% of total</div>
              )}
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
