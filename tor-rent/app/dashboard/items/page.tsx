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
    title: "Sony Alpha A7III Camera",
    category: "Electronics",
    price: "₹2,500/day",
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1350&q=80",
    status: "available",
    credScore: 95,
    owner: "Vikram Mehta",
    description: "Professional Sony mirrorless camera with 24-70mm lens, perfect for events and photography sessions.",
  },
  {
    id: "2",
    title: "Royal Enfield Himalayan",
    category: "Vehicles",
    price: "₹1,200/day",
    image: "https://images.unsplash.com/photo-1662391327580-69d98bde1618?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1350&q=80",
    status: "available",
    credScore: 92,
    owner: "Arjun Singh",
    description: "Adventure motorcycle perfect for weekend trips to Lonavala or longer journeys to Ladakh.",
  },
  {
    id: "3",
    title: "Portable Projector",
    category: "Electronics",
    price: "₹800/day",
    image: "https://images.unsplash.com/photo-1626379953822-baec19c3accd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1350&q=80",
    status: "available",
    credScore: 88,
    owner: "Priya Sharma",
    description: "BenQ portable projector for home movie nights or business presentations.",
  },
  {
    id: "4",
    title: "Bosch Power Tools Set",
    category: "Tools",
    price: "₹1,500/day",
    image: "https://images.unsplash.com/photo-1581147036324-c47a03a81d48?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1350&q=80",
    status: "available",
    credScore: 90,
    owner: "Rajesh Patel",
    description: "Complete power tools set including drill machine, grinder, and electric screwdriver for home renovations.",
  },
  {
    id: "5",
    title: "DJ Sound System",
    category: "Music",
    price: "₹3,000/day",
    image: "https://images.unsplash.com/photo-1571656419377-b5a261c28eb5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1350&q=80",
    status: "available",
    credScore: 94,
    owner: "Neha Kapoor",
    description: "Professional sound system with mixer, speakers and lights, perfect for parties and small weddings.",
  },
  {
    id: "6",
    title: "Camping Gear Set",
    category: "Sports & Outdoors",
    price: "₹1,800/day",
    image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1350&q=80",
    status: "available",
    credScore: 89,
    owner: "Karan Malhotra",
    description: "Complete camping set with Quechua tent, sleeping bags, and portable stove for Sahyadri treks.",
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

