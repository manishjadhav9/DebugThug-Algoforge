import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, User } from "lucide-react"

interface ItemCardProps {
  id: string
  title: string
  category: string
  price: string
  image: string
  status: string
  credScore: number
  owner: string
  description: string
}

export function ItemCard({ id, title, category, price, image, status, credScore, owner, description }: ItemCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative">
        <img src={image || "/placeholder.svg"} alt={title} className="h-48 w-full object-cover" />
        <Badge
          className={`absolute right-2 top-2 ${
            status === "available" ? "bg-green-500" : status === "pending" ? "bg-orange-500" : "bg-blue-500"
          }`}
        >
          {status === "available" ? "Available" : status === "pending" ? "Pending" : "Rented"}
        </Badge>
        <Badge className="absolute left-2 top-2 bg-gray-800">{category}</Badge>
      </div>
      <CardContent className="p-4">
        <h3 className="font-bold">{title}</h3>
        <p className="mt-1 text-sm text-gray-500 line-clamp-2">{description}</p>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Price</p>
            <p className="font-bold">{price}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Cred Score</p>
            <div className="flex items-center">
              <Star className="mr-1 h-4 w-4 fill-orange-500 text-orange-500" />
              <span className="font-bold">{credScore}</span>
            </div>
          </div>
        </div>
        <div className="mt-2 flex items-center text-sm text-gray-500">
          <User className="mr-1 h-4 w-4" />
          <span>Owner: {owner}</span>
        </div>
      </CardContent>
      <CardFooter className="border-t p-4">
        <Link href={`/dashboard/items/${id}`} className="w-full">
          <Button className="w-full bg-orange-500 hover:bg-orange-600">Rent Now</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

