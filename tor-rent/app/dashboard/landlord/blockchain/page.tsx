'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { TransactionList } from '@/components/blockchain/transaction-list';
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
  ReceiptText
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
    confirmations: 79,
    blockNumber: 12345600,
    isDeposit: true,
    status: 'confirmed' as const,
    type: 'deposit' as const,
    propertyId: 'prop-1',
    propertyTitle: 'Luxury Villa with Pool'
  },
  {
    id: 'tx3',
    transactionHash: '0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba',
    amount: '0.25 ETH',
    timestamp: new Date(Date.now() - 86400000 * 1).toISOString(),
    from: '0xabcdef1234567890abcdef1234567890abcdef12',
    to: '0x1234567890abcdef1234567890abcdef12345678',
    confirmations: 10,
    blockNumber: 12345700,
    isDeposit: false,
    status: 'confirmed' as const,
    type: 'refund' as const,
    propertyId: 'prop-1',
    propertyTitle: 'Luxury Villa with Pool'
  },
  {
    id: 'tx4',
    transactionHash: '0xfedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210',
    amount: '0 ETH',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    from: '0x1234567890abcdef1234567890abcdef12345678',
    to: '0xddeeff1234567890abcdef1234567890abcdef12',
    confirmations: 2,
    blockNumber: 12345790,
    isDeposit: false,
    status: 'pending' as const,
    type: 'agreement' as const,
    propertyId: 'prop-2',
    propertyTitle: 'Modern Apartment in City Center'
  }
];

