"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  Home,
  Users, 
  MessageSquare, 
  Settings,
  Wallet,
  Wrench,
  PieChart,
  Menu,
  X,
  HelpCircle,
  Bell,
  Briefcase,
  History,
  Star,
  FileText,
  Shield,
  Gift
} from "lucide-react"

interface DashboardNavProps {
  userType?: string
  isMobile?: boolean
  isOpen?: boolean
  onToggle?: () => void
}

export function DashboardNav({ userType = "tenant", isMobile = false, isOpen = false, onToggle }: DashboardNavProps) {
  const pathname = usePathname()
  
  // Navigation items
  const navItems = {
    tenant: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
      },
      {
        title: "Browse Properties",
        href: "/dashboard/properties",
        icon: <Home className="mr-2 h-4 w-4" />,
      },
      {
        title: "My Rentals",
        href: "/dashboard/my-rentals",
        icon: <History className="mr-2 h-4 w-4" />,
      },
      {
        title: "Messages",
        href: "/dashboard/messages",
        icon: <MessageSquare className="mr-2 h-4 w-4" />,
      },
      {
        title: "Payments",
        href: "/dashboard/payments",
        icon: <Wallet className="mr-2 h-4 w-4" />,
      },
      {
        title: "Maintenance Requests",
        href: "/dashboard/maintenance",
        icon: <Wrench className="mr-2 h-4 w-4" />,
      },
      {
        title: "Reviews & Ratings",
        href: "/dashboard/reviews",
        icon: <Star className="mr-2 h-4 w-4" />,
      },
      {
        title: "Documents",
        href: "/dashboard/documents",
        icon: <FileText className="mr-2 h-4 w-4" />,
      },
      {
        title: "Insurance",
        href: "/dashboard/insurance",
        icon: <Shield className="mr-2 h-4 w-4" />,
      },
      {
        title: "Loyalty Points",
        href: "/dashboard/loyalty",
        icon: <Gift className="mr-2 h-4 w-4" />,
      },
      {
        title: "Settings",
        href: "/dashboard/settings",
        icon: <Settings className="mr-2 h-4 w-4" />,
      },
    ],
    landlord: [
      {
        title: "Dashboard",
        href: "/dashboard/landlord",
        icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
      },
      {
        title: "Properties",
        href: "/dashboard/landlord/properties",
        icon: <Home className="mr-2 h-4 w-4" />,
      },
      {
        title: "Tenants",
        href: "/dashboard/landlord/tenants",
        icon: <Users className="mr-2 h-4 w-4" />,
      },
      {
        title: "Messages",
        href: "/dashboard/landlord/messages",
        icon: <MessageSquare className="mr-2 h-4 w-4" />,
      },
      {
        title: "Payments",
        href: "/dashboard/landlord/payments",
        icon: <Wallet className="mr-2 h-4 w-4" />,
      },
      {
        title: "Maintenance",
        href: "/dashboard/landlord/maintenance",
        icon: <Wrench className="mr-2 h-4 w-4" />,
      },
      {
        title: "Services",
        href: "/dashboard/landlord/services",
        icon: <Briefcase className="mr-2 h-4 w-4" />,
      },
      {
        title: "Analytics",
        href: "/dashboard/landlord/analytics",
        icon: <PieChart className="mr-2 h-4 w-4" />,
      },
      {
        title: "Settings",
        href: "/dashboard/landlord/settings",
        icon: <Settings className="mr-2 h-4 w-4" />,
      },
    ],
  }

  // Get the correct navigation items based on user type
  const items = navItems[userType as keyof typeof navItems] || navItems.tenant

  if (isMobile) {
    return (
      <div className={`fixed inset-0 bg-white z-50 transition-transform transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="font-bold text-lg">Tor-Rent</h2>
          <button onClick={onToggle} className="text-gray-500 focus:outline-none">
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="p-4">
          {items.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              onClick={onToggle}
              className={cn(
                "flex items-center py-3 px-4 rounded-md text-sm font-medium transition-colors hover:bg-gray-100",
                pathname === item.href
                  ? "bg-orange-50 text-orange-600"
                  : "text-gray-700 hover:text-gray-900"
              )}
            >
              {item.icon}
              {item.title}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 w-full p-4 border-t">
          <div className="flex flex-col space-y-2">
            <Link
              href="/help"
              className="flex items-center py-3 px-4 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              <HelpCircle className="mr-2 h-4 w-4" />
              Help & Support
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <nav className="flex flex-col space-y-1 h-full">
      {items.map((item, index) => (
        <Link
          key={index}
          href={item.href}
          className={cn(
            "flex items-center py-3 px-4 rounded-md text-sm font-medium transition-colors hover:bg-gray-100",
            pathname === item.href
              ? "bg-orange-50 text-orange-600"
              : "text-gray-700 hover:text-gray-900"
          )}
        >
          {item.icon}
          {item.title}
        </Link>
      ))}
    </nav>
  )
}

