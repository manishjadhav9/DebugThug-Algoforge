"use client"

import { useEffect, useState } from "react"
import { Home, Building } from "lucide-react"

interface PropertyLocationMapProps {
  property: {
    id: string
    title: string
    location: string
    coordinates: {
      lat: number
      lng: number
    }
    propertyType?: string
  }
  height?: number
}

export function PropertyLocationMap({ property, height = 300 }: PropertyLocationMapProps) {
  const [mapLoaded, setMapLoaded] = useState(false);
  
  // Generate Google Maps URL for the property location
  const getGoogleMapsSrc = () => {
    const { lat, lng } = property.coordinates;
    // Create a Google Maps embed URL with the property coordinates
    return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBIEm-_7ffhku2wyWdua8ZCpnJE596x9_o&q=${lat},${lng}&zoom=15`;
  };
  
  return (
    <div 
      className="relative w-full rounded-md overflow-hidden bg-gradient-to-b from-blue-50 to-blue-100" 
      style={{ height: `${height}px` }}
    >
      {/* Map loading indicator */}
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center z-20 bg-white bg-opacity-70">
          <div className="rounded-md bg-white bg-opacity-80 px-4 py-2 text-sm shadow-md">
            Loading map...
          </div>
        </div>
      )}
      
      {/* Google Maps iframe */}
      <iframe
        title={`Map of ${property.title}`}
        src={getGoogleMapsSrc()}
        className="absolute inset-0 w-full h-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        onLoad={() => setMapLoaded(true)}
      ></iframe>
      
      {/* Location name overlay */}
      <div className="absolute top-2 left-0 right-0 flex justify-center z-10">
        <div className="bg-white bg-opacity-70 p-1 px-3 rounded-md shadow-md">
          <p className="text-sm text-center font-medium">{property.location}</p>
        </div>
      </div>
      
      {/* Property info overlay */}
      <div className="absolute bottom-3 left-3 bg-white p-2 rounded-md shadow-md text-sm z-10">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-white">
            {property.propertyType === "Apartment" || property.propertyType === "Studio" ? (
              <Building className="h-3 w-3" />
            ) : (
              <Home className="h-3 w-3" />
            )}
          </div>
          <p className="font-medium">{property.title}</p>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Coordinates: {property.coordinates.lat.toFixed(4)}, {property.coordinates.lng.toFixed(4)}
        </p>
      </div>
    </div>
  )
} 