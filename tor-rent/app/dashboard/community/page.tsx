"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Search, ThumbsDown, ThumbsUp } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"

// Static community data
const forumPosts = [
  {
    id: "1",
    title: "Tips for first-time renters?",
    content:
      "I'm about to rent my first apartment using Tor-Rent. Any advice on what I should look out for or questions I should ask the landlord?",
    author: {
      name: "Anonymous",
      avatar: "/placeholder.svg?height=40&width=40",
      credScore: 85,
    },
    date: "2 hours ago",
    region: "Seattle, WA",
    likes: 12,
    dislikes: 0,
    comments: 5,
    tags: ["Advice", "First-time"],
  },
  {
    id: "2",
    title: "How to improve my Cred Score?",
    content:
      "My Cred Score is currently at 78. What are some ways I can improve it to get better rental opportunities?",
    author: {
      name: "Anonymous",
      avatar: "/placeholder.svg?height=40&width=40",
      credScore: 78,
    },
    date: "Yesterday",
    region: "Portland, OR",
    likes: 8,
    dislikes: 1,
    comments: 7,
    tags: ["Cred Score", "Improvement"],
  },
  {
    id: "3",
    title: "Experience with smart contract rentals",
    content:
      "Has anyone had experience with the smart contract rental system? How does it compare to traditional rental agreements?",
    author: {
      name: "Anonymous",
      avatar: "/placeholder.svg?height=40&width=40",
      credScore: 92,
    },
    date: "2 days ago",
    region: "San Francisco, CA",
    likes: 15,
    dislikes: 0,
    comments: 10,
    tags: ["Smart Contracts", "Experience"],
  },
  {
    id: "4",
    title: "Best neighborhoods in Seattle for young professionals?",
    content:
      "I'm relocating to Seattle for work and looking for recommendations on neighborhoods that are good for young professionals. Budget is around 0.05 ETH/month.",
    author: {
      name: "Anonymous",
      avatar: "/placeholder.svg?height=40&width=40",
      credScore: 88,
    },
    date: "3 days ago",
    region: "Seattle, WA",
    likes: 20,
    dislikes: 2,
    comments: 15,
    tags: ["Seattle", "Neighborhoods"],
  },
]

const comments = {
  "1": [
    {
      id: "1",
      content:
        "Always check the property in person before signing any agreement. Virtual tours are great, but nothing beats seeing it with your own eyes.",
      author: {
        name: "Anonymous",
        avatar: "/placeholder.svg?height=40&width=40",
        credScore: 94,
      },
      date: "1 hour ago",
      likes: 5,
      dislikes: 0,
    },
    {
      id: "2",
      content:
        "Make sure to read the smart contract terms carefully. The beauty of Tor-Rent is that everything is transparent and immutable.",
      author: {
        name: "Anonymous",
        avatar: "/placeholder.svg?height=40&width=40",
        credScore: 90,
      },
      date: "1 hour ago",
      likes: 3,
      dislikes: 0,
    },
    {
      id: "3",
      content: "Check the Cred Score of the property and the landlord. It's a good indicator of what to expect.",
      author: {
        name: "Anonymous",
        avatar: "/placeholder.svg?height=40&width=40",
        credScore: 87,
      },
      date: "2 hours ago",
      likes: 2,
      dislikes: 0,
    },
  ],
}

const regions = ["All Regions", "Seattle, WA", "Portland, OR", "San Francisco, CA", "Los Angeles, CA", "New York, NY"]

export default function CommunityPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("All Regions")
  const [selectedPost, setSelectedPost] = useState(forumPosts[0])
  const [newComment, setNewComment] = useState("")

  // Filter posts based on search query and region
  const filteredPosts = forumPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesRegion = selectedRegion === "All Regions" || post.region === selectedRegion

    return matchesSearch && matchesRegion
  })

  const handleAddComment = () => {
    if (newComment.trim() === "") return
    // In a real app, this would add the comment to the backend
    setNewComment("")
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Community Forum</h1>
          <p className="text-gray-500">Connect with other users and share experiences</p>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search discussions..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <select
                    className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                  >
                    {regions.map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                </div>
                <Button className="bg-orange-500 hover:bg-orange-600">New Discussion</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Posts list */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Discussions</CardTitle>
                <CardDescription>Browse community discussions</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-[600px] overflow-auto">
                  {filteredPosts.map((post) => (
                    <div
                      key={post.id}
                      className={`cursor-pointer border-b p-4 hover:bg-gray-50 ${
                        selectedPost.id === post.id ? "bg-orange-50" : ""
                      }`}
                      onClick={() => setSelectedPost(post)}
                    >
                      <div className="flex items-start justify-between">
                        <h3 className="font-medium">{post.title}</h3>
                        <Badge className="ml-2">{post.region}</Badge>
                      </div>
                      <p className="mt-1 text-sm text-gray-500 line-clamp-2">{post.content}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{post.date}</span>
                          <span>•</span>
                          <div className="flex items-center">
                            <MessageSquare className="mr-1 h-3 w-3" />
                            {post.comments}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {post.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Selected post and comments */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{selectedPost.title}</CardTitle>
                    <CardDescription>
                      Posted {selectedPost.date} in {selectedPost.region}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedPost.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg border p-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={selectedPost.author.avatar} alt="Anonymous" />
                      <AvatarFallback>A</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{selectedPost.author.name}</p>
                      <div className="flex items-center text-xs text-gray-500">
                        <span>Cred Score: {selectedPost.author.credScore}</span>
                      </div>
                    </div>
                  </div>
                  <p className="mt-4 text-gray-700">{selectedPost.content}</p>
                  <div className="mt-4 flex items-center gap-4">
                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                      <ThumbsUp className="h-4 w-4" />
                      {selectedPost.likes}
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                      <ThumbsDown className="h-4 w-4" />
                      {selectedPost.dislikes}
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 text-lg font-medium">Comments ({comments[selectedPost.id]?.length || 0})</h3>
                  <div className="space-y-4">
                    {comments[selectedPost.id]?.map((comment) => (
                      <div key={comment.id} className="rounded-lg border p-4">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={comment.author.avatar} alt="Anonymous" />
                            <AvatarFallback>A</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{comment.author.name}</p>
                            <div className="flex items-center text-xs text-gray-500">
                              <span>{comment.date}</span>
                              <span className="mx-1">•</span>
                              <span>Cred Score: {comment.author.credScore}</span>
                            </div>
                          </div>
                        </div>
                        <p className="mt-2 text-gray-700">{comment.content}</p>
                        <div className="mt-2 flex items-center gap-4">
                          <Button variant="ghost" size="sm" className="flex items-center gap-1">
                            <ThumbsUp className="h-4 w-4" />
                            {comment.likes}
                          </Button>
                          <Button variant="ghost" size="sm" className="flex items-center gap-1">
                            <ThumbsDown className="h-4 w-4" />
                            {comment.dislikes}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 text-lg font-medium">Add a Comment</h3>
                  <div className="space-y-4">
                    <Input
                      placeholder="Write your comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                    <Button className="bg-orange-500 hover:bg-orange-600" onClick={handleAddComment}>
                      Post Comment
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

