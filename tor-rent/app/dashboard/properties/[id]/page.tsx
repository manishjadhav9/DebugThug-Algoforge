"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  ArrowLeft,
  BarChart2,
  Calendar,
  Check,
  CuboidIcon as Cube,
  MapPin,
  MessageSquare,
  Star,
  User,
  Wallet,
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { VRView } from "@/components/vr-view"
import { AssuranceMeter } from "@/components/assurance-meter"

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
    owner: {
      name: "Sarah Johnson",
      image: "/placeholder.svg?height=40&width=40",
      credScore: 98,
      responseRate: "95%",
      responseTime: "within 1 hour",
    },
    reviews: [
      {
        id: "1",
        user: "Anonymous Tenant",
        avatar: "/placeholder.svg?height=40&width=40",
        date: "February 15, 2025",
        rating: 5,
        comment: "Amazing apartment with great views. The location is perfect for exploring the city.",
      },
      {
        id: "2",
        user: "Anonymous Tenant",
        avatar: "/placeholder.svg?height=40&width=40",
        date: "January 3, 2025",
        rating: 4,
        comment: "Very nice place. Clean and modern. The only downside is street parking can be difficult.",
      },
      {
        id: "3",
        user: "Anonymous Tenant",
        avatar: "/placeholder.svg?height=40&width=40",
        date: "December 10, 2024",
        rating: 5,
        comment: "Excellent property and responsive landlord. Would definitely rent again.",
      },
    ],
    assuranceScore: 92,
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
    owner: {
      name: "Alex Thompson",
      image: "/placeholder.svg?height=40&width=40",
      credScore: 92,
      responseRate: "90%",
      responseTime: "within 3 hours",
    },
    reviews: [
      {
        id: "1",
        user: "Anonymous Tenant",
        avatar: "/placeholder.svg?height=40&width=40",
        date: "March 5, 2025",
        rating: 4,
        comment: "Great location and nice space. Perfect for a single person.",
      },
      {
        id: "2",
        user: "Anonymous Tenant",
        avatar: "/placeholder.svg?height=40&width=40",
        date: "February 20, 2025",
        rating: 5,
        comment: "Loved staying here! The rooftop deck has amazing views of the city.",
      },
    ],
    assuranceScore: 85,
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
    owner: {
      name: "Robert Garcia",
      image: "/placeholder.svg?height=40&width=40",
      credScore: 95,
      responseRate: "98%",
      responseTime: "within 2 hours",
    },
    reviews: [
      {
        id: "1",
        user: "Anonymous Tenant",
        avatar: "/placeholder.svg?height=40&width=40",
        date: "March 10, 2025",
        rating: 5,
        comment: "Perfect for our family. The backyard was great for our kids and dog.",
      },
      {
        id: "2",
        user: "Anonymous Tenant",
        avatar: "/placeholder.svg?height=40&width=40",
        date: "February 28, 2025",
        rating: 4,
        comment: "Spacious and comfortable. The garage was a big plus for us.",
      },
    ],
    assuranceScore: 90,
  },
]

