'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { TransactionList } from '@/components/blockchain/transaction-list';
import { PaymentDialog } from '@/components/blockchain/payment-dialog';
import { toast } from '@/components/ui/use-toast';
import walletService from '@/lib/blockchain/wallet-service';
import propertyService from '@/lib/blockchain/property-service';
import { useUser } from '@/hooks/useUser';
import { 
  Blocks, 
  AlertCircle, 
  Wallet, 
  Building, 
  CopyIcon, 
  FileText, 
  RefreshCw, 
  Coins, 
  PlusCircle, 
  ChevronRight,
  Home,
  CreditCard
} from 'lucide-react';
import Link from 'next/link';

// Mock transactions for demo
const mockTransactions = [
  {
    id: 'tx1',
    transactionHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    amount: '0.5 ETH',
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
    from: '0x1234567890abcdef1234567890abcdef12345678',
    to: '0xabcdef1234567890abcdef1234567890abcdef12',
    confirmations: 24,
    blockNumber: 12345678,
    isDeposit: false,
    status: 'confirmed' as const,
    type: 'payment' as const,
    propertyId: 'prop-1',
    propertyTitle: 'Luxury Villa with Pool'
  },
  {
    id: 'tx2',
    transactionHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    amount: '1.0 ETH',
    timestamp: new Date(Date.now() - 86400000 * 5).toISOString(),
    from: '0x1234567890abcdef1234567890abcdef12345678',
    to: '0xabcdef1234567890abcdef1234567890abcdef12',
    confirmations: 124,
    blockNumber: 12345234,
    isDeposit: true,
    status: 'confirmed' as const,
    type: 'deposit' as const,
    propertyId: 'prop-1',
    propertyTitle: 'Luxury Villa with Pool'
  },
  {
    id: 'tx3',
    transactionHash: '0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456',
    amount: '0.2 ETH',
    timestamp: new Date(Date.now() - 86400000 * 10).toISOString(),
    from: '0x1234567890abcdef1234567890abcdef12345678',
    to: '0xabcdef1234567890abcdef1234567890abcdef12',
    confirmations: 345,
    blockNumber: 12341234,
    isDeposit: false,
    status: 'confirmed' as const,
    type: 'payment' as const,
    propertyId: 'prop-2',
    propertyTitle: 'Modern Downtown Apartment'
  }
];

// Mock agreements for demo
const mockAgreements = [
  {
    id: 'agreement-1',
    propertyId: 'prop-1',
    propertyTitle: 'Luxury Villa with Pool',
    propertyImage: '/images/property-1.jpg',
    landlordAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
    landlordName: 'John Landlord',
    startDate: new Date(Date.now() - 86400000 * 30).toISOString(),
    endDate: new Date(Date.now() + 86400000 * 335).toISOString(),
    rentAmount: '0.5',
    rentCurrency: 'ETH',
    rentPeriod: 'monthly',
    securityDeposit: '1.0',
    status: 'active',
    nextPaymentDate: new Date(Date.now() + 86400000 * 5).toISOString(),
    blockchainId: '12345'
  },
  {
    id: 'agreement-2',
    propertyId: 'prop-2',
    propertyTitle: 'Modern Downtown Apartment',
    propertyImage: '/images/property-2.jpg',
    landlordAddress: '0x7890abcdef1234567890abcdef1234567890abcdef',
    landlordName: 'Jane Doe',
    startDate: new Date(Date.now() - 86400000 * 60).toISOString(),
    endDate: new Date(Date.now() + 86400000 * 305).toISOString(),
    rentAmount: '0.3',
    rentCurrency: 'ETH',
    rentPeriod: 'monthly',
    securityDeposit: '0.6',
    status: 'active',
    nextPaymentDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    blockchainId: '12346'
  }
];

