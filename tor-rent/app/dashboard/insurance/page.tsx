"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Shield, AlertCircle, CheckCircle, Clock, FileText, ArrowRight } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export default function InsurancePage() {
  // Sample data - replace with actual data from your backend
  const insurancePolicies = [
    {
      id: "1",
      property: "Luxury Apartment in Bandra",
      policyNumber: "RTI-2024-001",
      type: "Comprehensive Rental Insurance",
      status: "active",
      coverage: "₹5,00,000",
      premium: "₹2,500/month",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      provider: "TorRent Secure",
      coverageDetails: [
        "Personal belongings up to ₹3,00,000",
        "Property damage liability up to ₹1,00,000",
        "Rent loss coverage up to ₹50,000",
        "Emergency accommodation up to ₹50,000"
      ]
    },
    {
      id: "2",
      property: "2BHK in Andheri",
      policyNumber: "RTI-2023-045",
      type: "Basic Rental Insurance",
      status: "expired",
      coverage: "₹3,00,000",
      premium: "₹1,500/month",
      startDate: "2023-01-01",
      endDate: "2023-12-31",
      provider: "TorRent Secure",
      coverageDetails: [
        "Personal belongings up to ₹1,50,000",
        "Property damage liability up to ₹1,00,000",
        "Emergency accommodation up to ₹50,000"
      ]
    }
  ]

  const recommendedPlans = [
    {
      id: "basic",
      name: "Basic Plan",
      price: "₹1,500/month",
      coverage: "₹3,00,000",
      features: [
        "Personal belongings coverage",
        "Basic liability protection",
        "Emergency accommodation"
      ]
    },
    {
      id: "standard",
      name: "Standard Plan",
      price: "₹2,500/month",
      coverage: "₹5,00,000",
      features: [
        "Enhanced personal belongings coverage",
        "Extended liability protection",
        "Rent loss coverage",
        "Emergency accommodation",
        "24/7 claims support"
      ],
      recommended: true
    },
    {
      id: "premium",
      name: "Premium Plan",
      price: "₹4,000/month",
      coverage: "₹10,00,000",
      features: [
        "Comprehensive belongings coverage",
        "Maximum liability protection",
        "Extended rent loss coverage",
        "Premium emergency accommodation",
        "Priority 24/7 claims support",
        "Additional living expenses"
      ]
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="success">Active</Badge>
      case "expired":
        return <Badge variant="destructive">Expired</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Rental Insurance</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Get New Insurance</Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Choose Insurance Plan</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4 md:grid-cols-3">
                {recommendedPlans.map((plan) => (
                  <Card
                    key={plan.id}
                    className={`relative ${
                      plan.recommended ? "border-2 border-orange-500" : ""
                    }`}
                  >
                    {plan.recommended && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-orange-500 px-3 py-1 text-xs font-medium text-white">
                        Recommended
                      </div>
                    )}
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold">{plan.name}</h3>
                      <div className="mt-2">
                        <p className="text-2xl font-bold">{plan.price}</p>
                        <p className="text-sm text-gray-500">Coverage up to {plan.coverage}</p>
                      </div>
                      <div className="mt-4 space-y-2">
                        {plan.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                      <Button className="mt-4 w-full">Select Plan</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4">
          {insurancePolicies.map((policy) => (
            <Card key={policy.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{policy.type}</h3>
                      {getStatusBadge(policy.status)}
                    </div>
                    <p className="text-sm text-gray-500">{policy.property}</p>
                    <p className="mt-1 text-sm">Policy Number: {policy.policyNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{policy.coverage}</p>
                    <p className="text-sm text-gray-500">{policy.premium}</p>
                  </div>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="text-sm font-medium">Coverage Details</h4>
                    <div className="mt-2 space-y-2">
                      {policy.coverageDetails.map((detail, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <Shield className="h-4 w-4 text-green-500" />
                          <span>{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Policy Information</h4>
                    <div className="mt-2 space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>Start Date: {policy.startDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>End Date: {policy.endDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-gray-500" />
                        <span>Provider: {policy.provider}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    View Policy
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    File Claim
                  </Button>
                  {policy.status === "expired" && (
                    <Button size="sm" className="flex items-center gap-1">
                      <ArrowRight className="h-4 w-4" />
                      Renew Policy
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
} 