"use client"
import { useEffect, useRef, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"

declare global {
  interface Window {
    google: any
  }
}

function loadGoogleMaps(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && window.google?.maps) {
      resolve()
      return
    }
    const existing = document.querySelector('script[src*="maps.googleapis"]')
    if (existing) {
      existing.addEventListener("load", () => resolve())
      return
    }
    const script = document.createElement("script")
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`
    script.async = true
    script.onload = () => resolve()
    document.head.appendChild(script)
  })
}

interface MapViewProps {
  places: { lat: number; lng: number; name: string; types: string[] }[]
  center: { lat: number; lng: number }
  onLocationSelect?: (lat: number, lng: number) => void
}

export default function MapView({ places, center, onLocationSelect }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const selectMarkerRef = useRef<any>(null)
  const [apiReady, setApiReady] = useState(false)

  useEffect(() => {
    loadGoogleMaps().then(() => setApiReady(true))
  }, [])

  useEffect(() => {
    if (!apiReady || !mapRef.current) return
    mapInstance.current = new window.google.maps.Map(mapRef.current, {
      center,
      zoom: 15,
      mapTypeControl: false,
      streetViewControl: false,
    })

    if (onLocationSelect) {
      mapInstance.current.addListener("click", (e: any) => {
        const lat = e.latLng.lat()
        const lng = e.latLng.lng()
        placeSelectMarker(lat, lng)
        onLocationSelect(lat, lng)
      })
    }
  }, [apiReady])

  function placeSelectMarker(lat: number, lng: number) {
    if (selectMarkerRef.current) {
      selectMarkerRef.current.setPosition({ lat, lng })
      return
    }
    selectMarkerRef.current = new window.google.maps.Marker({
      position: { lat, lng },
      map: mapInstance.current,
      draggable: true,
      animation: window.google.maps.Animation.DROP,
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: "#2563eb",
        fillOpacity: 1,
        strokeColor: "#ffffff",
        strokeWeight: 3,
      },
      title: "Seret untuk pindah lokasi",
    })
    selectMarkerRef.current.addListener("dragend", () => {
      const pos = selectMarkerRef.current.getPosition()
      if (pos && onLocationSelect) onLocationSelect(pos.lat(), pos.lng())
    })
  }

  useEffect(() => {
    if (!mapInstance.current || !window.google) return
    markersRef.current.forEach((m) => m.setMap(null))
    markersRef.current = []
    places.forEach((p) => {
      const marker = new window.google.maps.Marker({
        position: { lat: p.lat, lng: p.lng },
        map: mapInstance.current,
        title: p.name,
      })
      markersRef.current.push(marker)
    })
  }, [places, apiReady])

  if (!apiReady) return <Skeleton className="w-full h-[450px] rounded-lg" />

  return <div ref={mapRef} className="w-full h-full min-h-[450px] rounded-lg border" />
}

export function MapSkeleton() {
  return <Skeleton className="w-full h-[450px] rounded-lg" />
}
