"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts"
import { 
  Calendar, 
  ChevronDown, 
  Download, 
  LineChart as LineChartIcon, 
  PieChart as PieChartIcon, 
  ArrowUpRight, 
  ArrowDownRight, 
  Home,
  Wallet,
  Users,
  ClipboardList
} from "lucide-react"

// Mock data for financial metrics
const mockRevenueData = [
  { month: 'Jan', revenue: 575000 },
  { month: 'Feb', revenue: 575000 },
  { month: 'Mar', revenue: 600000 },
  { month: 'Apr', revenue: 625000 },
  { month: 'May', revenue: 625000 },
  { month: 'Jun', revenue: 650000 },
  { month: 'Jul', revenue: 650000 },
  { month: 'Aug', revenue: 650000 },
  { month: 'Sep', revenue: 675000 },
  { month: 'Oct', revenue: 675000 },
  { month: 'Nov', revenue: 700000 },
  { month: 'Dec', revenue: 700000 }
]

// Occupancy rate data
const mockOccupancyRateData = [
  { month: 'Jan', rate: 80 },
  { month: 'Feb', rate: 82 },
  { month: 'Mar', rate: 85 },
  { month: 'Apr', rate: 85 },
  { month: 'May', rate: 90 },
  { month: 'Jun', rate: 100 },
  { month: 'Jul', rate: 100 },
  { month: 'Aug', rate: 100 },
  { month: 'Sep', rate: 100 },
  { month: 'Oct', rate: 100 },
  { month: 'Nov', rate: 100 },
  { month: 'Dec', rate: 100 }
]

// Expense breakdown data
const mockExpenseData = [
  { name: 'Maintenance', value: 180000 },
  { name: 'Insurance', value: 120000 },
  { name: 'Property Tax', value: 250000 },
  { name: 'Utilities', value: 95000 },
  { name: 'Management', value: 130000 }
]

// Property performance data
const mockPropertyPerformanceData = [
  { 
    id: "prop-1", 
    name: "Luxury Villa with Pool", 
    location: "Whitefield", 
    revenue: 1500000, 
    expenses: 420000, 
    roi: 18.2, 
    occupancy: 100,
    trend: "up"
  },
  { 
    id: "prop-2", 
    name: "Modern Apartment in HSR", 
    location: "HSR Layout", 
    revenue: 960000, 
    expenses: 280000, 
    roi: 16.5, 
    occupancy: 100,
    trend: "up"
  },
  { 
    id: "prop-3", 
    name: "Cozy Studio in Indiranagar", 
    location: "Indiranagar", 
    revenue: 600000, 
    expenses: 190000, 
    roi: 15.2, 
    occupancy: 100,
    trend: "stable"
  },
  { 
    id: "prop-4", 
    name: "2BHK in Electronic City", 
    location: "Electronic City", 
    revenue: 780000, 
    expenses: 240000, 
    roi: 14.1, 
    occupancy: 100,
    trend: "up"
  },
  { 
    id: "prop-5", 
    name: "Penthouse in Brigade Road", 
    location: "Brigade Road", 
    revenue: 1200000, 
    expenses: 360000, 
    roi: 17.5, 
    occupancy: 83,
    trend: "down"
  }
]

// Tenant stats
const mockTenantStats = {
  totalTenants: 12,
  newTenants: 2,
  renewals: 5,
  moveOuts: 1,
  onTimePayments: 95,
  latePayments: 5,
  averageTenancy: 14,
  averageCredScore: 88
}

// Colors
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD']
const trendColor = {
  up: "text-green-500",
  down: "text-red-500",
  stable: "text-blue-500"
}

