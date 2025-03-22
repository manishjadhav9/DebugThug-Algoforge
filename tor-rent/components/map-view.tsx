"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"

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
}

interface MapViewProps {
  properties: Property[]
}

export function MapView({ properties }: MapViewProps) {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)

  return (
    <div className="relative h-[600px] w-full bg-gray-100">
      {/* Simulated map */}
      <div className="h-full w-full">
        <img
          src="/placeholder.svg?height=600&width=1200&text=Interactive+Map+View"
          alt="Map"
          className="h-full w-full object-cover"
        />

        {/* Property markers */}
        {properties.map((property) => (
          <div
            key={property.id}
            className="absolute cursor-pointer"
            style={{
              left: `${(property.coordinates.lng + 122.5) * 100}px`,
              top: `${(47.7 - property.coordinates.lat) * 300}px`,
            }}
            onClick={() => setSelectedProperty(property)}
          >
            <div className="flex flex-col items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  property.status === "active"
                    ? "bg-green-500"
                    : property.status === "pending"
                      ? "bg-orange-500"
                      : "bg-blue-500"
                } text-white`}
              >
                <MapPin className="h-5 w-5" />
              </div>
              <div className="mt-1 rounded-md bg-white px-2 py-1 text-xs font-medium shadow-md">{property.price}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Property info card */}
      {selectedProperty && (
        <Card className="absolute bottom-4 left-4 w-80">
          <CardContent className="p-4">
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
                <Button
                  className="mt-2 h-8 w-full bg-orange-500 text-xs hover:bg-orange-600"
                  onClick={() => (window.location.href = `/dashboard/properties/${selectedProperty.id}`)}
                >
                  View Details
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

