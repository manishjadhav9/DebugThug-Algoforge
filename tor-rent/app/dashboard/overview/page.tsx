"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar, CreditCard, FileText, Home, TrendingUp, User, Wallet } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { RentalAnalyticsChart } from "@/components/rental-analytics-chart"
import { LoyaltyPointsCard } from "@/components/loyalty-points-card"

export default function OverviewPage() {
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Overview</h1>
          <p className="text-gray-500">Your rental activity and analytics dashboard</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-orange-100 p-3">
                  <Home className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Active Rentals</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-orange-100 p-3">
                  <Wallet className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Monthly Rent</p>
                  <p className="text-2xl font-bold">0.15 ETH</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-orange-100 p-3">
                  <CreditCard className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Next Payment</p>
                  <p className="text-2xl font-bold">April 1, 2025</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="dashboard" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 md:w-auto">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="agreements">Agreements</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-6 space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Rental Timeline</CardTitle>
                  <CardDescription>Your active rental agreements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-500">Active</Badge>
                          <span className="font-medium">Modern Apartment</span>
                        </div>
                        <span className="text-sm text-gray-500">298 days left</span>
                      </div>
                      <Progress value={67} className="h-2" />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Jan 15, 2025</span>
                        <span>Jan 14, 2026</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-500">Active</Badge>
                          <span className="font-medium">Studio Loft</span>
                        </div>
                        <span className="text-sm text-gray-500">132 days left</span>
                      </div>
                      <Progress value={45} className="h-2" />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Feb 1, 2025</span>
                        <span>Jul 31, 2025</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-500">Active</Badge>
                          <span className="font-medium">Cozy Townhouse</span>
                        </div>
                        <span className="text-sm text-gray-500">163 days left</span>
                      </div>
                      <Progress value={30} className="h-2" />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Mar 1, 2025</span>
                        <span>Aug 31, 2025</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Payments</CardTitle>
                  <CardDescription>Your scheduled rent payments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 rounded-lg border p-4">
                      <Calendar className="mt-0.5 h-5 w-5 text-orange-500" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">Studio Loft</h3>
                          <p className="font-bold">0.03 ETH</p>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">Due on April 1, 2025</p>
                        <div className="mt-4 flex justify-end">
                          <Button className="bg-orange-500 hover:bg-orange-600">Pay Now</Button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 rounded-lg border p-4">
                      <Calendar className="mt-0.5 h-5 w-5 text-orange-500" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">Cozy Townhouse</h3>
                          <p className="font-bold">0.07 ETH</p>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">Due on April 1, 2025</p>
                        <div className="mt-4 flex justify-end">
                          <Button className="bg-orange-500 hover:bg-orange-600">Pay Now</Button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 rounded-lg border p-4">
                      <Calendar className="mt-0.5 h-5 w-5 text-orange-500" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">Modern Apartment</h3>
                          <p className="font-bold">0.05 ETH</p>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">Due on April 15, 2025</p>
                        <div className="mt-4 flex justify-end">
                          <Button variant="outline">Schedule</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <LoyaltyPointsCard />

            <Card>
              <CardHeader>
                <CardTitle>Maintenance Issues</CardTitle>
                <CardDescription>Status of your reported issues</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 rounded-lg border p-4">
                    <div className="rounded-full bg-orange-100 p-2">
                      <Home className="h-4 w-4 text-orange-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">Plumbing issue in bathroom</h3>
                        <Badge className="bg-orange-500">In Progress</Badge>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">Modern Apartment • Reported on March 15, 2025</p>
                      <p className="mt-2 text-sm">
                        A plumber has been scheduled to visit on March 18 between 9am-12pm.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 rounded-lg border p-4">
                    <div className="rounded-full bg-orange-100 p-2">
                      <Home className="h-4 w-4 text-orange-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">Heating not working properly</h3>
                        <Badge className="bg-blue-500">Open</Badge>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">Cozy Townhouse • Reported on March 20, 2025</p>
                      <p className="mt-2 text-sm">Awaiting response from property owner.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="agreements" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Rental Agreements</CardTitle>
                <CardDescription>Your active blockchain-based smart contracts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-orange-500" />
                        <h3 className="font-medium">Modern Apartment Agreement</h3>
                      </div>
                      <Badge className="bg-green-500">Active</Badge>
                    </div>
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <div>
                        <p className="text-sm text-gray-500">Agreement ID</p>
                        <p className="font-mono text-sm">AGR-2025-0115-001</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Smart Contract Address</p>
                        <p className="font-mono text-sm">0x1a2b...9s0t</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Start Date</p>
                        <p>January 15, 2025</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">End Date</p>
                        <p>January 14, 2026</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Monthly Rent</p>
                        <p>0.05 ETH</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Security Deposit</p>
                        <p>0.1 ETH</p>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Button variant="outline">
                        <FileText className="mr-2 h-4 w-4" />
                        View Full Agreement
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-orange-500" />
                        <h3 className="font-medium">Studio Loft Agreement</h3>
                      </div>
                      <Badge className="bg-green-500">Active</Badge>
                    </div>
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <div>
                        <p className="text-sm text-gray-500">Agreement ID</p>
                        <p className="font-mono text-sm">AGR-2025-0201-002</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Smart Contract Address</p>
                        <p className="font-mono text-sm">0x2b3c...s0t1</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Start Date</p>
                        <p>February 1, 2025</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">End Date</p>
                        <p>July 31, 2025</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Monthly Rent</p>
                        <p>0.03 ETH</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Security Deposit</p>
                        <p>0.06 ETH</p>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Button variant="outline">
                        <FileText className="mr-2 h-4 w-4" />
                        View Full Agreement
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-orange-500" />
                        <h3 className="font-medium">Cozy Townhouse Agreement</h3>
                      </div>
                      <Badge className="bg-green-500">Active</Badge>
                    </div>
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <div>
                        <p className="text-sm text-gray-500">Agreement ID</p>
                        <p className="font-mono text-sm">AGR-2025-0301-003</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Smart Contract Address</p>
                        <p className="font-mono text-sm">0x3c4d...2b3c</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Start Date</p>
                        <p>March 1, 2025</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">End Date</p>
                        <p>August 31, 2025</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Monthly Rent</p>
                        <p>0.07 ETH</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Security Deposit</p>
                        <p>0.14 ETH</p>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Button variant="outline">
                        <FileText className="mr-2 h-4 w-4" />
                        View Full Agreement
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Rental Expenses</CardTitle>
                  <CardDescription>Your rental payment history</CardDescription>
                </CardHeader>
                <CardContent>
                  <RentalAnalyticsChart type="expenses" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cred Score History</CardTitle>
                  <CardDescription>Your credibility score over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <RentalAnalyticsChart type="credScore" />
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Rental Activity</CardTitle>
                  <CardDescription>Overview of your rental history</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-4">
                    <div className="rounded-lg border p-4 text-center">
                      <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                        <Home className="h-6 w-6 text-orange-500" />
                      </div>
                      <p className="text-2xl font-bold">5</p>
                      <p className="text-sm text-gray-500">Total Properties Rented</p>
                    </div>

                    <div className="rounded-lg border p-4 text-center">
                      <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                        <Calendar className="h-6 w-6 text-orange-500" />
                      </div>
                      <p className="text-2xl font-bold">18</p>
                      <p className="text-sm text-gray-500">Months as Tenant</p>
                    </div>

                    <div className="rounded-lg border p-4 text-center">
                      <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                        <TrendingUp className="h-6 w-6 text-orange-500" />
                      </div>
                      <p className="text-2xl font-bold">92</p>
                      <p className="text-sm text-gray-500">Current Cred Score</p>
                    </div>

                    <div className="rounded-lg border p-4 text-center">
                      <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                        <User className="h-6 w-6 text-orange-500" />
                      </div>
                      <p className="text-2xl font-bold">4</p>
                      <p className="text-sm text-gray-500">Different Landlords</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

