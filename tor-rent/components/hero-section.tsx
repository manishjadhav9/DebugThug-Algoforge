import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <section className="py-20 px-4 md:px-6 bg-white">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Redefining Rentals with <span className="text-orange-500">Blockchain</span> Technology
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              A decentralized rental platform that provides secure, transparent, and efficient rental experiences for
              properties and items.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/signup">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                  Get Started <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button variant="outline">Learn More</Button>
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-orange-100 rounded-full z-0" />
            <div className="relative z-10 rounded-lg overflow-hidden shadow-xl">
              <img src="/placeholder.svg?height=600&width=800" alt="Tor-Rent Platform" className="w-full h-auto" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

