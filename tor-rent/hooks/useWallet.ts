import { useState, useEffect } from 'react'
import { walletService, Wallet } from '@/lib/services/wallet-service'
import { toast } from '@/components/ui/use-toast'

export interface UseWalletReturn {
  wallet: Wallet | null
  balance: number
  isLoading: boolean
  error: string | null
  fetchWallet: (userId: string) => Promise<void>
  createWallet: (userId: string, userType: 'tenant' | 'landlord') => Promise<Wallet | null>
  fundWallet: (userId: string, amount?: string) => Promise<boolean>
  refreshBalance: () => Promise<void>
  formatBalance: (balance?: number) => string
}

export const useWallet = (userId?: string): UseWalletReturn => {
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [balance, setBalance] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch wallet by userId
  const fetchWallet = async (id: string): Promise<void> => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Only attempt to fetch the wallet if we're on the client side
      if (typeof window !== 'undefined') {
        const walletData = await walletService.getWallet(id)
        setWallet(walletData)
        
        if (walletData) {
          const walletBalance = await walletService.getWalletBalance(walletData.address)
          setBalance(walletBalance)
        }
      }
    } catch (err) {
      setError(`Failed to fetch wallet: ${(err as Error).message}`)
      toast({
        title: "Error",
        description: `Failed to fetch wallet: ${(err as Error).message}`,
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Create a new wallet
  const createWallet = async (id: string, userType: 'tenant' | 'landlord'): Promise<Wallet | null> => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Check if wallet already exists
      const existingWallet = await walletService.getWallet(id)
      if (existingWallet) {
        setWallet(existingWallet)
        const walletBalance = await walletService.getWalletBalance(existingWallet.address)
        setBalance(walletBalance)
        
        toast({
          title: "Wallet Already Exists",
          description: "You already have a wallet associated with your account.",
        })
        
        return existingWallet
      }
      
      // Create a new wallet
      const newWallet = await walletService.createWallet(id, userType)
      setWallet(newWallet)
      
      // Get initial balance
      const walletBalance = await walletService.getWalletBalance(newWallet.address)
      setBalance(walletBalance)
      
      toast({
        title: "Wallet Created",
        description: "Your wallet has been successfully created.",
      })
      
      return newWallet
    } catch (err) {
      const errorMessage = `Failed to create wallet: ${(err as Error).message}`
      setError(errorMessage)
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      })
      
      return null
    } finally {
      setIsLoading(false)
    }
  }

  // Fund a wallet with test ETH
  const fundWallet = async (id: string, amount: string = "1.0"): Promise<boolean> => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Check if wallet exists
      if (!wallet) {
        const fetchedWallet = await walletService.getWallet(id)
        
        if (!fetchedWallet) {
          throw new Error("You need to create a wallet first")
        }
        
        setWallet(fetchedWallet)
      }
      
      // Fund the wallet
      await walletService.fundWallet(id, amount)
      
      // Refresh balance
      await refreshBalance()
      
      toast({
        title: "Wallet Funded",
        description: `${amount} ETH has been added to your wallet.`,
      })
      
      return true
    } catch (err) {
      const errorMessage = `Failed to fund wallet: ${(err as Error).message}`
      setError(errorMessage)
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      })
      
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Refresh wallet balance
  const refreshBalance = async (): Promise<void> => {
    try {
      if (!wallet) return
      
      const walletBalance = await walletService.getWalletBalance(wallet.address)
      setBalance(walletBalance)
    } catch (err) {
      setError(`Failed to fetch balance: ${(err as Error).message}`)
      
      toast({
        title: "Error",
        description: `Failed to refresh balance: ${(err as Error).message}`,
        variant: "destructive"
      })
    }
  }

  // Format balance for display
  const formatBalance = (walletBalance?: number): string => {
    const balanceToFormat = walletBalance !== undefined ? walletBalance : balance
    return balanceToFormat.toFixed(4) + ' ETH'
  }

  // Fetch wallet on mount if userId is provided
  useEffect(() => {
    if (userId && typeof window !== 'undefined') {
      fetchWallet(userId)
    }
  }, [userId])

  return {
    wallet,
    balance,
    isLoading,
    error,
    fetchWallet,
    createWallet,
    fundWallet,
    refreshBalance,
    formatBalance
  }
} 