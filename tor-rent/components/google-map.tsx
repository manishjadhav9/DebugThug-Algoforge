"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building, Home, Bed } from "lucide-react"

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
  region?: string
}

interface GoogleMapProps {
  properties: Property[]
  fullScreen?: boolean
  onPropertySelect?: (property: Property) => void
}

export function GoogleMap({ properties, fullScreen = false, onPropertySelect }: GoogleMapProps) {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  
  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property)
    if (onPropertySelect) {
      onPropertySelect(property)
    }
  }

  // Generate Google Maps URL with all property markers
  const getGoogleMapsSrc = () => {
    // Center on Mumbai
    const center = "19.0760,72.8777";
    
    // Create markers string for all properties - use different colors based on property type
    let markers = "";
    properties.forEach((property) => {
      // Skip properties without coordinates
      if (!property.coordinates || !property.coordinates.lat || !property.coordinates.lng) {
        return;
      }
      
      const color = property.propertyType === "Apartment" || property.propertyType === "Studio" 
        ? "blue" 
        : property.propertyType === "Villa" || property.propertyType === "Bungalow" 
          ? "green" 
          : "red";
          
      markers += `&markers=color:${color}%7Clabel:${property.id}%7C${property.coordinates.lat},${property.coordinates.lng}`;
    });
    
    return `https://www.google.com/maps/embed/v1/view?key=AIzaSyBIEm-_7ffhku2wyWdua8ZCpnJE596x9_o&center=${center}&zoom=12${markers}`;
  };

  return (
    <div className={`relative ${fullScreen ? "h-full" : "h-[600px]"} w-full bg-gray-100 overflow-hidden`}>
      {/* Loading indicator */}
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center z-20 bg-white bg-opacity-70">
          <div className="bg-white p-4 rounded-md shadow-md">
            <p className="text-lg font-medium text-center">Loading map...</p>
          </div>
        </div>
      )}
      
      {/* Google Maps iframe */}
      <iframe
        title="Mumbai Properties Map"
        src={getGoogleMapsSrc()}
        className="absolute inset-0 w-full h-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        onLoad={() => setMapLoaded(true)}
      ></iframe>
      
      {/* Map overlay */}
      <div className="absolute top-4 left-0 right-0 flex justify-center z-10">
        <div className="bg-white bg-opacity-70 p-2 rounded-md shadow-md">
          <p className="text-sm text-center font-medium">Mumbai Properties Map</p>
        </div>
      </div>

      {/* Property list sidebar */}
      <div className="absolute top-16 right-4 w-80 max-h-[calc(100%-140px)] overflow-y-auto bg-white rounded-md shadow-lg z-10">
        <div className="p-3 border-b sticky top-0 bg-white z-20">
          <p className="text-sm font-medium">{properties.length} properties found</p>
          <div className="flex items-center gap-2 mt-2 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span>Apartment</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Villa/Bungalow</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>Other</span>
            </div>
          </div>
        </div>
        
        {properties.map((property) => (
          <div 
            key={property.id}
            className={`p-3 border-b hover:bg-gray-50 cursor-pointer transition-colors ${
              selectedProperty?.id === property.id ? 'bg-orange-50' : ''
            }`}
            onClick={() => handlePropertyClick(property)}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    property.status === "active"
                      ? "bg-green-500"
                      : property.status === "pending"
                        ? "bg-orange-500"
                        : "bg-blue-500"
                  } text-white`}
                >
                  {property.propertyType === "Apartment" || property.propertyType === "Studio" ? (
                    <Building className="h-4 w-4" />
                  ) : (
                    <Home className="h-4 w-4" />
                  )}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{property.title}</p>
                <p className="text-xs text-gray-500 truncate">{property.location}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="font-medium text-sm">{property.price}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <Bed className="h-3 w-3" />
                    <span>{property.bedrooms || 1}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Property info card - shows when a property is selected */}
      {selectedProperty && (
        <div className="absolute bottom-4 left-4 w-80 bg-white rounded-md shadow-lg p-4 z-20">
          <div className="flex gap-3">
            <img
              src={selectedProperty.image || "/placeholder.svg"}
              alt={selectedProperty.title}
              className="h-20 w-20 rounded-md object-cover"
            />
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <h3 className="font-medium">{selectedProperty.title}</h3>
                <Badge
                  className={`${
                    selectedProperty.status === "active"
                      ? "bg-green-500"
                      : selectedProperty.status === "pending"
                        ? "bg-orange-500"
                        : "bg-blue-500"
                  }`}
                >
                  {selectedProperty.status === "active"
                    ? "Active"
                    : selectedProperty.status === "pending"
                      ? "Pending"
                      : "Completed"}
                </Badge>
              </div>
              <p className="text-sm text-gray-500">{selectedProperty.location}</p>
              <p className="mt-1 font-medium">{selectedProperty.price}</p>
              <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                <span className="flex items-center">
                  <Bed className="mr-1 h-3 w-3" />
                  {selectedProperty.bedrooms || 1}
                </span>
                <span>•</span>
                <span>{selectedProperty.bathrooms || 1} Bath</span>
              </div>
              <Button
                className="mt-2 h-8 w-full bg-orange-500 text-xs hover:bg-orange-600"
                onClick={() => window.location.href = `/dashboard/properties/${selectedProperty.id}`}
              >
                View Details
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 