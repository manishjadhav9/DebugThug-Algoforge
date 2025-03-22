"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Gift, Star, Clock, ArrowRight, Ticket, Tag, CheckCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { unsplashImages } from "@/lib/utils"

export default function LoyaltyPage() {
  // Sample data - replace with actual data from your backend
  const loyaltyInfo = {
    points: 2500,
    tier: "Gold",
    nextTier: "Platinum",
    pointsToNextTier: 1500,
    totalPointsNeeded: 4000,
    history: [
      {
        id: "1",
        description: "Monthly rent payment - Luxury Apartment Bandra",
        points: 500,
        date: "2024-03-01",
        type: "earned"
      },
      {
        id: "2",
        description: "Maintenance request resolved",
        points: 50,
        date: "2024-02-28",
        type: "earned"
      },
      {
        id: "3",
        description: "Redeemed for Amazon voucher",
        points: -1000,
        date: "2024-02-15",
        type: "redeemed"
      }
    ],
    rewards: [
      {
        id: "1",
        title: "₹500 Amazon Gift Card",
        points: 1000,
        category: "Shopping",
        image: unsplashImages.giftCard
      },
      {
        id: "2",
        title: "50% Off Security Deposit",
        points: 5000,
        category: "Rental Benefits",
        image: unsplashImages.discount
      },
      {
        id: "3",
        title: "Free Maintenance Service",
        points: 2000,
        category: "Services",
        image: unsplashImages.service
      },
      {
        id: "4",
        title: "1 Month Free Rental Insurance",
        points: 3000,
        category: "Insurance",
        image: unsplashImages.insurance
      }
    ],
    tiers: [
      {
        name: "Silver",
        pointsRequired: 0,
        benefits: [
          "Basic reward redemptions",
          "Monthly newsletters",
          "Standard support"
        ]
      },
      {
        name: "Gold",
        pointsRequired: 2000,
        benefits: [
          "Premium reward redemptions",
          "Priority support",
          "Quarterly bonus points",
          "Exclusive deals"
        ]
      },
      {
        name: "Platinum",
        pointsRequired: 4000,
        benefits: [
          "VIP reward redemptions",
          "24/7 priority support",
          "Monthly bonus points",
          "Exclusive deals and previews",
          "Free insurance upgrades"
        ]
      }
    ]
  }

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Loyalty Program</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Points Overview */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Your Points</h3>
                  <p className="text-3xl font-bold">{loyaltyInfo.points}</p>
                </div>
                <div className="rounded-full bg-orange-100 p-3">
                  <Gift className="h-6 w-6 text-orange-600" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm">
                  <span>Progress to {loyaltyInfo.nextTier}</span>
                  <span>{loyaltyInfo.pointsToNextTier} points needed</span>
                </div>
                <Progress
                  value={(loyaltyInfo.points / loyaltyInfo.totalPointsNeeded) * 100}
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>

          {/* Current Tier */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Current Tier</h3>
                  <p className="text-3xl font-bold">{loyaltyInfo.tier}</p>
                </div>
                <div className="rounded-full bg-yellow-100 p-3">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
              <div className="mt-4">
                <h4 className="font-medium">Your Benefits:</h4>
                <div className="mt-2 space-y-2">
                  {loyaltyInfo.tiers
                    .find((tier) => tier.name === loyaltyInfo.tier)
                    ?.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Available Rewards */}
        <Card>
          <CardHeader>
            <CardTitle>Available Rewards</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-4 md:grid-cols-4">
              {loyaltyInfo.rewards.map((reward) => (
                <Card key={reward.id}>
                  <CardContent className="p-4">
                    <div className="aspect-square overflow-hidden rounded-lg">
                      <img
                        src={reward.image}
                        alt={reward.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="mt-4">
                      <h4 className="font-semibold">{reward.title}</h4>
                      <p className="text-sm text-gray-500">{reward.category}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="flex items-center gap-1 text-sm">
                          <Gift className="h-4 w-4" />
                          {reward.points} points
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={loyaltyInfo.points < reward.points}
                        >
                          Redeem
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Points History */}
        <Card>
          <CardHeader>
            <CardTitle>Points History</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {loyaltyInfo.history.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`rounded-full p-2 ${
                        transaction.type === "earned"
                          ? "bg-green-100"
                          : "bg-orange-100"
                      }`}
                    >
                      {transaction.type === "earned" ? (
                        <ArrowRight
                          className="h-4 w-4 text-green-600"
                          style={{ transform: "rotate(-45deg)" }}
                        />
                      ) : (
                        <Tag className="h-4 w-4 text-orange-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-gray-500">{transaction.date}</p>
                    </div>
                  </div>
                  <span
                    className={`font-medium ${
                      transaction.type === "earned"
                        ? "text-green-600"
                        : "text-orange-600"
                    }`}
                  >
                    {transaction.type === "earned" ? "+" : "-"}
                    {Math.abs(transaction.points)} points
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tier Benefits */}
        <Card>
          <CardHeader>
            <CardTitle>Tier Benefits</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-4 md:grid-cols-3">
              {loyaltyInfo.tiers.map((tier) => (
                <Card
                  key={tier.name}
                  className={`${
                    tier.name === loyaltyInfo.tier
                      ? "border-2 border-orange-500"
                      : ""
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-semibold">{tier.name}</h4>
                      {tier.name === loyaltyInfo.tier && (
                        <Badge variant="default">Current Tier</Badge>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {tier.pointsRequired} points required
                    </p>
                    <div className="mt-4 space-y-2">
                      {tier.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
} 