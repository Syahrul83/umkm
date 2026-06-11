"use client"
import { useEffect, useRef } from "react"
import { Skeleton } from "@/components/ui/skeleton"

declare global {
  interface Window {
    google: any
  }
}

interface MapViewProps {
  places: { lat: number; lng: number; name: string; types: string[] }[]
  center: { lat: number; lng: number }
}

export default function MapView({ places, center }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<any>(null)
  const markersRef = useRef<any[]>([])

  useEffect(() => {
    if (!mapRef.current || !window.google) return
    mapInstance.current = new window.google.maps.Map(mapRef.current, {
      center,
      zoom: 15,
    })
  }, [])

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
  }, [places])

  return <div ref={mapRef} className="w-full h-full min-h-[450px] rounded-lg border" />
}

export function MapSkeleton() {
  return <Skeleton className="w-full h-[450px] rounded-lg" />
}
