"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageCircle, Send, Users, Search, Plus, BellRing } from "lucide-react"

// Mock tenant data
const mockTenants = [
  {
    id: "tenant-1",
    name: "Priya Kumar",
    propertyName: "Luxury Villa with Pool",
    propertyId: "prop-1",
    avatar: "/avatars/priya.jpg",
    avatarFallback: "PK",
    lastMessage: "Could you please check the AC in the bedroom?",
    lastMessageTime: "10:30 AM",
    unreadCount: 2,
    online: true
  },
  {
    id: "tenant-2",
    name: "Rahul Sharma",
    propertyName: "Modern Apartment in HSR",
    propertyId: "prop-2",
    avatar: "/avatars/rahul.jpg",
    avatarFallback: "RS",
    lastMessage: "The rent has been transferred.",
    lastMessageTime: "Yesterday",
    unreadCount: 0,
    online: false
  },
  {
    id: "tenant-3",
    name: "Aisha Patel",
    propertyName: "Cozy Studio in Indiranagar",
    propertyId: "prop-3",
    avatar: "/avatars/aisha.jpg",
    avatarFallback: "AP",
    lastMessage: "When will the new fridge be delivered?",
    lastMessageTime: "Jul 12",
    unreadCount: 1,
    online: true
  },
  {
    id: "tenant-4",
    name: "Vikram Mehta",
    propertyName: "2BHK in Electronic City",
    propertyId: "prop-4",
    avatar: "/avatars/vikram.jpg",
    avatarFallback: "VM",
    lastMessage: "Thanks for fixing the water issue.",
    lastMessageTime: "Jul 10",
    unreadCount: 0,
    online: false
  }
]

// Mock message data
const mockMessages = {
  "tenant-1": [
    {
      id: "msg-1",
      senderId: "tenant-1",
      receiverId: "landlord-1",
      content: "Hello! I wanted to report an issue with the AC in the master bedroom.",
      timestamp: "2024-07-15T10:15:00Z",
      read: true
    },
    {
      id: "msg-2",
      senderId: "landlord-1",
      receiverId: "tenant-1",
      content: "Hi Priya, thanks for letting me know. What seems to be the problem with it?",
      timestamp: "2024-07-15T10:20:00Z",
      read: true
    },
    {
      id: "msg-3",
      senderId: "tenant-1",
      receiverId: "landlord-1",
      content: "It's not cooling properly. The temperature doesn't go below 26°C even when set to 18°C.",
      timestamp: "2024-07-15T10:25:00Z",
      read: true
    },
    {
      id: "msg-4",
      senderId: "tenant-1",
      receiverId: "landlord-1",
      content: "Could you please check the AC in the bedroom?",
      timestamp: "2024-07-15T10:30:00Z",
      read: false
    }
  ],
  "tenant-2": [
    {
      id: "msg-1",
      senderId: "landlord-1",
      receiverId: "tenant-2",
      content: "Hi Rahul, just checking if you've transferred the rent for this month?",
      timestamp: "2024-07-14T14:30:00Z",
      read: true
    },
    {
      id: "msg-2",
      senderId: "tenant-2",
      receiverId: "landlord-1",
      content: "Yes, I've just done it. You should receive it in your account by tomorrow.",
      timestamp: "2024-07-14T14:45:00Z",
      read: true
    },
    {
      id: "msg-3",
      senderId: "tenant-2",
      receiverId: "landlord-1",
      content: "The rent has been transferred.",
      timestamp: "2024-07-14T15:00:00Z",
      read: true
    }
  ],
  "tenant-3": [
    {
      id: "msg-1",
      senderId: "tenant-3",
      receiverId: "landlord-1",
      content: "Hello, I'm inquiring about the replacement for the refrigerator we discussed?",
      timestamp: "2024-07-12T09:15:00Z",
      read: true
    },
    {
      id: "msg-2",
      senderId: "landlord-1",
      receiverId: "tenant-3",
      content: "Hi Aisha, I've ordered it and it should be delivered this week.",
      timestamp: "2024-07-12T09:30:00Z",
      read: true
    },
    {
      id: "msg-3",
      senderId: "tenant-3",
      receiverId: "landlord-1",
      content: "When will the new fridge be delivered?",
      timestamp: "2024-07-12T10:00:00Z",
      read: false
    }
  ],
  "tenant-4": [
    {
      id: "msg-1",
      senderId: "tenant-4",
      receiverId: "landlord-1",
      content: "The water pressure issue in the bathroom has been resolved. Thank you!",
      timestamp: "2024-07-10T16:20:00Z",
      read: true
    },
    {
      id: "msg-2",
      senderId: "landlord-1",
      receiverId: "tenant-4",
      content: "Great to hear that, Vikram! Let me know if you have any other issues.",
      timestamp: "2024-07-10T16:30:00Z",
      read: true
    },
    {
      id: "msg-3",
      senderId: "tenant-4",
      receiverId: "landlord-1",
      content: "Thanks for fixing the water issue.",
      timestamp: "2024-07-10T16:45:00Z",
      read: true
    }
  ]
}

