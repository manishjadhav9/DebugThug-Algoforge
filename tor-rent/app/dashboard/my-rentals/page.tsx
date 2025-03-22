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
import { unsplashImages } from "@/lib/utils"

export default function MyRentalsPage() {
  const rentals = {
    current: [
      {
        id: "1",
        name: "Luxury Apartment Bandra",
        address: "Plot 24, Turner Road, Bandra West, Mumbai",
        rent: "₹75,000",
        status: "active",
        startDate: "2024-01-01",
        endDate: "2024-12-31",
        image: unsplashImages.propertyInterior,
        amenities: ["2 BHK", "Furnished", "Sea View"]
      },
      {
        id: "2",
        name: "Premium Villa Juhu",
        address: "15A, Juhu Beach Road, Mumbai",
        rent: "₹150,000",
        status: "active",
        startDate: "2023-12-01",
        endDate: "2024-11-30",
        image: unsplashImages.propertyExterior,
        amenities: ["4 BHK", "Fully Furnished", "Private Pool"]
      }
    ],
    history: [
      {
        id: "3",
        name: "Modern Apartment Powai",
        address: "Hiranandani Gardens, Powai, Mumbai",
        rent: "₹45,000",
        status: "completed",
        startDate: "2023-01-01",
        endDate: "2023-12-31",
        image: unsplashImages.propertyLiving,
        amenities: ["1 BHK", "Semi Furnished", "Lake View"]
      },
      {
        id: "4",
        name: "Studio Apartment Andheri",
        address: "Lokhandwala Complex, Andheri West, Mumbai",
        rent: "₹35,000",
        status: "terminated",
        startDate: "2022-06-01",
        endDate: "2022-11-30",
        image: unsplashImages.propertyBedroom,
        amenities: ["Studio", "Furnished", "Metro Access"]
      }
    ]
  }

  const [selectedRental, setSelectedRental] = useState(rentals.current[0])
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
            {rentals.current.length > 0 ? (
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle>My Properties</CardTitle>
                      <CardDescription>Currently rented properties</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="divide-y">
                        {rentals.current.map((rental) => (
                          <div
                            key={rental.id}
                            className={`cursor-pointer p-4 hover:bg-gray-50 ${
                              selectedRental.id === rental.id ? "bg-orange-50" : ""
                            }`}
                            onClick={() => setSelectedRental(rental)}
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={rental.image}
                                alt={rental.name}
                                className="h-16 w-16 rounded-md object-cover"
                              />
                              <div className="flex-1">
                                <h3 className="font-medium">{rental.name}</h3>
                                <p className="text-sm text-gray-500">{rental.address}</p>
                                <div className="mt-1 flex items-center justify-between">
                                  <span className="text-sm font-medium">{rental.rent}</span>
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
                          <CardTitle>{selectedRental.name}</CardTitle>
                          <CardDescription>{selectedRental.address}</CardDescription>
                        </div>
                        <Badge className="bg-green-500">Active</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="rounded-lg overflow-hidden">
                        <img
                          src={selectedRental.image}
                          alt={selectedRental.name}
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
                            <span>{selectedRental.rent}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="font-medium">Property Amenities</h3>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">Amenities</span>
                          <div className="flex items-center gap-2">
                            {selectedRental.amenities.map((amenity, index) => (
                              <Badge key={index} variant="outline">
                                {amenity}
                              </Badge>
                            ))}
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
                                propertyTitle={selectedRental.name}
                                onSubmitSuccess={() => setIssueDialogOpen(false)}
                              />
                            </DialogContent>
                          </Dialog>
                        </div>

                        {/* Placeholder for maintenance issues */}
                        <div className="rounded-lg border border-dashed p-6 text-center">
                          <p className="text-gray-500">No maintenance issues reported</p>
                        </div>
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
            {rentals.history.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {rentals.history.map((rental) => (
                  <Card key={rental.id}>
                    <div className="relative">
                      <img
                        src={rental.image}
                        alt={rental.name}
                        className="h-48 w-full object-cover"
                      />
                      <Badge className="absolute right-2 top-2 bg-blue-500">Completed</Badge>
                    </div>
                    <CardHeader>
                      <CardTitle>{rental.name}</CardTitle>
                      <CardDescription>{rental.address}</CardDescription>
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
                        <span>{rental.rent}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Amenities</span>
                        <div className="flex items-center gap-2">
                          {rental.amenities.map((amenity, index) => (
                            <Badge key={index} variant="outline">
                              {amenity}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full" disabled>
                        Review Submitted
                      </Button>
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

