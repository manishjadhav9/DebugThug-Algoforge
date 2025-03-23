"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  Check, 
  Clock, 
  Ban, 
  AlertTriangle, 
  FileText, 
  Calendar, 
  DollarSign, 
  Wallet, 
  ReceiptText, 
  Home, 
  ArrowRight, 
  Loader2,
  RefreshCw 
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { walletService } from "@/lib/services/wallet-service"
import { propertyService } from "@/lib/services/property-service"

export default function TenantAgreementsPage() {
  const router = useRouter()
  const [agreements, setAgreements] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [wallet, setWallet] = useState<any>(null)
  const [hasWallet, setHasWallet] = useState(false)
  const [selectedAgreement, setSelectedAgreement] = useState<any>(null)
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)
  const [paymentAmount, setPaymentAmount] = useState<string>("")
  const [paymentType, setPaymentType] = useState<"rent" | "deposit">("rent")
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle')
  
  // Mock user ID for demonstration purposes
  const userId = "user123"
  
  useEffect(() => {
    fetchAgreementsAndWallet()
  }, [])
  
  const fetchAgreementsAndWallet = async () => {
    try {
      setLoading(true)
      
      // Check if user has wallet
      const walletExists = await walletService.checkWalletExists(userId)
      setHasWallet(walletExists)
      
      if (walletExists) {
        const walletInfo = await walletService.getWallet(userId)
        setWallet(walletInfo)
      }
      
      // Fetch agreements
      const userAgreements = await propertyService.getTenantAgreements(userId)
      setAgreements(userAgreements)
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "Error",
        description: "Failed to load agreements. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }
  
  const handleRefresh = () => {
    fetchAgreementsAndWallet()
  }
  
  const handleViewAgreement = (agreement: any) => {
    setSelectedAgreement(agreement)
  }
  
  const handleMakePayment = (agreement: any) => {
    setSelectedAgreement(agreement)
    setPaymentAmount(agreement.rentAmount.toString())
    setPaymentType("rent")
    setIsPaymentDialogOpen(true)
  }
  
  const handlePaymentSubmit = async () => {
    if (!hasWallet || !wallet) {
      toast({
        title: "Wallet required",
        description: "You need a wallet to make payments. Please create one first.",
        variant: "warning"
      })
      return
    }
    
    setPaymentStatus('processing')
    
    try {
      // Check wallet balance
      const balance = await walletService.getWalletBalance(wallet.address)
      const amount = parseFloat(paymentAmount)
      
      if (balance < amount) {
        toast({
          title: "Insufficient funds",
          description: `Your wallet balance (${balance} ETH) is not enough for this payment. Visit the Wallet Funding page to add more ETH.`,
          variant: "destructive"
        })
        setPaymentStatus('error')
        return
      }
      
      // Process payment
      await propertyService.makePayment(
        selectedAgreement.id, 
        wallet.address, 
        amount, 
        paymentType
      )
      
      setPaymentStatus('success')
      
      // Show success toast
      toast({
        title: "Payment successful!",
        description: `Your ${paymentType} payment of ${amount} ETH has been processed successfully.`,
        variant: "success"
      })
      
      // Close dialog and refresh data after 2 seconds
      setTimeout(() => {
        setIsPaymentDialogOpen(false)
        setPaymentStatus('idle')
        fetchAgreementsAndWallet()
      }, 2000)
    } catch (error) {
      console.error("Error processing payment:", error)
      setPaymentStatus('error')
      toast({
        title: "Payment failed",
        description: "There was an error processing your payment. Please try again later.",
        variant: "destructive"
      })
    }
  }
  
  const handleCreateWallet = async () => {
    try {
      toast({
        title: "Creating wallet",
        description: "Please wait while we create your wallet..."
      })
      
      const createdWallet = await walletService.createWallet(userId)
      
      // Fund wallet with test ETH
      await walletService.fundWalletWithTestEth(createdWallet.address)
      
      setWallet(createdWallet)
      setHasWallet(true)
      
      toast({
        title: "Wallet created",
        description: "Your wallet has been successfully created and funded with test ETH.",
        variant: "success"
      })
    } catch (error) {
      console.error("Error creating wallet:", error)
      toast({
        title: "Error",
        description: "Failed to create wallet. Please try again later.",
        variant: "destructive"
      })
    }
  }
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date)
  }
  
  // Get status badge based on agreement status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>
      case 'pending':
        return <Badge variant="outline" className="text-orange-500 border-orange-500">Pending</Badge>
      case 'completed':
        return <Badge variant="outline" className="text-blue-500 border-blue-500">Completed</Badge>
      case 'terminated':
        return <Badge variant="destructive">Terminated</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }
  
  // Get payment status based on payment data
  const getPaymentStatus = (agreement: any) => {
    const now = new Date()
    const dueDate = new Date(agreement.nextPaymentDate)
    const daysDiff = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    
    if (agreement.paymentStatus === 'paid') {
      return {
        status: 'paid',
        badge: <Badge className="bg-green-500">Paid</Badge>,
        message: 'Next payment due on ' + formatDate(agreement.nextPaymentDate)
      }
    } else if (daysDiff < 0) {
      return {
        status: 'overdue',
        badge: <Badge variant="destructive">Overdue</Badge>,
        message: `Payment overdue by ${Math.abs(daysDiff)} days`
      }
    } else if (daysDiff <= 3) {
      return {
        status: 'due-soon',
        badge: <Badge variant="outline" className="text-orange-500 border-orange-500">Due Soon</Badge>,
        message: `Payment due in ${daysDiff} days`
      }
    } else {
      return {
        status: 'upcoming',
        badge: <Badge variant="outline">Upcoming</Badge>,
        message: `Payment due in ${daysDiff} days`
      }
    }
  }
  
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
          <span className="ml-2">Loading your agreements...</span>
        </div>
      </DashboardLayout>
    )
  }
  
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">My Rental Agreements</h1>
            <p className="text-gray-500">Manage your current and past rental agreements</p>
          </div>
          <div className="flex space-x-2 mt-4 md:mt-0">
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/dashboard/wallet-funding")}
            >
              <Wallet className="h-4 w-4 mr-2" />
              Fund Wallet
            </Button>
          </div>
        </div>
        
        {/* Wallet status */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-semibold mb-2">Wallet Status</h2>
                {hasWallet ? (
                  <div className="space-y-1">
                    <p className="text-sm">
                      <span className="font-medium">Address:</span>{" "}
                      {wallet?.address.substring(0, 10)}...{wallet?.address.substring(wallet.address.length - 8)}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Balance:</span>{" "}
                      {wallet?.balance} ETH
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">
                    You don't have a wallet yet. Create one to make payments.
                  </p>
                )}
              </div>
              {!hasWallet && (
                <Button className="mt-4 md:mt-0" onClick={handleCreateWallet}>
                  <Wallet className="h-4 w-4 mr-2" />
                  Create Wallet
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
        
        {agreements.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">No agreements found</h2>
            <p className="text-gray-500 mb-4">You don't have any rental agreements yet.</p>
            <Button onClick={() => router.push("/dashboard/properties")}>
              Browse available properties
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {agreements.map((agreement) => {
              const paymentInfo = getPaymentStatus(agreement)
              
              return (
                <Card key={agreement.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <CardTitle className="text-lg">{agreement.property.title}</CardTitle>
                        <CardDescription>{agreement.property.location}</CardDescription>
                      </div>
                      <div className="flex items-center mt-2 md:mt-0 space-x-2">
                        {getStatusBadge(agreement.status)}
                        {paymentInfo.badge}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="grid gap-4 md:grid-cols-3">
                      <div>
                        <div className="text-sm font-medium text-gray-500">Rent Amount</div>
                        <div className="mt-1 flex items-center">
                          <DollarSign className="h-4 w-4 text-gray-500 mr-1" />
                          <span>{agreement.rentAmount} ETH / month</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-500">Start Date</div>
                        <div className="mt-1 flex items-center">
                          <Calendar className="h-4 w-4 text-gray-500 mr-1" />
                          <span>{formatDate(agreement.startDate)}</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-500">Next Payment</div>
                        <div className="mt-1 flex items-center">
                          <Clock className="h-4 w-4 text-gray-500 mr-1" />
                          <span>{formatDate(agreement.nextPaymentDate)}</span>
                        </div>
                      </div>
                    </div>
                    
                    {paymentInfo.status === 'overdue' && (
                      <div className="mt-4 p-3 bg-red-50 text-red-800 rounded-md flex items-start">
                        <AlertTriangle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Payment overdue</p>
                          <p className="text-sm">{paymentInfo.message}. Please make your payment as soon as possible to avoid penalties.</p>
                        </div>
                      </div>
                    )}
                    
                    {paymentInfo.status === 'due-soon' && (
                      <div className="mt-4 p-3 bg-orange-50 text-orange-800 rounded-md flex items-start">
                        <Clock className="h-5 w-5 text-orange-500 mr-2 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Payment due soon</p>
                          <p className="text-sm">{paymentInfo.message}. Please prepare to make your payment on time.</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  
                  <CardFooter className="flex justify-between border-t pt-4 px-6 pb-6">
                    <Button variant="outline" onClick={() => handleViewAgreement(agreement)}>
                      <FileText className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    
                    {(agreement.status === 'active' || agreement.status === 'pending') && (
                      <Button 
                        onClick={() => handleMakePayment(agreement)} 
                        disabled={!hasWallet || agreement.paymentStatus === 'paid'}
                      >
                        <DollarSign className="h-4 w-4 mr-2" />
                        {agreement.paymentStatus === 'paid' ? 'Paid' : 'Make Payment'}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        )}
      </div>
      
      {/* Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Make a Payment</DialogTitle>
            <DialogDescription>
              Please confirm your payment details for {selectedAgreement?.property?.title}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="mb-4">
              <Label htmlFor="payment-type">Payment Type</Label>
              <Select value={paymentType} onValueChange={(value: any) => setPaymentType(value)}>
                <SelectTrigger id="payment-type">
                  <SelectValue placeholder="Select payment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rent">Rent Payment</SelectItem>
                  <SelectItem value="deposit">Security Deposit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="mb-4">
              <Label htmlFor="payment-amount">Amount (ETH)</Label>
              <Input
                id="payment-amount"
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="0.00"
                step="0.01"
              />
            </div>
            
            <div className="mb-4 p-3 bg-gray-50 rounded-md text-sm">
              <p className="font-medium mb-1">Payment Summary</p>
              <div className="flex justify-between mb-1">
                <span className="text-gray-600">Current wallet balance:</span>
                <span>{wallet?.balance || 0} ETH</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-600">Payment amount:</span>
                <span>{paymentAmount} ETH</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-medium">
                <span>Remaining balance after payment:</span>
                <span>{wallet ? (parseFloat(wallet.balance) - parseFloat(paymentAmount)).toFixed(4) : 0} ETH</span>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)} disabled={paymentStatus === 'processing'}>
              Cancel
            </Button>
            <Button onClick={handlePaymentSubmit} disabled={paymentStatus !== 'idle'}>
              {paymentStatus === 'processing' && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {paymentStatus === 'success' && <Check className="h-4 w-4 mr-2" />}
              {paymentStatus === 'processing' ? 'Processing...' : 
               paymentStatus === 'success' ? 'Completed!' : 'Confirm Payment'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Agreement Details Dialog */}
      {selectedAgreement && (
        <Dialog open={!!selectedAgreement && !isPaymentDialogOpen} onOpenChange={(open) => !open && setSelectedAgreement(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Rental Agreement Details</DialogTitle>
              <DialogDescription>
                {selectedAgreement.property.title} - {selectedAgreement.property.location}
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Agreement #{selectedAgreement.id}</h3>
                {getStatusBadge(selectedAgreement.status)}
              </div>
              
              <div className="grid gap-4 md:grid-cols-2 mb-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Lease Period</h4>
                  <p className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-500 mr-1" />
                    {formatDate(selectedAgreement.startDate)} - {formatDate(selectedAgreement.endDate)}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Monthly Rent</h4>
                  <p className="flex items-center">
                    <DollarSign className="h-4 w-4 text-gray-500 mr-1" />
                    {selectedAgreement.rentAmount} ETH
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Security Deposit</h4>
                  <p className="flex items-center">
                    <DollarSign className="h-4 w-4 text-gray-500 mr-1" />
                    {selectedAgreement.depositAmount} ETH
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Blockchain ID</h4>
                  <p className="flex items-center">
                    <FileText className="h-4 w-4 text-gray-500 mr-1" />
                    {selectedAgreement.blockchainId ? 
                      selectedAgreement.blockchainId.substring(0, 10) + '...' : 
                      'Pending registration'}
                  </p>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="mb-6">
                <h4 className="font-medium mb-2">Payment History</h4>
                {selectedAgreement.payments && selectedAgreement.payments.length > 0 ? (
                  <div className="space-y-2">
                    {selectedAgreement.payments.map((payment: any) => (
                      <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                        <div className="flex items-center">
                          <ReceiptText className="h-4 w-4 text-gray-500 mr-2" />
                          <div>
                            <p className="font-medium">{payment.amount} ETH {payment.type}</p>
                            <p className="text-xs text-gray-500">{formatDate(payment.date)}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-green-500 border-green-500">Paid</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No payment records found.</p>
                )}
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Property Details</h4>
                <div className="p-3 bg-gray-50 rounded-md">
                  <div className="flex items-start">
                    <Home className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">{selectedAgreement.property.title}</p>
                      <p className="text-sm text-gray-600">{selectedAgreement.property.location}</p>
                      <div className="mt-2">
                        <Button 
                          variant="link" 
                          className="p-0 h-auto text-blue-600" 
                          onClick={() => {
                            setSelectedAgreement(null)
                            router.push(`/dashboard/properties/${selectedAgreement.property.id}`)
                          }}
                        >
                          View property details
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedAgreement(null)}>
                Close
              </Button>
              {(selectedAgreement.status === 'active' || selectedAgreement.status === 'pending') && 
                selectedAgreement.paymentStatus !== 'paid' && (
                <Button 
                  onClick={() => {
                    setIsPaymentDialogOpen(true)
                    setPaymentAmount(selectedAgreement.rentAmount.toString())
                    setPaymentType("rent")
                  }}
                  disabled={!hasWallet}
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  Make Payment
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </DashboardLayout>
  )
} 