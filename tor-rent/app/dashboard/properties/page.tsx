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
    title: "Modern Luxury Apartment",
    location: "Colaba, Mumbai",
    price: "₹85,000/month",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1350&q=80",
    status: "active",
    credScore: 95,
    description: "Stunning luxury apartment in the prestigious Colaba area with modern amenities and breathtaking sea views.",
    bedrooms: 2,
    bathrooms: 2,
    area: "1,200 sq ft",
    amenities: ["Swimming Pool", "Gym", "Parking", "24/7 Security"],
    coordinates: { lat: 18.9067, lng: 72.8147 },
    propertyType: "Apartment"
  },
  {
    id: "2",
    title: "Cozy Studio Apartment",
    location: "Bandra West, Mumbai",
    price: "₹45,000/month",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1350&q=80",
    status: "active",
    credScore: 85,
    description: "Charming studio apartment in trendy Bandra West with modern finishes, perfect for young professionals.",
    bedrooms: 1,
    bathrooms: 1,
    area: "550 sq ft",
    amenities: ["Laundry", "Bike Storage", "Rooftop Access", "Pet Friendly"],
    coordinates: { lat: 19.0596, lng: 72.8295 },
    propertyType: "Studio"
  },
  {
    id: "3",
    title: "Spacious Family Villa",
    location: "Juhu, Mumbai",
    price: "₹1,20,000/month",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1350&q=80",
    status: "pending",
    credScore: 92,
    description: "Beautiful family villa with a spacious garden in the exclusive Juhu neighborhood, close to the beach.",
    bedrooms: 4,
    bathrooms: 3,
    area: "2,500 sq ft",
    amenities: ["Garden", "Covered Parking", "Terrace", "Power Backup"],
    coordinates: { lat: 19.1075, lng: 72.8263 },
    propertyType: "Villa"
  },
  {
    id: "4",
    title: "Elegant Penthouse",
    location: "Worli, Mumbai",
    price: "₹1,50,000/month",
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1350&q=80",
    status: "active",
    credScore: 97,
    description: "Luxurious penthouse in Worli with panoramic views of the Arabian Sea and high-end finishes throughout.",
    bedrooms: 3,
    bathrooms: 3.5,
    area: "3,000 sq ft",
    amenities: ["Private Terrace", "Jacuzzi", "Home Theater", "Smart Home System"],
    coordinates: { lat: 19.0128, lng: 72.8158 },
    propertyType: "Apartment"
  },
  {
    id: "5",
    title: "Compact 1BHK Apartment",
    location: "Andheri East, Mumbai",
    price: "₹25,000/month",
    image: "https://images.unsplash.com/photo-1522156373667-4c7234bbd804?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1350&q=80",
    status: "active",
    credScore: 88,
    description: "Efficient 1BHK apartment in Andheri East with all necessities, close to metro station and shopping malls.",
    bedrooms: 1,
    bathrooms: 1,
    area: "650 sq ft",
    amenities: ["Parking", "Gym", "Clubhouse", "Children's Play Area"],
    coordinates: { lat: 19.1136, lng: 72.8697 },
    propertyType: "Apartment"
  },
  {
    id: "6",
    title: "Traditional Bungalow",
    location: "Powai, Mumbai",
    price: "₹95,000/month",
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1350&q=80",
    status: "active",
    credScore: 94,
    description: "Charming bungalow with traditional architecture and modern amenities in the peaceful Powai locality.",
    bedrooms: 3,
    bathrooms: 2,
    area: "2,200 sq ft",
    amenities: ["Garden", "Servant Quarters", "Study Room", "Modular Kitchen"],
    coordinates: { lat: 19.1207, lng: 72.9060 },
    propertyType: "Bungalow"
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
          <Card className="overflow-hidden h-[700px]">
            <CardContent className="p-0 h-full">
              <MapView properties={filteredProperties} />
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}

