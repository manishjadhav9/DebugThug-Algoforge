'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { FundWalletButton } from '@/components/blockchain/fund-wallet-button';
import { toast } from '@/components/ui/use-toast';
import { ethers } from 'ethers';
import { Wallet, RefreshCw, Copy, ExternalLink } from 'lucide-react';
import walletService from '@/lib/blockchain/wallet-service';

// Hardhat test accounts
const HARDHAT_ACCOUNTS = [
  {
    address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    privateKey: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
  },
  {
    address: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
    privateKey: '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d',
  },
  {
    address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
    privateKey: '0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a',
  },
  {
    address: '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
    privateKey: '0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6',
  },
  {
    address: '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65',
    privateKey: '0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a',
  },
];

export default function WalletFundingPage() {
  const [userId, setUserId] = useState<string>('');
  const [userType, setUserType] = useState<'tenant' | 'landlord'>('landlord');
  const [amount, setAmount] = useState<string>('1.0');
  const [wallet, setWallet] = useState<any>(null);
  const [manualPrivateKey, setManualPrivateKey] = useState<string>('');
  const [isManualFunding, setIsManualFunding] = useState<boolean>(false);
  const [externalAddress, setExternalAddress] = useState<string>('');
  const [externalBalance, setExternalBalance] = useState<string>('');
  const [isExternalAddressValid, setIsExternalAddressValid] = useState<boolean>(true);

  // Mock user for demo purposes
  useEffect(() => {
    if (!userId) {
      // For demo purposes, we'll use a hardcoded user ID
      setUserId('demo-user-123');
    }
  }, [userId]);

  const handleRefreshWallet = async () => {
    try {
      if (!userId) return;
      
      // Check if wallet exists
      if (walletService.hasWallet(userId)) {
        // Update wallet balance
        await walletService.updateWalletBalance(userId);
      } else {
        // Create wallet if it doesn't exist
        await walletService.createWallet(userId, userType);
      }
      
      // Get updated wallet
      const userWallet = walletService.getWallet(userId);
      setWallet(userWallet);
      
      toast({
        title: 'Wallet Refreshed',
        description: `Current balance: ${userWallet?.balance || '0'} ETH`,
      });
    } catch (error) {
      console.error('Error refreshing wallet:', error);
      toast({
        title: 'Error',
        description: 'Failed to refresh wallet',
        variant: 'destructive',
      });
    }
  };

  const handleCreateWallet = async () => {
    try {
      // Create or get wallet
      const userWallet = await walletService.createWallet(userId, userType);
      setWallet(userWallet);
      
      toast({
        title: 'Wallet Created',
        description: 'Your wallet has been created successfully.',
      });
    } catch (error) {
      console.error('Error creating wallet:', error);
      toast({
        title: 'Error',
        description: 'Failed to create wallet',
        variant: 'destructive',
      });
    }
  };

  const handleCopyAddress = () => {
    if (wallet?.address) {
      navigator.clipboard.writeText(wallet.address);
      toast({
        title: 'Address Copied',
        description: 'Wallet address copied to clipboard',
      });
    }
  };

  const handleCopyPrivateKey = () => {
    if (wallet?.privateKey) {
      navigator.clipboard.writeText(wallet.privateKey);
      toast({
        title: 'Private Key Copied',
        description: 'Wallet private key copied to clipboard. Keep it secure!',
        variant: 'destructive',
      });
    }
  };

  const handleManualFunding = async () => {
    try {
      if (!manualPrivateKey || !wallet?.address) {
        throw new Error('Private key and wallet address are required');
      }

      // Create provider
      const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545');
      
      // Create signer from private key
      const signer = new ethers.Wallet(manualPrivateKey, provider);
      
      // Send transaction
      const tx = await signer.sendTransaction({
        to: wallet.address,
        value: ethers.utils.parseEther(amount),
        gasLimit: 21000,
      });
      
      toast({
        title: 'Transaction Sent',
        description: `Transaction hash: ${tx.hash}`,
      });
      
      // Wait for confirmation
      const receipt = await tx.wait();
      
      toast({
        title: 'Transaction Confirmed',
        description: `Successfully funded wallet with ${amount} ETH`,
      });
      
      // Refresh wallet balance
      await handleRefreshWallet();
    } catch (error) {
      console.error('Error manually funding wallet:', error);
      toast({
        title: 'Error',
        description: (error as Error).message || 'Failed to fund wallet',
        variant: 'destructive',
      });
    }
  };

  // Check if an address is valid
  const isValidAddress = (address: string): boolean => {
    try {
      return ethers.utils.isAddress(address);
    } catch (error) {
      return false;
    }
  };

  // Handle external address change
  const handleExternalAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const address = e.target.value;
    setExternalAddress(address);
    setIsExternalAddressValid(address === '' || isValidAddress(address));
  };

  // Check external wallet balance
  const checkExternalBalance = async () => {
    if (!externalAddress || !isValidAddress(externalAddress)) {
      toast({
        title: 'Invalid Address',
        description: 'Please provide a valid Ethereum address',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Create provider
      const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545');
      
      // Get balance
      const balance = await provider.getBalance(externalAddress);
      const formattedBalance = ethers.utils.formatEther(balance);
      
      setExternalBalance(formattedBalance);
      
      toast({
        title: 'Balance Retrieved',
        description: `Balance: ${formattedBalance} ETH`,
      });
    } catch (error) {
      console.error('Error checking external balance:', error);
      toast({
        title: 'Error',
        description: (error as Error).message || 'Failed to check balance',
        variant: 'destructive',
      });
    }
  };

  // Fund external wallet
  const fundExternalWallet = async () => {
    if (!externalAddress || !isValidAddress(externalAddress)) {
      toast({
        title: 'Invalid Address',
        description: 'Please provide a valid Ethereum address',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Create provider
      const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545');
      
      // Create signer from selected private key
      if (!manualPrivateKey) {
        throw new Error('Please select a source account');
      }
      
      // Notify user
      toast({
        title: 'Transaction Started',
        description: `Sending ${amount} ETH to ${externalAddress}`,
      });
      
      const signer = new ethers.Wallet(manualPrivateKey, provider);
      
      // Send transaction
      const tx = await signer.sendTransaction({
        to: externalAddress,
        value: ethers.utils.parseEther(amount),
        gasLimit: 21000,
      });
      
      toast({
        title: 'Transaction Sent',
        description: `Transaction hash: ${tx.hash}`,
      });
      
      // Wait for confirmation
      const receipt = await tx.wait();
      
      toast({
        title: 'Transaction Confirmed',
        description: `Successfully funded wallet with ${amount} ETH`,
      });
      
      // Update external balance
      checkExternalBalance();
    } catch (error) {
      console.error('Error funding external wallet:', error);
      toast({
        title: 'Error',
        description: (error as Error).message || 'Failed to fund wallet',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    if (userId) {
      handleRefreshWallet();
    }
  }, [userId]);

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Wallet Funding</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Your Wallet</CardTitle>
            <CardDescription>View and manage your blockchain wallet</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {wallet ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Address</Label>
                  <div className="flex items-center">
                    <span className="text-sm font-mono truncate max-w-[180px] mr-2">
                      {wallet.address}
                    </span>
                    <Button variant="ghost" size="icon" onClick={handleCopyAddress}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Label>Balance</Label>
                  <div className="flex items-center">
                    <span className="text-lg font-semibold">{wallet.balance} ETH</span>
                    <Button variant="ghost" size="icon" onClick={handleRefreshWallet}>
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Label>Private Key</Label>
                  <div className="flex items-center">
                    <span className="text-sm font-mono truncate max-w-[180px] mr-2">
                      {wallet.privateKey.substring(0, 10)}...
                    </span>
                    <Button variant="ghost" size="icon" onClick={handleCopyPrivateKey}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <Wallet className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="mb-4">No wallet found for this user</p>
                <Button onClick={handleCreateWallet}>Create Wallet</Button>
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t pt-4">
            {wallet && (
              <FundWalletButton 
                userId={userId} 
                amount={amount}
                className="w-full"
                onSuccess={handleRefreshWallet}
              />
            )}
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Manual Funding</CardTitle>
            <CardDescription>
              Fund your wallet directly from one of the Hardhat test accounts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (ETH)</Label>
              <Input
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                type="number"
                step="0.1"
                min="0.1"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Select a Hardhat Account</Label>
              <div className="grid gap-2 mt-2">
                {HARDHAT_ACCOUNTS.map((account, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="justify-between text-left h-auto py-2"
                    onClick={() => setManualPrivateKey(account.privateKey)}
                  >
                    <div>
                      <div className="font-medium">Account #{index}</div>
                      <div className="text-xs font-mono truncate max-w-[260px]">{account.address}</div>
                    </div>
                    {manualPrivateKey === account.privateKey && (
                      <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        Selected
                      </div>
                    )}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <Button 
              onClick={handleManualFunding}
              disabled={!manualPrivateKey || !wallet}
              className="w-full"
            >
              Send {amount} ETH from Selected Account
            </Button>
          </CardFooter>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>External Wallet Funding</CardTitle>
            <CardDescription>
              Fund a specific external wallet address
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="externalAddress">External Wallet Address</Label>
                <div className="flex space-x-2">
                  <Input
                    id="externalAddress"
                    value={externalAddress}
                    onChange={handleExternalAddressChange}
                    placeholder="0x918B65d4434AfC91e8f10Da77E7CD0FCdEdc4f85"
                    className={!isExternalAddressValid ? "border-red-500" : ""}
                  />
                  <Button onClick={checkExternalBalance} variant="outline" disabled={!isExternalAddressValid || !externalAddress}>
                    Check
                  </Button>
                </div>
                {!isExternalAddressValid && (
                  <p className="text-sm text-red-500">Please enter a valid Ethereum address</p>
                )}
                {externalBalance && (
                  <div className="mt-2 p-2 bg-gray-100 rounded-md">
                    <p className="text-sm font-semibold">Balance: {externalBalance} ETH</p>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="externalAmount">Amount (ETH)</Label>
                <Input
                  id="externalAmount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  type="number"
                  step="0.1"
                  min="0.1"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Select a Source Account</Label>
              <div className="grid gap-2 mt-2">
                {HARDHAT_ACCOUNTS.map((account, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="justify-between text-left h-auto py-2"
                    onClick={() => setManualPrivateKey(account.privateKey)}
                  >
                    <div>
                      <div className="font-medium">Account #{index}</div>
                      <div className="text-xs font-mono truncate max-w-[260px]">{account.address}</div>
                    </div>
                    {manualPrivateKey === account.privateKey && (
                      <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        Selected
                      </div>
                    )}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <Button 
              onClick={fundExternalWallet}
              disabled={!manualPrivateKey || !externalAddress || !isExternalAddressValid}
              className="w-full"
            >
              Send {amount} ETH to External Address
            </Button>
          </CardFooter>
        </Card>

        {/* Specific Wallet Quick Access */}
        <Card className="md:col-span-2 border-2 border-orange-500">
          <CardHeader className="bg-orange-50">
            <CardTitle>Specific Wallet Quick Access</CardTitle>
            <CardDescription>
              Quick access to fund the specific wallet address: 0x918B65d4434AfC91e8f10Da77E7CD0FCdEdc4f85
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="flex items-center justify-between bg-gray-100 p-3 rounded-md">
              <div>
                <p className="font-medium">Target Wallet Address:</p>
                <p className="font-mono text-sm">0x918B65d4434AfC91e8f10Da77E7CD0FCdEdc4f85</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText('0x918B65d4434AfC91e8f10Da77E7CD0FCdEdc4f85');
                  toast({
                    title: 'Address Copied',
                    description: 'Wallet address copied to clipboard',
                  });
                }}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quickAmount">Quick Fund Amount (ETH)</Label>
                <Input
                  id="quickAmount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  type="number"
                  step="0.1"
                  min="0.1"
                  className="mt-2"
                />
              </div>
              
              <div className="flex items-end">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={async () => {
                    try {
                      // Create provider
                      const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545');
                      
                      // Get balance
                      const balance = await provider.getBalance('0x918B65d4434AfC91e8f10Da77E7CD0FCdEdc4f85');
                      const formattedBalance = ethers.utils.formatEther(balance);
                      
                      toast({
                        title: 'Balance Retrieved',
                        description: `Current Balance: ${formattedBalance} ETH`,
                      });
                      
                      setExternalAddress('0x918B65d4434AfC91e8f10Da77E7CD0FCdEdc4f85');
                      setExternalBalance(formattedBalance);
                    } catch (error) {
                      console.error('Error checking balance:', error);
                      toast({
                        title: 'Error',
                        description: (error as Error).message || 'Failed to check balance',
                        variant: 'destructive',
                      });
                    }
                  }}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Check Balance
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <FundWalletButton
              userId=""
              amount={amount}
              className="w-full bg-orange-500 hover:bg-orange-600"
              specificAddress="0x918B65d4434AfC91e8f10Da77E7CD0FCdEdc4f85"
              onSuccess={(newBalance) => {
                setExternalAddress('0x918B65d4434AfC91e8f10Da77E7CD0FCdEdc4f85');
                setExternalBalance(newBalance);
              }}
            />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 