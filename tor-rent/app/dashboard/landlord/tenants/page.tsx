"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Phone, Mail, MapPin, Calendar, User, Search, MessageCircle, FileText, ArrowUp, ArrowDown } from "lucide-react"
import { AssuranceMeter } from "@/components/assurance-meter"

// Mock tenant data
const mockTenants = [
  {
    id: "tenant-1",
    name: "Priya Kumar",
    email: "priya.kumar@example.com",
    phone: "+91 98765 43210",
    avatar: "/avatars/priya.jpg",
    avatarFallback: "PK",
    property: "Luxury Villa with Pool",
    propertyId: "prop-1",
    leaseStart: "2023-12-31",
    leaseEnd: "2024-12-31",
    rentAmount: "₹1,25,000/month",
    credScore: 95,
    paymentStatus: "on_time" as const,
    documents: ["lease_agreement", "id_proof", "employment_proof"],
    lastPaymentDate: "2024-03-01",
    lastPaymentAmount: "₹1,25,000",
  },
  {
    id: "tenant-2",
    name: "Amit Bhatt",
    email: "amit.bhatt@example.com",
    phone: "+91 98123 45678",
    avatar: "/avatars/amit.jpg",
    avatarFallback: "AB",
    property: "Modern 3BHK Apartment",
    propertyId: "prop-2",
    leaseStart: "2023-08-15",
    leaseEnd: "2024-08-15",
    rentAmount: "₹65,000/month",
    credScore: 88,
    paymentStatus: "on_time" as const,
    documents: ["lease_agreement", "id_proof"],
    lastPaymentDate: "2024-03-02",
    lastPaymentAmount: "₹65,000",
  },
  {
    id: "tenant-3",
    name: "Vikram Gupta",
    email: "vikram.gupta@example.com",
    phone: "+91 87654 32109",
    avatar: "/avatars/vikram.jpg",
    avatarFallback: "VG",
    property: "Spacious Office Space",
    propertyId: "prop-3",
    leaseStart: "2023-10-01",
    leaseEnd: "2024-10-01",
    rentAmount: "₹85,000/month",
    credScore: 76,
    paymentStatus: "overdue" as const,
    documents: ["lease_agreement", "id_proof", "business_registration"],
    lastPaymentDate: "2024-02-05",
    lastPaymentAmount: "₹85,000",
  },
  {
    id: "tenant-4",
    name: "Neha Sharma",
    email: "neha.sharma@example.com",
    phone: "+91 76543 21098",
    avatar: "/avatars/neha.jpg",
    avatarFallback: "NS",
    property: "Cozy 2BHK with Balcony",
    propertyId: "prop-4",
    leaseStart: "2023-06-30",
    leaseEnd: "2024-06-30",
    rentAmount: "₹45,000/month",
    credScore: 92,
    paymentStatus: "on_time" as const,
    documents: ["lease_agreement", "id_proof", "employment_proof"],
    lastPaymentDate: "2024-03-01",
    lastPaymentAmount: "₹45,000",
  },
  {
    id: "tenant-5",
    name: "Arjun Kapoor",
    email: "arjun.kapoor@example.com",
    phone: "+91 65432 10987",
    avatar: "/avatars/arjun.jpg",
    avatarFallback: "AK",
    property: "Retail Shop in Mall",
    propertyId: "prop-5",
    leaseStart: "2023-03-31",
    leaseEnd: "2025-03-31",
    rentAmount: "₹1,20,000/month",
    credScore: 84,
    paymentStatus: "late" as const,
    documents: ["lease_agreement", "id_proof", "business_registration"],
    lastPaymentDate: "2024-02-25",
    lastPaymentAmount: "₹1,20,000",
  },
]

