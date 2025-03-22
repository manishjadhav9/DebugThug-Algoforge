"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Award, Gift, Star, TrendingUp } from "lucide-react"

export function LoyaltyPointsCard() {
  const [showRewards, setShowRewards] = useState(false)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Loyalty Program</CardTitle>
            <CardDescription>Your Rentocoin rewards and achievements</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <img src="/placeholder.svg?height=30&width=30&text=RTC" alt="Rentocoin" className="h-8 w-8" />
            <span className="text-xl font-bold">250 RTC</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Tenant Level</h3>
              <Badge className="bg-orange-500">Gold Tenant</Badge>
            </div>
            <div className="mt-2 space-y-1">
              <div className="flex justify-between text-sm">
                <span>Progress to Platinum</span>
                <span>750 / 1000 points</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Earn 250 more points to reach Platinum level and unlock exclusive benefits.
            </p>
          </div>

          <div>
            <h3 className="font-medium">Recent Activity</h3>
            <div className="mt-2 space-y-2">
              <div className="flex justify-between rounded-lg border p-2">
                <span className="text-sm">On-time Rent Payment</span>
                <span className="font-medium text-green-500">+25 RTC</span>
              </div>
              <div className="flex justify-between rounded-lg border p-2">
                <span className="text-sm">Property Review Submitted</span>
                <span className="font-medium text-green-500">+10 RTC</span>
              </div>
              <div className="flex justify-between rounded-lg border p-2">
                <span className="text-sm">Referral Bonus</span>
                <span className="font-medium text-green-500">+50 RTC</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-medium">Achievements</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            <div className="flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1">
              <Award className="h-4 w-4 text-orange-500" />
              <span className="text-sm">Perfect Payer</span>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1">
              <Star className="h-4 w-4 text-orange-500" />
              <span className="text-sm">5-Star Tenant</span>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1">
              <TrendingUp className="h-4 w-4 text-orange-500" />
              <span className="text-sm">Rising Star</span>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-gray-500">
              <Gift className="h-4 w-4" />
              <span className="text-sm">Super Referrer</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Dialog open={showRewards} onOpenChange={setShowRewards}>
          <DialogTrigger asChild>
            <Button className="w-full bg-orange-500 hover:bg-orange-600">
              <Gift className="mr-2 h-4 w-4" />
              Redeem Rewards
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Redeem Rentocoins</DialogTitle>
              <DialogDescription>
                Use your Rentocoins for discounts on rent, service fees, or convert to ETH.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="rounded-lg border p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-orange-100 p-2">
                      <Gift className="h-4 w-4 text-orange-500" />
                    </div>
                    <div>
                      <h4 className="font-medium">Rent Discount</h4>
                      <p className="text-sm text-gray-500">Get 5% off your next rent payment</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">200 RTC</p>
                    <Button size="sm" className="mt-1 h-7 bg-orange-500 hover:bg-orange-600">
                      Redeem
                    </Button>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-orange-100 p-2">
                      <Gift className="h-4 w-4 text-orange-500" />
                    </div>
                    <div>
                      <h4 className="font-medium">Service Fee Waiver</h4>
                      <p className="text-sm text-gray-500">Waive service fees on your next rental</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">150 RTC</p>
                    <Button size="sm" className="mt-1 h-7 bg-orange-500 hover:bg-orange-600">
                      Redeem
                    </Button>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-orange-100 p-2">
                      <Gift className="h-4 w-4 text-orange-500" />
                    </div>
                    <div>
                      <h4 className="font-medium">Convert to ETH</h4>
                      <p className="text-sm text-gray-500">Convert your Rentocoins to ETH</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">500 RTC</p>
                    <Button size="sm" className="mt-1 h-7" variant="outline" disabled>
                      Redeem
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  )
}

