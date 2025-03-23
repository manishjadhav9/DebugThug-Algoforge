"use client"

import { useEffect, useState } from "react"
import { Home, Building, MapPin, Map, MoveHorizontal, MoveVertical } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface Coordinates {
  lat: number
  lng: number
}

interface PropertyLocationMapProps {
  // For existing property display
  property?: {
    id: string
    title: string
    location: string
    coordinates: Coordinates
    propertyType?: string
  }
  // For property creation/editing
  initialLocation?: {
    latitude: number
    longitude: number
  }
  onLocationChange?: (location: { latitude: number, longitude: number }) => void
  height?: number
}

export function PropertyLocationMap({ 
  property, 
  initialLocation, 
  onLocationChange,
  height = 300 
}: PropertyLocationMapProps) {
  const [isDraggable] = useState(!!onLocationChange);
  const [manualLat, setManualLat] = useState<string>("");
  const [manualLng, setManualLng] = useState<string>("");
  const [coordinates, setCoordinates] = useState<Coordinates>(() => {
    if (property?.coordinates) {
      return property.coordinates;
    }
    
    if (initialLocation) {
      return { 
        lat: initialLocation.latitude, 
        lng: initialLocation.longitude 
      };
    }
    
    // Default to Bangalore
    return { lat: 12.9716, lng: 77.5946 };
  });

  // Update coordinates when initialLocation changes
  useEffect(() => {
    if (initialLocation) {
      setCoordinates({
        lat: initialLocation.latitude,
        lng: initialLocation.longitude
      });
      setManualLat(initialLocation.latitude.toString());
      setManualLng(initialLocation.longitude.toString());
    }
  }, [initialLocation]);

  // Function to handle manual coordinate entry
  const handleApplyCoordinates = () => {
    try {
      const lat = parseFloat(manualLat);
      const lng = parseFloat(manualLng);
      
      if (isNaN(lat) || isNaN(lng)) {
        throw new Error("Invalid coordinates");
      }
      
      if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        throw new Error("Coordinates out of range");
      }
      
      const newCoordinates = { lat, lng };
      setCoordinates(newCoordinates);
      
      if (onLocationChange) {
        onLocationChange({
          latitude: lat,
          longitude: lng
        });
      }
    } catch (error) {
      console.error("Error updating coordinates:", error);
      // Reset the input values to current coordinates
      setManualLat(coordinates.lat.toString());
      setManualLng(coordinates.lng.toString());
    }
  };
  
  // Get styles for map marker (using fixed positioning)
  const getMarkerPositionStyles = () => {
    return {
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)"
    };
  };
  
  // Get map background style
  const getMapBackgroundStyle = () => {
    return {
      backgroundImage: `radial-gradient(circle, #e6f7ff, #f0f9ff)`,
      backgroundColor: "#f0f9ff"
    };
  };
  
  return (
    <div className="space-y-4">
      {/* Simple map visualization */}
      <div 
        className="relative w-full rounded-md overflow-hidden border" 
        style={{ ...getMapBackgroundStyle(), height: `${height}px` }}
      >
        {/* Location name overlay */}
        <div className="absolute top-4 left-0 right-0 flex justify-center z-10">
          <div className="bg-white p-2 px-4 rounded-md shadow-md">
            <p className="text-sm font-medium text-center">
              {property?.location || (isDraggable ? "Set property location" : "Property location")}
            </p>
          </div>
        </div>
        
        {/* Map marker */}
        <div 
          className="absolute z-10" 
          style={getMarkerPositionStyles()}
        >
          <MapPin className="h-10 w-10 text-orange-500 drop-shadow-lg" />
        </div>
        
        {/* Coordinates display */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center z-10">
          <div className="bg-white p-2 px-4 rounded-md shadow-md text-sm">
            <p className="text-center font-medium">
              Coordinates: {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
            </p>
          </div>
        </div>
        
        {/* Map overlay with icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Map className="h-20 w-20 text-blue-200 opacity-20" />
        </div>
      </div>
      
      {/* Manual coordinate input for draggable mode */}
      {isDraggable && (
        <Card className="p-4">
          <div className="space-y-3">
            <h4 className="text-sm font-medium mb-2">Set Coordinates Manually</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <div className="flex items-center text-xs text-gray-500">
                  <MoveVertical className="h-3 w-3 mr-1" />
                  <span>Latitude</span>
                </div>
                <Input 
                  type="text" 
                  placeholder="Latitude (e.g. 12.9716)" 
                  value={manualLat}
                  onChange={(e) => setManualLat(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <div className="flex items-center text-xs text-gray-500">
                  <MoveHorizontal className="h-3 w-3 mr-1" />
                  <span>Longitude</span>
                </div>
                <Input 
                  type="text" 
                  placeholder="Longitude (e.g. 77.5946)" 
                  value={manualLng}
                  onChange={(e) => setManualLng(e.target.value)}
                />
              </div>
            </div>
            <Button 
              size="sm" 
              onClick={handleApplyCoordinates}
              className="w-full"
            >
              Apply Coordinates
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
} 