"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Building, Home, MessageSquare, Settings, ShoppingBag, Users, Wallet } from "lucide-react"

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Properties",
    href: "/dashboard/properties",
    icon: Building,
  },
  {
    title: "Multi-Item Rentals",
    href: "/dashboard/items",
    icon: ShoppingBag,
  },
  {
    title: "Messages",
    href: "/dashboard/messages",
    icon: MessageSquare,
  },
  {
    title: "Community",
    href: "/dashboard/community",
    icon: Users,
  },
  {
    title: "Payments",
    href: "/dashboard/payments",
    icon: Wallet,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav className="flex-1 overflow-auto p-4">
      <ul className="grid gap-1">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                pathname === item.href
                  ? "bg-orange-50 text-orange-500"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

