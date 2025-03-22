"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardLayout } from "@/components/dashboard-layout"
import { MapWithFilters } from "@/components/map-with-filters"

// Extended property data with more details
const properties = [
  {
    id: "1",
    title: "Modern Luxury Apartment",
    location: "Koramangala, Bangalore",
    price: "₹85,000/month",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1350&q=80",
    status: "active",
    credScore: 95,
    description: "Stunning luxury apartment in the heart of Koramangala with modern amenities and breathtaking city views.",
    bedrooms: 2,
    bathrooms: 2,
    area: "1,200 sq ft",
    amenities: ["Swimming Pool", "Gym", "Parking", "24/7 Security"],
    coordinates: { lat: 12.9352, lng: 77.6245 },
    propertyType: "Apartment",
    region: "Koramangala, Bangalore",
  },
  {
    id: "2",
    title: "Cozy Studio Apartment",
    location: "Indiranagar, Bangalore",
    price: "₹45,000/month",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1350&q=80",
    status: "active",
    credScore: 85,
    description: "Charming studio apartment with modern finishes, perfect for young professionals or students.",
    bedrooms: 1,
    bathrooms: 1,
    area: "550 sq ft",
    amenities: ["Laundry", "Bike Storage", "Rooftop Access", "Pet Friendly"],
    coordinates: { lat: 12.9783, lng: 77.6408 },
    propertyType: "Studio",
    region: "Indiranagar, Bangalore",
  },
  {
    id: "3",
    title: "Spacious Family Villa",
    location: "HSR Layout, Bangalore",
    price: "₹1,20,000/month",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1350&q=80",
    status: "pending",
    credScore: 92,
    description: "Beautiful family villa with a spacious garden, perfect for families looking for a quiet neighborhood.",
    bedrooms: 4,
    bathrooms: 3,
    area: "2,500 sq ft",
    amenities: ["Garden", "Covered Parking", "Terrace", "Power Backup"],
    coordinates: { lat: 12.9116, lng: 77.6741 },
    propertyType: "Villa",
    region: "HSR Layout, Bangalore",
  },
  {
    id: "4",
    title: "Elegant Penthouse",
    location: "MG Road, Bangalore",
    price: "₹1,50,000/month",
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1350&q=80",
    status: "active",
    credScore: 97,
    description: "Luxurious penthouse with panoramic views of the city skyline and high-end finishes throughout.",
    bedrooms: 3,
    bathrooms: 3.5,
    area: "3,000 sq ft",
    amenities: ["Private Terrace", "Jacuzzi", "Home Theater", "Smart Home System"],
    coordinates: { lat: 12.9719, lng: 77.6412 },
    propertyType: "Penthouse",
    region: "MG Road, Bangalore",
  },
  {
    id: "5",
    title: "Compact 1BHK Apartment",
    location: "Whitefield, Bangalore",
    price: "₹25,000/month",
    image: "https://images.unsplash.com/photo-1522156373667-4c7234bbd804?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1350&q=80",
    status: "active",
    credScore: 88,
    description: "Efficient 1BHK apartment with all necessities, close to IT parks and shopping centers.",
    bedrooms: 1,
    bathrooms: 1,
    area: "650 sq ft",
    amenities: ["Parking", "Gym", "Clubhouse", "Children's Play Area"],
    coordinates: { lat: 12.9698, lng: 77.7499 },
    propertyType: "Apartment",
    region: "Whitefield, Bangalore",
  },
  {
    id: "6",
    title: "Traditional Bungalow",
    location: "Jayanagar, Bangalore",
    price: "₹95,000/month",
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1350&q=80",
    status: "active",
    credScore: 94,
    description: "Charming bungalow with traditional architecture and modern amenities in a peaceful locality.",
    bedrooms: 3,
    bathrooms: 2,
    area: "2,200 sq ft",
    amenities: ["Garden", "Servant Quarters", "Study Room", "Modular Kitchen"],
    coordinates: { lat: 12.9301, lng: 77.5877 },
    propertyType: "Bungalow",
    region: "Jayanagar, Bangalore",
  },
  {
    id: "7",
    title: "Premium 3BHK Apartment",
    location: "JP Nagar, Bangalore",
    price: "₹60,000/month",
    image: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1350&q=80",
    status: "active",
    credScore: 93,
    description: "Modern 3BHK apartment with premium finishes and full amenities in a gated community.",
    bedrooms: 3,
    bathrooms: 3,
    area: "1,800 sq ft",
    amenities: ["Swimming Pool", "Gym", "Club House", "Tennis Court"],
    coordinates: { lat: 12.9081, lng: 77.5853 },
    propertyType: "Apartment",
    region: "JP Nagar, Bangalore",
  },
  {
    id: "8",
    title: "Budget-Friendly 2BHK",
    location: "Electronic City, Bangalore",
    price: "₹18,000/month",
    image: "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1350&q=80",
    status: "active",
    credScore: 84,
    description: "Affordable 2BHK apartment ideal for working professionals, close to major IT companies.",
    bedrooms: 2,
    bathrooms: 2,
    area: "1,000 sq ft",
    amenities: ["Parking", "Security", "Power Backup"],
    coordinates: { lat: 12.8458, lng: 77.6712 },
    propertyType: "Apartment",
    region: "Electronic City, Bangalore",
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
          <p className="text-gray-500">Explore available properties across Bangalore using our interactive map</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Interactive Property Map</CardTitle>
            <CardDescription>
              Use the filters to find properties in your desired location and price range
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <MapWithFilters properties={properties} fullScreen={true} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

