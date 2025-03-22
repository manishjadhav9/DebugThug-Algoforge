"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Search } from "lucide-react"
import { GoogleMap } from "./google-map"

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

interface MapWithFiltersProps {
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

const priceRanges = [
  { label: "Any", value: [0, 300] },
  { label: "Below ₹25,000", value: [0, 25] },
  { label: "₹25,000 - ₹50,000", value: [25, 50] },
  { label: "₹50,000 - ₹1,00,000", value: [50, 100] },
  { label: "₹1,00,000 - ₹2,00,000", value: [100, 200] },
  { label: "Above ₹2,00,000", value: [200, 300] }
]

export function MapWithFilters({ properties, fullScreen = false }: MapWithFiltersProps) {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [selectedRegion, setSelectedRegion] = useState("All Regions")
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 300])
  const [bedroomFilter, setBedroomFilter] = useState("Any")
  const [propertyTypeFilter, setPropertyTypeFilter] = useState("Any")
  const [searchQuery, setSearchQuery] = useState("")

  // Filter properties based on selected filters
  const filteredProperties = properties.filter((property) => {
    // Region filter
    const matchesRegion = selectedRegion === "All Regions" || property.location.includes(selectedRegion)

    // Price filter (convert price string to number for comparison)
    const priceText = property.price.replace(/[^\d]/g, '')
    const propertyPrice = parseInt(priceText) / 1000 // Convert to thousands
    const matchesPrice = propertyPrice >= priceRange[0] && propertyPrice <= priceRange[1]

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
        (property.propertyType === "Villa" || 
         property.propertyType === "Bungalow" ||
         property.title.includes("Villa") ||
         property.title.includes("Bungalow"))) ||
      (propertyTypeFilter === "Studio" && (property.propertyType === "Studio" || property.title.includes("Studio")))

    // Search query
    const matchesSearch =
      searchQuery === "" ||
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesRegion && matchesPrice && matchesBedroom && matchesType && matchesSearch
  })

  const handlePriceRangeChange = (rangeValue: string) => {
    const selectedRange = priceRanges.find(range => range.label === rangeValue)
    if (selectedRange) {
      setPriceRange(selectedRange.value as [number, number])
    }
  }

  return (
    <div className={`relative ${fullScreen ? "h-[calc(100vh-200px)]" : "h-[600px]"} w-full`}>
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

              <Select 
                value={priceRanges.find(range => 
                  range.value[0] === priceRange[0] && range.value[1] === priceRange[1]
                )?.label || "Any"} 
                onValueChange={handlePriceRangeChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  {priceRanges.map((range) => (
                    <SelectItem key={range.label} value={range.label}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

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
                  <SelectItem value="House">Villa/Bungalow</SelectItem>
                  <SelectItem value="Studio">Studio</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Map view */}
      <GoogleMap 
        properties={filteredProperties} 
        fullScreen={fullScreen}
        onPropertySelect={setSelectedProperty}
      />
    </div>
  )
} 