"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Bell, Key, Lock, Shield, Wallet } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-gray-500">Manage your account settings and preferences</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 md:w-auto">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="wallet">Wallet</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your personal information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src="/placeholder.svg?height=80&width=80" alt="User" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <Button variant="outline" size="sm">
                        Change Avatar
                      </Button>
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">First Name</Label>
                      <Input id="first-name" defaultValue="John" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last Name</Label>
                      <Input id="last-name" defaultValue="Doe" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="john.doe@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="bg-orange-500 hover:bg-orange-600">Save Changes</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cred Score</CardTitle>
                  <CardDescription>Your rental credibility score</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold">92</h3>
                      <p className="text-sm text-gray-500">Excellent</p>
                    </div>
                    <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center text-white text-2xl font-bold">
                      92
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Payment History</span>
                        <span className="text-sm font-medium">Excellent</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-orange-500 h-2 rounded-full w-[95%]"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Property Maintenance</span>
                        <span className="text-sm font-medium">Very Good</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-orange-500 h-2 rounded-full w-[85%]"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Communication</span>
                        <span className="text-sm font-medium">Good</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-orange-500 h-2 rounded-full w-[75%]"></div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">Badges</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-green-500">Super Tenant</Badge>
                      <Badge className="bg-blue-500">Punctual Payer</Badge>
                      <Badge className="bg-purple-500">Property Protector</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="security">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Update your password</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="bg-orange-500 hover:bg-orange-600">Update Password</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Two-Factor Authentication</CardTitle>
                  <CardDescription>Add an extra layer of security to your account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-orange-500" />
                      <span className="font-medium">Two-Factor Authentication</span>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <p className="text-sm text-gray-500">
                    When two-factor authentication is enabled, you'll be required to provide a verification code in
                    addition to your password when logging in.
                  </p>
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center gap-2">
                      <Lock className="h-5 w-5 text-orange-500" />
                      <span className="font-medium">Recovery Keys</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Recovery keys can be used to access your account if you lose your two-factor authentication
                      device.
                    </p>
                    <Button variant="outline" className="mt-4">
                      <Key className="mr-2 h-4 w-4" />
                      View Recovery Keys
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="wallet">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Connected Wallet</CardTitle>
                  <CardDescription>Manage your blockchain wallet</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img src="/placeholder.svg?height=30&width=30&text=MM" alt="Metamask" className="h-6 w-6" />
                        <span className="font-medium">Metamask Wallet</span>
                      </div>
                      <Badge className="bg-green-500">Connected</Badge>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Wallet Address</span>
                        <span className="font-mono text-sm">0x1a2b...9s0t</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Balance</span>
                        <span className="font-medium">0.45 ETH</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Network</span>
                        <span className="font-medium">Polygon Mainnet</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Button variant="outline" className="text-red-500 hover:text-red-600">
                      Disconnect Wallet
                    </Button>
                    <Button className="bg-orange-500 hover:bg-orange-600">
                      <Wallet className="mr-2 h-4 w-4" />
                      Add Funds
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Rentocoin Rewards</CardTitle>
                  <CardDescription>Manage your blockchain-based rewards</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold">250 RTC</h3>
                      <p className="text-sm text-gray-500">Current Balance</p>
                    </div>
                    <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center">
                      <img src="/placeholder.svg?height=40&width=40&text=RTC" alt="Rentocoin" className="h-10 w-10" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">Recent Rewards</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between rounded-lg border p-3">
                        <span>On-time Rent Payment</span>
                        <span className="font-medium text-green-500">+25 RTC</span>
                      </div>
                      <div className="flex justify-between rounded-lg border p-3">
                        <span>Property Review Submitted</span>
                        <span className="font-medium text-green-500">+10 RTC</span>
                      </div>
                      <div className="flex justify-between rounded-lg border p-3">
                        <span>Referral Bonus</span>
                        <span className="font-medium text-green-500">+50 RTC</span>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-lg bg-orange-50 p-4">
                    <h3 className="font-medium">Redeem Rewards</h3>
                    <p className="mt-2 text-sm text-gray-600">
                      Use your Rentocoins for discounts on rent, service fees, or convert to ETH.
                    </p>
                    <Button className="mt-4 bg-orange-500 hover:bg-orange-600">Redeem Rentocoins</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Manage how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Email Notifications</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4 text-gray-500" />
                        <span>Rent Payment Reminders</span>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4 text-gray-500" />
                        <span>New Messages</span>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4 text-gray-500" />
                        <span>Maintenance Updates</span>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4 text-gray-500" />
                        <span>Community Forum Activity</span>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4 text-gray-500" />
                        <span>Promotional Offers</span>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Push Notifications</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4 text-gray-500" />
                        <span>Rent Payment Reminders</span>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4 text-gray-500" />
                        <span>New Messages</span>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4 text-gray-500" />
                        <span>Maintenance Updates</span>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4 text-gray-500" />
                        <span>Community Forum Activity</span>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="bg-orange-500 hover:bg-orange-600">Save Preferences</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

