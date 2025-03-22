"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, Send } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"

// Static messages data
const conversations = [
  {
    id: "1",
    user: {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      isOnline: true,
    },
    lastMessage: {
      text: "Hi, I'm interested in your Modern Apartment listing. Is it still available?",
      time: "10:30 AM",
      isRead: true,
      isFromMe: false,
    },
    property: "Modern Apartment",
    unreadCount: 0,
  },
  {
    id: "2",
    user: {
      name: "Alex Thompson",
      avatar: "/placeholder.svg?height=40&width=40",
      isOnline: false,
    },
    lastMessage: {
      text: "The camera is available for rent starting next week. Let me know if you're interested.",
      time: "Yesterday",
      isRead: false,
      isFromMe: true,
    },
    property: "Professional DSLR Camera",
    unreadCount: 0,
  },
  {
    id: "3",
    user: {
      name: "Robert Garcia",
      avatar: "/placeholder.svg?height=40&width=40",
      isOnline: true,
    },
    lastMessage: {
      text: "Thanks for your interest in the townhouse. When would you like to move in?",
      time: "Yesterday",
      isRead: false,
      isFromMe: true,
    },
    property: "Cozy Townhouse",
    unreadCount: 0,
  },
  {
    id: "4",
    user: {
      name: "Emily Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40",
      isOnline: false,
    },
    lastMessage: {
      text: "I've sent you the details about the DJ equipment. Let me know if you have any questions.",
      time: "Mar 20",
      isRead: true,
      isFromMe: false,
    },
    property: "DJ Equipment",
    unreadCount: 2,
  },
]

// Static messages for the selected conversation
const messageHistory = {
  "1": [
    {
      id: "1",
      text: "Hi, I'm interested in your Modern Apartment listing. Is it still available?",
      time: "10:30 AM",
      isFromMe: false,
    },
    {
      id: "2",
      text: "Yes, it's still available! When would you like to move in?",
      time: "10:35 AM",
      isFromMe: true,
    },
    {
      id: "3",
      text: "I'm looking to move in around April 1st. Is that possible?",
      time: "10:40 AM",
      isFromMe: false,
    },
    {
      id: "4",
      text: "April 1st works perfectly. Would you like to schedule a viewing?",
      time: "10:42 AM",
      isFromMe: true,
    },
    {
      id: "5",
      text: "That would be great! Do you have any availability this weekend?",
      time: "10:45 AM",
      isFromMe: false,
    },
  ],
  "2": [
    {
      id: "1",
      text: "Hello, I saw your listing for the DSLR camera. Is it available for rent next weekend?",
      time: "Yesterday, 2:15 PM",
      isFromMe: false,
    },
    {
      id: "2",
      text: "The camera is available for rent starting next week. Let me know if you're interested.",
      time: "Yesterday, 3:30 PM",
      isFromMe: true,
    },
  ],
  "3": [
    {
      id: "1",
      text: "Hi, I'm interested in renting your townhouse. Is it pet-friendly?",
      time: "Yesterday, 9:20 AM",
      isFromMe: false,
    },
    {
      id: "2",
      text: "Yes, the townhouse is pet-friendly! We allow cats and dogs under 50 pounds.",
      time: "Yesterday, 10:05 AM",
      isFromMe: true,
    },
    {
      id: "3",
      text: "That's perfect! I have a small dog. When can I see the place?",
      time: "Yesterday, 10:30 AM",
      isFromMe: false,
    },
    {
      id: "4",
      text: "Thanks for your interest in the townhouse. When would you like to move in?",
      time: "Yesterday, 11:15 AM",
      isFromMe: true,
    },
  ],
  "4": [
    {
      id: "1",
      text: "Hi, do you have the DJ equipment available for an event on April 15th?",
      time: "Mar 20, 1:10 PM",
      isFromMe: false,
    },
    {
      id: "2",
      text: "Yes, it's available on that date. What kind of event are you planning?",
      time: "Mar 20, 1:45 PM",
      isFromMe: true,
    },
    {
      id: "3",
      text: "It's for a wedding reception. Can you tell me more about what's included?",
      time: "Mar 20, 2:20 PM",
      isFromMe: false,
    },
    {
      id: "4",
      text: "I've sent you the details about the DJ equipment. Let me know if you have any questions.",
      time: "Mar 20, 3:05 PM",
      isFromMe: false,
    },
    {
      id: "5",
      text: "The package includes a Pioneer DJ controller, 2 speakers, a subwoofer, and headphones.",
      time: "Mar 20, 3:10 PM",
      isFromMe: false,
    },
    {
      id: "6",
      text: "Do you also provide setup and technical support?",
      time: "Mar 20, 3:30 PM",
      isFromMe: true,
    },
  ],
}

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0])
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  // Filter conversations based on search query
  const filteredConversations = conversations.filter(
    (conversation) =>
      conversation.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.property.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return
    // In a real app, this would send the message to the backend
    setNewMessage("")
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-gray-500">Communicate with property owners and tenants</p>
        </div>

        <div className="grid h-[calc(100vh-220px)] grid-cols-1 gap-6 md:grid-cols-3">
          {/* Conversations list */}
          <Card className="md:col-span-1">
            <CardContent className="p-0">
              <div className="border-b p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search conversations..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="h-[calc(100vh-300px)] overflow-auto">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`flex cursor-pointer items-center gap-3 border-b p-4 hover:bg-gray-50 ${
                      selectedConversation.id === conversation.id ? "bg-orange-50" : ""
                    }`}
                    onClick={() => setSelectedConversation(conversation)}
                  >
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={conversation.user.avatar} alt={conversation.user.name} />
                        <AvatarFallback>{conversation.user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {conversation.user.isOnline && (
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-white" />
                      )}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{conversation.user.name}</h3>
                        <span className="text-xs text-gray-500">{conversation.lastMessage.time}</span>
                      </div>
                      <p className="truncate text-sm text-gray-500">
                        {conversation.lastMessage.isFromMe ? "You: " : ""}
                        {conversation.lastMessage.text}
                      </p>
                      <p className="mt-1 text-xs text-orange-500">{conversation.property}</p>
                    </div>
                    {conversation.unreadCount > 0 && (
                      <Badge className="bg-orange-500">{conversation.unreadCount}</Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Chat area */}
          <Card className="md:col-span-2">
            <CardContent className="flex h-full flex-col p-0">
              {/* Chat header */}
              <div className="flex items-center justify-between border-b p-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={selectedConversation.user.avatar} alt={selectedConversation.user.name} />
                    <AvatarFallback>{selectedConversation.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{selectedConversation.user.name}</h3>
                    <p className="text-xs text-gray-500">
                      {selectedConversation.user.isOnline ? <span className="text-green-500">Online</span> : "Offline"}
                    </p>
                  </div>
                </div>
                <div>
                  <Badge className="bg-orange-500">{selectedConversation.property}</Badge>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-auto p-4">
                <div className="space-y-4">
                  {messageHistory[selectedConversation.id].map((message) => (
                    <div key={message.id} className={`flex ${message.isFromMe ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.isFromMe ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        <p>{message.text}</p>
                        <p
                          className={`mt-1 text-right text-xs ${
                            message.isFromMe ? "text-orange-100" : "text-gray-500"
                          }`}
                        >
                          {message.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Message input */}
              <div className="border-t p-4">
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSendMessage()
                      }
                    }}
                  />
                  <Button className="bg-orange-500 hover:bg-orange-600" size="icon" onClick={handleSendMessage}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