export default function BlockchainPage() {
  const { user } = useUser();
  const userId = user?.id || 'tenant-1'; // Fallback for development
  
  const [isLoading, setIsLoading] = useState(true);
  const [wallet, setWallet] = useState<any>(null);
  const [hasWallet, setHasWallet] = useState(false);
  const [agreements, setAgreements] = useState<any[]>([]);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [selectedAgreement, setSelectedAgreement] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('wallet');
  const [error, setError] = useState<string | null>(null);

  // Check if user has a wallet
  useEffect(() => {
    const checkWallet = async () => {
      try {
        setIsLoading(true);
        const hasUserWallet = walletService.hasWallet(userId);
        setHasWallet(hasUserWallet);
        
        if (hasUserWallet) {
          const userWallet = await walletService.getUserWallet(userId);
          if (userWallet) {
            setWallet(userWallet);
            
            // In a real implementation, we would fetch agreements from the blockchain
            // For now, use mock data
            setAgreements(mockAgreements);
          }
        }
      } catch (error) {
        console.error('Error checking wallet:', error);
        setError('Failed to check wallet status. Please ensure your blockchain node is running.');
      } finally {
        setIsLoading(false);
      }
    };

    checkWallet();
  }, [userId]);

  // Format wallet address for display
  const formatWalletAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Format balance for display
  const formatBalance = (balance: string) => {
    if (!balance) return '0 ETH';
    const balanceNum = parseFloat(balance);
    return `${balanceNum.toFixed(4)} ETH`;
  };

  // Connect wallet
  const connectWallet = async () => {
    try {
      setIsLoading(true);
      
      if (!hasWallet) {
        await walletService.createWallet(userId, 'tenant');
        
        // Fund wallet with test ETH
        await walletService.fundWallet(userId, "1.0");
        
        setHasWallet(true);
        
        const userWallet = await walletService.getUserWallet(userId);
        if (userWallet) {
          setWallet(userWallet);
        }
        
        toast({
          title: 'Wallet Created',
          description: 'Your blockchain wallet has been created and funded with test ETH.',
        });
        
        // In a real implementation, we would fetch agreements from the blockchain
        // For now, use mock data
        setAgreements(mockAgreements);
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast({
        title: 'Error',
        description: 'Failed to create wallet. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh wallet balance
  const refreshBalance = async () => {
    try {
      if (hasWallet) {
        await walletService.updateWalletBalance(userId);
        const userWallet = await walletService.getUserWallet(userId);
        if (userWallet) {
          setWallet(userWallet);
          toast({
            title: 'Balance updated',
            description: `Current balance: ${formatBalance(userWallet.balance)}`,
          });
        }
      }
    } catch (error) {
      console.error('Error refreshing balance:', error);
      toast({
        title: 'Error',
        description: 'Failed to refresh balance. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Copy wallet address
  const copyAddress = () => {
    if (wallet?.address) {
      navigator.clipboard.writeText(wallet.address);
    toast({
      title: 'Address copied',
        description: 'Wallet address copied to clipboard',
    });
    }
  };

  // Open payment dialog
  const handleMakePayment = (agreement: any) => {
    setSelectedAgreement(agreement);
    setIsPaymentDialogOpen(true);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Handle payment success
  const handlePaymentSuccess = () => {
    setIsPaymentDialogOpen(false);
    toast({
      title: 'Payment Successful',
      description: 'Your rental payment has been processed successfully.',
    });
    refreshBalance();
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold">Blockchain Wallet</h1>
            <p className="text-muted-foreground">Manage your wallet, agreements and transactions</p>
          </div>
      </div>

        {error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
              <p className="mt-4 text-muted-foreground">Loading wallet information...</p>
            </div>
        </div>
      ) : (
        <Tabs defaultValue={hasWallet ? "wallet" : "connect"} className="space-y-6">
          <TabsList className="grid grid-cols-1 md:grid-cols-3">
            <TabsTrigger value="wallet">
                <div className="flex items-center">
                  <Wallet className="mr-2 h-4 w-4" />
                  <span>Wallet</span>
                </div>
            </TabsTrigger>
            <TabsTrigger value="agreements">
                <div className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Agreements</span>
                </div>
            </TabsTrigger>
            <TabsTrigger value="transactions">
                <div className="flex items-center">
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>Transactions</span>
                </div>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="wallet" className="space-y-6">
            {!hasWallet ? (
              <Card>
                <CardHeader>
                    <CardTitle>Connect Wallet</CardTitle>
                  <CardDescription>
                      Connect to the blockchain to manage your rental properties and payments.
                  </CardDescription>
                </CardHeader>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center justify-center py-8">
                      <Blocks className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Wallet Detected</h3>
                      <p className="text-center text-muted-foreground mb-4">
                        You need to connect a wallet to interact with the blockchain.
                      </p>
                      <Button onClick={connectWallet}>
                        <Wallet className="mr-2 h-4 w-4" />
                        Create Blockchain Wallet
                  </Button>
                    </div>
                  </CardContent>
              </Card>
            ) : (
              <>
                  <div className="grid gap-6 lg:grid-cols-2">
                    <Card>
                    <CardHeader>
                        <CardTitle>Wallet Details</CardTitle>
                        <CardDescription>Your blockchain wallet information</CardDescription>
                    </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                        <div className="text-sm text-muted-foreground">Wallet Address</div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                            <code className="text-sm">{formatWalletAddress(wallet?.address || '')}</code>
                          <Button size="sm" variant="ghost" onClick={copyAddress}>
                            <CopyIcon className="h-4 w-4" />
                          </Button>
                      </div>
                      
                          <div className="text-sm text-muted-foreground">Balance</div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                            <div className="font-medium text-lg">{formatBalance(wallet?.balance || '0')}</div>
                          <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">Test Network</Badge>
                        </div>
                      </div>
                    </CardContent>
                      <CardFooter className="justify-end">
                        <Button variant="outline" onClick={refreshBalance}>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Refresh Balance
                        </Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Common wallet actions</CardDescription>
                    </CardHeader>
                      <CardContent>
                        <div className="grid gap-4">
                          <Link href="/dashboard/wallet-funding">
                            <Button className="w-full justify-between" variant="outline">
                          <div className="flex items-center">
                                <Coins className="mr-2 h-4 w-4" />
                                Fund Wallet with Test ETH
                          </div>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                          </Link>
                          
                          <Button className="w-full justify-between" variant="outline" onClick={() => setActiveTab('agreements')}>
                          <div className="flex items-center">
                              <FileText className="mr-2 h-4 w-4" />
                              View Rental Agreements
                          </div>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                          
                          <Button className="w-full justify-between" variant="outline" onClick={() => setActiveTab('transactions')}>
                            <div className="flex items-center">
                              <CreditCard className="mr-2 h-4 w-4" />
                              View Transaction History
                            </div>
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                          
                          <Link href="/dashboard/properties">
                            <Button className="w-full justify-between" variant="outline">
                              <div className="flex items-center">
                                <Home className="mr-2 h-4 w-4" />
                                Browse Properties
                              </div>
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </Link>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </TabsContent>
          
          <TabsContent value="agreements" className="space-y-6">
            {!hasWallet ? (
              <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col items-center justify-center py-8">
                      <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Wallet Required</h3>
                      <p className="text-center text-muted-foreground mb-4">
                        You need to connect a wallet to view rental agreements.
                      </p>
                      <Button onClick={connectWallet}>
                        <Wallet className="mr-2 h-4 w-4" />
                        Create Blockchain Wallet
                    </Button>
                  </div>
                </CardContent>
              </Card>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">My Rental Agreements</h2>
                  </div>
                  
                  {agreements.length === 0 ? (
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex flex-col items-center justify-center py-8">
                          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                          <h3 className="text-lg font-semibold mb-2">No Agreements Found</h3>
                          <p className="text-center text-muted-foreground mb-4">
                    You don't have any active rental agreements on the blockchain.
                  </p>
                          <Link href="/dashboard/properties">
                            <Button>
                              <Home className="mr-2 h-4 w-4" />
                              Browse Properties
                            </Button>
                          </Link>
                        </div>
                </CardContent>
              </Card>
            ) : (
                    <div className="grid gap-4">
                      {agreements.map((agreement) => (
                        <Card key={agreement.id}>
                          <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                              <div className="p-6 flex-1">
                                <div className="flex items-start justify-between mb-4">
                            <div>
                                    <h3 className="font-semibold text-lg">{agreement.propertyTitle}</h3>
                                    <p className="text-sm text-muted-foreground">Agreement ID: {agreement.blockchainId}</p>
                            </div>
                                  <Badge className={agreement.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                                    {agreement.status}
                            </Badge>
                          </div>
                          
                                <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                    <p className="text-sm font-medium">Landlord</p>
                              <div className="flex items-center mt-1">
                                <Avatar className="h-6 w-6 mr-2">
                                        <AvatarFallback>{agreement.landlordName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                      <p className="text-sm text-muted-foreground">{agreement.landlordName}</p>
                              </div>
                            </div>
                                  
                            <div>
                                    <p className="text-sm font-medium">Period</p>
                                    <p className="text-sm text-muted-foreground">
                                      {formatDate(agreement.startDate)} - {formatDate(agreement.endDate)}
                                    </p>
                            </div>
                                  
                            <div>
                                    <p className="text-sm font-medium">Next Payment</p>
                                    <p className="text-sm text-muted-foreground">{formatDate(agreement.nextPaymentDate)}</p>
                            </div>
                                  
                            <div>
                                    <p className="text-sm font-medium">Rent Amount</p>
                                    <p className="text-sm text-muted-foreground">
                                      {agreement.rentAmount} {agreement.rentCurrency} / {agreement.rentPeriod}
                                    </p>
                            </div>
                          </div>
                          
                                <div className="flex justify-end">
                                  <Button 
                                    variant="default" 
                                    onClick={() => handleMakePayment(agreement)}
                                  >
                                    <Coins className="mr-2 h-4 w-4" />
                                Make Payment
                              </Button>
                            </div>
                          </div>
                        </div>
                          </CardContent>
                    </Card>
                  ))}
                </div>
                  )}
              </>
            )}
          </TabsContent>
          
          <TabsContent value="transactions" className="space-y-6">
            {!hasWallet ? (
              <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col items-center justify-center py-8">
                      <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Wallet Required</h3>
                      <p className="text-center text-muted-foreground mb-4">
                        You need to connect a wallet to view transactions.
                      </p>
                      <Button onClick={connectWallet}>
                        <Wallet className="mr-2 h-4 w-4" />
                        Create Blockchain Wallet
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Transaction History</h2>
                  </div>
                  
                  <TransactionList transactions={mockTransactions} />
              </>
            )}
          </TabsContent>
        </Tabs>
      )}

      {selectedAgreement && (
        <PaymentDialog
          agreement={selectedAgreement}
          isOpen={isPaymentDialogOpen} 
          onClose={() => setIsPaymentDialogOpen(false)}
          userId={userId}
          userType="tenant"
          onSuccess={handlePaymentSuccess}
        />
      )}
      </div>
    </div>
  );
} 