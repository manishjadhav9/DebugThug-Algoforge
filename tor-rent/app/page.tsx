import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Building, Check, Shield, Truck } from "lucide-react"
import { HeroSection } from "@/components/hero-section"
import { FeatureCard } from "@/components/feature-card"
import { HowItWorks } from "@/components/how-it-works"
import { Testimonials } from "@/components/testimonials"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="sticky top-0 z-40 w-full border-b bg-white">
        <div className="container flex items-center justify-between h-16 px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-orange-500" />
            <span className="text-xl font-bold">Tor-Rent</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="#features" className="font-medium transition-colors hover:text-orange-500">
              Features
            </Link>
            <Link href="#how-it-works" className="font-medium transition-colors hover:text-orange-500">
              How It Works
            </Link>
            <Link href="#testimonials" className="font-medium transition-colors hover:text-orange-500">
              Testimonials
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline" className="hidden md:flex">
                Log In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-orange-500 hover:bg-orange-600">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <HeroSection />

        <section id="features" className="py-16 px-4 md:px-6 bg-gray-50">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Redefining Rentals with Blockchain</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Shield className="w-10 h-10 text-orange-500" />}
                title="Secure Agreements"
                description="Immutable and verifiable rental agreements stored on blockchain ledgers."
              />
              <FeatureCard
                icon={<Building className="w-10 h-10 text-orange-500" />}
                title="Property & Multi-Item Rentals"
                description="Rent properties, vehicles, electronics, furniture, and more with ease."
              />
              <FeatureCard
                icon={<Truck className="w-10 h-10 text-orange-500" />}
                title="Automated Payments"
                description="Automatic rent payments and deposit refunds via smart contracts."
              />
            </div>
          </div>
        </section>

        <HowItWorks />

        <section className="py-16 px-4 md:px-6 bg-white">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Trust & Credibility System</h2>
                <p className="text-gray-600 mb-6">
                  Our platform implements a comprehensive credibility system similar to a credit score for both tenants
                  and lenders.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-orange-500 mt-0.5" />
                    <span>Cred Score for tenants based on payment history</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-orange-500 mt-0.5" />
                    <span>Lender ratings from tenant reviews</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-orange-500 mt-0.5" />
                    <span>Gamification & badges for positive rental behaviors</span>
                  </li>
                </ul>
                <Link href="/signup">
                  <Button className="mt-8 bg-orange-500 hover:bg-orange-600">
                    Get Started <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-orange-100 rounded-full z-0" />
                <Card className="relative z-10 overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-bold">Tenant Cred Score</h3>
                        <p className="text-gray-500">Based on 24 rental transactions</p>
                      </div>
                      <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center text-white text-2xl font-bold">
                        92
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Payment History</span>
                          <span className="text-sm font-medium">Excellent</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-orange-500 h-2 rounded-full w-[95%]"></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Property Maintenance</span>
                          <span className="text-sm font-medium">Very Good</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-orange-500 h-2 rounded-full w-[85%]"></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Communication</span>
                          <span className="text-sm font-medium">Good</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-orange-500 h-2 rounded-full w-[75%]"></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <Testimonials />
      </main>
      <footer className="border-t bg-white">
        <div className="container flex flex-col gap-6 py-8 px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-orange-500" />
              <span className="text-xl font-bold">Tor-Rent</span>
            </div>
            <nav className="flex items-center gap-4 text-sm">
              <Link href="#" className="text-gray-500 hover:text-orange-500">
                Terms
              </Link>
              <Link href="#" className="text-gray-500 hover:text-orange-500">
                Privacy
              </Link>
              <Link href="#" className="text-gray-500 hover:text-orange-500">
                Contact
              </Link>
            </nav>
          </div>
          <div className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Tor-Rent. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

