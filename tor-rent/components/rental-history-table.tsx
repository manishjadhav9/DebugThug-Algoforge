import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"

export function RentalHistoryTable() {
  const rentalHistory = [
    {
      id: "1",
      property: "Modern Apartment",
      startDate: "Jan 15, 2025",
      endDate: "Jan 14, 2026",
      amount: "0.05 ETH/month",
      status: "active",
    },
    {
      id: "2",
      property: "Studio Loft",
      startDate: "Feb 1, 2025",
      endDate: "Jul 31, 2025",
      amount: "0.03 ETH/month",
      status: "active",
    },
    {
      id: "3",
      property: "Cozy Townhouse",
      startDate: "Mar 1, 2025",
      endDate: "Aug 31, 2025",
      amount: "0.07 ETH/month",
      status: "active",
    },
    {
      id: "4",
      property: "Downtown Condo",
      startDate: "Oct 1, 2024",
      endDate: "Dec 31, 2024",
      amount: "0.06 ETH/month",
      status: "completed",
    },
    {
      id: "5",
      property: "Camera Equipment",
      startDate: "Feb 15, 2025",
      endDate: "Feb 22, 2025",
      amount: "0.01 ETH/week",
      status: "completed",
    },
  ]

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Property/Item</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Period</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Amount</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Contract</th>
          </tr>
        </thead>
        <tbody>
          {rentalHistory.map((rental) => (
            <tr key={rental.id} className="border-b">
              <td className="px-4 py-3 text-sm">{rental.property}</td>
              <td className="px-4 py-3 text-sm">
                {rental.startDate} - {rental.endDate}
              </td>
              <td className="px-4 py-3 text-sm">{rental.amount}</td>
              <td className="px-4 py-3 text-sm">
                <Badge
                  className={`${
                    rental.status === "active"
                      ? "bg-green-500"
                      : rental.status === "pending"
                        ? "bg-orange-500"
                        : "bg-blue-500"
                  }`}
                >
                  {rental.status === "active" ? "Active" : rental.status === "pending" ? "Pending" : "Completed"}
                </Badge>
              </td>
              <td className="px-4 py-3 text-sm">
                <Button variant="ghost" size="sm" className="h-8 gap-1">
                  <FileText className="h-4 w-4" />
                  View
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

