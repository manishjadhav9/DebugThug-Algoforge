"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Bell, Building, LogOut, Menu, Settings, Shield, User, Wallet, AlertTriangle } from "lucide-react"
import { DashboardNav } from "@/components/dashboard-nav"
import { PropertyCard } from "@/components/property-card"
import { RentalHistoryTable } from "@/components/rental-history-table"
import { NotificationsList } from "@/components/notifications-list"

export default function DashboardPage() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 z-50 flex w-72 flex-col border-r bg-white transition-transform duration-300 md:static md:translate-x-0 ${
          isMobileNavOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-orange-500" />
            <span className="text-xl font-bold">Tor-Rent</span>
          </Link>
        </div>
        <DashboardNav />
        <div className="mt-auto border-t p-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">John Doe</p>
              <p className="text-xs text-gray-500">john.doe@example.com</p>
            </div>
          </div>
          <Button variant="ghost" className="mt-4 w-full justify-start text-gray-500 hover:text-gray-900">
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-white px-6">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          <div className="ml-auto flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1 top-1 flex h-2 w-2 rounded-full bg-orange-500" />
              <span className="sr-only">Notifications</span>
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Button>
          </div>
        </header>

        {/* Dashboard content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-gray-500">Welcome back, John Doe</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-orange-100 p-3">
                      <Wallet className="h-6 w-6 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Wallet Balance</p>
                      <p className="text-2xl font-bold">0.45 ETH</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-orange-100 p-3">
                      <User className="h-6 w-6 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Cred Score</p>
                      <p className="text-2xl font-bold">
                        92 <span className="text-sm text-green-500">+2</span>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-orange-100 p-3">
                      <Building className="h-6 w-6 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Active Rentals</p>
                      <p className="text-2xl font-bold">3</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="properties">
              <TabsList className="grid w-full grid-cols-3 md:w-auto">
                <TabsTrigger value="properties">Properties</TabsTrigger>
                <TabsTrigger value="history">Rental History</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
              </TabsList>
              <TabsContent value="properties" className="mt-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <PropertyCard
                    title="Modern Apartment"
                    location="Downtown, Seattle"
                    price="0.05 ETH/month"
                    image="/placeholder.svg?height=200&width=300"
                    status="active"
                    credScore={95}
                  />
                  <PropertyCard
                    title="Studio Loft"
                    location="Capitol Hill, Seattle"
                    price="0.03 ETH/month"
                    image="/placeholder.svg?height=200&width=300"
                    status="active"
                    credScore={88}
                  />
                  <PropertyCard
                    title="Cozy Townhouse"
                    location="Ballard, Seattle"
                    price="0.07 ETH/month"
                    image="/placeholder.svg?height=200&width=300"
                    status="active"
                    credScore={92}
                  />
                </div>
              </TabsContent>
              <TabsContent value="history" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Rental History</CardTitle>
                    <CardDescription>Your past and current rental agreements</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RentalHistoryTable />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="notifications" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>Stay updated on your rental activities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <NotificationsList />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <Card>
              <CardHeader>
                <CardTitle>Active Issues</CardTitle>
                <CardDescription>Maintenance issues that need attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 rounded-lg border p-4">
                    <AlertTriangle className="mt-0.5 h-5 w-5 text-orange-500" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">Plumbing issue in bathroom</h3>
                        <Badge className="bg-orange-500">Medium Priority</Badge>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">Reported on March 15, 2025</p>
                      <p className="mt-2 text-sm">
                        The sink in the master bathroom is leaking. Please send a plumber to fix it.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 rounded-lg border p-4">
                    <AlertTriangle className="mt-0.5 h-5 w-5 text-orange-500" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">Heating not working properly</h3>
                        <Badge className="bg-red-500">High Priority</Badge>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">Reported on March 20, 2025</p>
                      <p className="mt-2 text-sm">
                        The heating system is not working in the living room. Temperature is very low.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

