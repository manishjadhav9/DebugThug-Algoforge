"use client"

import { useState } from "react"
import { CuboidIcon as Cube } from "lucide-react"

interface VRViewProps {
  propertyId: string
}

export function VRView({ propertyId }: VRViewProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Handle iframe load
  const handleIframeLoad = () => {
    setIsLoading(false)
  }

  // Check if this is the Modern Luxury Apartment
  if (propertyId !== "1") {
    return (
      <div className="flex h-[600px] w-full items-center justify-center bg-gray-100 rounded-lg">
        <div className="flex flex-col items-center">
          <p className="text-gray-500">VR Tour not available for this property</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full">
      {isLoading && (
        <div className="absolute inset-0 z-10 flex h-[600px] w-full items-center justify-center bg-gray-100">
          <div className="flex flex-col items-center">
            <Cube className="h-12 w-12 animate-pulse text-orange-500" />
            <p className="mt-4 text-gray-500">Loading VR Tour...</p>
          </div>
        </div>
      )}
      <div className="sketchfab-embed-wrapper h-[600px] w-full">
        <iframe
          title="Modern Luxury Apartment"
          className="h-full w-full rounded-lg"
          frameBorder="0"
          allowFullScreen
          allow="autoplay; fullscreen; xr-spatial-tracking"
          onLoad={handleIframeLoad}
          src="https://sketchfab.com/models/44e7a9cfed67431e827d0cbaabd462c7/embed?autostart=1&ui_theme=dark"
        />
      </div>
      <p className="mt-2 text-xs text-gray-500">
        <a
          href="https://sketchfab.com/3d-models/loft-apartment-44e7a9cfed67431e827d0cbaabd462c7"
          target="_blank"
          rel="nofollow"
          className="font-semibold text-blue-600 hover:underline"
        >
          Modern Luxury Apartment
        </a>{" "}
        by{" "}
        <a
          href="https://sketchfab.com/Zeps3D"
          target="_blank"
          rel="nofollow"
          className="font-semibold text-blue-600 hover:underline"
        >
          Janis Zeps
        </a>{" "}
        on{" "}
        <a
          href="https://sketchfab.com"
          target="_blank"
          rel="nofollow"
          className="font-semibold text-blue-600 hover:underline"
        >
          Sketchfab
        </a>
      </p>
    </div>
  )
}

