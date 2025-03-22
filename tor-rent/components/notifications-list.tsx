import { Badge } from "@/components/ui/badge"

export function NotificationsList() {
  const notifications = [
    {
      id: "1",
      title: "Rent Payment Successful",
      description: "Your monthly rent payment of 0.05 ETH for Modern Apartment has been processed successfully.",
      date: "2 hours ago",
      isRead: false,
      type: "payment",
    },
    {
      id: "2",
      title: "Maintenance Request Update",
      description: "Your maintenance request for the plumbing issue has been assigned to a technician.",
      date: "1 day ago",
      isRead: true,
      type: "maintenance",
    },
    {
      id: "3",
      title: "New Message from Landlord",
      description: "You have received a new message from your landlord regarding your rental agreement.",
      date: "2 days ago",
      isRead: true,
      type: "message",
    },
    {
      id: "4",
      title: "Cred Score Increased",
      description: "Congratulations! Your Cred Score has increased by 2 points due to timely rent payments.",
      date: "3 days ago",
      isRead: true,
      type: "score",
    },
    {
      id: "5",
      title: "Rental Agreement Renewal",
      description: "Your rental agreement for Studio Loft is due for renewal in 30 days.",
      date: "1 week ago",
      isRead: true,
      type: "agreement",
    },
  ]

  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <div key={notification.id} className={`rounded-lg border p-4 ${notification.isRead ? "" : "bg-orange-50"}`}>
          <div className="flex items-center justify-between">
            <h3 className="font-medium">{notification.title}</h3>
            {!notification.isRead && <Badge className="bg-orange-500">New</Badge>}
          </div>
          <p className="mt-1 text-sm text-gray-500">{notification.date}</p>
          <p className="mt-2 text-sm">{notification.description}</p>
        </div>
      ))}
    </div>
  )
}

