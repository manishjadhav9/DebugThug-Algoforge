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
      name: "Priya Sharma",
      avatar: "/placeholder.svg?height=40&width=40",
      isOnline: true,
    },
    lastMessage: {
      text: "Hi, I'm interested in your Modern Luxury Apartment in Koramangala. Is it still available?",
      time: "10:30 AM",
      isRead: true,
      isFromMe: false,
    },
    property: "Modern Luxury Apartment",
    unreadCount: 0,
  },
  {
    id: "2",
    user: {
      name: "Vikram Mehta",
      avatar: "/placeholder.svg?height=40&width=40",
      isOnline: false,
    },
    lastMessage: {
      text: "The Sony Alpha camera is available for rent starting next week. Let me know if you're interested.",
      time: "Yesterday",
      isRead: false,
      isFromMe: true,
    },
    property: "Sony Alpha A7III Camera",
    unreadCount: 0,
  },
  {
    id: "3",
    user: {
      name: "Rajesh Mehta",
      avatar: "/placeholder.svg?height=40&width=40",
      isOnline: true,
    },
    lastMessage: {
      text: "Thanks for your interest in the villa. When would you like to move in?",
      time: "Yesterday",
      isRead: false,
      isFromMe: true,
    },
    property: "Spacious Family Villa",
    unreadCount: 0,
  },
  {
    id: "4",
    user: {
      name: "Neha Kapoor",
      avatar: "/placeholder.svg?height=40&width=40",
      isOnline: false,
    },
    lastMessage: {
      text: "I've sent you the details about the DJ sound system. Let me know if you have any questions.",
      time: "Mar 20",
      isRead: true,
      isFromMe: false,
    },
    property: "DJ Sound System",
    unreadCount: 2,
  },
]

// Static messages for the selected conversation
const messageHistory: Record<string, Array<{id: string; text: string; time: string; isFromMe: boolean}>> = {
  "1": [
    {
      id: "1",
      text: "Hi, I'm interested in your Modern Luxury Apartment in Koramangala. Is it still available?",
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
      text: "That would be great! Do you have any availability this weekend? I work at an IT company in Whitefield, so preferably Sunday would work best for me.",
      time: "10:45 AM",
      isFromMe: false,
    },
  ],
  "2": [
    {
      id: "1",
      text: "Hello, I saw your listing for the Sony Alpha camera. Is it available for rent next weekend? I need it for a pre-wedding shoot in Cubbon Park.",
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
      text: "Hi, I'm interested in renting your villa in HSR Layout. Is it pet-friendly?",
      time: "Yesterday, 9:20 AM",
      isFromMe: false,
    },
    {
      id: "2",
      text: "Yes, the villa is pet-friendly! We allow cats and dogs under 20 kg.",
      time: "Yesterday, 10:05 AM",
      isFromMe: true,
    },
    {
      id: "3",
      text: "That's perfect! I have a small dog. Does the villa have 24x7 water supply and power backup?",
      time: "Yesterday, 10:30 AM",
      isFromMe: false,
    },
    {
      id: "4",
      text: "Thanks for your interest in the villa. Yes, there's 24x7 water supply with borewell backup and power backup for essential appliances. When would you like to move in?",
      time: "Yesterday, 11:15 AM",
      isFromMe: true,
    },
  ],
  "4": [
    {
      id: "1",
      text: "Hi, do you have the DJ sound system available for a wedding on March 30th?",
      time: "Mar 20, 9:15 AM",
      isFromMe: true,
    },
    {
      id: "2", 
      text: "Yes, the sound system is available. What venue is this for?",
      time: "Mar 20, 10:30 AM",
      isFromMe: false,
    },
    {
      id: "3",
      text: "It's for a wedding reception at Taj MG Road. Would you offer installation support as well?",
      time: "Mar 20, 10:45 AM",
      isFromMe: true,
    },
    {
      id: "4",
      text: "I've sent you the details about the DJ sound system. Let me know if you have any questions.",
      time: "Mar 20, 11:30 AM",
      isFromMe: false,
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