export default function MessagesPage() {
  const searchParams = useSearchParams()
  const tenantParam = searchParams.get("tenant")
  
  const [selectedTab, setSelectedTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTenant, setSelectedTenant] = useState<string | null>(tenantParam)
  const [messageText, setMessageText] = useState("")
  const [messages, setMessages] = useState<any[]>([])
  
  // Initialize messages when selected tenant changes
  useEffect(() => {
    if (selectedTenant && mockMessages[selectedTenant]) {
      setMessages(mockMessages[selectedTenant])
    }
  }, [selectedTenant])
  
  // Format message timestamp
  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffInDays === 0) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    } else if (diffInDays === 1) {
      return 'Yesterday'
    } else if (diffInDays < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short' })
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  }
  
  // Filter tenants based on search and selected tab
  const filteredTenants = mockTenants.filter(tenant => {
    const matchesSearch = tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         tenant.propertyName.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (selectedTab === "all") return matchesSearch
    if (selectedTab === "unread") return matchesSearch && tenant.unreadCount > 0
    if (selectedTab === "active") return matchesSearch && tenant.online
    
    return matchesSearch
  })
  
  // Send message handler
  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedTenant) return
    
    const newMessage = {
      id: `msg-${Date.now()}`,
      senderId: "landlord-1",
      receiverId: selectedTenant,
      content: messageText,
      timestamp: new Date().toISOString(),
      read: true
    }
    
    setMessages([...messages, newMessage])
    setMessageText("")
  }
  
  // Get selected tenant data
  const selectedTenantData = selectedTenant ? mockTenants.find(t => t.id === selectedTenant) : null

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Messages</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-180px)]">
        {/* Left sidebar - Contact list */}
        <Card className="md:col-span-1 flex flex-col overflow-hidden">
          <div className="p-4 border-b">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search conversations..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="unread">
                  Unread
                  <Badge className="ml-1 bg-orange-500 text-white">
                    {mockTenants.reduce((acc, tenant) => acc + tenant.unreadCount, 0)}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <ScrollArea className="flex-1">
            {filteredTenants.length > 0 ? (
              <div className="p-2">
                {filteredTenants.map((tenant) => (
                  <div
                    key={tenant.id}
                    className={`flex items-start gap-3 p-3 rounded-md cursor-pointer hover:bg-gray-100 transition-colors ${
                      selectedTenant === tenant.id ? 'bg-orange-50' : ''
                    }`}
                    onClick={() => setSelectedTenant(tenant.id)}
                  >
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={tenant.avatar} alt={tenant.name} />
                        <AvatarFallback>{tenant.avatarFallback}</AvatarFallback>
                      </Avatar>
                      {tenant.online && (
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div className="font-medium truncate">{tenant.name}</div>
                        <div className="text-xs text-gray-500 whitespace-nowrap ml-2">
                          {tenant.lastMessageTime}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500 truncate">{tenant.propertyName}</div>
                      <div className="text-sm text-gray-600 truncate">{tenant.lastMessage}</div>
                    </div>
                    {tenant.unreadCount > 0 && (
                      <Badge className="bg-orange-500 text-white shrink-0">{tenant.unreadCount}</Badge>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <Users className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium mb-2">No conversations found</h3>
                <p className="text-gray-500 mb-6">
                  {searchQuery 
                    ? "No tenants match your search criteria."
                    : selectedTab === "unread"
                    ? "You have no unread messages."
                    : selectedTab === "active"
                    ? "No tenants are currently active."
                    : "You don't have any conversations yet."}
                </p>
              </div>
            )}
          </ScrollArea>
        </Card>
        
        {/* Right side - Chat area */}
        <Card className="md:col-span-2 flex flex-col overflow-hidden">
          {selectedTenantData ? (
            <>
              {/* Chat header */}
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={selectedTenantData.avatar} alt={selectedTenantData.name} />
                    <AvatarFallback>{selectedTenantData.avatarFallback}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium flex items-center">
                      {selectedTenantData.name}
                      {selectedTenantData.online && (
                        <Badge variant="outline" className="ml-2 text-xs text-green-500 bg-green-50">Online</Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">{selectedTenantData.propertyName}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon">
                    <BellRing className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Chat messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message, index) => {
                    const isLandlord = message.senderId === "landlord-1"
                    const showTime = index === 0 || 
                      new Date(message.timestamp).toDateString() !== new Date(messages[index - 1].timestamp).toDateString()
                    
                    return (
                      <div key={message.id}>
                        {showTime && (
                          <div className="flex justify-center my-4">
                            <Badge variant="outline" className="text-xs text-gray-500">
                              {new Date(message.timestamp).toLocaleDateString('en-US', {
                                weekday: 'long', 
                                month: 'short', 
                                day: 'numeric'
                              })}
                            </Badge>
                          </div>
                        )}
                        <div className={`flex ${isLandlord ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] ${isLandlord ? 'order-2' : 'order-1'}`}>
                            {!isLandlord && (
                              <Avatar className="h-8 w-8 mb-1">
                                <AvatarImage src={selectedTenantData.avatar} alt={selectedTenantData.name} />
                                <AvatarFallback>{selectedTenantData.avatarFallback}</AvatarFallback>
                              </Avatar>
                            )}
                            <div className="flex items-end gap-2">
                              <div
                                className={`rounded-lg p-3 ${
                                  isLandlord 
                                    ? 'bg-orange-500 text-white rounded-tr-none' 
                                    : 'bg-gray-100 rounded-tl-none'
                                }`}
                              >
                                <p>{message.content}</p>
                              </div>
                              <span className="text-xs text-gray-500">
                                {formatMessageTime(message.timestamp)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </ScrollArea>
              
              {/* Message input */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input 
                    placeholder="Type your message..." 
                    className="flex-1"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                  />
                  <Button 
                    className="bg-orange-500 hover:bg-orange-600"
                    onClick={handleSendMessage}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <MessageCircle className="h-16 w-16 text-gray-300 mb-4" />
              <h2 className="text-xl font-medium mb-2">Select a conversation</h2>
              <p className="text-gray-500 max-w-md mb-6">
                Choose a tenant from the list to start messaging or continue an existing conversation.
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
} 