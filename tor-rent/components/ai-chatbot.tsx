"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bot, Send, X } from "lucide-react"

// Static AI responses based on keywords
const aiResponses = [
  {
    keywords: ["hello", "hi", "hey", "greetings"],
    response: "Hello! I'm TorBot, your Tor-Rent assistant. How can I help you today?",
  },
  {
    keywords: ["rent", "payment", "pay"],
    response:
      "Rent payments on Tor-Rent are processed through our blockchain-based smart contracts. You can pay using ETH from your connected wallet. Payments are automatically recorded and your Cred Score is updated based on timely payments.",
  },
  {
    keywords: ["deposit", "security"],
    response:
      "Security deposits on Tor-Rent are held in escrow by our smart contracts. They're automatically returned to you at the end of your lease if there are no damages or outstanding payments.",
  },
  {
    keywords: ["cred", "score", "rating"],
    response:
      "Your Cred Score is our blockchain-based credibility rating system. It's calculated based on payment history, property maintenance, and communication. A higher score gives you access to premium properties and better rental terms.",
  },
  {
    keywords: ["maintenance", "repair", "fix", "issue"],
    response:
      "To report a maintenance issue, go to your dashboard, select the property, and click on 'Report Issue'. Your landlord will be notified, and you can track the status of your request in real-time.",
  },
  {
    keywords: ["contract", "agreement", "lease", "terms"],
    response:
      "All rental agreements on Tor-Rent are blockchain-based smart contracts. They're transparent, immutable, and automatically enforce terms like payment schedules and deposit returns. You can view your agreements in the 'My Rentals' section.",
  },
  {
    keywords: ["wallet", "metamask", "connect"],
    response:
      "To connect your wallet, click on the 'Connect Wallet' button on the login page. We currently support Metamask. Your wallet is used for secure authentication and processing payments.",
  },
  {
    keywords: ["property", "apartment", "house", "listing"],
    response:
      "You can browse available properties on the Properties page. Use filters to narrow down your search by price, location, or amenities. Each listing includes detailed information, reviews, and a VR tour option.",
  },
  {
    keywords: ["compare", "comparison"],
    response:
      "Our Property Comparison tool allows you to select up to 3 properties and compare them side by side. Look for the 'Add to Compare' button on property cards or detail pages.",
  },
  {
    keywords: ["review", "feedback"],
    response:
      "Reviews on Tor-Rent are anonymous to protect tenant privacy. You can leave reviews for properties you've rented after your lease ends. These reviews help build our Assurance Meter for properties.",
  },
  {
    keywords: ["points", "rewards", "loyalty"],
    response:
      "Our Gamified Loyalty System rewards you with Rentocoins (RTC) for positive actions like on-time payments, good property maintenance, and active community participation. You can redeem RTC for discounts on rent or service fees.",
  },
  {
    keywords: ["map", "location"],
    response:
      "Our interactive Map View shows all available properties in your selected region. You can filter properties directly on the map and click on markers to see property details.",
  },
  {
    keywords: ["vr", "virtual", "tour"],
    response:
      "Tor-Rent offers VR tours for most properties. Look for the 'View in VR' button on property detail pages to explore the space virtually before scheduling an in-person viewing.",
  },
  {
    keywords: ["help", "support", "contact"],
    response:
      "For additional support, you can contact our team through the Help Center or send a message to support@tor-rent.com. Our support team is available 24/7 to assist you.",
  },
]

// Fallback response when no keywords match
const fallbackResponses = [
  "I'm not sure I understand. Could you rephrase your question?",
  "I don't have information on that specific topic yet. Is there something else I can help with?",
  "That's a great question! While I don't have the specific answer, you can find more information in our Help Center.",
  "I'm still learning about that. Could you ask me something about rent payments, Cred Scores, or property listings instead?",
]

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I'm TorBot, your Tor-Rent assistant. How can I help you today?",
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (input.trim() === "") return

    // Add user message
    const userMessage = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate AI thinking
    setTimeout(() => {
      // Find matching response based on keywords
      const lowercaseInput = input.toLowerCase()
      let foundResponse = false

      for (const item of aiResponses) {
        if (item.keywords.some((keyword) => lowercaseInput.includes(keyword))) {
          setMessages((prev) => [...prev, { role: "assistant", content: item.response }])
          foundResponse = true
          break
        }
      }

      // Use fallback if no keywords match
      if (!foundResponse) {
        const randomFallback = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)]
        setMessages((prev) => [...prev, { role: "assistant", content: randomFallback }])
      }

      setIsTyping(false)
    }, 1000)
  }

  return (
    <>
      {/* Chatbot button */}
      <Button
        className="fixed bottom-4 right-4 h-12 w-12 rounded-full bg-orange-500 p-0 shadow-lg hover:bg-orange-600"
        onClick={() => setIsOpen(true)}
      >
        <Bot className="h-6 w-6" />
        <span className="sr-only">Open chatbot</span>
      </Button>

      {/* Chatbot dialog */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 z-50 w-80 md:w-96">
          <Card className="shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between border-b p-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Bot className="h-5 w-5 text-orange-500" />
                TorBot Assistant
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </CardHeader>
            <CardContent className="h-80 overflow-y-auto p-4">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    {message.role === "assistant" && (
                      <Avatar className="mr-2 h-8 w-8">
                        <AvatarImage src="/placeholder.svg?height=32&width=32&text=TB" alt="TorBot" />
                        <AvatarFallback>TB</AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.role === "user" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      <p>{message.content}</p>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <Avatar className="mr-2 h-8 w-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32&text=TB" alt="TorBot" />
                      <AvatarFallback>TB</AvatarFallback>
                    </Avatar>
                    <div className="max-w-[80%] rounded-lg bg-gray-100 p-3 text-gray-800">
                      <div className="flex space-x-1">
                        <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></div>
                        <div
                          className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                        <div
                          className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                          style={{ animationDelay: "0.4s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </CardContent>
            <CardFooter className="border-t p-4">
              <div className="flex w-full items-center gap-2">
                <Input
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
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
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  )
}

