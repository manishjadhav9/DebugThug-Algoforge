"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, ChevronLeft, X } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { AssuranceMeter } from "@/components/assurance-meter"

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
    assuranceScore: 92,
    securityDeposit: "0.1 ETH",
    availableFrom: "April 1, 2025",
    minStay: "6 months",
    utilities: "Not included",
    petsAllowed: true,
    furnished: "Partially",
    yearBuilt: 2018,
    nearbyTransit: ["Bus Stop (0.1 mi)", "Light Rail (0.3 mi)"],
    nearbyAmenities: ["Grocery Store", "Restaurants", "Coffee Shops", "Gym"],
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
    assuranceScore: 85,
    securityDeposit: "0.06 ETH",
    availableFrom: "May 1, 2025",
    minStay: "3 months",
    utilities: "Water included",
    petsAllowed: false,
    furnished: "No",
    yearBuilt: 2015,
    nearbyTransit: ["Bus Stop (0.2 mi)", "Light Rail (0.5 mi)"],
    nearbyAmenities: ["Bars", "Restaurants", "Music Venues", "Parks"],
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
    assuranceScore: 90,
    securityDeposit: "0.14 ETH",
    availableFrom: "April 15, 2025",
    minStay: "12 months",
    utilities: "Not included",
    petsAllowed: true,
    furnished: "No",
    yearBuilt: 2010,
    nearbyTransit: ["Bus Stop (0.3 mi)"],
    nearbyAmenities: ["Grocery Store", "Restaurants", "Brewery", "Parks"],
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
    assuranceScore: 95,
    securityDeposit: "0.18 ETH",
    availableFrom: "June 1, 2025",
    minStay: "12 months",
    utilities: "Water and garbage included",
    petsAllowed: true,
    furnished: "Fully",
    yearBuilt: 2020,
    nearbyTransit: ["Bus Stop (0.2 mi)", "Water Taxi (0.5 mi)"],
    nearbyAmenities: ["Beach", "Restaurants", "Coffee Shops", "Parks"],
  },
]

export default function ComparePage() {
  const searchParams = useSearchParams()
  const [selectedProperties, setSelectedProperties] = useState<any[]>([])

  useEffect(() => {
    const ids = searchParams.get("ids")?.split(",") || []
    if (ids.length > 0) {
      const propertiesToCompare = properties.filter((p) => ids.includes(p.id))
      setSelectedProperties(propertiesToCompare)
    }
  }, [searchParams])

  // If no properties are selected, show a message
  if (selectedProperties.length === 0) {
    return (
      <DashboardLayout>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold">Property Comparison</h1>
            <p className="text-gray-500">Compare properties side by side</p>
          </div>

          <Card className="flex flex-col items-center justify-center p-12 text-center">
            <div className="rounded-full bg-orange-100 p-4">
              <X className="h-8 w-8 text-orange-500" />
            </div>
            <h2 className="mt-4 text-xl font-bold">No Properties Selected</h2>
            <p className="mt-2 text-gray-500">
              Select properties to compare by clicking "Add to Compare" on property cards.
            </p>
            <Link href="/dashboard/properties">
              <Button className="mt-6 bg-orange-500 hover:bg-orange-600">Browse Properties</Button>
            </Link>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold">Property Comparison</h1>
            <p className="text-gray-500">Compare properties side by side</p>
          </div>
          <Link href="/dashboard/properties">
            <Button variant="outline">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Properties
            </Button>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="w-1/4 border-b p-4 text-left"></th>
                {selectedProperties.map((property) => (
                  <th key={property.id} className="border-b p-4 text-center">
                    <div className="flex flex-col items-center">
                      <img
                        src={property.image || "/placeholder.svg"}
                        alt={property.title}
                        className="mb-2 h-40 w-full rounded-lg object-cover"
                      />
                      <h3 className="text-lg font-bold">{property.title}</h3>
                      <p className="text-sm text-gray-500">{property.location}</p>
                      <p className="mt-2 text-xl font-bold text-orange-500">{property.price}</p>
                      <Link href={`/dashboard/properties/${property.id}`}>
                        <Button className="mt-2 bg-orange-500 hover:bg-orange-600">View Details</Button>
                      </Link>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border-b p-4 font-medium">Assurance Score</td>
                {selectedProperties.map((property) => (
                  <td key={property.id} className="border-b p-4 text-center">
                    <div className="flex justify-center">
                      <AssuranceMeter score={property.assuranceScore} size="small" />
                    </div>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="border-b p-4 font-medium">Property Type</td>
                {selectedProperties.map((property) => (
                  <td key={property.id} className="border-b p-4 text-center">
                    {property.propertyType}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="border-b p-4 font-medium">Bedrooms</td>
                {selectedProperties.map((property) => (
                  <td key={property.id} className="border-b p-4 text-center">
                    {property.bedrooms}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="border-b p-4 font-medium">Bathrooms</td>
                {selectedProperties.map((property) => (
                  <td key={property.id} className="border-b p-4 text-center">
                    {property.bathrooms}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="border-b p-4 font-medium">Area</td>
                {selectedProperties.map((property) => (
                  <td key={property.id} className="border-b p-4 text-center">
                    {property.area}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="border-b p-4 font-medium">Security Deposit</td>
                {selectedProperties.map((property) => (
                  <td key={property.id} className="border-b p-4 text-center">
                    {property.securityDeposit}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="border-b p-4 font-medium">Available From</td>
                {selectedProperties.map((property) => (
                  <td key={property.id} className="border-b p-4 text-center">
                    {property.availableFrom}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="border-b p-4 font-medium">Minimum Stay</td>
                {selectedProperties.map((property) => (
                  <td key={property.id} className="border-b p-4 text-center">
                    {property.minStay}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="border-b p-4 font-medium">Utilities</td>
                {selectedProperties.map((property) => (
                  <td key={property.id} className="border-b p-4 text-center">
                    {property.utilities}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="border-b p-4 font-medium">Pets Allowed</td>
                {selectedProperties.map((property) => (
                  <td key={property.id} className="border-b p-4 text-center">
                    {property.petsAllowed ? (
                      <Check className="mx-auto h-5 w-5 text-green-500" />
                    ) : (
                      <X className="mx-auto h-5 w-5 text-red-500" />
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="border-b p-4 font-medium">Furnished</td>
                {selectedProperties.map((property) => (
                  <td key={property.id} className="border-b p-4 text-center">
                    {property.furnished}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="border-b p-4 font-medium">Year Built</td>
                {selectedProperties.map((property) => (
                  <td key={property.id} className="border-b p-4 text-center">
                    {property.yearBuilt}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="border-b p-4 font-medium">Amenities</td>
                {selectedProperties.map((property) => (
                  <td key={property.id} className="border-b p-4 text-center">
                    <div className="flex flex-wrap justify-center gap-1">
                      {property.amenities.map((amenity) => (
                        <Badge key={amenity} variant="outline" className="mb-1">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="border-b p-4 font-medium">Nearby Transit</td>
                {selectedProperties.map((property) => (
                  <td key={property.id} className="border-b p-4 text-center">
                    <ul className="list-inside list-disc text-left">
                      {property.nearbyTransit.map((transit) => (
                        <li key={transit} className="text-sm">
                          {transit}
                        </li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="border-b p-4 font-medium">Nearby Amenities</td>
                {selectedProperties.map((property) => (
                  <td key={property.id} className="border-b p-4 text-center">
                    <div className="flex flex-wrap justify-center gap-1">
                      {property.nearbyAmenities.map((amenity) => (
                        <Badge key={amenity} variant="outline" className="mb-1">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}

