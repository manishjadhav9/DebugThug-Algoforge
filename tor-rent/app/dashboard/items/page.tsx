"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Filter, Search } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ItemCard } from "@/components/item-card"

// Static items data
const items = [
  {
    id: "1",
    title: "Professional DSLR Camera",
    category: "Electronics",
    price: "0.01 ETH/day",
    image: "/placeholder.svg?height=200&width=300",
    status: "available",
    credScore: 95,
    owner: "Alex Thompson",
    description: "Canon EOS 5D Mark IV with 24-70mm lens, perfect for professional photography.",
  },
  {
    id: "2",
    title: "Mountain Bike",
    category: "Sports & Outdoors",
    price: "0.005 ETH/day",
    image: "/placeholder.svg?height=200&width=300",
    status: "available",
    credScore: 92,
    owner: "Sarah Johnson",
    description: "Trek Fuel EX 8 mountain bike, great for trail riding and adventures.",
  },
  {
    id: "3",
    title: "Portable Projector",
    category: "Electronics",
    price: "0.008 ETH/day",
    image: "/placeholder.svg?height=200&width=300",
    status: "available",
    credScore: 88,
    owner: "Michael Chen",
    description: "Anker Nebula Capsule II smart mini projector with Android TV built-in.",
  },
  {
    id: "4",
    title: "Power Tools Set",
    category: "Tools",
    price: "0.012 ETH/day",
    image: "/placeholder.svg?height=200&width=300",
    status: "available",
    credScore: 90,
    owner: "Robert Garcia",
    description: "Complete DeWalt power tools set including drill, saw, and sander.",
  },
  {
    id: "5",
    title: "DJ Equipment",
    category: "Music",
    price: "0.02 ETH/day",
    image: "/placeholder.svg?height=200&width=300",
    status: "available",
    credScore: 94,
    owner: "Emily Rodriguez",
    description: "Pioneer DJ controller with speakers and headphones, perfect for events.",
  },
  {
    id: "6",
    title: "Camping Gear",
    category: "Sports & Outdoors",
    price: "0.015 ETH/day",
    image: "/placeholder.svg?height=200&width=300",
    status: "available",
    credScore: 89,
    owner: "David Kim",
    description: "Complete camping set with tent, sleeping bags, and cooking equipment.",
  },
]

const categories = ["All Categories", "Electronics", "Sports & Outdoors", "Tools", "Music", "Furniture", "Vehicles"]

export default function ItemsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")

  // Filter items based on search query and category
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = selectedCategory === "All Categories" || item.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Multi-Item Rentals</h1>
          <p className="text-gray-500">Rent various items for your needs</p>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search items..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <select
                    className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="all">
          <TabsList className="grid w-full grid-cols-3 md:w-auto">
            <TabsTrigger value="all">All Items</TabsTrigger>
            <TabsTrigger value="rented">My Rentals</TabsTrigger>
            <TabsTrigger value="listed">My Listings</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((item) => (
                <ItemCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  category={item.category}
                  price={item.price}
                  image={item.image}
                  status={item.status}
                  credScore={item.credScore}
                  owner={item.owner}
                  description={item.description}
                />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="rented" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>My Rented Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="rounded-full bg-orange-100 p-4">
                    <Search className="h-8 w-8 text-orange-500" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium">No items rented yet</h3>
                  <p className="mt-2 text-gray-500">Browse available items and start renting today.</p>
                  <Button className="mt-4 bg-orange-500 hover:bg-orange-600">Browse Items</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="listed" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>My Listed Items</CardTitle>
                <Button className="bg-orange-500 hover:bg-orange-600">List New Item</Button>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="rounded-full bg-orange-100 p-4">
                    <Search className="h-8 w-8 text-orange-500" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium">No items listed yet</h3>
                  <p className="mt-2 text-gray-500">Start listing your items to earn passive income.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

