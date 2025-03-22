"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { 
  BellRing, 
  CreditCard,
  User, 
  Settings, 
  Shield, 
  Wallet, 
  Upload, 
  LogOut,
  Key,
  Smartphone,
  Languages,
  Moon,
  Clock,
  CheckCircle,
  ChevronRight
} from "lucide-react"

// Mock user data
const mockLandlord = {
  id: "landlord-1",
  name: "Arjun Mehta",
  email: "arjun.mehta@example.com",
  phone: "+91 98765 12345",
  avatar: "/avatars/arjun.jpg",
  avatarFallback: "AM",
  accountType: "landlord",
  properties: 5,
  tenants: 4,
  joinedDate: "2023-06-15",
  walletAddress: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t",
  paymentMethods: [
    {
      id: "payment-1",
      type: "bank",
      name: "HDFC Bank",
      lastFour: "4567",
      isDefault: true
    },
    {
      id: "payment-2",
      type: "wallet",
      name: "Metamask",
      lastFour: "8901",
      isDefault: false
    }
  ],
  notifications: {
    email: true,
    push: true,
    sms: false,
    paymentReminders: true,
    maintenanceAlerts: true,
    newMessages: true,
    marketingUpdates: false
  },
  preferences: {
    language: "en",
    currency: "INR",
    theme: "light",
    timezone: "Asia/Kolkata"
  },
  securitySettings: {
    twoFactorEnabled: true,
    lastPasswordChange: "2024-06-01",
    loginNotifications: true,
    trustedDevices: 2
  }
}

