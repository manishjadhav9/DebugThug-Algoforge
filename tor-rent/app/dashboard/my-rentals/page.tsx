"use client"

import { useState } from "react"
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
import { AlertTriangle, Calendar, FileText, Home, MessageSquare, Star } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { IssueReportForm } from "@/components/issue-report-form"

// Static data for currently rented properties
const currentRentals = [
  {
    id: "1",
    title: "Modern Apartment",
    location: "Downtown, Seattle",
    price: "0.05 ETH/month",
    image: "/placeholder.svg?height=200&width=300",
    startDate: "January 15, 2025",
    endDate: "January 14, 2026",
    daysLeft: 298,
    owner: {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      credScore: 98,
      responseRate: "95%",
    },
    agreement: {
      id: "AGR-2025-0115-001",
      securityDeposit: "0.1 ETH",
      terms: "12 months",
      autoRenewal: true,
      nextPaymentDate: "April 15, 2025",
      nextPaymentAmount: "0.05 ETH",
    },
    issues: [
      {
        id: "ISS-001",
        title: "Plumbing issue in bathroom",
        description: "The sink in the master bathroom is leaking. Please send a plumber to fix it.",
        status: "in-progress",
        priority: "medium",
        reportedDate: "March 15, 2025",
        lastUpdated: "March 16, 2025",
        ownerResponse: "A plumber has been scheduled to visit on March 18 between 9am-12pm.",
      },
    ],
  },
  {
    id: "2",
    title: "Studio Loft",
    location: "Capitol Hill, Seattle",
    price: "0.03 ETH/month",
    image: "/placeholder.svg?height=200&width=300",
    startDate: "February 1, 2025",
    endDate: "July 31, 2025",
    daysLeft: 132,
    owner: {
      name: "Alex Thompson",
      avatar: "/placeholder.svg?height=40&width=40",
      credScore: 92,
      responseRate: "90%",
    },
    agreement: {
      id: "AGR-2025-0201-002",
      securityDeposit: "0.06 ETH",
      terms: "6 months",
      autoRenewal: false,
      nextPaymentDate: "April 1, 2025",
      nextPaymentAmount: "0.03 ETH",
    },
    issues: [],
  },
  {
    id: "3",
    title: "Cozy Townhouse",
    location: "Ballard, Seattle",
    price: "0.07 ETH/month",
    image: "/placeholder.svg?height=200&width=300",
    startDate: "March 1, 2025",
    endDate: "August 31, 2025",
    daysLeft: 163,
    owner: {
      name: "Robert Garcia",
      avatar: "/placeholder.svg?height=40&width=40",
      credScore: 95,
      responseRate: "98%",
    },
    agreement: {
      id: "AGR-2025-0301-003",
      securityDeposit: "0.14 ETH",
      terms: "6 months",
      autoRenewal: true,
      nextPaymentDate: "April 1, 2025",
      nextPaymentAmount: "0.07 ETH",
    },
    issues: [
      {
        id: "ISS-002",
        title: "Heating not working properly",
        description: "The heating system is not working in the living room. Temperature is very low.",
        status: "open",
        priority: "high",
        reportedDate: "March 20, 2025",
        lastUpdated: "March 20, 2025",
        ownerResponse: null,
      },
    ],
  },
]

// Static data for past rentals
const pastRentals = [
  {
    id: "4",
    title: "Downtown Condo",
    location: "Downtown, Seattle",
    price: "0.06 ETH/month",
    image: "/placeholder.svg?height=200&width=300",
    startDate: "October 1, 2024",
    endDate: "December 31, 2024",
    owner: {
      name: "Jennifer Lee",
      avatar: "/placeholder.svg?height=40&width=40",
      credScore: 96,
    },
    agreement: {
      id: "AGR-2024-1001-004",
      securityDeposit: "0.12 ETH",
      depositReturned: true,
      depositReturnDate: "January 5, 2025",
      depositReturnAmount: "0.1 ETH",
    },
    reviewSubmitted: true,
  },
  {
    id: "5",
    title: "Camera Equipment",
    location: "Item Rental",
    price: "0.01 ETH/week",
    image: "/placeholder.svg?height=200&width=300",
    startDate: "February 15, 2025",
    endDate: "February 22, 2025",
    owner: {
      name: "Michael Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      credScore: 94,
    },
    agreement: {
      id: "AGR-2025-0215-005",
      securityDeposit: "0.02 ETH",
      depositReturned: true,
      depositReturnDate: "February 23, 2025",
      depositReturnAmount: "0.02 ETH",
    },
    reviewSubmitted: false,
  },
]

