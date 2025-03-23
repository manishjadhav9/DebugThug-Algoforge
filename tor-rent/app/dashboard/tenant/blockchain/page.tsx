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
    from: '0xabcdef1234567890abcdef1234567890abcdef12',
    to: '0x1234567890abcdef1234567890abcdef12345678',
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
    timestamp: new Date(Date.now() - 86400000 * 15).toISOString(),
    from: '0xabcdef1234567890abcdef1234567890abcdef12',
    to: '0x1234567890abcdef1234567890abcdef12345678',
    confirmations: 242,
    blockNumber: 12345200,
    isDeposit: true,
    status: 'confirmed' as const,
    type: 'deposit' as const,
    propertyId: 'prop-1',
    propertyTitle: 'Luxury Villa with Pool'
  }
];

// Mock agreements for demo
const mockAgreements = [
  {
    id: 'agreement-1',
    blockchainId: '1',
    propertyId: 'prop-1',
    propertyTitle: 'Luxury Villa with Pool',
    landlord: 'John Doe',
    landlordAddress: '0x1234567890abcdef1234567890abcdef12345678',
    rent: '0.5 ETH',
    deposit: '1.0 ETH',
    startDate: new Date(Date.now() - 86400000 * 30).toISOString(),
    duration: 12, // months
    status: 'active',
    nextPaymentDue: new Date(Date.now() + 86400000 * 2).toISOString(),
    propertyImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1350&q=80',
    location: 'Whitefield, Bangalore',
  }
];

