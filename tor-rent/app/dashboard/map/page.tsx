"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardLayout } from "@/components/dashboard-layout"
import { EnhancedMapView } from "@/components/enhanced-map-view"

// Extended property data with more details
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
    propertyType: "Apartment",
    region: "Downtown, Seattle",
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
    propertyType: "Studio",
    region: "Capitol Hill, Seattle",
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
    propertyType: "House",
    region: "Ballard, Seattle",
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
    propertyType: "Apartment",
    region: "West Seattle",
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
    propertyType: "House",
    region: "Wallingford, Seattle",
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
    propertyType: "Studio",
    region: "South Lake Union, Seattle",
  },
  {
    id: "7",
    title: "Luxury Penthouse",
    location: "Downtown, Seattle",
    price: "0.15 ETH/month",
    image: "/placeholder.svg?height=200&width=300",
    status: "active",
    credScore: 98,
    description: "Stunning penthouse with panoramic city views, featuring high-end finishes and smart home technology.",
    bedrooms: 3,
    bathrooms: 3.5,
    area: "2,200 sq ft",
    amenities: ["Private Terrace", "Concierge", "Gym", "Wine Cellar"],
    coordinates: { lat: 47.6092, lng: -122.3331 },
    propertyType: "Apartment",
    region: "Downtown, Seattle",
  },
  {
    id: "8",
    title: "Fremont Bungalow",
    location: "Fremont, Seattle",
    price: "0.055 ETH/month",
    image: "/placeholder.svg?height=200&width=300",
    status: "active",
    credScore: 91,
    description: "Charming bungalow in the artistic Fremont neighborhood, walking distance to shops and restaurants.",
    bedrooms: 2,
    bathrooms: 1,
    area: "950 sq ft",
    amenities: ["Yard", "Porch", "Hardwood Floors"],
    coordinates: { lat: 47.6505, lng: -122.3509 },
    propertyType: "House",
    region: "Fremont, Seattle",
  },
  {
    id: "9",
    title: "Queen Anne Victorian",
    location: "Queen Anne, Seattle",
    price: "0.08 ETH/month",
    image: "/placeholder.svg?height=200&width=300",
    status: "active",
    credScore: 94,
    description: "Historic Victorian home with modern updates in the prestigious Queen Anne neighborhood.",
    bedrooms: 4,
    bathrooms: 2.5,
    area: "2,100 sq ft",
    amenities: ["Garden", "Fireplace", "Bay Windows", "Hardwood Floors"],
    coordinates: { lat: 47.637, lng: -122.357 },
    propertyType: "House",
    region: "Queen Anne, Seattle",
  },
  {
    id: "10",
    title: "Bellevue Highrise",
    location: "Bellevue, WA",
    price: "0.075 ETH/month",
    image: "/placeholder.svg?height=200&width=300",
    status: "active",
    credScore: 93,
    description: "Modern apartment in a luxury highrise in downtown Bellevue with excellent amenities.",
    bedrooms: 2,
    bathrooms: 2,
    area: "1,100 sq ft",
    amenities: ["Pool", "Gym", "Concierge", "Parking"],
    coordinates: { lat: 47.6101, lng: -122.2015 },
    propertyType: "Apartment",
    region: "Bellevue",
  },
  {
    id: "11",
    title: "Redmond Townhome",
    location: "Redmond, WA",
    price: "0.065 ETH/month",
    image: "/placeholder.svg?height=200&width=300",
    status: "active",
    credScore: 89,
    description: "Spacious townhome in Redmond, perfect for tech professionals working at nearby companies.",
    bedrooms: 3,
    bathrooms: 2.5,
    area: "1,700 sq ft",
    amenities: ["Garage", "Patio", "Community Pool"],
    coordinates: { lat: 47.674, lng: -122.1215 },
    propertyType: "House",
    region: "Redmond",
  },
]

export default function MapPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Property Map</h1>
          <p className="text-gray-500">Explore available properties across all regions</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Interactive Property Map</CardTitle>
            <CardDescription>
              Use the filters to find properties in your desired location and price range
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <EnhancedMapView properties={properties} fullScreen={true} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

