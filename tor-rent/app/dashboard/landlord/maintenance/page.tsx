"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
  AlertTriangle,
  Building, 
  Search,
  Wrench,
  MessageCircle, 
  Calendar,
  CheckCircle,
  Clock
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

// Mock maintenance issues
const mockIssues = [
  {
    id: "issue-1",
    propertyId: "prop-1",
    propertyName: "Luxury Villa with Pool",
    tenantId: "tenant-1",
    tenantName: "Priya Kumar",
    tenantAvatar: "/avatars/priya.jpg",
    tenantAvatarFallback: "PK",
    title: "AC not working",
    description: "The AC in the master bedroom is not cooling properly and making strange noises when switched on.",
    priority: "high" as const,
    status: "reported" as const,
    reportedDate: "2024-03-10",
    images: [
      "/images/maintenance/ac-issue-1.jpg",
      "/images/maintenance/ac-issue-2.jpg"
    ],
    replies: [
      {
        id: "reply-1",
        sender: "landlord",
        message: "I'll send a technician tomorrow to check the AC. Please be available between 10 AM and 12 PM.",
        timestamp: "2024-03-11T10:30:00",
      }
    ]
  },
  {
    id: "issue-2",
    propertyId: "prop-1",
    propertyName: "Luxury Villa with Pool",
    tenantId: "tenant-1",
    tenantName: "Priya Kumar",
    tenantAvatar: "/avatars/priya.jpg",
    tenantAvatarFallback: "PK",
    title: "Water leakage in kitchen",
    description: "There's water leaking from the sink pipe in the kitchen. The cabinet below is getting damaged.",
    priority: "medium" as const,
    status: "inProgress" as const,
    reportedDate: "2024-03-08",
    scheduledDate: "2024-03-12",
    images: [
      "/images/maintenance/sink-leak-1.jpg"
    ],
    replies: [
      {
        id: "reply-1",
        sender: "landlord",
        message: "I've scheduled a plumber to visit on March 12th. Please be available.",
        timestamp: "2024-03-09T14:20:00",
      },
      {
        id: "reply-2",
        sender: "tenant",
        message: "Thank you. I'll be available after 2 PM on that day.",
        timestamp: "2024-03-09T15:45:00",
      }
    ]
  },
  {
    id: "issue-3",
    propertyId: "prop-2",
    propertyName: "Modern 3BHK Apartment",
    tenantId: "tenant-2",
    tenantName: "Amit Bhatt",
    tenantAvatar: "/avatars/amit.jpg",
    tenantAvatarFallback: "AB",
    title: "Bathroom door not closing properly",
    description: "The master bathroom door doesn't latch properly and keeps opening on its own.",
    priority: "low" as const,
    status: "resolved" as const,
    reportedDate: "2024-02-25",
    resolvedDate: "2024-03-02",
    images: [],
    replies: [
      {
        id: "reply-1",
        sender: "landlord",
        message: "I'll send someone to fix it this weekend.",
        timestamp: "2024-02-26T09:15:00",
      },
      {
        id: "reply-2",
        sender: "landlord",
        message: "The carpenter has fixed the door. Please confirm if it's working properly now.",
        timestamp: "2024-03-02T18:30:00",
      },
      {
        id: "reply-3",
        sender: "tenant",
        message: "Yes, it's working fine now. Thank you!",
        timestamp: "2024-03-02T19:45:00",
      }
    ]
  },
  {
    id: "issue-4",
    propertyId: "prop-3",
    propertyName: "Spacious Office Space",
    tenantId: "tenant-3",
    tenantName: "Vikram Gupta",
    tenantAvatar: "/avatars/vikram.jpg",
    tenantAvatarFallback: "VG",
    title: "Electrical outlets not working",
    description: "Three electrical outlets in the main conference room are not working. We need them urgently for our client presentations.",
    priority: "high" as const,
    status: "inProgress" as const,
    reportedDate: "2024-03-09",
    scheduledDate: "2024-03-11",
    images: [
      "/images/maintenance/outlet-issue.jpg"
    ],
    replies: []
  },
  {
    id: "issue-5",
    propertyId: "prop-4",
    propertyName: "Cozy 2BHK with Balcony",
    tenantId: "tenant-4",
    tenantName: "Neha Sharma",
    tenantAvatar: "/avatars/neha.jpg",
    tenantAvatarFallback: "NS",
    title: "Balcony railing loose",
    description: "The railing on the balcony is loose and feels unsafe. This is a safety issue, especially since we have a small child.",
    priority: "high" as const,
    status: "reported" as const,
    reportedDate: "2024-03-11",
    images: [
      "/images/maintenance/railing-issue-1.jpg",
      "/images/maintenance/railing-issue-2.jpg"
    ],
    replies: []
  },
]

