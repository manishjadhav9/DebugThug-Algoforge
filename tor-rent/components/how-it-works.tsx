import { Wallet, FileCheck, CreditCard, UserCheck } from "lucide-react"

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 px-4 md:px-6 bg-white">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">How It Works</h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Tor-Rent simplifies the rental process with blockchain technology, providing security and transparency at
          every step.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mb-4">
              <Wallet className="w-8 h-8 text-orange-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">1. Connect Wallet</h3>
            <p className="text-gray-600">Sign up and connect your Metamask wallet for secure authentication.</p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mb-4">
              <FileCheck className="w-8 h-8 text-orange-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">2. Create Agreement</h3>
            <p className="text-gray-600">Browse listings and create a blockchain-based rental agreement.</p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mb-4">
              <CreditCard className="w-8 h-8 text-orange-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">3. Secure Payment</h3>
            <p className="text-gray-600">Make secure payments with cryptocurrency via smart contracts.</p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mb-4">
              <UserCheck className="w-8 h-8 text-orange-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">4. Build Cred Score</h3>
            <p className="text-gray-600">Earn badges and improve your Cred Score with positive rental behaviors.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

