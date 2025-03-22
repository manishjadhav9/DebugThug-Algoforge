"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, DollarSign, Filter, Search, Star, ThumbsUp, Wrench } from "lucide-react"

// Mock services data
const services = [
  {
    id: "service-1",
    title: "Professional Cleaning",
    description: "Deep cleaning services for properties between tenants or for regular maintenance.",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1350&q=80",
    category: "cleaning",
    price: "₹2,500 - ₹8,000",
    rating: 4.8,
    reviewCount: 156,
    turnaround: "24-48 hours"
  },
  {
    id: "service-2",
    title: "Plumbing Repairs",
    description: "Licensed plumbers for leak fixing, pipe repairs, fixture installation, and more.",
    image: "https://images.unsplash.com/photo-1558618666-c6879a9b1f6d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1350&q=80",
    category: "repair",
    price: "₹1,500 - ₹5,000",
    rating: 4.7,
    reviewCount: 94,
    turnaround: "Same day"
  },
  {
    id: "service-3",
    title: "Electrical Work",
    description: "Certified electricians for all your electrical needs, including wiring, fixtures, and safety inspections.",
    image: "https://images.unsplash.com/photo-1565608438257-faf9e37adf8b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1350&q=80",
    category: "repair",
    price: "₹2,000 - ₹6,000",
    rating: 4.9,
    reviewCount: 72,
    turnaround: "24 hours"
  },
  {
    id: "service-4",
    title: "Home Painting",
    description: "Professional painting services for interior and exterior walls, with premium quality paints.",
    image: "https://images.unsplash.com/photo-1562887085-22edc4817be0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1350&q=80",
    category: "renovation",
    price: "₹15,000 - ₹50,000",
    rating: 4.6,
    reviewCount: 88,
    turnaround: "3-7 days"
  },
  {
    id: "service-5",
    title: "Pest Control",
    description: "Comprehensive pest control services to keep your property free from unwanted guests.",
    image: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1350&q=80",
    category: "maintenance",
    price: "₹3,500 - ₹12,000",
    rating: 4.7,
    reviewCount: 65,
    turnaround: "24 hours"
  },
  {
    id: "service-6",
    title: "Property Inspection",
    description: "Detailed property inspections before new tenants or for regular maintenance checks.",
    image: "https://images.unsplash.com/photo-1629904853893-c2c8981a1dc5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1350&q=80",
    category: "inspection",
    price: "₹5,000 - ₹15,000",
    rating: 4.9,
    reviewCount: 42,
    turnaround: "48 hours"
  },
  {
    id: "service-7",
    title: "Furniture Assembly",
    description: "Quick and professional furniture assembly for new properties or tenant requirements.",
    image: "https://images.unsplash.com/photo-1581622558667-3419a8dc5f83?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1350&q=80",
    category: "installation",
    price: "₹1,000 - ₹3,000",
    rating: 4.5,
    reviewCount: 38,
    turnaround: "Same day"
  },
  {
    id: "service-8",
    title: "Landscaping & Garden",
    description: "Professional garden maintenance and landscaping services to enhance property appeal.",
    image: "https://images.unsplash.com/photo-1558904541-eba5a448bcf0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1350&q=80",
    category: "maintenance",
    price: "₹4,000 - ₹25,000",
    rating: 4.8,
    reviewCount: 56,
    turnaround: "2-5 days"
  }
]

export default function ServicesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")

  // Filter services based on search and category
  const filteredServices = services.filter((service) => {
    const matchesSearch = 
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = categoryFilter === "all" || service.category === categoryFilter
    
    return matchesSearch && matchesCategory
  })

  return (
    <div className="p-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Property Services</h1>
          <p className="text-gray-500">Book professional services for your rental properties</p>
        </div>
      </div>

      <div className="mb-6 flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search services..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <Tabs value={categoryFilter} onValueChange={setCategoryFilter}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="cleaning">Cleaning</TabsTrigger>
              <TabsTrigger value="repair">Repairs</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
              <TabsTrigger value="renovation">Renovation</TabsTrigger>
              <TabsTrigger value="inspection">Inspection</TabsTrigger>
              <TabsTrigger value="installation">Installation</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {filteredServices.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Wrench className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No services found</h3>
            <p className="text-gray-500 mb-6">
              Try adjusting your search or filter criteria
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredServices.map((service) => (
            <Card key={service.id} className="overflow-hidden flex flex-col h-full">
              <div className="relative h-48">
                <img
                  src={service.image}
                  alt={service.title}
                  className="h-full w-full object-cover"
                />
                <Badge className="absolute top-2 right-2 bg-orange-500">
                  {service.category.charAt(0).toUpperCase() + service.category.slice(1)}
                </Badge>
              </div>
              <CardHeader className="pb-2">
                <CardTitle>{service.title}</CardTitle>
                <CardDescription className="line-clamp-2">{service.description}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2 flex-grow">
                <div className="flex items-center text-sm text-gray-700 mb-2">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="font-medium">{service.rating}</span>
                  <span className="text-gray-500 ml-1">({service.reviewCount} reviews)</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <DollarSign className="h-4 w-4 text-gray-500 mr-2" />
                    <span>{service.price}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 text-gray-500 mr-2" />
                    <span>Turnaround: {service.turnaround}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link href={`/dashboard/landlord/services/${service.id}`} className="w-full">
                  <Button className="w-full bg-orange-500 hover:bg-orange-600">Book Service</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 