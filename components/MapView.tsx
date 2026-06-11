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
    if (document.querySelector('script[src*="maps.googleapis"]')) {
      const check = setInterval(() => {
        if (window.google?.maps) {
          clearInterval(check)
          resolve()
        }
      }, 100)
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
  const onSelectRef = useRef(onLocationSelect)
  const [apiReady, setApiReady] = useState(false)

  onSelectRef.current = onLocationSelect

  useEffect(() => {
    loadGoogleMaps().then(() => setApiReady(true))
  }, [])

  useEffect(() => {
    if (!apiReady || !mapRef.current) return
    const map = new window.google.maps.Map(mapRef.current, {
      center,
      zoom: 13,
      mapTypeControl: false,
      streetViewControl: false,
      zoomControl: true,
    })
    mapInstance.current = map

    map.addListener("click", (e: any) => {
      const lat = e.latLng.lat()
      const lng = e.latLng.lng()
      if (selectMarkerRef.current) {
        selectMarkerRef.current.setPosition({ lat, lng })
      } else {
        const marker = new window.google.maps.Marker({
          position: { lat, lng },
          map,
          draggable: true,
          animation: window.google.maps.Animation.DROP,
          label: { text: "📍", fontSize: "20px" },
        })
        marker.addListener("dragend", () => {
          const pos = marker.getPosition()
          if (pos) onSelectRef.current?.(pos.lat(), pos.lng())
        })
        selectMarkerRef.current = marker
      }
      onSelectRef.current?.(lat, lng)
    })
  }, [apiReady])

  useEffect(() => {
    if (!mapInstance.current) return
    mapInstance.current.setCenter(center)
  }, [center.lat, center.lng])

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