export default function LandlordTenantsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [selectedTenant, setSelectedTenant] = useState<typeof mockTenants[0] | null>(null)
  const [currentTab, setCurrentTab] = useState("all")

  // Filter tenants based on search term
  const filteredTenants = mockTenants.filter((tenant) => {
    const matchesSearch =
      tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.property.toLowerCase().includes(searchTerm.toLowerCase())

    if (currentTab === "all") return matchesSearch
    if (currentTab === "on_time") return matchesSearch && tenant.paymentStatus === "on_time"
    if (currentTab === "late") return matchesSearch && tenant.paymentStatus === "late"
    if (currentTab === "overdue") return matchesSearch && tenant.paymentStatus === "overdue"
    
    return matchesSearch
  })

  // Sort tenants
  const sortedTenants = [...filteredTenants].sort((a, b) => {
    if (!sortField) return 0

    let comparison = 0
    
    if (sortField === "name") {
      comparison = a.name.localeCompare(b.name)
    } else if (sortField === "property") {
      comparison = a.property.localeCompare(b.property)
    } else if (sortField === "credScore") {
      comparison = a.credScore - b.credScore
    } else if (sortField === "leaseEnd") {
      comparison = new Date(a.leaseEnd).getTime() - new Date(b.leaseEnd).getTime()
    }

    return sortDirection === "asc" ? comparison : -comparison
  })

  // Handle sort
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="p-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-6">
        <div>
          <h1 className="text-2xl font-bold">My Tenants</h1>
          <p className="text-gray-500">Manage and view your tenant relationships</p>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search tenants by name, email, or property..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs value={currentTab} onValueChange={setCurrentTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Tenants</TabsTrigger>
          <TabsTrigger value="on_time">On Time Payments</TabsTrigger>
          <TabsTrigger value="late">Late Payments</TabsTrigger>
          <TabsTrigger value="overdue">Overdue Payments</TabsTrigger>
        </TabsList>
      </Tabs>

      {sortedTenants.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No tenants found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm
                ? "Try adjusting your search"
                : "You don't have any tenants in this category yet"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tenant</TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("property")}
                >
                  Property
                  {sortField === "property" && (
                    <span className="ml-2">
                      {sortDirection === "asc" ? <ArrowUp className="h-4 w-4 inline" /> : <ArrowDown className="h-4 w-4 inline" />}
                    </span>
                  )}
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("leaseEnd")}
                >
                  Lease End
                  {sortField === "leaseEnd" && (
                    <span className="ml-2">
                      {sortDirection === "asc" ? <ArrowUp className="h-4 w-4 inline" /> : <ArrowDown className="h-4 w-4 inline" />}
                    </span>
                  )}
                </TableHead>
                <TableHead>Rent</TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("credScore")}
                >
                  Cred Score
                  {sortField === "credScore" && (
                    <span className="ml-2">
                      {sortDirection === "asc" ? <ArrowUp className="h-4 w-4 inline" /> : <ArrowDown className="h-4 w-4 inline" />}
                    </span>
                  )}
                </TableHead>
                <TableHead>Payment Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedTenants.map((tenant) => (
                <TableRow key={tenant.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={tenant.avatar} alt={tenant.name} />
                        <AvatarFallback>{tenant.avatarFallback}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{tenant.name}</p>
                        <p className="text-sm text-gray-500">{tenant.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Link 
                      href={`/dashboard/landlord/properties/${tenant.propertyId}`}
                      className="text-orange-500 hover:underline"
                    >
                      {tenant.property}
                    </Link>
                  </TableCell>
                  <TableCell>{formatDate(tenant.leaseEnd)}</TableCell>
                  <TableCell>{tenant.rentAmount}</TableCell>
                  <TableCell>
                    <AssuranceMeter score={tenant.credScore} size="small" />
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        tenant.paymentStatus === "on_time"
                          ? "bg-green-500"
                          : tenant.paymentStatus === "late"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }
                    >
                      {tenant.paymentStatus === "on_time"
                        ? "On Time"
                        : tenant.paymentStatus === "late"
                        ? "Late"
                        : "Overdue"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedTenant(tenant)}
                          >
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          {selectedTenant && (
                            <>
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-3">
                                  <Avatar className="h-10 w-10">
                                    <AvatarImage src={selectedTenant.avatar} alt={selectedTenant.name} />
                                    <AvatarFallback>{selectedTenant.avatarFallback}</AvatarFallback>
                                  </Avatar>
                                  <span>{selectedTenant.name}</span>
                                </DialogTitle>
                                <DialogDescription>
                                  Tenant details and information
                                </DialogDescription>
                              </DialogHeader>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                                <div className="space-y-4">
                                  <div>
                                    <h3 className="text-sm font-medium text-gray-500">Contact Information</h3>
                                    <div className="mt-2 space-y-2">
                                      <div className="flex items-center">
                                        <Mail className="h-4 w-4 text-gray-500 mr-2" />
                                        <span>{selectedTenant.email}</span>
                                      </div>
                                      <div className="flex items-center">
                                        <Phone className="h-4 w-4 text-gray-500 mr-2" />
                                        <span>{selectedTenant.phone}</span>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <h3 className="text-sm font-medium text-gray-500">Rental Information</h3>
                                    <div className="mt-2 space-y-2">
                                      <div className="flex items-center">
                                        <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                                        <Link
                                          href={`/dashboard/landlord/properties/${selectedTenant.propertyId}`}
                                          className="text-orange-500 hover:underline"
                                        >
                                          {selectedTenant.property}
                                        </Link>
                                      </div>
                                      <div className="flex items-center">
                                        <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                                        <span>
                                          Lease: {formatDate(selectedTenant.leaseStart)} to{" "}
                                          {formatDate(selectedTenant.leaseEnd)}
                                        </span>
                                      </div>
                                      <div className="flex items-start">
                                        <FileText className="h-4 w-4 text-gray-500 mr-2 mt-0.5" />
                                        <div>
                                          <span className="block">Documents:</span>
                                          <ul className="list-disc ml-5 text-sm text-gray-600">
                                            {selectedTenant.documents.map((doc) => (
                                              <li key={doc}>
                                                {doc
                                                  .split("_")
                                                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                                  .join(" ")}
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="space-y-4">
                                  <div>
                                    <h3 className="text-sm font-medium text-gray-500">Payment Information</h3>
                                    <div className="mt-2 space-y-2">
                                      <div className="flex items-center justify-between">
                                        <span>Rent Amount:</span>
                                        <span className="font-medium">{selectedTenant.rentAmount}</span>
                                      </div>
                                      <div className="flex items-center justify-between">
                                        <span>Last Payment:</span>
                                        <span className="font-medium">{selectedTenant.lastPaymentDate}</span>
                                      </div>
                                      <div className="flex items-center justify-between">
                                        <span>Amount Paid:</span>
                                        <span className="font-medium">{selectedTenant.lastPaymentAmount}</span>
                                      </div>
                                      <div className="flex items-center justify-between">
                                        <span>Payment Status:</span>
                                        <Badge
                                          className={
                                            selectedTenant.paymentStatus === "on_time"
                                              ? "bg-green-500"
                                              : selectedTenant.paymentStatus === "late"
                                              ? "bg-yellow-500"
                                              : "bg-red-500"
                                          }
                                        >
                                          {selectedTenant.paymentStatus === "on_time"
                                            ? "On Time"
                                            : selectedTenant.paymentStatus === "late"
                                            ? "Late"
                                            : "Overdue"}
                                        </Badge>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <h3 className="text-sm font-medium text-gray-500">Trust Score</h3>
                                    <div className="mt-2">
                                      <div className="flex flex-col items-center">
                                        <AssuranceMeter score={selectedTenant.credScore} size="large" />
                                        <p className="text-sm text-gray-500 mt-2">
                                          {selectedTenant.credScore >= 90
                                            ? "Excellent tenant with consistent on-time payments"
                                            : selectedTenant.credScore >= 80
                                            ? "Good tenant with mostly reliable payments"
                                            : selectedTenant.credScore >= 70
                                            ? "Average tenant with some payment issues"
                                            : "Below average tenant with frequent payment issues"}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <DialogFooter>
                                <Link href={`/dashboard/messages?tenant=${selectedTenant.id}`}>
                                  <Button className="bg-orange-500 hover:bg-orange-600">
                                    <MessageCircle className="mr-2 h-4 w-4" />
                                    Message Tenant
                                  </Button>
                                </Link>
                              </DialogFooter>
                            </>
                          )}
                        </DialogContent>
                      </Dialog>
                      
                      <Link href={`/dashboard/messages?tenant=${tenant.id}`}>
                        <Button variant="ghost" size="sm">
                          <MessageCircle className="h-4 w-4" />
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