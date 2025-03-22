"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Star, ThumbsUp, MessageSquare } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ReviewsPage() {
  const [activeTab, setActiveTab] = useState("my-reviews")

  // Sample data - replace with actual data from your backend
  const myReviews = [
    {
      id: "1",
      propertyName: "Luxury Apartment in Bandra",
      landlordName: "Mr. Sharma",
      rating: 4,
      review: "Great property with excellent amenities. The landlord was very cooperative and responsive.",
      date: "2024-02-15",
      likes: 5,
      replies: 2,
      image: "/placeholder.svg"
    },
    {
      id: "2",
      propertyName: "2BHK in Andheri",
      landlordName: "Mrs. Patel",
      rating: 5,
      review: "Amazing experience! The property was well-maintained and the location is perfect.",
      date: "2024-01-20",
      likes: 8,
      replies: 3,
      image: "/placeholder.svg"
    }
  ]

  const pendingReviews = [
    {
      id: "3",
      propertyName: "Studio Apartment in Powai",
      landlordName: "Mr. Kumar",
      startDate: "2023-06-01",
      endDate: "2024-02-29",
      image: "/placeholder.svg"
    }
  ]

  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, index) => (
        <Star
          key={index}
          className={`h-4 w-4 ${
            index < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
        />
      ))
  }

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Reviews & Ratings</h2>
        </div>

        <Tabs defaultValue="my-reviews" className="space-y-4">
          <TabsList>
            <TabsTrigger value="my-reviews" onClick={() => setActiveTab("my-reviews")}>
              My Reviews
            </TabsTrigger>
            <TabsTrigger value="pending" onClick={() => setActiveTab("pending")}>
              Pending Reviews
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my-reviews" className="space-y-4">
            {myReviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="h-24 w-24 flex-shrink-0">
                      <img
                        src={review.image}
                        alt={review.propertyName}
                        className="h-full w-full rounded-md object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div>
                        <h3 className="font-semibold">{review.propertyName}</h3>
                        <p className="text-sm text-gray-500">Landlord: {review.landlordName}</p>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        {renderStars(review.rating)}
                        <span className="ml-2 text-sm text-gray-600">{review.date}</span>
                      </div>
                      <p className="mt-2 text-sm text-gray-600">{review.review}</p>
                      <div className="mt-4 flex items-center gap-4">
                        <Button variant="ghost" size="sm" className="flex items-center gap-1">
                          <ThumbsUp className="h-4 w-4" />
                          <span>{review.likes} Likes</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          <span>{review.replies} Replies</span>
                        </Button>
                        <Button variant="outline" size="sm">Edit Review</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            {pendingReviews.map((property) => (
              <Card key={property.id}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="h-24 w-24 flex-shrink-0">
                      <img
                        src={property.image}
                        alt={property.propertyName}
                        className="h-full w-full rounded-md object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div>
                        <h3 className="font-semibold">{property.propertyName}</h3>
                        <p className="text-sm text-gray-500">Landlord: {property.landlordName}</p>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        <p>Rental Period: {property.startDate} to {property.endDate}</p>
                      </div>
                      <div className="mt-4">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button>Write Review</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Write a Review</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="flex items-center gap-1">
                                {Array(5).fill(0).map((_, index) => (
                                  <Star
                                    key={index}
                                    className="h-6 w-6 cursor-pointer text-gray-300 hover:text-yellow-400"
                                  />
                                ))}
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Your Review</label>
                                <Textarea
                                  placeholder="Share your experience with this property and landlord..."
                                  className="min-h-[100px]"
                                />
                              </div>
                              <div className="flex justify-end">
                                <Button>Submit Review</Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
} 