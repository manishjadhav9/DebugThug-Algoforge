"use client"

import { useState } from "react"
import Link from "next/link"
import { DashboardNav } from "@/components/dashboard-nav"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Bell, 
  LogOut, 
  Menu, 
  Settings, 
  Shield 
} from "lucide-react"

interface LandlordLayoutProps {
  children: React.ReactNode
}

export default function LandlordLayout({ children }: LandlordLayoutProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Fixed Sidebar - hidden on mobile */}
      <aside className="hidden md:flex flex-col w-64 border-r bg-white fixed h-full z-10">
        <div className="p-4 border-b">
          <Link href="/dashboard/landlord" className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-orange-600" />
            <h1 className="text-2xl font-bold text-orange-600">Tor-Rent</h1>
          </Link>
          <p className="text-sm text-gray-500">Landlord Dashboard</p>
        </div>
        <div className="flex-1 py-4 overflow-y-auto">
          <DashboardNav userType="landlord" />
        </div>
        <div className="border-t p-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="/avatars/landlord.jpg" alt="Landlord" />
              <AvatarFallback>AR</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">Arjun Reddy</p>
              <p className="text-xs text-gray-500">arjun.reddy@example.com</p>
            </div>
          </div>
          <Link href="/login">
            <Button variant="ghost" className="mt-4 w-full justify-start text-gray-500 hover:text-gray-900">
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </Button>
          </Link>
        </div>
      </aside>

      {/* Mobile navigation overlay */}
      {mobileNavOpen && (
        <DashboardNav 
          userType="landlord" 
          isMobile={true} 
          isOpen={mobileNavOpen} 
          onToggle={() => setMobileNavOpen(false)} 
        />
      )}

      {/* Main content */}
      <main className="flex-1 md:ml-64">
        {/* Header */}
        <header className="bg-white border-b p-4 flex items-center justify-between sticky top-0 z-10">
          <button 
            className="md:hidden p-2 rounded-md hover:bg-gray-100"
            onClick={() => setMobileNavOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="md:hidden flex-1 text-center">
            <h1 className="text-xl font-bold text-orange-600">Tor-Rent</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </header>

        {/* Page content */}
        {children}
      </main>
    </div>
  )
} 