export default function PropertyDetailPage() {
  const params = useParams()
  const propertyId = params.id as string
  const property = properties.find((p) => p.id === propertyId) || properties[0]

  const [activeTab, setActiveTab] = useState("details")
  const [isRenting, setIsRenting] = useState(false)
  const [isComparing, setIsComparing] = useState(false)

  const handleCompare = () => {
    setIsComparing(!isComparing)

    // In a real app, this would add/remove the property from a comparison list
    // For demo purposes, we'll just toggle the state

    // Get current comparison list from localStorage
    const currentCompareList = JSON.parse(localStorage.getItem("compareList") || "[]")

    if (isComparing) {
      // Remove from comparison
      const newList = currentCompareList.filter((item: string) => item !== property.id)
      localStorage.setItem("compareList", JSON.stringify(newList))
    } else {
      // Add to comparison if not already in list and list length < 3
      if (!currentCompareList.includes(property.id) && currentCompareList.length < 3) {
        // Add to comparison
        currentCompareList.push(property.id)
        localStorage.setItem("compareList", JSON.stringify(newList))
      }
    }
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/dashboard/properties">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">{property.title}</h1>
            <Badge
              className={`ml-2 ${
                property.status === "active"
                  ? "bg-green-500"
                  : property.status === "pending"
                    ? "bg-orange-500"
                    : "bg-blue-500"
              }`}
            >
              {property.status === "active" ? "Active" : property.status === "pending" ? "Pending" : "Completed"}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={isComparing ? "default" : "outline"}
              className={isComparing ? "bg-orange-500 hover:bg-orange-600" : ""}
              onClick={handleCompare}
            >
              <BarChart2 className="mr-2 h-4 w-4" />
              {isComparing ? "Remove from Compare" : "Add to Compare"}
            </Button>
            <Link href={`/dashboard/compare?ids=${property.id}`}>
              <Button variant="outline">View Comparison</Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <div className="relative">
                <img
                  src={property.image || "/placeholder.svg"}
                  alt={property.title}
                  className="h-[300px] w-full object-cover"
                />
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="absolute bottom-4 right-4 bg-orange-500 hover:bg-orange-600">
                      <Cube className="mr-2 h-4 w-4" />
                      View in VR
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle>VR Tour: {property.title}</DialogTitle>
                      <DialogDescription>Explore the property in virtual reality</DialogDescription>
                    </DialogHeader>
                    <div className="aspect-video overflow-hidden rounded-md">
                      <VRView propertyId={property.id} />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <CardContent className="p-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                    <TabsTrigger value="location">Location</TabsTrigger>
                  </TabsList>
                  <TabsContent value="details" className="mt-6">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium">Description</h3>
                        <p className="mt-2 text-gray-600">{property.description}</p>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium">Property Details</h3>
                        <div className="mt-2 grid grid-cols-2 gap-4 md:grid-cols-4">
                          <div className="rounded-lg border p-3 text-center">
                            <p className="text-sm text-gray-500">Bedrooms</p>
                            <p className="text-lg font-medium">{property.bedrooms}</p>
                          </div>
                          <div className="rounded-lg border p-3 text-center">
                            <p className="text-sm text-gray-500">Bathrooms</p>
                            <p className="text-lg font-medium">{property.bathrooms}</p>
                          </div>
                          <div className="rounded-lg border p-3 text-center">
                            <p className="text-sm text-gray-500">Area</p>
                            <p className="text-lg font-medium">{property.area}</p>
                          </div>
                          <div className="rounded-lg border p-3 text-center">
                            <p className="text-sm text-gray-500">Assurance Score</p>
                            <p className="text-lg font-medium">{property.assuranceScore}</p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium">Amenities</h3>
                        <div className="mt-2 grid grid-cols-2 gap-2">
                          {property.amenities.map((amenity, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-green-500" />
                              <span>{amenity}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="reviews" className="mt-6">
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-5 w-5 text-orange-500 fill-orange-500" />
                          ))}
                        </div>
                        <span className="text-lg font-medium">{property.reviews.length} reviews</span>
                      </div>
                      <div className="space-y-4">
                        {property.reviews.map((review) => (
                          <div key={review.id} className="rounded-lg border p-4">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={review.avatar} alt={review.user} />
                                <AvatarFallback>{review.user.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{review.user}</p>
                                <p className="text-sm text-gray-500">{review.date}</p>
                              </div>
                              <div className="ml-auto flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`h-4 w-4 ${star <= review.rating ? "text-orange-500 fill-orange-500" : "text-gray-300"}`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="mt-3 text-gray-600">{review.comment}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="location" className="mt-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-orange-500" />
                        <span className="font-medium">{property.location}</span>
                      </div>
                      <div className="h-[300px] overflow-hidden rounded-lg border bg-gray-100">
                        <div className="flex h-full items-center justify-center">
                          <img
                            src={`/placeholder.svg?height=300&width=600&text=Map+of+${encodeURIComponent(property.location)}`}
                            alt={`Map of ${property.location}`}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </div>
                      <p className="text-gray-600">
                        The exact address will be provided after your rental agreement is confirmed.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Assurance Score</CardTitle>
                <CardDescription>Property reliability rating</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <AssuranceMeter score={property.assuranceScore} size="large" showDetails={true} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Rental Information</CardTitle>
                <CardDescription>Property pricing and availability</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Price</span>
                  <span className="font-bold">{property.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Security Deposit</span>
                  <span className="font-bold">0.1 ETH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Minimum Stay</span>
                  <span className="font-bold">6 months</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Available From</span>
                  <span className="font-bold">April 1, 2025</span>
                </div>
                <div className="rounded-lg bg-orange-50 p-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-orange-500" />
                    <span className="font-medium">Smart Contract Rental</span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">
                    This property uses blockchain-based smart contracts for secure, transparent rental agreements.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-orange-500 hover:bg-orange-600" onClick={() => setIsRenting(true)}>
                  Rent Now
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Property Owner</CardTitle>
                <CardDescription>Contact information and details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={property.owner.image} alt={property.owner.name} />
                    <AvatarFallback>{property.owner.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{property.owner.name}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <User className="mr-1 h-4 w-4" />
                      <span>Owner</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Cred Score</span>
                    <div className="flex items-center">
                      <Star className="mr-1 h-4 w-4 fill-orange-500 text-orange-500" />
                      <span className="font-bold">{property.owner.credScore}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Response Rate</span>
                    <span className="font-bold">{property.owner.responseRate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Response Time</span>
                    <span className="font-bold">{property.owner.responseTime}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Contact Owner
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>

        {isRenting && (
          <Card>
            <CardHeader>
              <CardTitle>Complete Your Rental</CardTitle>
              <CardDescription>Review and confirm your rental agreement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-medium">Rental Summary</h3>
                <div className="mt-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Property</span>
                    <span className="font-medium">{property.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Location</span>
                    <span className="font-medium">{property.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Monthly Rent</span>
                    <span className="font-medium">{property.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Security Deposit</span>
                    <span className="font-medium">0.1 ETH</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Start Date</span>
                    <span className="font-medium">April 1, 2025</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Lease Term</span>
                    <span className="font-medium">12 months</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Initial Payment</span>
                    <span className="font-bold">0.15 ETH</span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-orange-50 p-4">
                <div className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-orange-500" />
                  <h3 className="text-lg font-medium">Payment Method</h3>
                </div>
                <p className="mt-2 text-gray-600">
                  Payment will be processed through your connected Metamask wallet. Make sure you have sufficient ETH
                  balance.
                </p>
                <div className="mt-4 flex items-center justify-between rounded-md border bg-white p-3">
                  <div className="flex items-center gap-2">
                    <img src="/placeholder.svg?height=30&width=30&text=MM" alt="Metamask" className="h-6 w-6" />
                    <span className="font-medium">Metamask Wallet</span>
                  </div>
                  <Badge className="bg-green-500">Connected</Badge>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setIsRenting(false)}>
                Cancel
              </Button>
              <Button className="bg-orange-500 hover:bg-orange-600">Confirm and Pay</Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}

