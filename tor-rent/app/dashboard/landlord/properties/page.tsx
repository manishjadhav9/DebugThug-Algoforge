"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { 
  ArrowLeft, 
  Building, 
  Check, 
  Edit, 
  Filter, 
  Grid, 
  List, 
  Plus, 
  Search, 
  Trash,
  Loader2 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { PropertyCard } from "@/components/property-card"
import { toast } from "@/components/ui/use-toast"
import { formatDate } from "@/lib/utils/date"
import { useUser } from "@/hooks/useUser"
import { getLandlordProperties } from "@/lib/helpers/property-helper"

export default function LandlordPropertiesPage() {
  const searchParams = useSearchParams()
  const success = searchParams.get("success")
  const { user } = useUser()
  const userId = user?.id || 'landlord-1' // Fallback ID for development
  
  const [properties, setProperties] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [view, setView] = useState<"grid" | "list">("grid")

  // Fetch properties on component mount
  useEffect(() => {
    async function fetchProperties() {
      try {
        setIsLoading(true)
        const data = await getLandlordProperties(userId)
        setProperties(data)
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
  }, [userId])

  // Show success toast when property is added
  useEffect(() => {
    if (success === "true") {
      toast({
        title: "Property Added",
        description: "Your property has been successfully added.",
      })
    }
  }, [success])

  // Filter properties based on search term, status, and type
  const filteredProperties = properties.filter((property) => {
    // Search term filter
    const matchesSearch = searchTerm === "" || 
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.toLowerCase().includes(searchTerm.toLowerCase())
    
    // Status filter
    const matchesStatus = statusFilter === "all" || property.status === statusFilter
    
    // Type filter
    const matchesType = typeFilter === "all" || property.propertyType === typeFilter
    
    return matchesSearch && matchesStatus && matchesType
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
    <div className="p-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-6">
        <div>
          <h1 className="text-2xl font-bold">My Properties</h1>
          <p className="text-gray-500">Manage your property listings</p>
        </div>
        <Link href="/dashboard/landlord/properties/add">
          <Button className="bg-orange-500 hover:bg-orange-600">
            <Plus className="mr-2 h-4 w-4" /> Add New Property
          </Button>
        </Link>
      </div>

      <div className="mb-6 flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search properties..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
          <div className="flex items-center space-x-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="rented">Rented</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          
            <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Property Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="villa">Villa</SelectItem>
                <SelectItem value="office">Office</SelectItem>
                <SelectItem value="shop">Shop</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          
          <div className="flex border rounded-md">
            <Button
              variant={view === "grid" ? "default" : "ghost"}
              size="icon"
              className={view === "grid" ? "bg-orange-500 hover:bg-orange-600" : ""}
              onClick={() => setView("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={view === "list" ? "default" : "ghost"}
              size="icon"
              className={view === "list" ? "bg-orange-500 hover:bg-orange-600" : ""}
              onClick={() => setView("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
          <span className="ml-2">Loading properties...</span>
        </div>
      ) : filteredProperties.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Building className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No properties found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || statusFilter !== "all" || typeFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Add your first property to get started"}
            </p>
            <Link href="/dashboard/landlord/properties/add">
              <Button className="bg-orange-500 hover:bg-orange-600">
                <Plus className="mr-2 h-4 w-4" /> Add New Property
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : view === "grid" ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProperties.map((property) => (
            <Card key={property.id} className="overflow-hidden">
              <div className="relative">
                <img
                  src={property.images && property.images.length > 0 ? property.images[0] : "/placeholder.svg?height=200&width=300"}
                  alt={property.title}
                  className="h-48 w-full object-cover"
                />
                <div className="absolute bottom-2 right-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="secondary" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <Link href={`/dashboard/landlord/properties/${property.id}/edit`}>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Property
                        </DropdownMenuItem>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Trash className="mr-2 h-4 w-4" />
                            Delete Property
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete the property listing.
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold">{property.title}</h3>
                <p className="text-sm text-gray-500">{property.location}</p>
                <div className="mt-2 flex items-center justify-between">
                  <p className="font-medium">{formatPrice(property.price, property.priceUnit)}</p>
                  {property.status === "rented" && (
                    <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50">
                      Leased
                    </Badge>
                  )}
                  {property.blockchainId && (
                    <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50">
                      On Blockchain
                    </Badge>
                  )}
                </div>
                {property.status === "rented" && property.tenantName && (
                  <div className="mt-2 text-sm">
                    <p className="text-gray-500">
                      Tenant: <span className="text-gray-700">{property.tenantName}</span>
                    </p>
                    <p className="text-gray-500">
                      Lease ends:{" "}
                      <span className="text-gray-700">
                        {formatDate(property.leaseEnd)}
                      </span>
                    </p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t p-4">
                <Link href={`/dashboard/landlord/properties/${property.id}`} className="w-full">
                  <Button className="w-full bg-orange-500 hover:bg-orange-600">View Details</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProperties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                      <img
                          src={property.images && property.images.length > 0 ? property.images[0] : "/placeholder.svg?height=30&width=30"}
                        alt={property.title}
                          className="h-8 w-8 rounded-md object-cover"
                      />
                      <span>{property.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>{property.location}</TableCell>
                    <TableCell>{formatPrice(property.price, property.priceUnit)}</TableCell>
                  <TableCell>
                    <Badge
                        className={`${
                          property.status === "available" 
                            ? "bg-blue-50 text-blue-700 hover:bg-blue-50"
                            : property.status === "rented"
                            ? "bg-green-50 text-green-700 hover:bg-green-50"
                            : "bg-gray-50 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {property.status === "available" ? "Available" : 
                         property.status === "rented" ? "Leased" : 
                         property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                    </Badge>
                  </TableCell>
                    <TableCell>{formatDate(property.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                        <Link href={`/dashboard/landlord/properties/${property.id}`}>
                          <Button size="sm" variant="ghost">
                            View
                        </Button>
                      </Link>
                        <Link href={`/dashboard/landlord/properties/${property.id}/edit`}>
                          <Button size="sm" variant="ghost">
                            <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 