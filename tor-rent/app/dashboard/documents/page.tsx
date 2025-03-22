"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { FileText, Upload, Download, Eye, Trash2, Clock, CheckCircle, XCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { unsplashImages } from "@/lib/utils"

export default function DocumentsPage() {
  const [activeTab, setActiveTab] = useState("rental")

  const documents = {
    rental: [
      {
        id: "1",
        title: "Rental Agreement",
        property: "Luxury Apartment Bandra",
        type: "Contract",
        status: "active",
        uploadDate: "2024-01-01",
        expiryDate: "2024-12-31",
        image: unsplashImages.contract
      },
      {
        id: "2",
        title: "Security Deposit Receipt",
        property: "Premium Villa Juhu",
        type: "Receipt",
        status: "active",
        uploadDate: "2023-12-01",
        expiryDate: null,
        image: unsplashImages.contract
      }
    ],
    personal: [
      {
        id: "3",
        title: "Aadhar Card",
        type: "Identity",
        status: "verified",
        uploadDate: "2024-01-15",
        expiryDate: null,
        image: unsplashImages.identification
      },
      {
        id: "4",
        title: "PAN Card",
        type: "Identity",
        status: "verified",
        uploadDate: "2024-01-15",
        expiryDate: null,
        image: unsplashImages.identification
      },
      {
        id: "5",
        title: "Employment Certificate",
        type: "Certificate",
        status: "verified",
        uploadDate: "2024-01-15",
        expiryDate: "2025-01-15",
        image: unsplashImages.certificate
      }
    ]
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default" className="bg-green-500">Active</Badge>
      case "expired":
        return <Badge variant="destructive">Expired</Badge>
      case "verified":
        return <Badge variant="default" className="bg-blue-500">Verified</Badge>
      case "pending":
        return <Badge variant="default" className="bg-orange-500">Pending</Badge>
      default:
        return <Badge variant="default">{status}</Badge>
    }
  }

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Documents</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Upload className="mr-2 h-4 w-4" />
                Upload Document
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload New Document</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Document Title</label>
                  <Input placeholder="Enter document title" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Document Type</label>
                  <select className="w-full rounded-md border border-gray-300 p-2">
                    <option value="rental-agreement">Rental Agreement</option>
                    <option value="identity-proof">Identity Proof</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Property (if applicable)</label>
                  <select className="w-full rounded-md border border-gray-300 p-2">
                    <option value="">Select Property</option>
                    <option value="1">Luxury Apartment in Bandra</option>
                    <option value="2">2BHK in Andheri</option>
                  </select>
                </div>
                <div className="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    Drag and drop your document here, or click to browse
                  </p>
                  <input type="file" className="hidden" />
                </div>
                <div className="flex justify-end">
                  <Button>Upload</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="rental" className="space-y-4">
          <TabsList>
            <TabsTrigger value="rental" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Rental Documents
            </TabsTrigger>
            <TabsTrigger value="personal" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Personal Documents
            </TabsTrigger>
          </TabsList>

          <TabsContent value="rental" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {documents.rental.map((document) => (
                <Card key={document.id}>
                  <CardContent className="p-0">
                    <div className="aspect-video w-full overflow-hidden">
                      <img
                        src={document.image}
                        alt={document.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{document.title}</h3>
                          <p className="text-sm text-gray-500">{document.property}</p>
                        </div>
                        {getStatusBadge(document.status)}
                      </div>
                      <div className="mt-4">
                        <p className="text-sm text-gray-500">Type: {document.type}</p>
                        <p className="text-sm text-gray-500">Uploaded: {document.uploadDate}</p>
                        {document.expiryDate && (
                          <p className="text-sm text-gray-500">Expires: {document.expiryDate}</p>
                        )}
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <Button variant="outline" size="sm">
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                        <Button variant="outline" size="sm">View Details</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="personal" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {documents.personal.map((document) => (
                <Card key={document.id}>
                  <CardContent className="p-0">
                    <div className="aspect-video w-full overflow-hidden">
                      <img
                        src={document.image}
                        alt={document.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{document.title}</h3>
                          <p className="text-sm text-gray-500">{document.type}</p>
                        </div>
                        {getStatusBadge(document.status)}
                      </div>
                      <div className="mt-4">
                        <p className="text-sm text-gray-500">Uploaded: {document.uploadDate}</p>
                        {document.expiryDate && (
                          <p className="text-sm text-gray-500">Expires: {document.expiryDate}</p>
                        )}
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <Button variant="outline" size="sm">
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                        <Button variant="outline" size="sm">View Details</Button>
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