export default function AnalyticsPage() {
  const [timeframe, setTimeframe] = React.useState('year')
  const [reportType, setReportType] = React.useState('financial')
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value)
  }
  
  // Calculate total annual revenue
  const totalAnnualRevenue = mockRevenueData.reduce((sum, item) => sum + item.revenue, 0)
  
  // Calculate total annual expenses
  const totalAnnualExpenses = mockExpenseData.reduce((sum, item) => sum + item.value, 0)
  
  // Calculate net income
  const netIncome = totalAnnualRevenue - totalAnnualExpenses
  
  // Calculate profit margin
  const profitMargin = (netIncome / totalAnnualRevenue) * 100
  
  // Calculate average occupancy
  const averageOccupancy = mockOccupancyRateData.reduce((sum, item) => sum + item.rate, 0) / mockOccupancyRateData.length
  
  // Calculate average ROI
  const averageROI = mockPropertyPerformanceData.reduce((sum, item) => sum + item.roi, 0) / mockPropertyPerformanceData.length

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Analytics & Reports</h1>
          <p className="text-gray-500">Track your property performance and financial metrics</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[130px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>
      
      {/* Metrics overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center">
                <Wallet className="h-6 w-6 text-orange-600" />
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
              <p className="text-2xl font-bold mt-1">{formatCurrency(totalAnnualRevenue)}</p>
              <div className="flex items-center mt-2">
                <Badge className="bg-green-100 text-green-600 font-medium">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  +12.5%
                </Badge>
                <span className="text-gray-500 text-xs ml-2">from last year</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                <Home className="h-6 w-6 text-green-600" />
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-500">Average Occupancy</h3>
              <p className="text-2xl font-bold mt-1">{averageOccupancy.toFixed(1)}%</p>
              <div className="flex items-center mt-2">
                <Badge className="bg-green-100 text-green-600 font-medium">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  +8.2%
                </Badge>
                <span className="text-gray-500 text-xs ml-2">from last year</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <LineChartIcon className="h-6 w-6 text-blue-600" />
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-500">Profit Margin</h3>
              <p className="text-2xl font-bold mt-1">{profitMargin.toFixed(1)}%</p>
              <div className="flex items-center mt-2">
                <Badge className="bg-green-100 text-green-600 font-medium">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  +2.1%
                </Badge>
                <span className="text-gray-500 text-xs ml-2">from last year</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <PieChartIcon className="h-6 w-6 text-purple-600" />
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-500">Average ROI</h3>
              <p className="text-2xl font-bold mt-1">{averageROI.toFixed(1)}%</p>
              <div className="flex items-center mt-2">
                <Badge className="bg-green-100 text-green-600 font-medium">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  +1.8%
                </Badge>
                <span className="text-gray-500 text-xs ml-2">from last year</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-0">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full">
              <div>
                <CardTitle>Revenue Trends</CardTitle>
                <CardDescription>Monthly revenue breakdown</CardDescription>
              </div>
              <Select defaultValue="revenue">
                <SelectTrigger className="w-[160px] mt-2 sm:mt-0">
                  <SelectValue placeholder="Select metric" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="revenue">Revenue</SelectItem>
                  <SelectItem value="expenses">Expenses</SelectItem>
                  <SelectItem value="profit">Net Profit</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={mockRevenueData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis 
                    tickFormatter={(value) => `₹${(value/1000).toFixed(0)}K`}
                  />
                  <Tooltip 
                    formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Revenue']}
                  />
                  <Legend />
                  <Bar dataKey="revenue" fill="#ff8c00" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
            <CardDescription>Annual expenses by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mockExpenseData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {mockExpenseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => formatCurrency(Number(value))}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center">
                  <span className="w-3 h-3 inline-block bg-[#0088FE] rounded-full mr-2"></span>
                  <span>Maintenance</span>
                </div>
                <span className="font-medium">{formatCurrency(mockExpenseData[0].value)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center">
                  <span className="w-3 h-3 inline-block bg-[#00C49F] rounded-full mr-2"></span>
                  <span>Insurance</span>
                </div>
                <span className="font-medium">{formatCurrency(mockExpenseData[1].value)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center">
                  <span className="w-3 h-3 inline-block bg-[#FFBB28] rounded-full mr-2"></span>
                  <span>Property Tax</span>
                </div>
                <span className="font-medium">{formatCurrency(mockExpenseData[2].value)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Additional Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Property Performance</CardTitle>
            <CardDescription>Financial performance of your properties</CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            <div className="w-full overflow-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium text-gray-500">Property</th>
                    <th className="text-left p-3 font-medium text-gray-500">Revenue</th>
                    <th className="text-left p-3 font-medium text-gray-500">Expenses</th>
                    <th className="text-left p-3 font-medium text-gray-500">ROI</th>
                    <th className="text-left p-3 font-medium text-gray-500">Occupancy</th>
                    <th className="text-left p-3 font-medium text-gray-500">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {mockPropertyPerformanceData.map((property) => (
                    <tr key={property.id} className="border-b">
                      <td className="p-3">
                        <div>
                          <div className="font-medium">{property.name}</div>
                          <div className="text-gray-500 text-sm">{property.location}</div>
                        </div>
                      </td>
                      <td className="p-3 font-medium">
                        {formatCurrency(property.revenue)}
                      </td>
                      <td className="p-3">
                        {formatCurrency(property.expenses)}
                      </td>
                      <td className="p-3 font-medium">
                        {property.roi.toFixed(1)}%
                      </td>
                      <td className="p-3">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                          <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: `${property.occupancy}%` }}></div>
                        </div>
                        <span className="text-xs text-gray-500 mt-1">{property.occupancy}%</span>
                      </td>
                      <td className="p-3">
                        <div className={`flex items-center ${trendColor[property.trend as keyof typeof trendColor]}`}>
                          {property.trend === "up" && <ArrowUpRight className="h-4 w-4 mr-1" />}
                          {property.trend === "down" && <ArrowDownRight className="h-4 w-4 mr-1" />}
                          {property.trend === "stable" && <span className="h-4 w-4 mr-1">→</span>}
                          <span className="capitalize">{property.trend}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Tenant Stats</CardTitle>
            <CardDescription>Key metrics about your tenants</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-md text-center">
                  <Users className="h-5 w-5 mx-auto mb-1 text-gray-500" />
                  <p className="text-sm text-gray-500">Total Tenants</p>
                  <p className="text-xl font-semibold">{mockTenantStats.totalTenants}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-md text-center">
                  <p className="text-sm text-gray-500">New Tenants</p>
                  <p className="text-xl font-semibold">{mockTenantStats.newTenants}</p>
                  <Badge className="mt-1 bg-green-100 text-green-600 font-normal text-xs">
                    Last 3 months
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-500">Payment Stats</h3>
                <div className="flex justify-between items-center">
                  <span className="text-sm">On-time Payments</span>
                  <span className="font-medium">{mockTenantStats.onTimePayments}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${mockTenantStats.onTimePayments}%` }}></div>
                </div>
                
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm">Late Payments</span>
                  <span className="font-medium">{mockTenantStats.latePayments}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-red-500 h-2.5 rounded-full" style={{ width: `${mockTenantStats.latePayments}%` }}></div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-500">Tenant Quality</h3>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Average Tenancy</span>
                  <span className="font-medium">{mockTenantStats.averageTenancy} months</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Average Assurance Score</span>
                  <span className="font-medium">{mockTenantStats.averageCredScore}/100</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Occupancy Trends */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Occupancy Trends</CardTitle>
          <CardDescription>Monthly occupancy rates for your properties</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={mockOccupancyRateData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value) => [`${value}%`, 'Occupancy Rate']} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="rate" 
                  stroke="#8884d8" 
                  activeDot={{ r: 8 }} 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Report Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Custom Reports</CardTitle>
          <CardDescription>Generate detailed reports for your properties</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto py-6 flex flex-col items-center justify-center">
              <ClipboardList className="h-10 w-10 mb-3 text-orange-500" />
              <span className="font-medium">Income Statement</span>
              <span className="text-xs text-gray-500 mt-1">Revenue & Expense Details</span>
            </Button>
            
            <Button variant="outline" className="h-auto py-6 flex flex-col items-center justify-center">
              <LineChartIcon className="h-10 w-10 mb-3 text-green-500" />
              <span className="font-medium">Performance Report</span>
              <span className="text-xs text-gray-500 mt-1">ROI & Occupancy Analysis</span>
            </Button>
            
            <Button variant="outline" className="h-auto py-6 flex flex-col items-center justify-center">
              <Users className="h-10 w-10 mb-3 text-blue-500" />
              <span className="font-medium">Tenant Report</span>
              <span className="text-xs text-gray-500 mt-1">Tenant History & Payments</span>
            </Button>
            
            <Button variant="outline" className="h-auto py-6 flex flex-col items-center justify-center">
              <Calendar className="h-10 w-10 mb-3 text-purple-500" />
              <span className="font-medium">Tax Report</span>
              <span className="text-xs text-gray-500 mt-1">Annual Tax Summary</span>
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <Button variant="outline">Schedule Reports</Button>
          <Button className="bg-orange-500 hover:bg-orange-600">
            <Download className="h-4 w-4 mr-2" />
            Download All Reports
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
} 