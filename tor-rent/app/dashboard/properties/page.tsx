"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PropertyCard } from "@/components/property-card"
import { MapView } from "@/components/map-view"
import { Filter, Grid, Map, Search } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"

// Static property data
const properties = [
  {
    id: "1",
    title: "Modern Apartment",
    location: "Downtown, Seattle",
    price: "0.05 ETH/month",
    image: "/placeholder.svg?height=200&width=300",
    status: "active",
    credScore: 95,
    description: "A beautiful modern apartment in the heart of downtown with stunning city views.",
    bedrooms: 2,
    bathrooms: 2,
    area: "1,200 sq ft",
    amenities: ["Parking", "Gym", "Pool", "Pet Friendly"],
    coordinates: { lat: 47.6062, lng: -122.3321 },
  },
  {
    id: "2",
    title: "Studio Loft",
    location: "Capitol Hill, Seattle",
    price: "0.03 ETH/month",
    image: "/placeholder.svg?height=200&width=300",
    status: "active",
    credScore: 88,
    description: "Cozy studio loft in the vibrant Capitol Hill neighborhood, close to restaurants and nightlife.",
    bedrooms: 1,
    bathrooms: 1,
    area: "650 sq ft",
    amenities: ["Rooftop Deck", "Laundry", "Bike Storage"],
    coordinates: { lat: 47.6253, lng: -122.3222 },
  },
  {
    id: "3",
    title: "Cozy Townhouse",
    location: "Ballard, Seattle",
    price: "0.07 ETH/month",
    image: "/placeholder.svg?height=200&width=300",
    status: "active",
    credScore: 92,
    description: "Spacious townhouse in family-friendly Ballard with a private backyard.",
    bedrooms: 3,
    bathrooms: 2.5,
    area: "1,800 sq ft",
    amenities: ["Backyard", "Garage", "Fireplace", "Washer/Dryer"],
    coordinates: { lat: 47.6677, lng: -122.3829 },
  },
  {
    id: "4",
    title: "Waterfront Condo",
    location: "Alki Beach, Seattle",
    price: "0.09 ETH/month",
    image: "/placeholder.svg?height=200&width=300",
    status: "pending",
    credScore: 97,
    description: "Luxury waterfront condo with breathtaking views of Puget Sound and the Olympic Mountains.",
    bedrooms: 2,
    bathrooms: 2,
    area: "1,400 sq ft",
    amenities: ["Beach Access", "Balcony", "Concierge", "Fitness Center"],
    coordinates: { lat: 47.5812, lng: -122.4088 },
  },
  {
    id: "5",
    title: "Charming Craftsman",
    location: "Wallingford, Seattle",
    price: "0.06 ETH/month",
    image: "/placeholder.svg?height=200&width=300",
    status: "active",
    credScore: 90,
    description: "Classic Seattle craftsman home with modern updates in the desirable Wallingford neighborhood.",
    bedrooms: 3,
    bathrooms: 2,
    area: "1,600 sq ft",
    amenities: ["Porch", "Hardwood Floors", "Garden", "Basement"],
    coordinates: { lat: 47.6615, lng: -122.3343 },
  },
  {
    id: "6",
    title: "Urban Micro Studio",
    location: "South Lake Union, Seattle",
    price: "0.025 ETH/month",
    image: "/placeholder.svg?height=200&width=300",
    status: "active",
    credScore: 85,
    description: "Efficient micro studio in the tech hub of South Lake Union, walking distance to Amazon campus.",
    bedrooms: 0,
    bathrooms: 1,
    area: "350 sq ft",
    amenities: ["Communal Roof Deck", "Bike Storage", "Package Service"],
    coordinates: { lat: 47.6344, lng: -122.3422 },
  },
]

export default function PropertiesPage() {
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [priceFilter, setPriceFilter] = useState("all")

  // Filter properties based on search query and price filter
  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesPrice =
      priceFilter === "all" ||
      (priceFilter === "low" && Number.parseFloat(property.price.split(" ")[0].substring(1)) <= 0.03) ||
      (priceFilter === "medium" &&
        Number.parseFloat(property.price.split(" ")[0].substring(1)) > 0.03 &&
        Number.parseFloat(property.price.split(" ")[0].substring(1)) <= 0.06) ||
      (priceFilter === "high" && Number.parseFloat(property.price.split(" ")[0].substring(1)) > 0.06)

    return matchesSearch && matchesPrice
  })

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Properties</h1>
          <p className="text-gray-500">Browse available properties for rent</p>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search properties..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <Select value={priceFilter} onValueChange={setPriceFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Price Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Prices</SelectItem>
                      <SelectItem value="low">Low (&lt;= 0.03 ETH)</SelectItem>
                      <SelectItem value="medium">Medium (0.03-0.06 ETH)</SelectItem>
                      <SelectItem value="high">High (&gt; 0.06 ETH)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center rounded-md border">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="icon"
                    className={viewMode === "grid" ? "bg-orange-500 hover:bg-orange-600" : ""}
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="h-4 w-4" />
                    <span className="sr-only">Grid view</span>
                  </Button>
                  <Button
                    variant={viewMode === "map" ? "default" : "ghost"}
                    size="icon"
                    className={viewMode === "map" ? "bg-orange-500 hover:bg-orange-600" : ""}
                    onClick={() => setViewMode("map")}
                  >
                    <Map className="h-4 w-4" />
                    <span className="sr-only">Map view</span>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {viewMode === "grid" ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                id={property.id}
                title={property.title}
                location={property.location}
                price={property.price}
                image={property.image}
                status={property.status as any}
                credScore={property.credScore}
              />
            ))}
          </div>
        ) : (
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <MapView properties={filteredProperties} />
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}

