"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
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
  Clock,
  Loader2
} from "lucide-react"
import { PropertyBlockchainCard } from "@/components/blockchain/property-blockchain-card"
import { getPropertyById, createTestProperty } from "@/lib/helpers/property-helper"
import { toast } from "@/components/ui/use-toast"

// Removed mock properties data

export default function PropertyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const propertyId = params.id as string
  
  const [property, setProperty] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)
  const [activeTab, setActiveTab] = useState("overview")
  const [error, setError] = useState<string | null>(null)

  // Fetch the property data
  useEffect(() => {
    async function fetchProperty() {
      try {
        setLoading(true)
        console.log("Fetching property with ID:", propertyId)
        
        // Debug: Check if the property ID format is as expected
        console.log("Property ID type:", typeof propertyId)
        console.log("Property ID value:", propertyId)
        
        // First attempt to create the test property
        if (process.env.NODE_ENV === 'development') {
          console.log("PropertyDetailPage: Attempting to create test property first:", propertyId)
          try {
            // This will either create a new property or return an existing one
            const testProperty = await createTestProperty(propertyId)
            if (testProperty) {
              console.log("PropertyDetailPage: Test property created or retrieved:", testProperty.id)
              setProperty(testProperty)
            }
          } catch (createError) {
            console.error("PropertyDetailPage: Error creating test property:", createError)
          }
        }
        
        // If we don't have a property yet, attempt to get property data
        if (!property) {
          console.log("PropertyDetailPage: Attempting to get property:", propertyId)
          let propertyData = await getPropertyById(propertyId)
          console.log("PropertyDetailPage: Property retrieval result:", propertyData ? "success" : "not found")
          
          // If not found, try with alternate ID formats
          if (!propertyData) {
            console.log("Property not found with exact ID, trying alternate formats...")
            
            // If propertyId is not prefixed with 'property_', try adding it
            if (!propertyId.startsWith('property_')) {
              const alternateId = `property_${propertyId}`
              console.log("Trying with alternate ID:", alternateId)
              propertyData = await getPropertyById(alternateId)
            }
            
            // If it's failed and the ID is a string that could be a number, try as number
            if (!propertyData && !isNaN(Number(propertyId))) {
              const numericId = Number(propertyId)
              console.log("Trying with numeric ID:", numericId)
              propertyData = await getPropertyById(numericId)
            }
          }
          
          // Create a fallback property with the ID if not found
          if (!propertyData) {
            console.error("Property not found for ID:", propertyId)
            console.log("Creating fallback property with ID:", propertyId)
            
            // Add a fallback property to the database for this ID
            const fallbackProperty = {
              id: propertyId,
              title: "Property Not Found",
              description: "This property could not be found in the database. It may have been deleted or its ID has changed.",
              location: "Unknown Location",
              propertyType: "unknown",
              price: 0,
              priceUnit: "month",
              bedrooms: 0,
              bathrooms: 0,
              area: 0,
              areaUnit: "sqft",
              amenities: [],
              images: ["/placeholder.svg"],
              status: "inactive",
              coordinates: { lat: 0, lng: 0 },
              landlordId: "unknown",
              createdAt: new Date().toISOString(),
              isPlaceholder: true
            }
            
            // Try to save this fallback property for future reference
            try {
              const { inmemoryService } = await import("@/lib/services/sqlite-service")
              await inmemoryService.create('properties', fallbackProperty)
              console.log("Created fallback property:", fallbackProperty)
              propertyData = fallbackProperty
            } catch (saveError) {
              console.error("Error creating fallback property:", saveError)
              propertyData = fallbackProperty
            }
            
            toast({
              title: "Property not found",
              description: "We couldn't find the property you're looking for. Using placeholder data instead.",
              variant: "destructive"
            })
          }
          
          console.log("Property data loaded:", propertyData)
          setProperty(propertyData)
        }
      } catch (error) {
        console.error("Error fetching property:", error)
        toast({
          title: "Error",
          description: "Failed to load property details. Please try again.",
          variant: "destructive"
        })
        setError(error instanceof Error ? error.message : "Unknown error")
      } finally {
        setLoading(false)
      }
    }
    
    if (propertyId) {
      fetchProperty()
    }
  }, [propertyId, router])

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
      case "available":
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

  // Loading state
  if (loading) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        <p className="mt-4 text-gray-500">Loading property details...</p>
      </div>
    )
  }

  // Not found state
  if (!property) {
    return (
      <div className="p-6">
        <Link href="/dashboard/landlord/properties">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="text-center py-12">
          <h2 className="text-xl font-bold mb-2">Property not found</h2>
          <p className="text-gray-500 mb-4">The property you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => router.push("/dashboard/landlord/properties")}>
            Back to properties
          </Button>
        </div>
      </div>
    )
  }

  // Make sure images is an array
  const propertyImages = Array.isArray(property.images) && property.images.length > 0 
    ? property.images 
    : ["/placeholder.svg"]

  // Provide fallbacks for property fields
  const safeProperty = {
    id: property.id || propertyId,
    title: property.title || "Untitled Property",
    location: property.location || "No location specified",
    description: property.description || "No description available",
    status: property.status || "unknown",
    createdAt: property.createdAt || new Date().toISOString(),
    propertyType: property.propertyType || "Other",
    price: typeof property.price === 'number' ? property.price : 0,
    priceUnit: property.priceUnit || "month",
    bedrooms: property.bedrooms || 0,
    bathrooms: property.bathrooms || 0,
    area: property.area || 0,
    areaUnit: property.areaUnit || "sqft",
    amenities: Array.isArray(property.amenities) ? property.amenities : [],
    images: Array.isArray(property.images) ? property.images : [],
    coordinates: property.coordinates || { lat: 0, lng: 0 },
    blockchainId: property.blockchainId || null,
    // Optional properties that might not exist
    tenant: property.tenant || null,
    maintenance: Array.isArray(property.maintenance) ? property.maintenance : [],
    paymentHistory: Array.isArray(property.paymentHistory) ? property.paymentHistory : [],
    ...property // Include all original properties
  }

  return (
    <div className="p-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/landlord/properties">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">{safeProperty.title}</h1>
          <div className="flex items-center text-gray-500">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{safeProperty.location}</span>
          </div>
        </div>
        <div className="ml-auto flex gap-2">
          <Link href={`/dashboard/landlord/properties/${safeProperty.id}/edit`}>
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
                src={propertyImages[activeImage]}
                alt={safeProperty.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {propertyImages.map((image: string, index: number) => (
                <div
                  key={index}
                  className={`aspect-video rounded-md overflow-hidden cursor-pointer border-2 ${
                    activeImage === index ? "border-orange-500" : "border-transparent"
                  }`}
                  onClick={() => setActiveImage(index)}
                >
                  <img src={image} alt={`${safeProperty.title} ${index + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="tenant">Tenant</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4 pt-4">
              <div className="grid grid-cols-3 gap-4">
                <Card className="col-span-3">
                <CardHeader>
                    <CardTitle>Description</CardTitle>
                </CardHeader>
                  <CardContent>
                    <p>{safeProperty.description}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-base font-medium flex items-center">
                      <BedDouble className="h-4 w-4 mr-2 text-orange-500" />
                      Bedrooms
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-2xl font-bold">{safeProperty.bedrooms}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-base font-medium flex items-center">
                      <Bath className="h-4 w-4 mr-2 text-orange-500" />
                      Bathrooms
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-2xl font-bold">{safeProperty.bathrooms}</p>
                </CardContent>
              </Card>
              
              <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-base font-medium flex items-center">
                      <SquareCode className="h-4 w-4 mr-2 text-orange-500" />
                      Area
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-2xl font-bold">{safeProperty.area} {safeProperty.areaUnit}</p>
                  </CardContent>
                </Card>
                
                <Card className="col-span-3">
                <CardHeader>
                    <CardTitle>Amenities</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {safeProperty.amenities.map((amenity: string, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>{amenity}</span>
                      </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="tenant" className="space-y-4 pt-4">
              {safeProperty.tenant ? (
                <Card>
                  <CardHeader className="flex flex-row items-center space-y-0 gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={safeProperty.tenant.avatar} />
                      <AvatarFallback>{safeProperty.tenant.avatarFallback}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>{safeProperty.tenant.name}</CardTitle>
                      <CardDescription>Current Tenant</CardDescription>
                    </div>
                    <Button className="ml-auto" variant="outline">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Message
                      </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Email</span>
                        <span>{safeProperty.tenant.email}</span>
                          </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Phone</span>
                        <span>{safeProperty.tenant.phone}</span>
                        </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Lease Start</span>
                        <span>{safeProperty.tenant.leaseStart ? formatDate(safeProperty.tenant.leaseStart) : "N/A"}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Lease End</span>
                        <span>{safeProperty.tenant.leaseEnd ? formatDate(safeProperty.tenant.leaseEnd) : "N/A"}</span>
                        </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Security Deposit</span>
                        <span>₹{safeProperty.tenant.securityDeposit?.toLocaleString('en-IN') || "N/A"}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Users className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Tenant Yet</h3>
                  <p className="text-gray-500 mb-4">This property is not currently rented to any tenant.</p>
                  <Button variant="outline">Find Tenants</Button>
                </div>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Payment History</CardTitle>
                </CardHeader>
                <CardContent>
                  {safeProperty.paymentHistory && safeProperty.paymentHistory.length > 0 ? (
                    <div className="space-y-4">
                      {safeProperty.paymentHistory.map((payment: any) => (
                        <div key={payment.id} className="flex items-center justify-between border-b pb-2">
                          <div>
                            <p className="font-medium">{payment.amount}</p>
                            <p className="text-sm text-gray-500">Due: {formatDate(payment.dueDate)}</p>
                          </div>
                          <div>
                            {payment.status === "completed" ? (
                              <Badge className="bg-green-500">
                                <span className="flex items-center">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Paid on {formatDate(payment.paidDate)}
                                </span>
                              </Badge>
                            ) : payment.status === "upcoming" ? (
                              <Badge variant="outline" className="border-orange-500 text-orange-500">
                                Upcoming
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="border-red-500 text-red-500">
                                Overdue
                              </Badge>
                            )}
              </div>
                        </div>
                  ))}
                </div>
              ) : (
                    <div className="text-center py-8">
                      <Wallet className="h-8 w-8 mx-auto text-gray-300 mb-2" />
                      <p className="text-gray-500">No payment history available</p>
                    </div>
                  )}
                  </CardContent>
                </Card>
            </TabsContent>
            
            <TabsContent value="maintenance" className="space-y-4 pt-4">
              {safeProperty.maintenance && safeProperty.maintenance.length > 0 ? (
                safeProperty.maintenance.map((issue: any) => (
                  <Card key={issue.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle>{issue.title}</CardTitle>
                        {getMaintenanceStatusBadge(issue.status)}
              </div>
                      <CardDescription>Reported on {formatDate(issue.reportedDate)}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>{issue.description}</p>
                      
                      {issue.status === "inProgress" && issue.scheduledDate && (
                        <div className="mt-2 p-2 bg-orange-50 rounded-md flex items-center">
                          <Calendar className="h-4 w-4 text-orange-500 mr-2" />
                          <span className="text-sm">
                            Scheduled for {formatDate(issue.scheduledDate)}
                          </span>
                </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Message Tenant
                      </Button>
                      {issue.status !== "resolved" && (
                        <Button size="sm">
                          <Wrench className="h-4 w-4 mr-2" />
                          {issue.status === "reported" ? "Schedule Repair" : "Mark as Resolved"}
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Wrench className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Maintenance Issues</h3>
                  <p className="text-gray-500">This property has no reported maintenance issues.</p>
                </div>
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
                {getStatusBadge(safeProperty.status)}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Listed On</span>
                <span>{safeProperty.createdAt ? formatDate(safeProperty.createdAt) : "N/A"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Property Type</span>
                <span className="capitalize">{safeProperty.propertyType}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Monthly Revenue</span>
                <span className="font-semibold">₹{safeProperty.price?.toLocaleString('en-IN') || 0}</span>
              </div>
              
              {safeProperty.tenant && (
                <>
                  <div className="border-t my-2 pt-2">
                    <p className="text-gray-500 text-sm">Current lease ends in</p>
                    <div className="flex justify-between items-center mt-1">
                      <div>
                        <Calendar className="h-4 w-4 text-orange-500 inline mr-1" />
                        <span>{formatDate(safeProperty.tenant.leaseEnd)}</span>
                      </div>
                      <Badge variant="outline" className="bg-orange-50 text-orange-600">
                        {Math.ceil((new Date(safeProperty.tenant.leaseEnd).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                      </Badge>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
          
          <PropertyBlockchainCard 
            property={{
              id: safeProperty.id,
              title: safeProperty.title,
              blockchainId: safeProperty.blockchainId,
              location: safeProperty.location,
              price: safeProperty.price,
              bedrooms: safeProperty.bedrooms,
              bathrooms: safeProperty.bathrooms,
              area: safeProperty.area,
              areaUnit: safeProperty.areaUnit,
              agreements: []
            }}
            tenants={[
              safeProperty.tenant ? 
                { id: safeProperty.tenant.id, name: safeProperty.tenant.name } : 
                undefined
            ].filter(Boolean)}
          />
        </div>
      </div>
      
      {/* Debug section - only visible in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 p-4 border border-gray-300 rounded-lg bg-gray-50">
          <h2 className="text-xl font-semibold mb-2">Debug Information</h2>
          <div className="space-y-2">
            <p><strong>Property ID:</strong> {safeProperty.id}</p>
            <p><strong>Blockchain ID:</strong> {safeProperty.blockchainId || 'Not set'}</p>
            <p><strong>Created At:</strong> {safeProperty.createdAt}</p>
            <div className="mt-4 space-x-2">
              <a 
                href={`/api/debug?action=getProperty&id=${encodeURIComponent(safeProperty.id)}`}
                target="_blank"
                className="inline-block px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              >
                Debug API: Get Property
              </a>
              <a 
                href={`/api/debug?action=createTestProperty&id=${encodeURIComponent(safeProperty.id)}`}
                target="_blank"
                className="inline-block px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
              >
                Debug API: Create Test Property
              </a>
              <a 
                href="/api/debug?action=getAllProperties"
                target="_blank"
                className="inline-block px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
              >
                Debug API: List All Properties
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 