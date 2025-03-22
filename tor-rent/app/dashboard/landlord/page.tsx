"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PropertyCard } from "@/components/property-card"
import { 
  Home, 
  Users, 
  CreditCard, 
  Plus, 
  ArrowUpRight
} from "lucide-react"

export default function LandlordDashboardPage() {
  // Mock properties
  const properties = [
    {
      id: "prop1",
      title: "Luxury Villa with Pool",
      location: "Whitefield, Bangalore",
      price: 125000,
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1350&q=80",
      status: "active",
      credScore: 95
    },
    {
      id: "prop2",
      title: "Modern Apartment in HSR",
      location: "HSR Layout, Bangalore",
      price: 80000,
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1350&q=80",
      status: "active",
      credScore: 90
    },
    {
      id: "prop3",
      title: "Cozy Studio in Indiranagar",
      location: "Indiranagar, Bangalore",
      price: 50000,
      image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1350&q=80",
      status: "active",
      credScore: 88
    }
  ]

  // Mock pending payments
  const pendingPayments = [
    {
      id: "pay1",
      property: "Luxury Villa with Pool",
      tenant: "Priya Kumar",
      date: "July 25, 2024",
      amount: "₹125,000",
      status: "upcoming"
    },
    {
      id: "pay2",
      property: "Modern Apartment in HSR",
      tenant: "Rahul Sharma",
      date: "July 22, 2024",
      amount: "₹80,000",
      status: "upcoming"
    }
  ]

  // Mock maintenance issues
  const maintenanceIssues = [
    {
      id: "issue1",
      property: "Luxury Villa with Pool",
      tenant: "Priya Kumar",
      title: "AC not working",
      date: "July 15, 2024",
      priority: "high",
      status: "open"
    },
    {
      id: "issue2",
      property: "Modern Apartment in HSR",
      tenant: "Rahul Sharma",
      title: "Water leakage in kitchen",
      date: "July 14, 2024",
      priority: "medium",
      status: "in progress"
    }
  ]

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, Arjun!</h1>
          <p className="text-gray-500">Here's what's happening with your properties today.</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link href="/dashboard/landlord/properties/add">
            <Button className="bg-orange-500 hover:bg-orange-600">
              <Plus className="mr-2 h-4 w-4" />
              Add New Property
            </Button>
          </Link>
        </div>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 mb-1">Monthly Revenue</p>
                <h3 className="text-2xl font-bold">₹7,05,000</h3>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <CreditCard className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <ArrowUpRight className="text-green-500 h-4 w-4 mr-1" />
              <span className="text-green-500 font-medium">8.2%</span>
              <span className="text-gray-500 ml-2">from last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 mb-1">Total Properties</p>
                <h3 className="text-2xl font-bold">5</h3>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Home className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <ArrowUpRight className="text-green-500 h-4 w-4 mr-1" />
              <span className="text-green-500 font-medium">2</span>
              <span className="text-gray-500 ml-2">properties added in 3 months</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 mb-1">Active Tenants</p>
                <h3 className="text-2xl font-bold">12</h3>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-500">
                <span className="text-green-500 font-medium">100%</span> occupancy rate
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Properties section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Your Properties</h2>
          <Link href="/dashboard/landlord/properties">
            <Button variant="outline">View All</Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              id={property.id}
              title={property.title}
              location={property.location}
              price={property.price}
              image={property.image}
              status={property.status}
              credScore={property.credScore}
            />
          ))}
        </div>
      </div>

      {/* Maintenance requests and payments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Maintenance requests */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Maintenance Requests</CardTitle>
            <CardDescription>Your tenant's latest issues</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {maintenanceIssues.map((issue) => (
                <div key={issue.id} className="flex items-start border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{issue.title}</h4>
                      <span className={`text-xs rounded-full px-2 py-1 font-medium ${
                        issue.priority === "high" 
                          ? "bg-red-100 text-red-800" 
                          : issue.priority === "medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}>
                        {issue.priority.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{issue.property}</p>
                    <p className="text-sm text-gray-500">Reported by {issue.tenant} on {issue.date}</p>
                    <div className="mt-2">
                      <Link href={`/dashboard/landlord/maintenance?issue=${issue.id}`}>
                        <Button size="sm" variant="outline">View Details</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Link href="/dashboard/landlord/maintenance" className="w-full">
              <Button variant="outline" className="w-full">View All Maintenance Requests</Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Pending payments */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Payments</CardTitle>
            <CardDescription>Rent payments due in the next 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingPayments.map((payment) => (
                <div key={payment.id} className="flex items-start border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{payment.property}</h4>
                      <p className="font-bold">{payment.amount}</p>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Tenant: {payment.tenant}</p>
                    <p className="text-sm text-gray-500">Due on {payment.date}</p>
                    <div className="mt-2">
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                        {payment.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Link href="/dashboard/landlord/payments" className="w-full">
              <Button variant="outline" className="w-full">View All Payments</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
} 