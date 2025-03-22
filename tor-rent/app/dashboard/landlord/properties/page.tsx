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
  Trash 
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
import { toast } from "@/hooks/use-toast"

// Mock property data
const mockProperties = [
  {
    id: "prop-1",
    title: "Luxury Villa with Pool",
    location: "Whitefield, Bangalore",
    price: "125000",
    priceUnit: "month",
    formattedPrice: "₹1,25,000/month",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1350&q=80",
    status: "active" as const,
    credScore: 98,
    type: "villa",
    bedrooms: 4,
    bathrooms: 4.5,
    area: 3200,
    areaUnit: "sqft",
    tenantName: "Priya Kumar",
    leaseEnd: "2024-12-31",
    createdAt: "2023-11-15",
  },
  {
    id: "prop-2",
    title: "Modern 3BHK Apartment",
    location: "HSR Layout, Bangalore",
    price: "65000",
    priceUnit: "month",
    formattedPrice: "₹65,000/month",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1350&q=80",
    status: "active" as const,
    credScore: 95,
    type: "apartment",
    bedrooms: 3,
    bathrooms: 3,
    area: 1800,
    areaUnit: "sqft",
    tenantName: "Amit Bhatt",
    leaseEnd: "2024-08-15",
    createdAt: "2023-09-22",
  },
  {
    id: "prop-3",
    title: "Spacious Office Space",
    location: "Indira Nagar, Bangalore",
    price: "85000",
    priceUnit: "month",
    formattedPrice: "₹85,000/month",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1350&q=80",
    status: "pending" as const,
    credScore: 90,
    type: "office",
    bedrooms: 0,
    bathrooms: 2,
    area: 2200,
    areaUnit: "sqft",
    tenantName: "Vikram Gupta",
    leaseEnd: "2024-10-01",
    createdAt: "2023-10-05",
  },
  {
    id: "prop-4",
    title: "Cozy 2BHK with Balcony",
    location: "Koramangala, Bangalore",
    price: "45000",
    priceUnit: "month",
    formattedPrice: "₹45,000/month",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1350&q=80",
    status: "active" as const,
    credScore: 92,
    type: "apartment",
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    areaUnit: "sqft",
    tenantName: "Neha Sharma",
    leaseEnd: "2024-06-30",
    createdAt: "2023-07-12",
  },
  {
    id: "prop-5",
    title: "Retail Shop in Mall",
    location: "MG Road, Bangalore",
    price: "120000",
    priceUnit: "month",
    formattedPrice: "₹1,20,000/month",
    image: "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1350&q=80",
    status: "active" as const,
    credScore: 96,
    type: "shop",
    bedrooms: 0,
    bathrooms: 1,
    area: 800,
    areaUnit: "sqft",
    tenantName: "Arjun Kapoor",
    leaseEnd: "2025-03-31",
    createdAt: "2023-12-01",
  },
]

export default function LandlordPropertiesPage() {
  const searchParams = useSearchParams()
  const [view, setView] = useState<"grid" | "list">("grid")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [properties, setProperties] = useState(mockProperties)
  const [showSuccessNotification, setShowSuccessNotification] = useState(false)

  // Check for success parameter in URL (for add/edit redirects)
  useEffect(() => {
    const success = searchParams.get('success')
    if (success === 'true') {
      toast({
        title: "Success!",
        description: "Your property has been saved successfully.",
        variant: "default",
      })
    }
  }, [searchParams])

  // Filter properties based on search and filters
  const filteredProperties = properties.filter((property) => {
    const matchesSearch = 
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || property.status === statusFilter
    const matchesType = typeFilter === "all" || property.type === typeFilter
    
    return matchesSearch && matchesStatus && matchesType
  })

  // Delete property handler
  const handleDeleteProperty = (id: string) => {
    setProperties(properties.filter(property => property.id !== id))
    toast({
      title: "Property deleted",
      description: "The property has been removed from your listings.",
      variant: "destructive",
    })
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
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Building className="h-4 w-4 text-gray-500" />
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px]">
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
          </div>
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

      {filteredProperties.length === 0 ? (
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
                  src={property.image}
                  alt={property.title}
                  className="h-48 w-full object-cover"
                />
                <Badge
                  className={`absolute right-2 top-2 ${
                    property.status === "active"
                      ? "bg-green-500"
                      : property.status === "pending"
                      ? "bg-orange-500"
                      : "bg-blue-500"
                  }`}
                >
                  {property.status === "active"
                    ? "Active"
                    : property.status === "pending"
                    ? "Pending"
                    : "Completed"}
                </Badge>
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
                              This will permanently delete this property listing. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteProperty(property.id)}
                              className="bg-red-500 hover:bg-red-600"
                            >
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
                  <p className="font-medium">{property.formattedPrice}</p>
                  {property.status === "active" && (
                    <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50">
                      Leased
                    </Badge>
                  )}
                </div>
                {property.status === "active" && (
                  <div className="mt-2 text-sm">
                    <p className="text-gray-500">
                      Tenant: <span className="text-gray-700">{property.tenantName}</span>
                    </p>
                    <p className="text-gray-500">
                      Lease ends:{" "}
                      <span className="text-gray-700">
                        {new Date(property.leaseEnd).toLocaleDateString()}
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
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tenant</TableHead>
                <TableHead>Lease Ends</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProperties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <img
                        src={property.image}
                        alt={property.title}
                        className="h-10 w-10 rounded-md object-cover"
                      />
                      <span>{property.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{property.location}</TableCell>
                  <TableCell>{property.formattedPrice}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        property.status === "active"
                          ? "bg-green-500"
                          : property.status === "pending"
                          ? "bg-orange-500"
                          : "bg-blue-500"
                      }
                    >
                      {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{property.tenantName || "-"}</TableCell>
                  <TableCell>
                    {property.leaseEnd
                      ? new Date(property.leaseEnd).toLocaleDateString()
                      : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/dashboard/landlord/properties/${property.id}/edit`}>
                        <Button size="icon" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="icon" variant="ghost">
                            <Trash className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete this property listing. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteProperty(property.id)}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      <Link href={`/dashboard/landlord/properties/${property.id}`}>
                        <Button size="icon" variant="ghost">
                          <ArrowLeft className="h-4 w-4 rotate-180" />
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
} 