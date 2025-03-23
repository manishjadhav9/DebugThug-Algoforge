"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ArrowLeft, 
  Calendar, 
  Edit, 
  ImageIcon, 
  MapPin, 
  MessageCircle, 
  Users, 
  Wallet, 
  Wrench,
  BedDouble,
  Bath,
  SquareCode,
  CheckCircle,
  AlertTriangle,
  Clock
} from "lucide-react"
import { PropertyBlockchainCard } from "@/components/blockchain/property-blockchain-card"

// Mock property data
const mockProperties = [
  {
    id: "prop-1",
    title: "Luxury Villa with Pool",
    location: "Whitefield, Bangalore",
    address: "123 Palm Avenue, Whitefield, Bangalore 560066",
    price: 125000,
    priceUnit: "month",
    formattedPrice: "₹1,25,000/month",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1600585154526-f0c7992d0bb9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1600585154526-f0c7992d0bb9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1350&q=80"
    ],
    description: "A luxurious villa located in the prestigious Whitefield area. This fully furnished property features a private swimming pool, spacious living areas, modern kitchen, and beautifully landscaped gardens. Perfect for executives and families looking for a premium lifestyle.",
    status: "active",
    createdAt: "2023-11-15",
    propertyType: "villa",
    bedrooms: 4,
    bathrooms: 4.5,
    area: 3200,
    areaUnit: "sqft",
    amenities: ["Swimming Pool", "Garden", "Gym", "Security", "Parking", "Furnished", "Air Conditioning", "Power Backup"],
    coordinates: {
      latitude: 12.9698,
      longitude: 77.7500
    },
    tenant: {
      id: "tenant-1",
      name: "Priya Kumar",
      email: "priya.kumar@example.com",
      phone: "+91 98765 43210",
      avatar: "/avatars/priya.jpg",
      avatarFallback: "PK",
      credScore: 95,
      leaseStart: "2023-12-31",
      leaseEnd: "2024-12-31",
      securityDeposit: 250000
    },
    maintenance: [
      {
        id: "issue-1",
        title: "AC not working",
        description: "The AC in the master bedroom is not cooling properly.",
        priority: "high",
        status: "reported",
        reportedDate: "2024-03-10"
      },
      {
        id: "issue-2",
        title: "Water leakage in kitchen",
        description: "There's water leaking from the sink pipe in the kitchen.",
        priority: "medium",
        status: "inProgress",
        reportedDate: "2024-03-08",
        scheduledDate: "2024-03-12"
      }
    ],
    paymentHistory: [
      {
        id: "payment-1",
        amount: "₹1,25,000",
        dueDate: "2024-03-01",
        paidDate: "2024-03-01",
        status: "completed",
        method: "bank"
      },
      {
        id: "payment-6",
        amount: "₹1,25,000",
        dueDate: "2024-02-01",
        paidDate: "2024-02-05",
        status: "completed",
        method: "bank"
      },
      {
        id: "payment-upcoming",
        amount: "₹1,25,000",
        dueDate: "2024-04-01",
        paidDate: null,
        status: "upcoming",
        method: null
      }
    ]
  }
]

