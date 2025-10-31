"use client"

import React, { useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"
import { Region } from "@/types/catalog"

export interface UserGlobeProps {
  height?: number // px
  rotationSpeed?: number // degrees per second
  cameraDistance?: number // camera distance (higher = further)
  colors?: Record<string, string>
  autoRotate?: boolean
}

export interface RegionDatum {
  region: string
  users: number
}

export interface GlobePoint {
  id?: string
  region?: string
  users?: number
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
 * Generate up to 500 random points uniformly distributed on the globe surface.
 * Each point is an object { lat, lng, size, color, alt } ready to be fed to Globe.pointsData().
 * globalUsers: number of users counted as global (used to decide how many points)
 */
export async function generateGlobalPointsAsync(globalUsers: number, color = "#999999", globeImageUrl = "https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg") {
  // Try to sample points preferentially on land using globe texture.
  // Fallback to uniform sampling on sphere if image sampling is not possible.
  const count = Math.min(500, Math.max(20, Math.round(globalUsers <= 0 ? 20 : Math.min(500, globalUsers / Math.ceil(globalUsers / 500)))))

  // helper: uniform point on sphere
  const uniformPoint = (): GlobePoint => {
    const u = Math.random()
    const v = Math.random()
    const theta = 2 * Math.PI * u
    const phi = Math.acos(2 * v - 1)
    const lat = 90 - (phi * 180) / Math.PI
    const lng = (theta * 180) / Math.PI - 180
    return { lat, lng, size: 0.2 + Math.random() * 0.6, color, alt: 0.01 + Math.random() * 0.02 }
  }

  // try to load image and create a land mask sampler
  try {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = globeImageUrl

    await new Promise((resolve, reject) => {
      img.onload = () => resolve(true)
      img.onerror = (e) => reject(e)
    })

    const canvas = document.createElement("canvas")
    canvas.width = img.width
    canvas.height = img.height
    const ctx = canvas.getContext("2d")
    if (!ctx) throw new Error("no-canvas")
    ctx.drawImage(img, 0, 0)

    const isLandAt = (lat: number, lng: number) => {
      // map lat/lng to image coords (equirectangular projection)
      const x = Math.floor(((lng + 180) / 360) * canvas.width)
      const y = Math.floor(((90 - lat) / 180) * canvas.height)
      const px = ctx.getImageData(x, y, 1, 1).data
      // crude check: land tends to have higher red/green components vs blue ocean
      const r = px[0], g = px[1], b = px[2]
      // if green+red significantly greater than blue -> likely land
      return (r + g) / 2 > b * 0.9
    }

    const pts: GlobePoint[] = []
    let attempts = 0
    const maxAttempts = count * 20
    while (pts.length < count && attempts < maxAttempts) {
      attempts++
      const p = uniformPoint()
      try {
        if (isLandAt(p.lat, p.lng)) {
          pts.push(p)
        }
      } catch (e) {
        // if sampling fails, break and fallback to uniform
        break
      }
    }

    // if not enough land points found, fill remaining with uniform points
    while (pts.length < count) pts.push(uniformPoint())
    return pts
  } catch (e) {
    // CORS or loading failed — fallback to uniform sampling
    const pts: GlobePoint[] = []
    for (let i = 0; i < count; i++) pts.push(uniformPoint())
    return pts
  }
}

// Backwards-compatible sync wrapper (returns Promise-resolved points when used sync)
export function generateGlobalPoints(globalUsers: number, color = "#999999") {
  // caller will often call this without awaiting; keep behavior compatible by returning immediate uniform points
  // but prefer async usage in codepath where possible.
  // Provide a quick synchronous uniform fallback to avoid breaking callers.
  const pts: GlobePoint[] = []
  const count = Math.min(500, Math.max(20, Math.round(globalUsers <= 0 ? 20 : Math.min(500, globalUsers / Math.ceil(globalUsers / 500)))))
  for (let i = 0; i < count; i++) {
    const u = Math.random()
    const v = Math.random()
    const theta = 2 * Math.PI * u
    const phi = Math.acos(2 * v - 1)
    const lat = 90 - (phi * 180) / Math.PI
    const lng = (theta * 180) / Math.PI - 180
    pts.push({ lat, lng, size: 0.2 + Math.random() * 0.6, color, alt: 0.01 + Math.random() * 0.02 })
  }
  return pts
}

export default function UserGlobe({ height = 600, rotationSpeed = 0.2, cameraDistance = 400, colors = {}, autoRotate = true }: UserGlobeProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const globeRef = useRef<any>(null)
  const rafRef = useRef<number | null>(null)
  const [points, setPoints] = useState<GlobePoint[]>([])
  const [hovered, setHovered] = useState<GlobePoint | null>(null)
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null)

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

      globe = Globe()(containerRef.current)
        .width(containerRef.current.offsetWidth)
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
        if (globe && autoRotate) {
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
            // stop our animate-driven motion by clearing autoRotate flag
            // we still preserve autoRotate=false; we just skip stepping while interacting
            // set a short flag on globeRef to indicate paused
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
        // ignore if controls not available
      }

      // initial fetch
      await refreshData()
      // poll periodically
      const poll = setInterval(() => refreshData().catch(() => {}), 30_000)

      function cleanup() {
        clearInterval(poll)
        if (rafRef.current) cancelAnimationFrame(rafRef.current)
        try {
          globe.pauseAnimation?.()
          globe.renderer()?.dispose?.()
        } catch (e) {}
      }

      (containerRef.current as any)._cleanup = cleanup
    }

    init()

    return () => {
      mounted = false
      try {
        const c = containerRef.current as any
        c?._cleanup && c._cleanup()
      } catch (e) {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // mouse pos for tooltip
  useEffect(() => {
    const onMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY })
    window.addEventListener("mousemove", onMove)
    return () => window.removeEventListener("mousemove", onMove)
  }, [])

  // refresh data from API and update globe
  async function refreshData() {
    try {
      // --- MOCK DATA START -----------------------------------------------
      // The real API call is commented out below. Use the mock while backend
      // is not available or for local development.
      /*
      const res = await fetch("/api/stats/users-by-region")
      if (!res.ok) throw new Error("fetch failed")
      const data: RegionDatum[] = await res.json()
      */

      const data: RegionDatum[] = [
        { region: "NAM", users: 680000 },
        { region: "CAM", users: 456000 },
        { region: "SAM", users: 312000 },
        { region: "EUW", users: 240000 },
        { region: "EUE", users: 180000 },
        { region: "EUN", users: 90000 },
        { region: "AFR", users: 150000 },
        { region: "ASW", users: 200000 },
        { region: "ASE", users: 400000 },
        { region: "ASS", users: 250000 },
        { region: "ASC", users: 80000 },
        { region: "OCE", users: 50000 },
        { region: "GLB", users: 300000 },
      ]
      // --- MOCK DATA END -------------------------------------------------

      // normalize data: look for GLB entry
      const maxUsers = Math.max(...data.map((d) => d.users), 1)
      const sizeScale = linearScale([0, maxUsers], [0.3, 3.5])

      const regionPts: GlobePoint[] = []
      let globalUsers = 0
      for (const row of data) {
        const code = (row.region || "").toUpperCase()
        if (code === "GLB" || code === "GLOBAL") {
          globalUsers = row.users
          continue
        }
        // try to map to our centroid map; if not found, skip
        if ((REGION_COORDS as any)[code]) {
          const coord = (REGION_COORDS as any)[code]
          regionPts.push({
            region: code,
            users: row.users,
            lat: coord.lat,
            lng: coord.lng,
            size: Math.max(0.3, sizeScale(row.users)),
            color: palette[code] || palette["GLB"],
            alt: 0.02 + (sizeScale(row.users) / 50),
          })
        }
      }

  const globalPts = await generateGlobalPointsAsync(globalUsers, palette.GLB || "#999999")

      const all = [...regionPts, ...globalPts]
      setPoints(all)

      // set into globe instance
      const globe = globeRef.current
      if (globe) {
        globe.pointsData(all)
      }

      // tiny pulsing for global points
      let pulseRunning = true
      const pulse = () => {
        if (!globe || !pulseRunning) return
        // tweak alt for global points
        let changed = false
        for (const p of all) {
          if (!p.region) {
            p.alt = 0.01 + 0.02 * (0.5 + 0.5 * Math.sin(Date.now() / 500 + Math.random()))
            changed = true
          }
        }
        if (changed) globe.pointsData(all)
        setTimeout(pulse, 300 + Math.random() * 200)
      }
      pulse()

      // stop pulse after some time when page unmounts
      setTimeout(() => {
        pulseRunning = false
      }, 30_000)

      return all
    } catch (e) {
      console.error("UserGlobe: failed to load data", e)
      return []
    }
  }

  // update globe when points change (for client resizing etc.)
  useEffect(() => {
    const globe = globeRef.current
    if (!globe) return
    globe.pointsData(points)
  }, [points])

  return (
    <div style={{ position: "relative" }}>
      <div
        ref={containerRef}
        style={{ width: "100%", height: `${height}px`, borderRadius: 8, overflow: "hidden" }}
      />

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
          <div style={{ fontWeight: 600 }}>{hovered.region || "Global"}</div>
          {typeof hovered.users === "number" ? (
            <div style={{ opacity: 0.9 }}>{hovered.users.toLocaleString()} users</div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