export default function BlockchainPage() {
  const { user } = useUser();
  const userId = user?.id || 'user-1'; // Fallback for development
  
  const [isLoading, setIsLoading] = useState(true);
  const [hasWallet, setHasWallet] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [walletBalance, setWalletBalance] = useState('0');
  const [properties, setProperties] = useState<any[]>([]);
  const [agreements, setAgreements] = useState<any[]>([]);

  // Fetch properties from blockchain
  const fetchBlockchainProperties = async () => {
    try {
      // In a real implementation, we would get actual properties from the blockchain
      const landlordId = userId;
      const props = await propertyService.getPropertiesByLandlord(landlordId);
      setProperties(props.filter((p: any) => p.blockchainId));
    } catch (error) {
      console.error('Error fetching blockchain properties:', error);
    }
  };

  // Fetch agreements from blockchain
  const fetchAgreements = async () => {
    try {
      // In a real implementation, we would get actual agreements from the blockchain
      // Here we're just using the properties to simulate agreements
      const agreementList = properties.map((property, index) => ({
        id: `agreement-${index}`,
        blockchainId: `${index + 1}`,
        propertyId: property.id,
        propertyTitle: property.title,
        tenant: 'Tenant Name',
        tenantAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
        landlord: 'Landlord Name',
        landlordAddress: '0x1234567890abcdef1234567890abcdef12345678',
        rent: `${0.5 * (index + 1)} ETH`,
        deposit: `${1.0 * (index + 1)} ETH`,
        startDate: new Date().toISOString(),
        duration: 12, // months
        status: index === 0 ? 'active' : 'pending',
        createdAt: new Date(Date.now() - 86400000 * index).toISOString(),
      }));
      
      setAgreements(agreementList);
    } catch (error) {
      console.error('Error fetching agreements:', error);
    }
  };

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
            await fetchBlockchainProperties();
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

  // Update agreements when properties change
  useEffect(() => {
    if (properties.length > 0) {
      fetchAgreements();
    }
  }, [properties]);

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
        await walletService.createWallet(userId, 'landlord');
        
        // Fund wallet with test ETH
        await walletService.fundWallet(userId, "2.0");
        
        setHasWallet(true);
        
        const wallet = await walletService.getUserWallet(userId);
        if (wallet) {
          setWalletAddress(wallet.address);
          setWalletBalance(wallet.balance || '0');
        }
        
        toast({
          title: 'Wallet created successfully',
          description: 'Your blockchain wallet has been created and funded with 2 ETH for testing.',
        });
        
        await fetchBlockchainProperties();
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
        description: 'There was an error refreshing your wallet balance.',
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

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Blocks className="h-6 w-6 text-orange-500" />
            Blockchain Management
          </h1>
          <p className="text-muted-foreground">Manage your properties on the blockchain</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <Tabs defaultValue={hasWallet ? "wallet" : "connect"} className="space-y-6">
          <TabsList className="grid grid-cols-1 md:grid-cols-4">
            <TabsTrigger value="wallet">
              <Wallet className="h-4 w-4 mr-2" />
              Wallet
            </TabsTrigger>
            <TabsTrigger value="properties">
              <Building className="h-4 w-4 mr-2" />
              Properties
            </TabsTrigger>
            <TabsTrigger value="agreements">
              <FileText className="h-4 w-4 mr-2" />
              Agreements
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
                    Create a blockchain wallet to manage your properties on the blockchain
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center py-6">
                  <div className="rounded-full bg-orange-100 p-6 mb-4">
                    <Wallet className="h-12 w-12 text-orange-500" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">No Wallet Found</h3>
                  <p className="text-center text-muted-foreground mb-6 max-w-md">
                    You need a blockchain wallet to list properties, create agreements, and receive payments through the blockchain.
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
                        Use this wallet to interact with the blockchain
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
                        <Button variant="outline" className="justify-between" asChild>
                          <Link href="/dashboard/landlord/properties">
                            <div className="flex items-center">
                              <Building className="h-4 w-4 mr-2" />
                              Add Property to Blockchain
                            </div>
                            <ChevronRight className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="outline" className="justify-between" asChild>
                          <Link href="/dashboard/landlord/payments">
                            <div className="flex items-center">
                              <ReceiptText className="h-4 w-4 mr-2" />
                              Request Payment
                            </div>
                            <ChevronRight className="h-4 w-4" />
                          </Link>
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
          
          <TabsContent value="properties" className="space-y-6">
            {!hasWallet ? (
              <Card>
                <CardContent className="pt-6">
                  <Alert className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Wallet Required</AlertTitle>
                    <AlertDescription>
                      You need to create a blockchain wallet first to manage properties on the blockchain.
                    </AlertDescription>
                  </Alert>
                  <div className="text-center py-6">
                    <Button onClick={() => document.querySelector('[value="wallet"]')?.dispatchEvent(new Event('click'))}>
                      Go to Wallet
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : properties.length === 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>Blockchain Properties</CardTitle>
                  <CardDescription>
                    Properties you have added to the blockchain
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center py-8">
                  <div className="rounded-full bg-gray-100 p-6 mb-4">
                    <Building className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">No Properties Found</h3>
                  <p className="text-center text-muted-foreground mb-6 max-w-md">
                    You haven't added any properties to the blockchain yet. Add a property to get started.
                  </p>
                  <Button asChild>
                    <Link href="/dashboard/landlord/properties">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Property
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-medium">Your Properties on Blockchain</h2>
                  <Button asChild>
                    <Link href="/dashboard/landlord/properties">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Property
                    </Link>
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {properties.map((property, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{property.title}</CardTitle>
                        <CardDescription>{property.location}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Blockchain ID</span>
                            <code className="text-xs bg-gray-100 p-1 rounded">{property.blockchainId}</code>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Status</span>
                            <Badge>Active</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Rent</span>
                            <span>{property.price / 1000} ETH</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full" asChild>
                          <Link href={`/dashboard/landlord/properties/${property.id}`}>
                            View Details
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
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
                      You need to create a blockchain wallet first to manage agreements on the blockchain.
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
                  <CardTitle>Rental Agreements</CardTitle>
                  <CardDescription>
                    Rental agreements stored on the blockchain
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center py-8">
                  <div className="rounded-full bg-gray-100 p-6 mb-4">
                    <FileText className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">No Agreements Found</h3>
                  <p className="text-center text-muted-foreground mb-6 max-w-md">
                    You haven't created any rental agreements on the blockchain yet.
                  </p>
                  <Button asChild>
                    <Link href="/dashboard/landlord/properties">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Create Agreement
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-medium">Rental Agreements</h2>
                  <Button asChild>
                    <Link href="/dashboard/landlord/properties">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Create Agreement
                    </Link>
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {agreements.map((agreement, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-3">
                        <div className="flex justify-between">
                          <div>
                            <CardTitle className="text-base">
                              Agreement #{agreement.blockchainId}
                            </CardTitle>
                            <CardDescription>
                              {agreement.propertyTitle}
                            </CardDescription>
                          </div>
                          <Badge className={
                            agreement.status === 'active' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-yellow-100 text-yellow-700'
                          }>
                            {agreement.status.charAt(0).toUpperCase() + agreement.status.slice(1)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Tenant</p>
                            <div className="flex items-center mt-1">
                              <Avatar className="h-6 w-6 mr-2">
                                <AvatarFallback>T</AvatarFallback>
                              </Avatar>
                              <p className="text-sm font-medium">{agreement.tenant}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Monthly Rent</p>
                            <p className="font-medium">{agreement.rent}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Security Deposit</p>
                            <p className="font-medium">{agreement.deposit}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Duration</p>
                            <p className="font-medium">{agreement.duration} months</p>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between border-t pt-4">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/dashboard/landlord/properties/${agreement.propertyId}`}>
                            <Home className="h-4 w-4 mr-2" />
                            View Property
                          </Link>
                        </Button>
                        <Button size="sm">
                          <Coins className="h-4 w-4 mr-2" />
                          Request Payment
                        </Button>
                      </CardFooter>
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
                      You need to create a blockchain wallet first to see transactions.
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
                      View all transactions related to your properties and agreements
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
    </div>
  );
} 