export default function TenantBlockchainPage() {
  const { user } = useUser();
  const userId = user?.id || 'tenant-1'; // Fallback for development
  
  const [isLoading, setIsLoading] = useState(true);
  const [hasWallet, setHasWallet] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [walletBalance, setWalletBalance] = useState('0');
  const [agreements, setAgreements] = useState<any[]>([]);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [selectedAgreement, setSelectedAgreement] = useState<any>(null);

  // Check if user has a wallet
  useEffect(() => {
    const checkWallet = async () => {
      try {
        setIsLoading(true);
        const hasUserWallet = walletService.hasWallet(userId);
        setHasWallet(hasUserWallet);
        
        if (hasUserWallet) {
          const wallet = await walletService.getUserWallet(userId);
          if (wallet) {
            setWalletAddress(wallet.address);
            setWalletBalance(wallet.balance || '0');
            
            // In a real implementation, we would fetch agreements from the blockchain
            setAgreements(mockAgreements);
          }
        }
      } catch (error) {
        console.error('Error checking wallet:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkWallet();
  }, [userId]);

  // Format wallet address for display
  const formatWalletAddress = (address: string) => {
    if (!address) return '';
    return `${address.substring(0, 8)}...${address.substring(address.length - 6)}`;
  };

  // Format ETH balance
  const formatBalance = (balance: string) => {
    try {
      const balanceFloat = parseFloat(balance);
      return `${balanceFloat.toFixed(4)} ETH`;
    } catch (error) {
      return '0 ETH';
    }
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
        
        const wallet = await walletService.getUserWallet(userId);
        if (wallet) {
          setWalletAddress(wallet.address);
          setWalletBalance(wallet.balance || '0');
        }
        
        toast({
          title: 'Wallet created successfully',
          description: 'Your blockchain wallet has been created and funded with 1 ETH for testing.',
        });
        
        // Set the mock agreements
        setAgreements(mockAgreements);
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast({
        title: 'Error connecting wallet',
        description: 'There was an error connecting your wallet. Please try again.',
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
        const wallet = await walletService.getUserWallet(userId);
        if (wallet) {
          setWalletBalance(wallet.balance || '0');
          toast({
            title: 'Balance updated',
            description: 'Your wallet balance has been updated.',
          });
        }
      }
    } catch (error) {
      console.error('Error refreshing balance:', error);
      toast({
        title: 'Error refreshing balance',
        description: 'There was an error refreshing your wallet balance. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Copy wallet address
  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    toast({
      title: 'Address copied',
      description: 'Wallet address copied to clipboard.',
    });
  };

  // Handle make payment
  const handleMakePayment = (agreement: any) => {
    setSelectedAgreement(agreement);
    setIsPaymentDialogOpen(true);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Handle payment success
  const handlePaymentSuccess = () => {
    toast({
      title: 'Payment successful',
      description: 'Your payment has been processed successfully.',
    });
    // In a real app, we would refresh the data
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Blocks className="h-6 w-6 text-orange-500" />
            Blockchain Payments
          </h1>
          <p className="text-muted-foreground">Make secure payments using blockchain technology</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <Tabs defaultValue={hasWallet ? "wallet" : "connect"} className="space-y-6">
          <TabsList className="grid grid-cols-1 md:grid-cols-3">
            <TabsTrigger value="wallet">
              <Wallet className="h-4 w-4 mr-2" />
              Wallet
            </TabsTrigger>
            <TabsTrigger value="agreements">
              <FileText className="h-4 w-4 mr-2" />
              My Agreements
            </TabsTrigger>
            <TabsTrigger value="transactions">
              <Coins className="h-4 w-4 mr-2" />
              Transactions
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="wallet" className="space-y-6">
            {!hasWallet ? (
              <Card>
                <CardHeader>
                  <CardTitle>Connect to Blockchain</CardTitle>
                  <CardDescription>
                    Create a blockchain wallet to make secure payments to your landlord
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center py-6">
                  <div className="rounded-full bg-orange-100 p-6 mb-4">
                    <Wallet className="h-12 w-12 text-orange-500" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">No Wallet Found</h3>
                  <p className="text-center text-muted-foreground mb-6 max-w-md">
                    You need a blockchain wallet to make payments securely through the blockchain.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    onClick={connectWallet}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Creating Wallet...
                      </>
                    ) : (
                      <>
                        <Wallet className="h-4 w-4 mr-2" />
                        Create Blockchain Wallet
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="md:col-span-2">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Your Wallet</span>
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Connected</Badge>
                      </CardTitle>
                      <CardDescription>
                        Use this wallet to make payments to your landlord
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">Wallet Address</div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                          <code className="text-sm">{formatWalletAddress(walletAddress)}</code>
                          <Button size="sm" variant="ghost" onClick={copyAddress}>
                            <CopyIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <div className="text-sm text-muted-foreground">Balance</div>
                          <Button size="sm" variant="ghost" onClick={refreshBalance}>
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                          <div className="font-medium text-lg">{formatBalance(walletBalance)}</div>
                          <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">Test Network</Badge>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex-col space-y-2">
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Test Network</AlertTitle>
                        <AlertDescription>
                          This is a test wallet on the Ethereum test network. Do not send real ETH to this address.
                        </AlertDescription>
                      </Alert>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex flex-col gap-2">
                        <Button variant="outline" className="justify-between" onClick={() => document.querySelector('[value="agreements"]')?.dispatchEvent(new Event('click'))}>
                          <div className="flex items-center">
                            <CreditCard className="h-4 w-4 mr-2" />
                            Make a Payment
                          </div>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" className="justify-between" onClick={() => document.querySelector('[value="transactions"]')?.dispatchEvent(new Event('click'))}>
                          <div className="flex items-center">
                            <Coins className="h-4 w-4 mr-2" />
                            View Transactions
                          </div>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" className="justify-between" asChild>
                          <Link href="https://etherscan.io/address/">
                            <div className="flex items-center">
                              <Blocks className="h-4 w-4 mr-2" />
                              View on Block Explorer
                            </div>
                            <ChevronRight className="h-4 w-4" />
                          </Link>
                        </Button>
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
                  <Alert className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Wallet Required</AlertTitle>
                    <AlertDescription>
                      You need to create a blockchain wallet first to view and manage your rental agreements.
                    </AlertDescription>
                  </Alert>
                  <div className="text-center py-6">
                    <Button onClick={() => document.querySelector('[value="wallet"]')?.dispatchEvent(new Event('click'))}>
                      Go to Wallet
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : agreements.length === 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>My Rental Agreements</CardTitle>
                  <CardDescription>
                    Your rental agreements on the blockchain
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center py-8">
                  <div className="rounded-full bg-gray-100 p-6 mb-4">
                    <FileText className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">No Agreements Found</h3>
                  <p className="text-center text-muted-foreground mb-6 max-w-md">
                    You don't have any active rental agreements on the blockchain.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-medium">My Rental Agreements</h2>
                </div>
                
                <div className="space-y-4">
                  {agreements.map((agreement, index) => (
                    <Card key={index} className="overflow-hidden">
                      <div className="flex flex-col md:flex-row">
                        <div className="w-full md:w-1/3 h-48 md:h-auto relative">
                          <img 
                            src={agreement.propertyImage} 
                            alt={agreement.propertyTitle}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-semibold">{agreement.propertyTitle}</h3>
                              <p className="text-sm text-muted-foreground">{agreement.location}</p>
                            </div>
                            <Badge className="bg-green-100 text-green-700">
                              {agreement.status.charAt(0).toUpperCase() + agreement.status.slice(1)}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 mt-4">
                            <div>
                              <p className="text-sm text-gray-500">Landlord</p>
                              <div className="flex items-center mt-1">
                                <Avatar className="h-6 w-6 mr-2">
                                  <AvatarFallback>{agreement.landlord.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <p className="text-sm font-medium">{agreement.landlord}</p>
                              </div>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Start Date</p>
                              <p className="font-medium">{formatDate(agreement.startDate)}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Monthly Rent</p>
                              <p className="font-medium">{agreement.rent}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Security Deposit</p>
                              <p className="font-medium">{agreement.deposit}</p>
                            </div>
                          </div>
                          
                          <div className="mt-4 pt-4 border-t">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                              <div>
                                <p className="text-sm text-gray-500">Next Payment Due</p>
                                <p className="font-medium">{formatDate(agreement.nextPaymentDue)}</p>
                              </div>
                              <Button onClick={() => handleMakePayment(agreement)}>
                                <CreditCard className="h-4 w-4 mr-2" />
                                Make Payment
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </TabsContent>
          
          <TabsContent value="transactions" className="space-y-6">
            {!hasWallet ? (
              <Card>
                <CardContent className="pt-6">
                  <Alert className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Wallet Required</AlertTitle>
                    <AlertDescription>
                      You need to create a blockchain wallet first to see your transactions.
                    </AlertDescription>
                  </Alert>
                  <div className="text-center py-6">
                    <Button onClick={() => document.querySelector('[value="wallet"]')?.dispatchEvent(new Event('click'))}>
                      Go to Wallet
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>
                      View all your blockchain payment transactions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TransactionList 
                      transactions={mockTransactions}
                      isLoading={false}
                    />
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>
        </Tabs>
      )}

      {/* Payment Dialog */}
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
  );
} 