"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, BarChart2 } from "lucide-react"
import { AssuranceMeter } from "@/components/assurance-meter"

interface PropertyCardProps {
  id: string
  title: string
  location: string
  price: string
  image: string
  status: "active" | "pending" | "completed"
  credScore: number
}

export function PropertyCard({ id, title, location, price, image, status, credScore }: PropertyCardProps) {
  const [isComparing, setIsComparing] = useState(false)

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsComparing(!isComparing)

    // In a real app, this would add/remove the property from a comparison list
    // For demo purposes, we'll just toggle the state

    // Get current comparison list from localStorage
    const currentCompareList = JSON.parse(localStorage.getItem("compareList") || "[]")

    if (isComparing) {
      // Remove from comparison
      const newList = currentCompareList.filter((item: string) => item !== id)
      localStorage.setItem("compareList", JSON.stringify(newList))
    } else {
      // Add to comparison if not already in list and list length < 3
      if (!currentCompareList.includes(id) && currentCompareList.length < 3) {
        // Add to comparison
        currentCompareList.push(id)
        localStorage.setItem("compareList", JSON.stringify(currentCompareList))
      }
    }
  }

  return (
    <Card className="overflow-hidden">
      <div className="relative">
        <img src={image || "/placeholder.svg"} alt={title} className="h-48 w-full object-cover" />
        <Badge
          className={`absolute right-2 top-2 ${
            status === "active" ? "bg-green-500" : status === "pending" ? "bg-orange-500" : "bg-blue-500"
          }`}
        >
          {status === "active" ? "Active" : status === "pending" ? "Pending" : "Completed"}
        </Badge>
      </div>
      <CardContent className="p-4">
        <h3 className="font-bold">{title}</h3>
        <div className="mt-1 flex items-center text-sm text-gray-500">
          <MapPin className="mr-1 h-4 w-4" />
          {location}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Price</p>
            <p className="font-bold">{price}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Assurance Score</p>
            <AssuranceMeter score={credScore} size="small" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t p-4">
        <div className="flex w-full gap-2">
          <Link href={`/dashboard/properties/${id}`} className="flex-1">
            <Button className="w-full bg-orange-500 hover:bg-orange-600">View Details</Button>
          </Link>
          <Button
            variant={isComparing ? "default" : "outline"}
            size="icon"
            className={isComparing ? "bg-orange-500 hover:bg-orange-600" : ""}
            onClick={handleCompare}
          >
            <BarChart2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

