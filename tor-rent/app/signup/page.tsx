"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Shield, Wallet } from "lucide-react"

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [accountType, setAccountType] = useState("tenant")

  const handleMetamaskSignup = () => {
    setIsLoading(true)
    // Simulate Metamask connection
    setTimeout(() => {
      setIsLoading(false)
      // Redirect would happen here in a real app
    }, 1500)
  }

  return (
    <div className="flex min-h-screen bg-white">
      <div className="hidden md:flex flex-1 bg-orange-500 items-center justify-center">
        <div className="max-w-md p-8 text-white">
          <Shield className="w-12 h-12 mb-6" />
          <h1 className="text-3xl font-bold mb-4">Join Tor-Rent Today</h1>
          <p className="text-orange-100 mb-6">
            Create an account to start your secure, blockchain-powered rental journey.
          </p>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-white text-orange-500 flex items-center justify-center text-sm font-bold">
                1
              </div>
              <p>Sign up and connect your Metamask wallet</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-white text-orange-500 flex items-center justify-center text-sm font-bold">
                2
              </div>
              <p>Browse properties and items available for rent</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-white text-orange-500 flex items-center justify-center text-sm font-bold">
                3
              </div>
              <p>Create secure, blockchain-based rental agreements</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-6 h-6 text-orange-500" />
              <span className="text-xl font-bold">Tor-Rent</span>
            </div>
            <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
            <CardDescription>Enter your information to get started</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <RadioGroup
              defaultValue="tenant"
              className="grid grid-cols-2 gap-4"
              onValueChange={setAccountType}
              value={accountType}
            >
              <div>
                <RadioGroupItem value="tenant" id="tenant" className="peer sr-only" />
                <Label
                  htmlFor="tenant"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 hover:border-orange-200 peer-data-[state=checked]:border-orange-500 peer-data-[state=checked]:bg-orange-50"
                >
                  <span className="text-sm font-medium">Tenant</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem value="landlord" id="landlord" className="peer sr-only" />
                <Label
                  htmlFor="landlord"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 hover:border-orange-200 peer-data-[state=checked]:border-orange-500 peer-data-[state=checked]:bg-orange-50"
                >
                  <span className="text-sm font-medium">Landlord</span>
                </Label>
              </div>
            </RadioGroup>

            <Button
              className="w-full bg-orange-500 hover:bg-orange-600 flex items-center gap-2"
              onClick={handleMetamaskSignup}
              disabled={isLoading}
            >
              <Wallet className="w-5 h-5" />
              {isLoading ? "Connecting..." : "Sign up with Metamask"}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first-name">First name</Label>
                <Input id="first-name" placeholder="John" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name">Last name</Label>
                <Input id="last-name" placeholder="Doe" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" placeholder="name@example.com" type="email" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" />
            </div>

            <Button className="w-full bg-orange-500 hover:bg-orange-600">Create Account</Button>
          </CardContent>
          <CardFooter>
            <p className="text-center text-sm text-gray-500 w-full">
              Already have an account?{" "}
              <Link href="/login" className="text-orange-500 hover:underline">
                Log in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

