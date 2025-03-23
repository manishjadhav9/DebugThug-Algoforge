'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import walletService from '@/lib/blockchain/wallet-service';
import { Loader2, AlertCircle, Check } from 'lucide-react';
import { ethers } from 'ethers';

// Special address to monitor
const SPECIAL_ADDRESS = '0x918B65d4434AfC91e8f10Da77E7CD0FCdEdc4f85';

interface FundWalletButtonProps {
  userId: string;
  amount?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  onSuccess?: (newBalance: string) => void;
  specificAddress?: string;
}

export function FundWalletButton({
  userId,
  amount = "1.0",
  variant = 'default',
  size = 'default',
  className = '',
  onSuccess,
  specificAddress
}: FundWalletButtonProps) {
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [targetAddress, setTargetAddress] = useState<string | null>(null);

  // Set up target address when component mounts or props change
  useEffect(() => {
    async function setupTargetAddress() {
      if (specificAddress) {
        // If a specific address is provided, use it
        setTargetAddress(specificAddress);
      } else if (userId) {
        try {
          // Get wallet address from user ID
          const userWallet = walletService.getWallet(userId);
          if (userWallet) {
            setTargetAddress(userWallet.address);
          }
        } catch (error) {
          console.error('Error getting wallet address:', error);
        }
      }
    }
    
    setupTargetAddress();
  }, [userId, specificAddress]);

  const handleFundWallet = async () => {
    try {
      setStatus('processing');
      setErrorMessage(null);

      // Handle specific address case
      if (specificAddress) {
        // Create provider
        const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545');
        
        // Using a hardcoded private key for a test account with funds
        const faucetPrivateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"; // Default hardhat account #0
        const faucetWallet = new ethers.Wallet(faucetPrivateKey, provider);
        
        // Show loading toast
        toast({
          title: 'Funding Wallet',
          description: `Adding ${amount} ETH to ${specificAddress}. This may take a moment...`,
        });
        
        // Send ETH to the address
        const tx = await faucetWallet.sendTransaction({
          to: specificAddress,
          value: ethers.utils.parseEther(amount),
          gasLimit: 21000,
        });
        
        console.log(`Transaction hash: ${tx.hash}`);
        const receipt = await tx.wait();
        
        // Get new balance
        const balance = await provider.getBalance(specificAddress);
        const newBalance = ethers.utils.formatEther(balance);
        
        // Success
        setStatus('success');
        toast({
          title: 'Wallet Funded',
          description: `Successfully added ${amount} ETH to the wallet. New balance: ${newBalance} ETH`,
        });
        
        if (onSuccess) {
          onSuccess(newBalance);
        }
      } else {
        // Regular wallet funding via service
        // Check if wallet exists
        if (!walletService.hasWallet(userId)) {
          throw new Error('Wallet not found. Please create a wallet first.');
        }

        // Show loading toast
        toast({
          title: 'Funding Wallet',
          description: `Adding ${amount} ETH to your wallet. This may take a moment...`,
        });

        // Fund wallet
        await walletService.fundWallet(userId, amount);
        
        // Update wallet balance
        const newBalance = await walletService.updateWalletBalance(userId);
        
        // Special handling for specific address
        const userWallet = walletService.getWallet(userId);
        if (userWallet && userWallet.address.toLowerCase() === SPECIAL_ADDRESS.toLowerCase()) {
          console.log(`Special address detected: ${userWallet.address}`);
          console.log(`Funded with ${amount} ETH. New balance: ${newBalance} ETH`);
          
          // Additional verification of balance
          const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545');
          const externalBalance = await provider.getBalance(SPECIAL_ADDRESS);
          const formattedBalance = ethers.utils.formatEther(externalBalance);
          console.log(`Verified balance from provider directly: ${formattedBalance} ETH`);
        }
        
        // Success
        setStatus('success');
        toast({
          title: 'Wallet Funded',
          description: `Successfully added ${amount} ETH to your wallet. New balance: ${newBalance} ETH`,
        });

        if (onSuccess) {
          onSuccess(newBalance);
        }
      }

      // Reset status after a short delay
      setTimeout(() => {
        setStatus('idle');
      }, 3000);
    } catch (error) {
      console.error('Error funding wallet:', error);
      setStatus('error');
      setErrorMessage((error as Error).message || 'Failed to fund wallet');
      
      toast({
        title: 'Error',
        description: (error as Error).message || 'Failed to fund wallet',
        variant: 'destructive',
      });
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleFundWallet}
      disabled={status === 'processing'}
    >
      {status === 'processing' && (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      )}
      {status === 'success' && (
        <Check className="mr-2 h-4 w-4" />
      )}
      {status === 'error' && (
        <AlertCircle className="mr-2 h-4 w-4" />
      )}
      {specificAddress ? `Fund ${specificAddress.substring(0, 6)}...${specificAddress.substring(38)} with Test ETH` : 'Fund Wallet with Test ETH'}
    </Button>
  );
} 