export default function LandlordMaintenancePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentTab, setCurrentTab] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [propertyFilter, setPropertyFilter] = useState("all")
  const [selectedIssue, setSelectedIssue] = useState<typeof mockIssues[0] | null>(null)
  const [replyText, setReplyText] = useState("")
  const [newStatus, setNewStatus] = useState<string>("")
  
  // Derive unique properties for the filter
  const properties = Array.from(
    new Set(mockIssues.map((issue) => issue.propertyName))
  ).map((name) => ({
    id: mockIssues.find((i) => i.propertyName === name)?.propertyId || "",
    name,
  }))

  // Filter issues
  const filteredIssues = mockIssues.filter((issue) => {
    const matchesSearch =
      issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.propertyName.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesTab = 
      currentTab === "all" || 
      (currentTab === "reported" && issue.status === "reported") ||
      (currentTab === "inProgress" && issue.status === "inProgress") ||
      (currentTab === "resolved" && issue.status === "resolved")
    
    const matchesStatus = statusFilter === "all" || issue.status === statusFilter
    const matchesPriority = priorityFilter === "all" || issue.priority === priorityFilter
    const matchesProperty = propertyFilter === "all" || issue.propertyId === propertyFilter
    
    return matchesSearch && matchesTab && matchesStatus && matchesPriority && matchesProperty
  })

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Get priority styling
  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case "high":
        return {
          bg: "bg-red-500",
          label: "High"
        }
      case "medium":
        return {
          bg: "bg-orange-500",
          label: "Medium"
        }
      case "low":
        return {
          bg: "bg-green-500",
          label: "Low"
        }
      default:
        return {
          bg: "bg-gray-500",
          label: priority
        }
    }
  }

  // Get status styling
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "reported":
        return {
          bg: "bg-red-500",
          icon: <AlertTriangle className="h-4 w-4 mr-1" />,
          label: "Reported"
        }
      case "inProgress":
        return {
          bg: "bg-orange-500",
          icon: <Clock className="h-4 w-4 mr-1" />,
          label: "In Progress"
        }
      case "resolved":
        return {
          bg: "bg-green-500",
          icon: <CheckCircle className="h-4 w-4 mr-1" />,
          label: "Resolved"
        }
      default:
        return {
          bg: "bg-gray-500",
          icon: null,
          label: status.charAt(0).toUpperCase() + status.slice(1)
        }
    }
  }

  // Calculate summary statistics
  const reportedCount = mockIssues.filter(i => i.status === "reported").length
  const inProgressCount = mockIssues.filter(i => i.status === "inProgress").length
  const resolvedCount = mockIssues.filter(i => i.status === "resolved").length
  const highPriorityCount = mockIssues.filter(i => i.priority === "high" && i.status !== "resolved").length

  // Handle reply submission
  const handleReplySubmit = () => {
    // In a real app, this would send the reply to the backend
    console.log("Reply:", replyText)
    console.log("To issue:", selectedIssue?.id)
    
    // Reset form
    setReplyText("")
    
    // If status was updated
    if (newStatus && newStatus !== selectedIssue?.status) {
      console.log("Updating status from", selectedIssue?.status, "to", newStatus)
      setNewStatus("")
    }
  }

  return (
    <div className="p-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Maintenance Issues</h1>
          <p className="text-gray-500">Manage and track property maintenance requests</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-red-100 p-3">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Reported</p>
                <p className="text-2xl font-bold">{reportedCount}</p>
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
                <p className="text-sm font-medium text-gray-500">In Progress</p>
                <p className="text-2xl font-bold">{inProgressCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Resolved</p>
                <p className="text-2xl font-bold">{resolvedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-red-100 p-3">
                <Wrench className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">High Priority</p>
                <p className="text-2xl font-bold">{highPriorityCount}</p>
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
              placeholder="Search issues by title, description, tenant or property..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
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

      <div className="space-y-4 mb-6">
        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList>
            <TabsTrigger value="all">All Issues</TabsTrigger>
            <TabsTrigger value="reported">Reported</TabsTrigger>
            <TabsTrigger value="inProgress">In Progress</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {filteredIssues.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Wrench className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No maintenance issues found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || statusFilter !== "all" || priorityFilter !== "all" || propertyFilter !== "all"
                ? "Try adjusting your search or filters"
                : "You don't have any maintenance issues in this category yet"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Issue</TableHead>
                <TableHead>Property</TableHead>
                <TableHead>Tenant</TableHead>
                <TableHead>Reported On</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredIssues.map((issue) => {
                const priorityStyle = getPriorityStyles(issue.priority)
                const statusStyle = getStatusStyles(issue.status)
                
                return (
                  <TableRow key={issue.id}>
                    <TableCell>
                      <div className="font-medium">{issue.title}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {issue.description}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Link 
                        href={`/dashboard/landlord/properties/${issue.propertyId}`}
                        className="text-orange-500 hover:underline"
                      >
                        {issue.propertyName}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={issue.tenantAvatar} alt={issue.tenantName} />
                          <AvatarFallback>{issue.tenantAvatarFallback}</AvatarFallback>
                        </Avatar>
                        <span>{issue.tenantName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="whitespace-nowrap">{formatDate(issue.reportedDate)}</span>
                    </TableCell>
                    <TableCell>
                      <Badge className={priorityStyle.bg}>
                        {priorityStyle.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusStyle.bg}>
                        <span className="flex items-center">
                          {statusStyle.icon}
                          {statusStyle.label}
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setSelectedIssue(issue)
                                setNewStatus(issue.status)
                              }}
                            >
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl">
                            {selectedIssue && (
                              <>
                                <DialogHeader>
                                  <div className="flex items-center justify-between">
                                    <DialogTitle className="text-xl">{selectedIssue.title}</DialogTitle>
                                    <div className="flex items-center gap-2">
                                      <Badge className={getPriorityStyles(selectedIssue.priority).bg}>
                                        {getPriorityStyles(selectedIssue.priority).label} Priority
                                      </Badge>
                                      <Badge className={getStatusStyles(selectedIssue.status).bg}>
                                        <span className="flex items-center">
                                          {getStatusStyles(selectedIssue.status).icon}
                                          {getStatusStyles(selectedIssue.status).label}
                                        </span>
                                      </Badge>
                                    </div>
                                  </div>
                                  <DialogDescription>
                                    Reported by {selectedIssue.tenantName} on {formatDate(selectedIssue.reportedDate)}
                                  </DialogDescription>
                                </DialogHeader>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
                                  <div className="md:col-span-2 space-y-4">
                                    <div className="rounded-md border p-4 bg-gray-50">
                                      <p className="text-gray-700">{selectedIssue.description}</p>
                                    </div>

                                    {selectedIssue.images.length > 0 && (
                                      <div>
                                        <h3 className="text-sm font-medium text-gray-500 mb-2">Images</h3>
                                        <div className="grid grid-cols-2 gap-2">
                                          {selectedIssue.images.map((image, index) => (
                                            <div key={index} className="aspect-video relative rounded-md overflow-hidden border">
                                              <img 
                                                src={image} 
                                                alt={`Issue ${index + 1}`} 
                                                className="w-full h-full object-cover"
                                              />
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}

                                    {selectedIssue.replies.length > 0 && (
                                      <div>
                                        <h3 className="text-sm font-medium text-gray-500 mb-2">Communication History</h3>
                                        <div className="space-y-3">
                                          {selectedIssue.replies.map((reply) => (
                                            <div 
                                              key={reply.id}
                                              className={`p-3 rounded-lg ${
                                                reply.sender === "landlord" 
                                                  ? "bg-orange-50 border border-orange-100 ml-8" 
                                                  : "bg-gray-50 border border-gray-100 mr-8"
                                              }`}
                                            >
                                              <div className="flex justify-between items-center mb-1">
                                                <span className="text-sm font-medium">
                                                  {reply.sender === "landlord" ? "You" : selectedIssue.tenantName}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                  {formatTimestamp(reply.timestamp)}
                                                </span>
                                              </div>
                                              <p className="text-gray-700">{reply.message}</p>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}

                                    <div className="pt-4">
                                      <h3 className="text-sm font-medium text-gray-500 mb-2">Add Reply</h3>
                                      <div className="space-y-3">
                                        <Textarea 
                                          placeholder="Type your reply here..." 
                                          value={replyText}
                                          onChange={(e) => setReplyText(e.target.value)}
                                          className="h-24"
                                        />
                                        <div className="flex justify-between items-center">
                                          <Select value={newStatus} onValueChange={setNewStatus}>
                                            <SelectTrigger className="w-[180px]">
                                              <SelectValue placeholder="Update status..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="reported">Reported</SelectItem>
                                              <SelectItem value="inProgress">Mark as In Progress</SelectItem>
                                              <SelectItem value="resolved">Mark as Resolved</SelectItem>
                                            </SelectContent>
                                          </Select>
                                          <Button 
                                            className="bg-orange-500 hover:bg-orange-600"
                                            onClick={handleReplySubmit}
                                            disabled={!replyText.trim()}
                                          >
                                            Send Reply
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="space-y-6">
                                    <div className="rounded-md border p-4">
                                      <h3 className="text-sm font-medium text-gray-500 mb-2">Property Details</h3>
                                      <div className="space-y-2">
                                        <div className="flex items-center">
                                          <Building className="h-4 w-4 text-gray-500 mr-2" />
                                          <Link 
                                            href={`/dashboard/landlord/properties/${selectedIssue.propertyId}`}
                                            className="text-orange-500 hover:underline"
                                          >
                                            {selectedIssue.propertyName}
                                          </Link>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="rounded-md border p-4">
                                      <h3 className="text-sm font-medium text-gray-500 mb-2">Tenant Details</h3>
                                      <div className="flex items-center gap-3 mb-3">
                                        <Avatar>
                                          <AvatarImage src={selectedIssue.tenantAvatar} alt={selectedIssue.tenantName} />
                                          <AvatarFallback>{selectedIssue.tenantAvatarFallback}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                          <p className="font-medium">{selectedIssue.tenantName}</p>
                                        </div>
                                      </div>
                                      <Link href={`/dashboard/messages?tenant=${selectedIssue.tenantId}`}>
                                        <Button className="w-full" variant="outline">
                                          <MessageCircle className="mr-2 h-4 w-4" />
                                          Message Tenant
                                        </Button>
                                      </Link>
                                    </div>

                                    {selectedIssue.status === "inProgress" && selectedIssue.scheduledDate && (
                                      <div className="rounded-md border p-4 bg-orange-50">
                                        <h3 className="text-sm font-medium text-gray-500 mb-2">Service Visit</h3>
                                        <div className="flex items-center">
                                          <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                                          <span>Scheduled for {formatDate(selectedIssue.scheduledDate)}</span>
                                        </div>
                                      </div>
                                    )}

                                    {selectedIssue.status === "resolved" && selectedIssue.resolvedDate && (
                                      <div className="rounded-md border p-4 bg-green-50">
                                        <h3 className="text-sm font-medium text-gray-500 mb-2">Resolution</h3>
                                        <div className="flex items-center">
                                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                          <span>Resolved on {formatDate(selectedIssue.resolvedDate)}</span>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <DialogFooter>
                                  <Button
                                    variant="outline"
                                    onClick={() => {
                                      setSelectedIssue(null)
                                      setReplyText("")
                                    }}
                                  >
                                    Close
                                  </Button>
                                </DialogFooter>
                              </>
                            )}
                          </DialogContent>
                        </Dialog>
                        
                        <Link href={`/dashboard/messages?tenant=${issue.tenantId}`}>
                          <Button variant="ghost" size="sm">
                            <MessageCircle className="h-4 w-4" />
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