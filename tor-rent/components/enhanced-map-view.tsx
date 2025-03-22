"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Search, Home, Building, Bed } from "lucide-react"

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

interface EnhancedMapViewProps {
  properties: Property[]
  fullScreen?: boolean
}

// Add more properties with different regions
const allRegions = [
  "All Regions",
  "Koramangala, Bangalore",
  "Indiranagar, Bangalore",
  "HSR Layout, Bangalore",
  "Whitefield, Bangalore",
  "MG Road, Bangalore",
  "Jayanagar, Bangalore",
  "JP Nagar, Bangalore",
  "Electronic City, Bangalore",
  "Marathahalli, Bangalore",
  "Hebbal, Bangalore",
]

export function EnhancedMapView({ properties, fullScreen = false }: EnhancedMapViewProps) {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [selectedRegion, setSelectedRegion] = useState("All Regions")
  const [priceRange, setPriceRange] = useState([0, 10])
  const [bedroomFilter, setBedroomFilter] = useState("Any")
  const [propertyTypeFilter, setPropertyTypeFilter] = useState("Any")
  const [searchQuery, setSearchQuery] = useState("")

  // Filter properties based on selected filters
  const filteredProperties = properties.filter((property) => {
    // Region filter
    const matchesRegion = selectedRegion === "All Regions" || property.location.includes(selectedRegion)

    // Price filter (convert ETH string to number for comparison)
    const propertyPrice = Number.parseFloat(property.price.split(" ")[0].substring(1))
    const matchesPrice = propertyPrice >= priceRange[0] / 100 && propertyPrice <= priceRange[1] / 100

    // Bedroom filter
    const matchesBedroom =
      bedroomFilter === "Any" ||
      (bedroomFilter === "1" && property.bedrooms === 1) ||
      (bedroomFilter === "2" && property.bedrooms === 2) ||
      (bedroomFilter === "3+" && (property.bedrooms || 0) >= 3)

    // Property type filter
    const matchesType =
      propertyTypeFilter === "Any" ||
      (propertyTypeFilter === "Apartment" &&
        (property.propertyType === "Apartment" || property.title.includes("Apartment"))) ||
      (propertyTypeFilter === "House" &&
        (property.propertyType === "House" ||
          property.title.includes("House") ||
          property.title.includes("Townhouse"))) ||
      (propertyTypeFilter === "Studio" && (property.propertyType === "Studio" || property.title.includes("Studio")))

    // Search query
    const matchesSearch =
      searchQuery === "" ||
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesRegion && matchesPrice && matchesBedroom && matchesType && matchesSearch
  })

  return (
    <div className={`relative ${fullScreen ? "h-[calc(100vh-200px)]" : "h-[600px]"} w-full bg-gray-100`}>
      {/* Filter panel */}
      <div className="absolute left-4 right-4 top-4 z-10">
        <Card>
          <CardContent className="p-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search locations..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Region" />
                </SelectTrigger>
                <SelectContent>
                  {allRegions.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div>
                <p className="mb-2 text-sm font-medium">Price Range (ETH)</p>
                <Slider value={priceRange} min={0} max={10} step={1} onValueChange={setPriceRange} />
                <div className="mt-1 flex justify-between text-xs text-gray-500">
                  <span>{(priceRange[0] / 100).toFixed(2)} ETH</span>
                  <span>{(priceRange[1] / 100).toFixed(2)} ETH</span>
                </div>
              </div>

              <Select value={bedroomFilter} onValueChange={setBedroomFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Bedrooms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Any">Any Bedrooms</SelectItem>
                  <SelectItem value="1">1 Bedroom</SelectItem>
                  <SelectItem value="2">2 Bedrooms</SelectItem>
                  <SelectItem value="3+">3+ Bedrooms</SelectItem>
                </SelectContent>
              </Select>

              <Select value={propertyTypeFilter} onValueChange={setPropertyTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Property Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Any">Any Type</SelectItem>
                  <SelectItem value="Apartment">Apartment</SelectItem>
                  <SelectItem value="House">House</SelectItem>
                  <SelectItem value="Studio">Studio</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Simulated map */}
      <div className="h-full w-full">
        <img
          src="/placeholder.svg?height=800&width=1200&text=Interactive+Map+View"
          alt="Map"
          className="h-full w-full object-cover"
        />

        {/* Property markers */}
        {filteredProperties.map((property) => (
          <div
            key={property.id}
            className="absolute cursor-pointer transition-all hover:scale-110"
            style={{
              left: `${(property.coordinates.lng + 122.5) * 100}px`,
              top: `${(47.7 - property.coordinates.lat) * 300}px`,
            }}
            onClick={() => setSelectedProperty(property)}
          >
            <div className="flex flex-col items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  property.status === "active"
                    ? "bg-green-500"
                    : property.status === "pending"
                      ? "bg-orange-500"
                      : "bg-blue-500"
                } text-white shadow-lg transition-transform hover:scale-110`}
              >
                {property.title.includes("Apartment") || property.title.includes("Studio") ? (
                  <Building className="h-5 w-5" />
                ) : (
                  <Home className="h-5 w-5" />
                )}
              </div>
              <div className="mt-1 rounded-md bg-white px-2 py-1 text-xs font-medium shadow-md">{property.price}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Property count */}
      <div className="absolute bottom-4 left-4 rounded-md bg-white px-3 py-2 shadow-md">
        <p className="text-sm font-medium">{filteredProperties.length} properties found</p>
      </div>

      {/* Property info card */}
      {selectedProperty && (
        <Card className="absolute bottom-4 right-4 w-80">
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

