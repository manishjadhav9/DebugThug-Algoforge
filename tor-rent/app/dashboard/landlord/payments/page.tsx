"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Calendar,
  CreditCard, 
  Download, 
  Search,
  SlidersHorizontal, 
  User,
  Wallet,
  ArrowUp,
  ArrowDown,
  FileText,
  CheckCircle,
  AlertCircle,
  Clock
} from "lucide-react"
import { DateRangePicker } from "@/components/date-range-picker"

// Mock payment data
const mockPayments = [
  {
    id: "payment-1",
    tenantId: "tenant-1",
    tenantName: "Priya Kumar",
    tenantAvatar: "/avatars/priya.jpg",
    tenantAvatarFallback: "PK",
    propertyId: "prop-1",
    propertyName: "Luxury Villa with Pool",
    amount: "₹1,25,000",
    numericAmount: 125000,
    dueDate: "2024-03-01",
    paidDate: "2024-03-01",
    status: "completed" as const,
    paymentMethod: "bank" as const,
    transactionId: "TXN123456789",
    invoiceNumber: "INV-2024-001",
  },
  {
    id: "payment-2",
    tenantId: "tenant-2",
    tenantName: "Amit Bhatt",
    tenantAvatar: "/avatars/amit.jpg",
    tenantAvatarFallback: "AB",
    propertyId: "prop-2",
    propertyName: "Modern 3BHK Apartment",
    amount: "₹65,000",
    numericAmount: 65000,
    dueDate: "2024-03-05",
    paidDate: "2024-03-02",
    status: "completed" as const,
    paymentMethod: "crypto" as const,
    transactionId: "0x1a2b3c4d5e6f7g8h9i0j",
    invoiceNumber: "INV-2024-002",
  },
  {
    id: "payment-3",
    tenantId: "tenant-3",
    tenantName: "Vikram Gupta",
    tenantAvatar: "/avatars/vikram.jpg",
    tenantAvatarFallback: "VG",
    propertyId: "prop-3",
    propertyName: "Spacious Office Space",
    amount: "₹85,000",
    numericAmount: 85000,
    dueDate: "2024-02-28",
    paidDate: null,
    status: "overdue" as const,
    paymentMethod: null,
    transactionId: null,
    invoiceNumber: "INV-2024-003",
  },
  {
    id: "payment-4",
    tenantId: "tenant-4",
    tenantName: "Neha Sharma",
    tenantAvatar: "/avatars/neha.jpg",
    tenantAvatarFallback: "NS",
    propertyId: "prop-4",
    propertyName: "Cozy 2BHK with Balcony",
    amount: "₹45,000",
    numericAmount: 45000,
    dueDate: "2024-03-01",
    paidDate: "2024-03-01",
    status: "completed" as const,
    paymentMethod: "card" as const,
    transactionId: "CCT987654321",
    invoiceNumber: "INV-2024-004",
  },
  {
    id: "payment-5",
    tenantId: "tenant-5",
    tenantName: "Arjun Kapoor",
    tenantAvatar: "/avatars/arjun.jpg",
    tenantAvatarFallback: "AK",
    propertyId: "prop-5",
    propertyName: "Retail Shop in Mall",
    amount: "₹1,20,000",
    numericAmount: 120000,
    dueDate: "2024-03-31",
    paidDate: null,
    status: "pending" as const,
    paymentMethod: null,
    transactionId: null,
    invoiceNumber: "INV-2024-005",
  },
  {
    id: "payment-6",
    tenantId: "tenant-1",
    tenantName: "Priya Kumar",
    tenantAvatar: "/avatars/priya.jpg",
    tenantAvatarFallback: "PK",
    propertyId: "prop-1",
    propertyName: "Luxury Villa with Pool",
    amount: "₹1,25,000",
    numericAmount: 125000,
    dueDate: "2024-02-01",
    paidDate: "2024-02-05",
    status: "completed" as const,
    paymentMethod: "bank" as const,
    transactionId: "TXN123456788",
    invoiceNumber: "INV-2024-006",
  },
  {
    id: "payment-7",
    tenantId: "tenant-2",
    tenantName: "Amit Bhatt",
    tenantAvatar: "/avatars/amit.jpg",
    tenantAvatarFallback: "AB",
    propertyId: "prop-2",
    propertyName: "Modern 3BHK Apartment",
    amount: "₹65,000",
    numericAmount: 65000,
    dueDate: "2024-04-05",
    paidDate: null,
    status: "upcoming" as const,
    paymentMethod: null,
    transactionId: null,
    invoiceNumber: "INV-2024-007",
  },
]