export default function PropertyDetailPage() {
  const params = useParams()
  const propertyId = params.id as string
  
  const property = mockProperties.find(p => p.id === propertyId) || mockProperties[0]
  const [activeImage, setActiveImage] = useState(0)
  const [activeTab, setActiveTab] = useState("overview")

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Get status styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>
      case "pending":
        return <Badge className="bg-orange-500">Pending</Badge>
      case "maintenance":
        return <Badge className="bg-yellow-500">Maintenance</Badge>
      case "inactive":
        return <Badge className="bg-gray-500">Inactive</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  // Get maintenance status styling
  const getMaintenanceStatusBadge = (status: string) => {
    switch (status) {
      case "reported":
        return (
          <Badge className="bg-red-500">
            <span className="flex items-center">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Reported
            </span>
          </Badge>
        )
      case "inProgress":
        return (
          <Badge className="bg-orange-500">
            <span className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              In Progress
            </span>
          </Badge>
        )
      case "resolved":
        return (
          <Badge className="bg-green-500">
            <span className="flex items-center">
              <CheckCircle className="h-3 w-3 mr-1" />
              Resolved
            </span>
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/landlord/properties">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">{property.title}</h1>
          <div className="flex items-center text-gray-500">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{property.location}</span>
          </div>
        </div>
        <div className="ml-auto flex gap-2">
          <Link href={`/dashboard/landlord/properties/${property.id}/edit`}>
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit Property
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-4">
            <div className="aspect-video rounded-lg overflow-hidden relative">
              <img
                src={property.images[activeImage]}
                alt={property.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {property.images.map((image, index) => (
                <div
                  key={index}
                  className={`aspect-video rounded-md overflow-hidden cursor-pointer border-2 ${
                    activeImage === index ? "border-orange-500" : "border-transparent"
                  }`}
                  onClick={() => setActiveImage(index)}
                >
                  <img src={image} alt={`${property.title} ${index + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="tenant">Tenant</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Property Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700">{property.description}</p>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                    <div className="flex flex-col items-center p-3 bg-gray-50 rounded-md">
                      <BedDouble className="h-5 w-5 text-gray-500 mb-1" />
                      <span className="text-sm text-gray-500">Bedrooms</span>
                      <span className="font-medium">{property.bedrooms}</span>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-gray-50 rounded-md">
                      <Bath className="h-5 w-5 text-gray-500 mb-1" />
                      <span className="text-sm text-gray-500">Bathrooms</span>
                      <span className="font-medium">{property.bathrooms}</span>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-gray-50 rounded-md">
                      <SquareCode className="h-5 w-5 text-gray-500 mb-1" />
                      <span className="text-sm text-gray-500">Area</span>
                      <span className="font-medium">{property.area} {property.areaUnit}</span>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-gray-50 rounded-md">
                      <Wallet className="h-5 w-5 text-gray-500 mb-1" />
                      <span className="text-sm text-gray-500">Rent</span>
                      <span className="font-medium">{property.formattedPrice}</span>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Amenities</h3>
                    <div className="flex flex-wrap gap-2">
                      {property.amenities.map((amenity, index) => (
                        <Badge key={index} variant="outline" className="bg-gray-50">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Location</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-gray-700">{property.address}</p>
                    <div className="aspect-video rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                      <div className="text-gray-500 flex flex-col items-center">
                        <MapPin className="h-8 w-8 mb-2" />
                        <span>Map location at {property.coordinates.latitude.toFixed(4)}, {property.coordinates.longitude.toFixed(4)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="tenant" className="space-y-6">
              {property.tenant ? (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="space-y-1">
                      <CardTitle>Current Tenant</CardTitle>
                      <CardDescription>
                        Lease period: {formatDate(property.tenant.leaseStart)} to {formatDate(property.tenant.leaseEnd)}
                      </CardDescription>
                    </div>
                    <Link href={`/dashboard/messages?tenant=${property.tenant.id}`}>
                      <Button className="bg-orange-500 hover:bg-orange-600">
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Message Tenant
                      </Button>
                    </Link>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={property.tenant.avatar} alt={property.tenant.name} />
                          <AvatarFallback>{property.tenant.avatarFallback}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium text-lg">{property.tenant.name}</h3>
                          <div className="space-y-1 text-sm text-gray-500">
                            <p>{property.tenant.email}</p>
                            <p>{property.tenant.phone}</p>
                          </div>
                        </div>
                      </div>
                      <div className="md:ml-auto grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-md">
                          <p className="text-sm text-gray-500">Security Deposit</p>
                          <p className="font-medium">₹{property.tenant.securityDeposit.toLocaleString('en-IN')}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-md">
                          <p className="text-sm text-gray-500">Assurance Score</p>
                          <p className="font-medium">{property.tenant.credScore}/100</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="text-center py-12">
                  <CardContent>
                    <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No active tenant</h3>
                    <p className="text-gray-500 mb-6">
                      This property doesn't have a tenant yet.
                    </p>
                    <Button className="bg-orange-500 hover:bg-orange-600">
                      List Property
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="maintenance" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Maintenance Issues</h2>
                <Link href="/dashboard/landlord/maintenance">
                  <Button variant="outline">View All Issues</Button>
                </Link>
              </div>
              
              {property.maintenance && property.maintenance.length > 0 ? (
                <div className="space-y-4">
                  {property.maintenance.map((issue) => (
                    <Card key={issue.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between">
                          <CardTitle className="text-base">{issue.title}</CardTitle>
                          {getMaintenanceStatusBadge(issue.status)}
                        </div>
                        <CardDescription>
                          Reported on {formatDate(issue.reportedDate)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-700">{issue.description}</p>
                      </CardContent>
                      <CardFooter className="border-t pt-4 flex justify-between">
                        <Badge variant="outline" className={issue.priority === "high" ? "text-red-500" : issue.priority === "medium" ? "text-orange-500" : "text-green-500"}>
                          {issue.priority.charAt(0).toUpperCase() + issue.priority.slice(1)} Priority
                        </Badge>
                        <Link href={`/dashboard/landlord/maintenance?issue=${issue.id}`}>
                          <Button size="sm">View Details</Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="text-center py-12">
                  <CardContent>
                    <Wrench className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No maintenance issues</h3>
                    <p className="text-gray-500 mb-6">
                      This property doesn't have any reported maintenance issues.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="payments" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Payment History</h2>
                <Link href="/dashboard/landlord/payments">
                  <Button variant="outline">View All Payments</Button>
                </Link>
              </div>
              
              {property.paymentHistory && property.paymentHistory.length > 0 ? (
                <div className="rounded-md border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 text-sm font-medium text-gray-500">Due Date</th>
                        <th className="text-left p-3 text-sm font-medium text-gray-500">Paid Date</th>
                        <th className="text-left p-3 text-sm font-medium text-gray-500">Amount</th>
                        <th className="text-left p-3 text-sm font-medium text-gray-500">Status</th>
                        <th className="text-left p-3 text-sm font-medium text-gray-500">Method</th>
                      </tr>
                    </thead>
                    <tbody>
                      {property.paymentHistory.map((payment) => (
                        <tr key={payment.id} className="border-b">
                          <td className="p-3">{formatDate(payment.dueDate)}</td>
                          <td className="p-3">{payment.paidDate ? formatDate(payment.paidDate) : "-"}</td>
                          <td className="p-3 font-medium">{payment.amount}</td>
                          <td className="p-3">
                            <Badge className={
                              payment.status === "completed" 
                                ? "bg-green-500" 
                                : payment.status === "upcoming" 
                                ? "bg-blue-500" 
                                : "bg-red-500"
                            }>
                              {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                            </Badge>
                          </td>
                          <td className="p-3">{payment.method ? payment.method.charAt(0).toUpperCase() + payment.method.slice(1) : "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <Card className="text-center py-12">
                  <CardContent>
                    <Wallet className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No payment history</h3>
                    <p className="text-gray-500 mb-6">
                      There are no payment records for this property yet.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Property Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Status</span>
                {getStatusBadge(property.status)}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Listed On</span>
                <span>{formatDate(property.createdAt)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Property Type</span>
                <span className="capitalize">{property.propertyType}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Monthly Revenue</span>
                <span className="font-semibold">₹{property.price.toLocaleString('en-IN')}</span>
              </div>
              
              {property.tenant && (
                <>
                  <div className="border-t my-2 pt-2">
                    <p className="text-gray-500 text-sm">Current lease ends in</p>
                    <div className="flex justify-between items-center mt-1">
                      <div>
                        <Calendar className="h-4 w-4 text-orange-500 inline mr-1" />
                        <span>{formatDate(property.tenant.leaseEnd)}</span>
                      </div>
                      <Badge variant="outline" className="bg-orange-50 text-orange-600">
                        {Math.ceil((new Date(property.tenant.leaseEnd).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                      </Badge>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter className="flex-col space-y-2">
              <Button className="w-full bg-orange-500 hover:bg-orange-600">Generate Rent Receipt</Button>
              {property.tenant && (
                <Button variant="outline" className="w-full">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Message Tenant
                </Button>
              )}
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-xs text-gray-500">Maintenance</p>
                  <p className="text-lg font-medium">{property.maintenance?.length || 0}</p>
                  <p className="text-xs text-gray-500">Open issues</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-xs text-gray-500">Occupancy</p>
                  <p className="text-lg font-medium">100%</p>
                  <p className="text-xs text-gray-500">Since {property.tenant ? formatDate(property.tenant.leaseStart) : "N/A"}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-md col-span-2">
                  <p className="text-xs text-gray-500">Annual Revenue</p>
                  <p className="text-lg font-medium">₹{(property.price * 12).toLocaleString('en-IN')}</p>
                  <p className="text-xs text-gray-500">Based on current rent</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <PropertyBlockchainCard 
            property={{
              id: property.id,
              title: property.title,
              blockchainId: property.blockchainId || null,
              location: property.location,
              price: property.price,
              bedrooms: property.bedrooms,
              bathrooms: property.bathrooms,
              area: property.area,
              areaUnit: property.areaUnit,
              agreements: []
            }}
            tenants={[
              property.tenant ? 
                { id: property.tenant.id, name: property.tenant.name } : 
                undefined
            ].filter(Boolean)}
          />
        </div>
      </div>
    </div>
  )
} 