export default function MyRentalsPage() {
  const [selectedRental, setSelectedRental] = useState(currentRentals[0])
  const [activeTab, setActiveTab] = useState("current")
  const [issueDialogOpen, setIssueDialogOpen] = useState(false)

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">My Rentals</h1>
          <p className="text-gray-500">Manage your current and past rental agreements</p>
        </div>

        <Tabs defaultValue="current" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 md:w-auto">
            <TabsTrigger value="current">Current Rentals</TabsTrigger>
            <TabsTrigger value="past">Past Rentals</TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="mt-6">
            {currentRentals.length > 0 ? (
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle>My Properties</CardTitle>
                      <CardDescription>Currently rented properties</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="divide-y">
                        {currentRentals.map((rental) => (
                          <div
                            key={rental.id}
                            className={`cursor-pointer p-4 hover:bg-gray-50 ${
                              selectedRental.id === rental.id ? "bg-orange-50" : ""
                            }`}
                            onClick={() => setSelectedRental(rental)}
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={rental.image || "/placeholder.svg"}
                                alt={rental.title}
                                className="h-16 w-16 rounded-md object-cover"
                              />
                              <div className="flex-1">
                                <h3 className="font-medium">{rental.title}</h3>
                                <p className="text-sm text-gray-500">{rental.location}</p>
                                <div className="mt-1 flex items-center justify-between">
                                  <span className="text-sm font-medium">{rental.price}</span>
                                  <Badge className="bg-green-500">Active</Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>{selectedRental.title}</CardTitle>
                          <CardDescription>{selectedRental.location}</CardDescription>
                        </div>
                        <Badge className="bg-green-500">{selectedRental.daysLeft} days left</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="rounded-lg overflow-hidden">
                        <img
                          src={selectedRental.image || "/placeholder.svg"}
                          alt={selectedRental.title}
                          className="w-full h-48 object-cover"
                        />
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <h3 className="font-medium">Rental Period</h3>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Start Date</span>
                            <span>{selectedRental.startDate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">End Date</span>
                            <span>{selectedRental.endDate}</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h3 className="font-medium">Payment Details</h3>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Monthly Rent</span>
                            <span>{selectedRental.price}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Next Payment</span>
                            <span>{selectedRental.agreement.nextPaymentDate}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="font-medium">Property Owner</h3>
                        <div className="flex items-center gap-3 rounded-lg border p-3">
                          <Avatar>
                            <AvatarImage src={selectedRental.owner.avatar} alt={selectedRental.owner.name} />
                            <AvatarFallback>{selectedRental.owner.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-medium">{selectedRental.owner.name}</p>
                            <div className="flex items-center text-sm text-gray-500">
                              <Star className="mr-1 h-4 w-4 fill-orange-500 text-orange-500" />
                              <span>Cred Score: {selectedRental.owner.credScore}</span>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Message
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">Rental Agreement</h3>
                          <Button variant="outline" size="sm">
                            <FileText className="mr-2 h-4 w-4" />
                            View Full Agreement
                          </Button>
                        </div>
                        <div className="rounded-lg border p-3 space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Agreement ID</span>
                            <span className="font-mono text-sm">{selectedRental.agreement.id}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Security Deposit</span>
                            <span>{selectedRental.agreement.securityDeposit}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Term Length</span>
                            <span>{selectedRental.agreement.terms}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Auto Renewal</span>
                            <span>{selectedRental.agreement.autoRenewal ? "Yes" : "No"}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">Maintenance Issues</h3>
                          <Dialog open={issueDialogOpen} onOpenChange={setIssueDialogOpen}>
                            <DialogTrigger asChild>
                              <Button className="bg-orange-500 hover:bg-orange-600" size="sm">
                                Report Issue
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px]">
                              <DialogHeader>
                                <DialogTitle>Report Maintenance Issue</DialogTitle>
                                <DialogDescription>
                                  Describe the issue you're experiencing with the property.
                                </DialogDescription>
                              </DialogHeader>
                              <IssueReportForm
                                propertyId={selectedRental.id}
                                propertyTitle={selectedRental.title}
                                onSubmitSuccess={() => setIssueDialogOpen(false)}
                              />
                            </DialogContent>
                          </Dialog>
                        </div>

                        {selectedRental.issues.length > 0 ? (
                          <div className="space-y-3">
                            {selectedRental.issues.map((issue) => (
                              <div key={issue.id} className="rounded-lg border p-3">
                                <div className="flex items-start gap-3">
                                  <AlertTriangle
                                    className={`h-5 w-5 mt-0.5 ${
                                      issue.priority === "high"
                                        ? "text-red-500"
                                        : issue.priority === "medium"
                                          ? "text-orange-500"
                                          : "text-yellow-500"
                                    }`}
                                  />
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                      <h4 className="font-medium">{issue.title}</h4>
                                      <Badge
                                        className={`${
                                          issue.status === "open"
                                            ? "bg-blue-500"
                                            : issue.status === "in-progress"
                                              ? "bg-orange-500"
                                              : issue.status === "resolved"
                                                ? "bg-green-500"
                                                : "bg-gray-500"
                                        }`}
                                      >
                                        {issue.status === "open"
                                          ? "Open"
                                          : issue.status === "in-progress"
                                            ? "In Progress"
                                            : issue.status === "resolved"
                                              ? "Resolved"
                                              : "Closed"}
                                      </Badge>
                                    </div>
                                    <p className="mt-1 text-sm text-gray-500">Reported on {issue.reportedDate}</p>
                                    <p className="mt-2 text-sm">{issue.description}</p>

                                    {issue.ownerResponse && (
                                      <div className="mt-3 rounded-lg bg-gray-50 p-2 text-sm">
                                        <p className="font-medium">Owner Response:</p>
                                        <p className="mt-1">{issue.ownerResponse}</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="rounded-lg border border-dashed p-6 text-center">
                            <p className="text-gray-500">No maintenance issues reported</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline">
                        <Calendar className="mr-2 h-4 w-4" />
                        Payment Schedule
                      </Button>
                      <Button className="bg-orange-500 hover:bg-orange-600">
                        <Home className="mr-2 h-4 w-4" />
                        Property Details
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            ) : (
              <Card className="flex flex-col items-center justify-center p-12 text-center">
                <div className="rounded-full bg-orange-100 p-4">
                  <Home className="h-8 w-8 text-orange-500" />
                </div>
                <h2 className="mt-4 text-xl font-bold">No Active Rentals</h2>
                <p className="mt-2 text-gray-500">You don't have any active rental agreements at the moment.</p>
                <Link href="/dashboard/properties">
                  <Button className="mt-6 bg-orange-500 hover:bg-orange-600">Browse Properties</Button>
                </Link>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="past" className="mt-6">
            {pastRentals.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {pastRentals.map((rental) => (
                  <Card key={rental.id}>
                    <div className="relative">
                      <img
                        src={rental.image || "/placeholder.svg"}
                        alt={rental.title}
                        className="h-48 w-full object-cover"
                      />
                      <Badge className="absolute right-2 top-2 bg-blue-500">Completed</Badge>
                    </div>
                    <CardHeader>
                      <CardTitle>{rental.title}</CardTitle>
                      <CardDescription>{rental.location}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Rental Period</span>
                        <span>
                          {rental.startDate} - {rental.endDate}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Monthly Rent</span>
                        <span>{rental.price}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Security Deposit</span>
                        <span>{rental.agreement.securityDeposit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Deposit Returned</span>
                        <span className={rental.agreement.depositReturned ? "text-green-500" : "text-red-500"}>
                          {rental.agreement.depositReturned ? "Yes" : "No"}
                        </span>
                      </div>
                      {rental.agreement.depositReturned && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Return Amount</span>
                          <span>{rental.agreement.depositReturnAmount}</span>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter>
                      {rental.reviewSubmitted ? (
                        <Button variant="outline" className="w-full" disabled>
                          Review Submitted
                        </Button>
                      ) : (
                        <Button className="w-full bg-orange-500 hover:bg-orange-600">Leave Review</Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="flex flex-col items-center justify-center p-12 text-center">
                <div className="rounded-full bg-orange-100 p-4">
                  <Calendar className="h-8 w-8 text-orange-500" />
                </div>
                <h2 className="mt-4 text-xl font-bold">No Past Rentals</h2>
                <p className="mt-2 text-gray-500">You don't have any completed rental agreements yet.</p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

