"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Shield, Wallet } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [userType, setUserType] = useState("tenant")

  const handleMetamaskLogin = () => {
    setIsLoading(true)
    // Simulate Metamask connection
    setTimeout(() => {
      setIsLoading(false)
      // Redirect to dashboard
      router.push("/dashboard")
    }, 1500)
  }

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate login
    setTimeout(() => {
      setIsLoading(false)
      // Redirect to dashboard
      router.push("/dashboard")
    }, 1500)
  }

  return (
    <div className="flex min-h-screen bg-white">
      <div className="hidden md:flex flex-1 bg-orange-500 items-center justify-center">
        <div className="max-w-md p-8 text-white">
          <Shield className="w-12 h-12 mb-6" />
          <h1 className="text-3xl font-bold mb-4">Welcome back to Tor-Rent</h1>
          <p className="text-orange-100 mb-6">
            The decentralized rental platform that provides secure, transparent, and efficient rental experiences.
          </p>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-white text-orange-500 flex items-center justify-center text-sm font-bold">
                1
              </div>
              <p>Connect your Metamask wallet for secure authentication</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-white text-orange-500 flex items-center justify-center text-sm font-bold">
                2
              </div>
              <p>Access your rental agreements and payment history</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-white text-orange-500 flex items-center justify-center text-sm font-bold">
                3
              </div>
              <p>Manage your properties or find new items to rent</p>
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
            <CardTitle className="text-2xl font-bold">Log in to your account</CardTitle>
            <CardDescription>Choose your preferred login method</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <RadioGroup
              defaultValue="tenant"
              className="grid grid-cols-2 gap-4 mb-4"
              onValueChange={setUserType}
              value={userType}
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
              onClick={handleMetamaskLogin}
              disabled={isLoading}
            >
              <Wallet className="w-5 h-5" />
              {isLoading ? "Connecting..." : "Connect with Metamask"}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or continue with</span>
              </div>
            </div>

            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" placeholder="name@example.com" type="email" required />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/forgot-password" className="text-sm text-orange-500 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input id="password" type="password" required />
              </div>
              <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Log In"}
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <p className="text-center text-sm text-gray-500 w-full">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-orange-500 hover:underline">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

