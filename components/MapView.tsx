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
  onLocationSelect?: (lat: number, lng: number) => void
}

export default function MapView({ places, center, onLocationSelect }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const selectMarkerRef = useRef<any>(null)

  useEffect(() => {
    if (!mapRef.current || !window.google) return
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
  }, [])

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
      if (pos && onLocationSelect) {
        onLocationSelect(pos.lat(), pos.lng())
      }
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
  }, [places])

  return <div ref={mapRef} className="w-full h-full min-h-[450px] rounded-lg border" />
}

export function MapSkeleton() {
  return <Skeleton className="w-full h-[450px] rounded-lg" />
}