export default function SettingsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("profile")
  const [formData, setFormData] = useState({
    name: mockLandlord.name,
    email: mockLandlord.email,
    phone: mockLandlord.phone,
    walletAddress: mockLandlord.walletAddress,
    notifications: { ...mockLandlord.notifications },
    preferences: { ...mockLandlord.preferences },
    securitySettings: { ...mockLandlord.securitySettings }
  })

  // Handle input change
  const handleInputChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  // Handle notification toggle
  const handleNotificationToggle = (key: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }))
  }

  // Handle preference change
  const handlePreferenceChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value
      }
    }))
  }

  // Handle security setting toggle
  const handleSecurityToggle = (key: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      securitySettings: {
        ...prev.securitySettings,
        [key]: value
      }
    }))
  }

  // Save settings
  const handleSaveSettings = () => {
    // Simulate API call to save settings
    console.log("Saving settings:", formData)
    // Show success message
    alert("Settings saved successfully!")
  }

  // Handle logout
  const handleLogout = () => {
    router.push("/login")
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <Card className="md:col-span-1">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={mockLandlord.avatar} alt={mockLandlord.name} />
                <AvatarFallback>{mockLandlord.avatarFallback}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{mockLandlord.name}</CardTitle>
                <CardDescription>{mockLandlord.email}</CardDescription>
                <Badge className="mt-1 bg-orange-500">Landlord</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <nav className="flex flex-col">
              <button
                className={`flex items-center gap-3 p-3 text-left hover:bg-gray-100 transition-colors ${activeTab === "profile" ? "bg-orange-50 text-orange-500" : ""}`}
                onClick={() => setActiveTab("profile")}
              >
                <User className="h-5 w-5" />
                <span>Profile</span>
              </button>
              <button
                className={`flex items-center gap-3 p-3 text-left hover:bg-gray-100 transition-colors ${activeTab === "payments" ? "bg-orange-50 text-orange-500" : ""}`}
                onClick={() => setActiveTab("payments")}
              >
                <Wallet className="h-5 w-5" />
                <span>Payment Methods</span>
              </button>
              <button
                className={`flex items-center gap-3 p-3 text-left hover:bg-gray-100 transition-colors ${activeTab === "notifications" ? "bg-orange-50 text-orange-500" : ""}`}
                onClick={() => setActiveTab("notifications")}
              >
                <BellRing className="h-5 w-5" />
                <span>Notifications</span>
              </button>
              <button
                className={`flex items-center gap-3 p-3 text-left hover:bg-gray-100 transition-colors ${activeTab === "security" ? "bg-orange-50 text-orange-500" : ""}`}
                onClick={() => setActiveTab("security")}
              >
                <Shield className="h-5 w-5" />
                <span>Security</span>
              </button>
              <button
                className={`flex items-center gap-3 p-3 text-left hover:bg-gray-100 transition-colors ${activeTab === "preferences" ? "bg-orange-50 text-orange-500" : ""}`}
                onClick={() => setActiveTab("preferences")}
              >
                <Settings className="h-5 w-5" />
                <span>Preferences</span>
              </button>
            </nav>
          </CardContent>
          <CardFooter className="border-t p-4">
            <Button variant="outline" className="w-full text-red-500 hover:text-red-600" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Log Out
            </Button>
          </CardFooter>
        </Card>
        
        {/* Main content */}
        <div className="md:col-span-3 space-y-6">
          {/* Profile */}
          {activeTab === "profile" && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your personal information and contact details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="avatar">Profile Picture</Label>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={mockLandlord.avatar} alt={mockLandlord.name} />
                        <AvatarFallback>{mockLandlord.avatarFallback}</AvatarFallback>
                      </Avatar>
                      <Button variant="outline">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload New Picture
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="joined">Joined</Label>
                      <Input id="joined" value={new Date(mockLandlord.joinedDate).toLocaleDateString('en-IN')} disabled />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-6 flex justify-between">
                  <Button variant="outline">Cancel</Button>
                  <Button className="bg-orange-500 hover:bg-orange-600" onClick={handleSaveSettings}>Save Changes</Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Wallet Address</CardTitle>
                  <CardDescription>
                    Update your blockchain wallet address for crypto transactions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="wallet">Wallet Address</Label>
                    <Input
                      id="wallet"
                      value={formData.walletAddress}
                      onChange={(e) => handleInputChange("walletAddress", e.target.value)}
                    />
                    <p className="text-sm text-gray-500">
                      This wallet will be used for receiving payments and security deposits from tenants.
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-6 flex justify-between">
                  <Button variant="outline">Cancel</Button>
                  <Button className="bg-orange-500 hover:bg-orange-600" onClick={handleSaveSettings}>Save Changes</Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Account Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-gray-50 rounded-md text-center">
                      <p className="text-sm text-gray-500">Properties</p>
                      <p className="text-2xl font-semibold">{mockLandlord.properties}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-md text-center">
                      <p className="text-sm text-gray-500">Tenants</p>
                      <p className="text-2xl font-semibold">{mockLandlord.tenants}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-md text-center">
                      <p className="text-sm text-gray-500">Account Type</p>
                      <p className="text-lg font-semibold capitalize">{mockLandlord.accountType}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-md text-center">
                      <p className="text-sm text-gray-500">Member Since</p>
                      <p className="text-lg font-semibold">{new Date(mockLandlord.joinedDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'short' })}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
          
          {/* Payment Methods */}
          {activeTab === "payments" && (
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>
                  Manage your payment methods for receiving rent and security deposits
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {mockLandlord.paymentMethods.map((method) => (
                    <div key={method.id} className="flex items-center justify-between p-4 border rounded-md">
                      <div className="flex items-center gap-4">
                        {method.type === "bank" ? (
                          <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <CreditCard className="h-5 w-5 text-blue-600" />
                          </div>
                        ) : (
                          <div className="h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center">
                            <Wallet className="h-5 w-5 text-orange-600" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{method.name}</p>
                          <p className="text-sm text-gray-500">
                            {method.type === "bank" ? "Bank Account" : "Crypto Wallet"} •••• {method.lastFour}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {method.isDefault && (
                          <Badge variant="outline" className="bg-green-50 text-green-600">
                            Default
                          </Badge>
                        )}
                        <Button variant="outline" size="sm">Edit</Button>
                        {!method.isDefault && (
                          <Button variant="outline" size="sm">Set Default</Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button className="bg-orange-500 hover:bg-orange-600">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Add New Payment Method
                </Button>
              </CardContent>
            </Card>
          )}
          
          {/* Notifications */}
          {activeTab === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Customize how you receive notifications and updates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex flex-col space-y-4 border-b pb-4">
                    <h3 className="text-sm font-medium text-gray-700">Notification Channels</h3>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Email Notifications</Label>
                        <p className="text-sm text-gray-500">Receive updates via email</p>
                      </div>
                      <Switch 
                        checked={formData.notifications.email}
                        onCheckedChange={(value) => handleNotificationToggle("email", value)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Push Notifications</Label>
                        <p className="text-sm text-gray-500">Receive notifications on your browser or mobile device</p>
                      </div>
                      <Switch 
                        checked={formData.notifications.push}
                        onCheckedChange={(value) => handleNotificationToggle("push", value)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">SMS Notifications</Label>
                        <p className="text-sm text-gray-500">Receive urgent notifications via SMS</p>
                      </div>
                      <Switch 
                        checked={formData.notifications.sms}
                        onCheckedChange={(value) => handleNotificationToggle("sms", value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-700">Notification Types</h3>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Payment Reminders</Label>
                        <p className="text-sm text-gray-500">Notifications for upcoming and overdue payments</p>
                      </div>
                      <Switch 
                        checked={formData.notifications.paymentReminders}
                        onCheckedChange={(value) => handleNotificationToggle("paymentReminders", value)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Maintenance Alerts</Label>
                        <p className="text-sm text-gray-500">Updates on maintenance requests and issues</p>
                      </div>
                      <Switch 
                        checked={formData.notifications.maintenanceAlerts}
                        onCheckedChange={(value) => handleNotificationToggle("maintenanceAlerts", value)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">New Messages</Label>
                        <p className="text-sm text-gray-500">Notifications when you receive new messages</p>
                      </div>
                      <Switch 
                        checked={formData.notifications.newMessages}
                        onCheckedChange={(value) => handleNotificationToggle("newMessages", value)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Marketing Updates</Label>
                        <p className="text-sm text-gray-500">News, feature updates, and promotional content</p>
                      </div>
                      <Switch 
                        checked={formData.notifications.marketingUpdates}
                        onCheckedChange={(value) => handleNotificationToggle("marketingUpdates", value)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-6">
                <Button className="ml-auto bg-orange-500 hover:bg-orange-600" onClick={handleSaveSettings}>Save Preferences</Button>
              </CardFooter>
            </Card>
          )}
          
          {/* Security */}
          {activeTab === "security" && (
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage your account security and authentication settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="border-b pb-4">
                    <h3 className="text-base font-medium mb-3">Password</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm">Last changed: {new Date(mockLandlord.securitySettings.lastPasswordChange).toLocaleDateString('en-IN')}</p>
                      </div>
                      <Button variant="outline">
                        <Key className="h-4 w-4 mr-2" />
                        Change Password
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border-b pb-4">
                    <h3 className="text-base font-medium mb-3">Two-Factor Authentication</h3>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <p className="text-sm">Status: </p>
                          {formData.securitySettings.twoFactorEnabled ? (
                            <Badge className="ml-2 bg-green-500">Enabled</Badge>
                          ) : (
                            <Badge className="ml-2 bg-red-500">Disabled</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      {formData.securitySettings.twoFactorEnabled ? (
                        <Button variant="outline">Disable</Button>
                      ) : (
                        <Button className="bg-orange-500 hover:bg-orange-600">Enable</Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="border-b pb-4">
                    <h3 className="text-base font-medium mb-3">Login Notifications</h3>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Email me when there's a new login</Label>
                        <p className="text-sm text-gray-500">
                          Get notified when someone logs into your account from a new device or location
                        </p>
                      </div>
                      <Switch 
                        checked={formData.securitySettings.loginNotifications}
                        onCheckedChange={(value) => handleSecurityToggle("loginNotifications", value)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-base font-medium mb-3">Trusted Devices</h3>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <p className="text-sm">
                          You have {mockLandlord.securitySettings.trustedDevices} trusted devices
                        </p>
                      </div>
                      <Button variant="outline">
                        <Smartphone className="h-4 w-4 mr-2" />
                        Manage Devices
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-6">
                <Button className="ml-auto bg-orange-500 hover:bg-orange-600" onClick={handleSaveSettings}>Save Settings</Button>
              </CardFooter>
            </Card>
          )}
          
          {/* Preferences */}
          {activeTab === "preferences" && (
            <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>
                  Customize your experience with language, theme, and regional settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4 border-b pb-4">
                  <h3 className="text-sm font-medium text-gray-700">Language & Region</h3>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select 
                        value={formData.preferences.language}
                        onValueChange={(value) => handlePreferenceChange("language", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="hi">Hindi</SelectItem>
                          <SelectItem value="te">Telugu</SelectItem>
                          <SelectItem value="ta">Tamil</SelectItem>
                          <SelectItem value="kn">Kannada</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <Select 
                        value={formData.preferences.currency}
                        onValueChange={(value) => handlePreferenceChange("currency", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
                          <SelectItem value="USD">US Dollar ($)</SelectItem>
                          <SelectItem value="EUR">Euro (€)</SelectItem>
                          <SelectItem value="GBP">British Pound (£)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select 
                        value={formData.preferences.timezone}
                        onValueChange={(value) => handlePreferenceChange("timezone", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Asia/Kolkata">India (IST)</SelectItem>
                          <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                          <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                          <SelectItem value="Europe/London">London (GMT)</SelectItem>
                          <SelectItem value="Asia/Singapore">Singapore (SGT)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-700">Appearance</h3>
                  
                  <div className="space-y-3">
                    <Label>Theme</Label>
                    <RadioGroup 
                      value={formData.preferences.theme}
                      onValueChange={(value) => handlePreferenceChange("theme", value)}
                      className="flex flex-col space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="light" id="theme-light" />
                        <Label htmlFor="theme-light" className="flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2 text-orange-500" />
                          Light
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="dark" id="theme-dark" />
                        <Label htmlFor="theme-dark" className="flex items-center">
                          <Moon className="h-4 w-4 mr-2 text-indigo-500" />
                          Dark
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="system" id="theme-system" />
                        <Label htmlFor="theme-system" className="flex items-center">
                          <Settings className="h-4 w-4 mr-2 text-gray-500" />
                          System
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-6">
                <Button className="ml-auto bg-orange-500 hover:bg-orange-600" onClick={handleSaveSettings}>Save Preferences</Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
} 