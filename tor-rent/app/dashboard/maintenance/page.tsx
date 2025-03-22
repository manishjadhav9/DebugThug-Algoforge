"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Wrench, Clock, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import { unsplashImages } from "@/lib/utils"

type MaintenanceStatus = "open" | "in-progress" | "resolved"
type MaintenancePriority = "high" | "medium" | "low"

export default function MaintenancePage() {
  const [selectedRequest, setSelectedRequest] = useState(null)

  const requests = {
    active: [
      {
        id: "1",
        title: "AC Not Working",
        property: "Luxury Apartment Bandra",
        description: "The AC in master bedroom is not cooling properly",
        status: "in-progress" as MaintenanceStatus,
        priority: "high" as MaintenancePriority,
        date: "2024-03-15",
        lastUpdate: "2024-03-16",
        image: unsplashImages.maintenance,
        updates: [
          {
            date: "2024-03-16",
            status: "Technician assigned",
            comment: "Service scheduled for tomorrow between 10 AM - 12 PM"
          }
        ]
      },
      {
        id: "2",
        title: "Cleaning Required",
        property: "Premium Villa Juhu",
        description: "Deep cleaning needed for the entire house",
        status: "open" as MaintenanceStatus,
        priority: "medium" as MaintenancePriority,
        date: "2024-03-14",
        lastUpdate: "2024-03-14",
        image: unsplashImages.cleaning,
        updates: []
      }
    ],
    resolved: [
      {
        id: "3",
        title: "Security System Update",
        property: "Luxury Apartment Bandra",
        description: "Install new security cameras",
        status: "resolved" as MaintenanceStatus,
        priority: "high" as MaintenancePriority,
        date: "2024-03-10",
        lastUpdate: "2024-03-11",
        image: unsplashImages.security,
        updates: [
          {
            date: "2024-03-11",
            status: "Issue resolved",
            comment: "New security system installed and tested"
          }
        ]
      },
      {
        id: "4",
        title: "Regular Maintenance",
        property: "Premium Villa Juhu",
        description: "Monthly maintenance check",
        status: "resolved" as MaintenanceStatus,
        priority: "low" as MaintenancePriority,
        date: "2024-03-08",
        lastUpdate: "2024-03-09",
        image: unsplashImages.maintenance,
        updates: [
          {
            date: "2024-03-09",
            status: "Issue resolved",
            comment: "All systems checked and maintained"
          }
        ]
      }
    ]
  }

  const getStatusBadge = (status: MaintenanceStatus) => {
    switch (status) {
      case "open":
        return <Badge variant="default" className="bg-blue-500">Open</Badge>
      case "in-progress":
        return <Badge variant="default" className="bg-orange-500">In Progress</Badge>
      case "resolved":
        return <Badge variant="default" className="bg-green-500">Resolved</Badge>
      default:
        return <Badge variant="default">Unknown</Badge>
    }
  }

  const getPriorityBadge = (priority: MaintenancePriority) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High Priority</Badge>
      case "medium":
        return <Badge variant="default" className="bg-orange-500">Medium Priority</Badge>
      case "low":
        return <Badge variant="default" className="bg-yellow-500">Low Priority</Badge>
      default:
        return <Badge variant="default">Unknown Priority</Badge>
    }
  }

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Maintenance Requests</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Wrench className="mr-2 h-4 w-4" />
                New Request
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Maintenance Request</DialogTitle>
              </DialogHeader>
              {/* Add maintenance request form here */}
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="active" className="space-y-4">
          <TabsList>
            <TabsTrigger value="active" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Active Requests
            </TabsTrigger>
            <TabsTrigger value="resolved" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Resolved
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {requests.active.map((request) => (
                <Card key={request.id}>
                  <CardContent className="p-0">
                    <div className="aspect-video w-full overflow-hidden">
                      <img
                        src={request.image}
                        alt={request.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{request.title}</h3>
                          <p className="text-sm text-gray-500">{request.property}</p>
                        </div>
                        {getStatusBadge(request.status)}
                      </div>
                      <div className="mt-4">
                        <p className="text-sm">{request.description}</p>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getPriorityBadge(request.priority)}
                          <span className="text-sm text-gray-500">
                            Reported: {request.date}
                          </span>
                        </div>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="resolved" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {requests.resolved.map((request) => (
                <Card key={request.id}>
                  <CardContent className="p-0">
                    <div className="aspect-video w-full overflow-hidden">
                      <img
                        src={request.image}
                        alt={request.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{request.title}</h3>
                          <p className="text-sm text-gray-500">{request.property}</p>
                        </div>
                        {getStatusBadge(request.status)}
                      </div>
                      <div className="mt-4">
                        <p className="text-sm">{request.description}</p>
                      </div>
                      <div className="mt-4">
                        <h4 className="font-medium">Resolution</h4>
                        <p className="mt-1 text-sm">
                          {request.updates[request.updates.length - 1].comment}
                        </p>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          Resolved: {request.lastUpdate}
                        </span>
                        <Button variant="outline" size="sm">
                          View History
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
} 