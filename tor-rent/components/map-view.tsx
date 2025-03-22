"use client"

import { useState } from "react"
import { GoogleMap } from "@/components/google-map"

interface Property {
  id: string
  title: string
  location: string
  price: string
  image: string
  status: string
  credScore: number
  coordinates: {
    lat: number
    lng: number
  }
  bedrooms?: number
  bathrooms?: number
  propertyType?: string
}

interface MapViewProps {
  properties: Property[]
}

export function MapView({ properties }: MapViewProps) {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)

  // Ensure properties have the necessary fields for the map
  const enhancedProperties = properties.map(property => ({
    ...property,
    propertyType: property.propertyType || 
      (property.title.toLowerCase().includes('apartment') ? 'Apartment' : 
       property.title.toLowerCase().includes('villa') ? 'Villa' : 'Other')
  }));

  return (
    <div className="relative h-[700px] w-full">
      <GoogleMap 
        properties={enhancedProperties} 
        onPropertySelect={setSelectedProperty}
        fullScreen={true}
      />
    </div>
  )
}