export default function LandlordPaymentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentTab, setCurrentTab] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [propertyFilter, setPropertyFilter] = useState("all")
  const [sortField, setSortField] = useState<string | null>("dueDate")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  
  // Unique list of properties for filter
  const properties = Array.from(
    new Set(mockPayments.map((payment) => payment.propertyName))
  ).map((name) => ({
    id: mockPayments.find((p) => p.propertyName === name)?.propertyId || "",
    name,
  }))

  // Filter payments based on search, tab, and filters
  const filteredPayments = mockPayments.filter((payment) => {
    const matchesSearch =
      payment.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesTab = 
      currentTab === "all" || 
      (currentTab === "completed" && payment.status === "completed") ||
      (currentTab === "pending" && payment.status === "pending") ||
      (currentTab === "overdue" && payment.status === "overdue") ||
      (currentTab === "upcoming" && payment.status === "upcoming")
    
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter
    const matchesProperty = propertyFilter === "all" || payment.propertyId === propertyFilter
    
    return matchesSearch && matchesTab && matchesStatus && matchesProperty
  })

  // Sort payments
  const sortedPayments = [...filteredPayments].sort((a, b) => {
    if (!sortField) return 0

    let comparison = 0
    
    if (sortField === "amount") {
      comparison = a.numericAmount - b.numericAmount
    } else if (sortField === "dueDate") {
      comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    } else if (sortField === "paidDate") {
      // Handle null paidDate values
      if (!a.paidDate && !b.paidDate) comparison = 0
      else if (!a.paidDate) comparison = 1 // null values come last
      else if (!b.paidDate) comparison = -1
      else comparison = new Date(a.paidDate).getTime() - new Date(b.paidDate).getTime()
    } else if (sortField === "tenant") {
      comparison = a.tenantName.localeCompare(b.tenantName)
    } else if (sortField === "property") {
      comparison = a.propertyName.localeCompare(b.propertyName)
    }

    return sortDirection === "asc" ? comparison : -comparison
  })

  // Calculate summary statistics
  const totalReceived = mockPayments
    .filter(p => p.status === "completed")
    .reduce((sum, payment) => sum + payment.numericAmount, 0)
  
  const pendingAmount = mockPayments
    .filter(p => p.status === "pending" || p.status === "overdue")
    .reduce((sum, payment) => sum + payment.numericAmount, 0)
  
  const overdueCount = mockPayments.filter(p => p.status === "overdue").length

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
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-"
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Get status styling
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "completed":
        return {
          bg: "bg-green-500",
          icon: <CheckCircle className="h-4 w-4 mr-1" />,
          label: "Completed"
        }
      case "pending":
        return {
          bg: "bg-orange-500",
          icon: <Clock className="h-4 w-4 mr-1" />,
          label: "Pending"
        }
      case "overdue":
        return {
          bg: "bg-red-500",
          icon: <AlertCircle className="h-4 w-4 mr-1" />,
          label: "Overdue"
        }
      case "upcoming":
        return {
          bg: "bg-blue-500",
          icon: <Calendar className="h-4 w-4 mr-1" />,
          label: "Upcoming"
        }
      default:
        return {
          bg: "bg-gray-500",
          icon: null,
          label: status.charAt(0).toUpperCase() + status.slice(1)
        }
    }
  }

  return (
    <div className="p-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Payments</h1>
          <p className="text-gray-500">Manage and track all rental payments</p>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600">
          <Download className="mr-2 h-4 w-4" /> Export Statement
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-green-100 p-3">
                <Wallet className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Received</p>
                <p className="text-2xl font-bold">₹{totalReceived.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-orange-100 p-3">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Pending Amount</p>
                <p className="text-2xl font-bold">₹{pendingAmount.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-red-100 p-3">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Overdue Payments</p>
                <p className="text-2xl font-bold">{overdueCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6">
        <div className="grid gap-4 md:grid-cols-[1fr_auto]">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search by tenant, property, or invoice number..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden md:inline">Date Range</span>
              <span className="md:hidden">Date</span>
            </Button>
            <div>
              <Button variant="outline" className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                <span className="hidden md:inline">More Filters</span>
                <span className="md:hidden">Filter</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full sm:w-auto">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="overdue">Overdue</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
              </SelectContent>
            </Select>
            <Select value={propertyFilter} onValueChange={setPropertyFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Property" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Properties</SelectItem>
                {properties.map((property) => (
                  <SelectItem key={property.id} value={property.id}>
                    {property.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {sortedPayments.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Wallet className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No payments found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || statusFilter !== "all" || propertyFilter !== "all"
                ? "Try adjusting your search or filters"
                : "You don't have any payments in this category yet"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("tenant")}
                >
                  Tenant
                  {sortField === "tenant" && (
                    <span className="ml-2">
                      {sortDirection === "asc" ? <ArrowUp className="h-4 w-4 inline" /> : <ArrowDown className="h-4 w-4 inline" />}
                    </span>
                  )}
                </TableHead>
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
                <TableHead>Invoice</TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("amount")}
                >
                  Amount
                  {sortField === "amount" && (
                    <span className="ml-2">
                      {sortDirection === "asc" ? <ArrowUp className="h-4 w-4 inline" /> : <ArrowDown className="h-4 w-4 inline" />}
                    </span>
                  )}
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("dueDate")}
                >
                  Due Date
                  {sortField === "dueDate" && (
                    <span className="ml-2">
                      {sortDirection === "asc" ? <ArrowUp className="h-4 w-4 inline" /> : <ArrowDown className="h-4 w-4 inline" />}
                    </span>
                  )}
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("paidDate")}
                >
                  Paid Date
                  {sortField === "paidDate" && (
                    <span className="ml-2">
                      {sortDirection === "asc" ? <ArrowUp className="h-4 w-4 inline" /> : <ArrowDown className="h-4 w-4 inline" />}
                    </span>
                  )}
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Method</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedPayments.map((payment) => {
                const statusStyle = getStatusStyles(payment.status)
                
                return (
                  <TableRow key={payment.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={payment.tenantAvatar} alt={payment.tenantName} />
                          <AvatarFallback>{payment.tenantAvatarFallback}</AvatarFallback>
                        </Avatar>
                        <span className="whitespace-nowrap">{payment.tenantName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Link 
                        href={`/dashboard/landlord/properties/${payment.propertyId}`}
                        className="text-orange-500 hover:underline whitespace-nowrap"
                      >
                        {payment.propertyName}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{payment.invoiceNumber}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{payment.amount}</span>
                    </TableCell>
                    <TableCell>
                      <span className="whitespace-nowrap">{formatDate(payment.dueDate)}</span>
                    </TableCell>
                    <TableCell>
                      <span className="whitespace-nowrap">{formatDate(payment.paidDate)}</span>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusStyle.bg}>
                        <span className="flex items-center">
                          {statusStyle.icon}
                          {statusStyle.label}
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {payment.paymentMethod ? (
                        <Badge variant="outline">
                          {payment.paymentMethod === "bank" && (
                            <span className="flex items-center">
                              <Wallet className="h-3 w-3 mr-1" /> Bank
                            </span>
                          )}
                          {payment.paymentMethod === "card" && (
                            <span className="flex items-center">
                              <CreditCard className="h-3 w-3 mr-1" /> Card
                            </span>
                          )}
                          {payment.paymentMethod === "crypto" && (
                            <span className="flex items-center">
                              <svg 
                                className="h-3 w-3 mr-1" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                              >
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="16" />
                                <line x1="8" y1="12" x2="16" y2="12" />
                              </svg>
                              Crypto
                            </span>
                          )}
                        </Badge>
                      ) : (
                        <span>-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/dashboard/landlord/payments/${payment.id}/details`}>
                          <Button size="sm" variant="ghost">
                            <FileText className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/dashboard/messages?tenant=${payment.tenantId}`}>
                          <Button size="sm" variant="ghost">
                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                            </svg>
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
} 