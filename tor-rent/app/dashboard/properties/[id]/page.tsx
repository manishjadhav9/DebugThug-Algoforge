"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { 
  ArrowLeft, 
  BedDouble, 
  Bath, 
  SquareFeet, 
  Loader2, 
  Check, 
  Wifi, 
  Car, 
  Info, 
  ArrowRight,
  MapPin, 
  DollarSign,
  Wallet
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { getPropertyById } from "@/lib/helpers/property-helper"
import { MapView } from "@/components/map-view"
import { walletService } from "@/lib/services/wallet-service"
import { propertyService } from "@/lib/services/property-service"

export default function PropertyDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [property, setProperty] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [wallet, setWallet] = useState<any>(null)
  const [hasWallet, setHasWallet] = useState(false)
  const [isRentingDialogOpen, setIsRentingDialogOpen] = useState(false)
  const [rentingStatus, setRentingStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle')
  
  // Mock user ID for demonstration purposes
  const userId = "user123"
  
  useEffect(() => {
    async function fetchPropertyAndWallet() {
      try {
        setLoading(true)
        
        // Fetch property details
        if (id) {
          const propertyData = await getPropertyById(id.toString())
          
          if (!propertyData) {
            toast({
              title: "Property not found",
              description: "The property you're looking for doesn't exist or has been removed.",
              variant: "destructive"
            })
            router.push("/dashboard/properties")
            return
          }
          
          setProperty(propertyData)
        }
        
        // Check if user has wallet
        const walletExists = await walletService.checkWalletExists(userId)
        setHasWallet(walletExists)
        
        if (walletExists) {
          const walletInfo = await walletService.getWallet(userId)
          setWallet(walletInfo)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to load property details. Please try again.",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }
    
    fetchPropertyAndWallet()
  }, [id, router, userId])
  
  // Function to create wallet if needed
  const handleCreateWallet = async () => {
    try {
      toast({
        title: "Creating wallet",
        description: "Please wait while we create your wallet..."
      })
      
      const createdWallet = await walletService.createWallet(userId)
      
      // Fund wallet with test ETH
      await walletService.fundWalletWithTestEth(createdWallet.address)
      
      setWallet(createdWallet)
      setHasWallet(true)
      
      toast({
        title: "Wallet created",
        description: "Your wallet has been successfully created and funded with test ETH.",
        variant: "success"
      })
    } catch (error) {
      console.error("Error creating wallet:", error)
      toast({
        title: "Error",
        description: "Failed to create wallet. Please try again later.",
        variant: "destructive"
      })
    }
  }
  
  // Function to handle renting property
  const handleRentProperty = async () => {
    if (!hasWallet) {
      toast({
        title: "Wallet required",
        description: "You need a wallet to rent this property. Please create one first.",
        variant: "warning"
      })
      return
    }
    
    setRentingStatus('processing')
    
    try {
      // Check wallet balance
      const balance = await walletService.getWalletBalance(wallet.address)
      const price = typeof property.price === 'string' ? parseFloat(property.price) : property.price
      
      if (balance < price) {
        toast({
          title: "Insufficient funds",
          description: `Your wallet balance (${balance} ETH) is not enough to rent this property. Visit the Wallet Funding page to add more ETH.`,
          variant: "destructive"
        })
        setRentingStatus('error')
        return
      }
      
      // Attempt to rent property on blockchain
      await propertyService.rentProperty(property.id, wallet.address, userId)
      
      setRentingStatus('success')
      
      // Show success toast
      toast({
        title: "Property rented!",
        description: "You have successfully rented this property. Check your agreements tab for details.",
        variant: "success"
      })
      
      // Redirect to agreements page after 2 seconds
      setTimeout(() => {
        router.push("/dashboard/tenant/agreements")
      }, 2000)
    } catch (error) {
      console.error("Error renting property:", error)
      setRentingStatus('error')
      toast({
        title: "Renting failed",
        description: "There was an error while processing your rental request. Please try again later.",
        variant: "destructive"
      })
    }
  }
  
  // Format price for display
  const formatPrice = (price: number, priceUnit: string) => {
    const formatter = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    })
    
    const formattedPrice = formatter.format(price)
    
    const unitMap: Record<string, string> = {
      day: "/day",
      week: "/week",
      month: "/month"
    }
    
    return `${formattedPrice}${unitMap[priceUnit] || ''}`
  }
  
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
          <span className="ml-2">Loading property details...</span>
        </div>
      </DashboardLayout>
    )
  }
  
  if (!property) {
  return (
    <DashboardLayout>
        <div className="p-6">
          <Button variant="outline" className="mb-4" onClick={() => router.push("/dashboard/properties")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Properties
              </Button>
          <div className="text-center py-12">
            <h2 className="text-xl font-bold mb-2">Property not found</h2>
            <p className="text-gray-500 mb-4">The property you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => router.push("/dashboard/properties")}>
              Browse available properties
            </Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }
  
  const propertyImages = property.images && property.images.length > 0 
    ? property.images 
    : ["/placeholder.svg"]
  
  return (
    <DashboardLayout>
      <div className="p-6">
        <Button variant="outline" className="mb-4" onClick={() => router.push("/dashboard/properties")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Properties
        </Button>
        
        <div className="grid gap-6 md:grid-cols-3">
          {/* Property details column */}
          <div className="md:col-span-2">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{property.title}</h1>
            <div className="flex items-center mb-4">
              <MapPin className="h-4 w-4 text-gray-500 mr-1" />
              <span className="text-gray-500">{property.location}</span>
        </div>

            {/* Property image gallery */}
            <div className="relative aspect-video mb-4 overflow-hidden rounded-lg">
              <Image 
                src={propertyImages[activeImageIndex]}
                  alt={property.title}
                fill
                className="object-cover"
              />
              
              {propertyImages.length > 1 && (
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                  {propertyImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImageIndex(index)}
                      className={`h-2 w-2 rounded-full ${
                        index === activeImageIndex ? "bg-white" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
            
            {/* Thumbnail gallery */}
            {propertyImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2 mb-6">
                {propertyImages.map((image, index) => (
                  <div 
                    key={index}
                    className={`relative aspect-video rounded-md overflow-hidden cursor-pointer border-2 
                      ${index === activeImageIndex ? "border-orange-500" : "border-transparent"}`}
                    onClick={() => setActiveImageIndex(index)}
                  >
                    <Image
                      src={image}
                      alt={`${property.title} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    </div>
                ))}
              </div>
            )}
            
            {/* Property details tabs */}
            <Tabs defaultValue="overview" className="mb-8">
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                    <TabsTrigger value="location">Location</TabsTrigger>
                  </TabsList>
              
              <TabsContent value="overview">
                <div className="space-y-4">
                      <div>
                    <h3 className="text-xl font-semibold mb-2">Description</h3>
                    <p className="text-gray-700">{property.description}</p>
                      </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-4">
                    {property.bedrooms && (
                      <div className="flex items-center">
                        <BedDouble className="h-5 w-5 text-orange-500 mr-2" />
                      <div>
                            <p className="text-sm text-gray-500">Bedrooms</p>
                          <p className="font-medium">{property.bedrooms}</p>
                        </div>
                      </div>
                    )}
                    
                    {property.bathrooms && (
                      <div className="flex items-center">
                        <Bath className="h-5 w-5 text-orange-500 mr-2" />
                      <div>
                          <p className="text-sm text-gray-500">Bathrooms</p>
                          <p className="font-medium">{property.bathrooms}</p>
                        </div>
                      </div>
                    )}
                    
                    {property.area && (
                        <div className="flex items-center">
                        <SquareFeet className="h-5 w-5 text-orange-500 mr-2" />
                        <div>
                          <p className="text-sm text-gray-500">Area</p>
                          <p className="font-medium">{property.area}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {property.blockchainId && (
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                      <div className="flex items-start">
                        <Info className="h-5 w-5 text-orange-500 mr-2 mt-0.5" />
                              <div>
                          <h4 className="font-semibold">Blockchain Verified</h4>
                          <p className="text-sm text-gray-600">
                            This property is registered on the blockchain, ensuring secure and transparent rental transactions.
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Blockchain ID: {property.blockchainId}
                          </p>
                          </div>
                      </div>
                    </div>
                  )}
                    </div>
                  </TabsContent>
              
              <TabsContent value="features">
                    <div className="space-y-4">
                  <h3 className="text-xl font-semibold mb-2">Property Features</h3>
                  
                  {property.amenities && property.amenities.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {property.amenities.map((amenity: string, index: number) => (
                        <div key={index} className="flex items-center">
                          <Check className="h-5 w-5 text-green-500 mr-2" />
                          <span>{amenity}</span>
                      </div>
                      ))}
                      </div>
                  ) : (
                    <p className="text-gray-500">No amenities listed for this property.</p>
                  )}
                  
                  {property.propertyType && (
                    <div className="mt-6">
                      <h4 className="font-semibold mb-2">Property Type</h4>
                      <Badge variant="outline" className="text-sm">
                        {property.propertyType}
                      </Badge>
                    </div>
                  )}
                    </div>
                  </TabsContent>
              
              <TabsContent value="location">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold mb-2">Location</h3>
                  <p className="text-gray-700 mb-4">{property.location}</p>
                  
                  {/* Map view */}
                  <Card className="overflow-hidden h-[400px]">
                    <CardContent className="p-0 h-full">
                      <MapView properties={[{
                        ...property,
                        id: property.id.toString(),
                        price: formatPrice(property.price, property.priceUnit),
                        image: propertyImages[0],
                        coordinates: property.coordinates || { lat: 12.9716, lng: 77.5946 }
                      }]} />
              </CardContent>
            </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar - Price, contact, actions */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <DollarSign className="h-5 w-5 text-orange-500 mr-1" />
                  {formatPrice(property.price, property.priceUnit)}
                </CardTitle>
                <CardDescription>
                  {property.status === 'available' ? (
                    <Badge className="bg-green-500">Available</Badge>
                  ) : (
                    <Badge variant="secondary">Not Available</Badge>
                  )}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Wallet Status</h4>
                  {hasWallet ? (
                    <div className="flex items-center text-sm">
                      <Wallet className="h-4 w-4 text-green-500 mr-2" />
                      <span>Wallet connected: {wallet?.address.substring(0, 6)}...{wallet?.address.substring(wallet.address.length - 4)}</span>
                </div>
                  ) : (
                    <div>
                      <div className="flex items-center text-sm mb-2">
                        <Wallet className="h-4 w-4 text-orange-500 mr-2" />
                        <span>No wallet connected</span>
                </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={handleCreateWallet}
                      >
                        Create Wallet
                      </Button>
                </div>
                  )}
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-semibold mb-1">Security Deposit</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    {formatPrice(property.price * 2, property.priceUnit)} (refundable)
                  </p>
                </div>
                
                <Separator />
                
                {property.status === 'available' ? (
                  <Button 
                    className="w-full" 
                    onClick={() => setIsRentingDialogOpen(true)}
                    disabled={!hasWallet}
                  >
                    Rent Now
                  </Button>
                ) : (
                  <Button disabled className="w-full">
                    Currently Unavailable
                  </Button>
                )}
                
                <p className="text-xs text-gray-500 text-center">
                  Rent is processed through secure blockchain transaction
                </p>
              </CardContent>
            </Card>

            {/* Landlord info card */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">Landlord Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-1"><span className="font-semibold">Name:</span> {property.landlordName || 'Verified Landlord'}</p>
                <p className="text-sm"><span className="font-semibold">Response Rate:</span> 98%</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Rent Property Dialog */}
      <Dialog open={isRentingDialogOpen} onOpenChange={setIsRentingDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rent {property.title}</DialogTitle>
            <DialogDescription>
              Confirm the details below to proceed with your rental agreement.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Monthly Rent</p>
                <p className="font-medium">{formatPrice(property.price, property.priceUnit)}</p>
                  </div>
              <div>
                <p className="text-sm text-gray-500">Security Deposit</p>
                <p className="font-medium">{formatPrice(property.price * 2, property.priceUnit)}</p>
                  </div>
              <div>
                <p className="text-sm text-gray-500">Total Initial Payment</p>
                <p className="font-medium">{formatPrice(property.price * 3, property.priceUnit)}</p>
                  </div>
              <div>
                <p className="text-sm text-gray-500">Wallet Balance</p>
                <p className="font-medium">{wallet?.balance || "0.0"} ETH</p>
              </div>
              </div>

            <div className="bg-orange-50 p-3 rounded text-sm mb-4">
              <p className="flex items-start">
                <Info className="h-4 w-4 text-orange-500 mr-2 mt-0.5" />
                This will create a blockchain rental agreement between you and the landlord.
              </p>
                </div>
              </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRentingDialogOpen(false)} disabled={rentingStatus === 'processing'}>
                Cancel
              </Button>
            <Button onClick={handleRentProperty} disabled={rentingStatus !== 'idle'}>
              {rentingStatus === 'processing' && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {rentingStatus === 'success' && <Check className="h-4 w-4 mr-2" />}
              {rentingStatus === 'processing' ? 'Processing...' : 
               rentingStatus === 'success' ? 'Completed!' : 'Confirm Rental'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}

