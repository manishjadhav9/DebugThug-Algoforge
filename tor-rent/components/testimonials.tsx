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
            name="Aryan Sharma"
            role="Renter"
            image="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80"
            rating={5}
            testimonial="Tor-Rent has made finding a flat in Bangalore so much easier. I relocated from Delhi for my IT job, and the verified listings with virtual tours saved me multiple trips. The RentoCoin rewards are a bonus!"
          />

          <TestimonialCard
            name="Meera Patel"
            role="Property Owner"
            image="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80"
            rating={4}
            testimonial="As a landlord with multiple properties in HSR Layout, Tor-Rent has helped me find reliable tenants quickly. The credibility score system ensures I get trustworthy professionals who pay rent on time."
          />

          <TestimonialCard
            name="Vikram Mehta"
            role="Item Owner"
            image="https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80"
            rating={5}
            testimonial="I've been renting out my camera equipment on weekends through Tor-Rent. The secure payment system and insurance coverage give me peace of mind, and I've earned enough to upgrade to the latest Sony Alpha series!"
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

