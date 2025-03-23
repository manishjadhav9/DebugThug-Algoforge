"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PropertyCard } from "@/components/property-card"
import { MapView } from "@/components/map-view"
import { Filter, Grid, Map, Search, Loader2 } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { toast } from "@/components/ui/use-toast"
import { getAllProperties } from "@/lib/helpers/property-helper"

export default function PropertiesPage() {
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid")
  const [properties, setProperties] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [locationFilter, setLocationFilter] = useState("all")
  const [priceFilter, setPriceFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  // Fetch properties on component mount
  useEffect(() => {
    async function fetchProperties() {
      try {
        setIsLoading(true)
        const data = await getAllProperties()
        
        // Filter only available properties for tenants
        const availableProperties = data.filter(prop => prop.status === 'available')
        setProperties(availableProperties)
      } catch (error) {
        console.error("Error fetching properties:", error)
        toast({
          title: "Error",
          description: "Failed to load properties. Please try again.",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchProperties()
  }, [])

  // Filter properties based on search, location, price and type
  const filteredProperties = properties.filter((property) => {
    // Search filter
    const matchesSearch = searchTerm === "" || 
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.toLowerCase().includes(searchTerm.toLowerCase())
    
    // Location filter
    const matchesLocation = locationFilter === "all" || (
      property.location && property.location.toLowerCase().includes(locationFilter.toLowerCase())
    )
    
    // Price filter
    let matchesPrice = true
    if (priceFilter !== "all") {
      const price = typeof property.price === 'string' ? parseFloat(property.price) : property.price
      
      if (priceFilter === "under25k" && price > 25000) matchesPrice = false
      if (priceFilter === "25k-50k" && (price < 25000 || price > 50000)) matchesPrice = false
      if (priceFilter === "50k-100k" && (price < 50000 || price > 100000)) matchesPrice = false
      if (priceFilter === "above100k" && price < 100000) matchesPrice = false
    }
    
    // Type filter
    const matchesType = typeFilter === "all" || 
      property.propertyType === typeFilter
    
    return matchesSearch && matchesLocation && matchesPrice && matchesType
  })

  // Format price for display
  const formatPrice = (price: number, priceUnit: string) => {
    // Format currency
    const formatter = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    })
    
    const formattedPrice = formatter.format(price)
    
    // Add price unit
    const unitMap: Record<string, string> = {
      day: "/day",
      week: "/week",
      month: "/month"
    }
    
    return `${formattedPrice}${unitMap[priceUnit] || ''}`
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Find Your New Home</h1>
            <p className="text-gray-500">Explore available properties for rent</p>
          </div>
          <div className="flex space-x-2 mt-4 md:mt-0">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4 mr-2" />
              Grid
            </Button>
            <Button
              variant={viewMode === "map" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("map")}
            >
              <Map className="h-4 w-4 mr-2" />
              Map
            </Button>
          </div>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <div className="relative col-span-full md:col-span-2">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search by location or property name..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="mumbai">Mumbai</SelectItem>
              <SelectItem value="bangalore">Bangalore</SelectItem>
              <SelectItem value="delhi">Delhi</SelectItem>
              <SelectItem value="pune">Pune</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priceFilter} onValueChange={setPriceFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by price" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Prices</SelectItem>
              <SelectItem value="under25k">Under ₹25K</SelectItem>
              <SelectItem value="25k-50k">₹25K - ₹50K</SelectItem>
              <SelectItem value="50k-100k">₹50K - ₹1L</SelectItem>
              <SelectItem value="above100k">Above ₹1L</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="apartment">Apartment</SelectItem>
              <SelectItem value="house">House</SelectItem>
              <SelectItem value="villa">Villa</SelectItem>
              <SelectItem value="office">Office</SelectItem>
              <SelectItem value="shop">Shop</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
            <span className="ml-2">Loading properties...</span>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-bold mb-2">No properties found</h2>
            <p className="text-gray-500 mb-4">Try adjusting your filters to see more results</p>
            <Button onClick={() => {
              setSearchTerm("")
              setLocationFilter("all")
              setPriceFilter("all")
              setTypeFilter("all")
            }}>
              Clear all filters
            </Button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                id={property.id}
                title={property.title}
                location={property.location}
                price={formatPrice(property.price, property.priceUnit)}
                image={property.images && property.images.length > 0 ? property.images[0] : "/placeholder.svg"}
                status={property.status}
                credScore={property.credScore || 85}
                blockchainId={property.blockchainId}
              />
            ))}
          </div>
        ) : (
          <Card className="overflow-hidden h-[700px]">
            <CardContent className="p-0 h-full">
              <MapView properties={filteredProperties.map(p => ({
                ...p,
                id: p.id.toString(),
                price: formatPrice(p.price, p.priceUnit),
                image: p.images && p.images.length > 0 ? p.images[0] : "/placeholder.svg",
                coordinates: p.coordinates || { lat: 12.9716, lng: 77.5946 } // Default to Bangalore if no coordinates
              }))} />
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}

