import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"

export function Testimonials() {
  return (
    <section id="testimonials" className="py-16 px-4 md:px-6 bg-gray-50">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <TestimonialCard
            name="Alex Johnson"
            role="Property Owner"
            image="/placeholder.svg?height=100&width=100"
            rating={5}
            testimonial="Tor-Rent has completely transformed how I manage my rental properties. The blockchain-based agreements give me peace of mind, and I love the automated payment system."
          />

          <TestimonialCard
            name="Sarah Williams"
            role="Tenant"
            image="/placeholder.svg?height=100&width=100"
            rating={4}
            testimonial="As someone who rents frequently, the Cred Score system has been a game-changer. I can now showcase my reliability as a tenant, which has made finding new rentals much easier."
          />

          <TestimonialCard
            name="Michael Chen"
            role="Equipment Lender"
            image="/placeholder.svg?height=100&width=100"
            rating={5}
            testimonial="I rent out camera equipment, and Tor-Rent's multi-item rental feature is perfect for my business. The secure payments and transparent agreements have eliminated payment disputes."
          />
        </div>
      </div>
    </section>
  )
}

interface TestimonialCardProps {
  name: string
  role: string
  image: string
  rating: number
  testimonial: string
}

function TestimonialCard({ name, role, image, rating, testimonial }: TestimonialCardProps) {
  return (
    <Card className="border-none shadow-md">
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="w-12 h-12">
            <AvatarImage src={image} alt={name} />
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-bold">{name}</h3>
            <p className="text-sm text-gray-500">{role}</p>
          </div>
        </div>

        <div className="flex mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={`w-4 h-4 ${i < rating ? "text-orange-500 fill-orange-500" : "text-gray-300"}`} />
          ))}
        </div>

        <p className="text-gray-600">{testimonial}</p>
      </CardContent>
    </Card>
  )
}

