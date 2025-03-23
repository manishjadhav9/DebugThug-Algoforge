'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Loader2, CheckCircle, AlertCircle, CalendarIcon, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';
import propertyService, { AgreementData, PaymentData } from '@/lib/blockchain/property-service';
import walletService from '@/lib/blockchain/wallet-service';
import web3Service from '@/lib/blockchain/web3-service';

interface PaymentDialogProps {
  agreement: AgreementData;
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userType: 'tenant' | 'landlord';
  onSuccess?: (paymentId: number) => void;
}

export function PaymentDialog({
  agreement,
  isOpen,
  onClose,
  userId,
  userType,
  onSuccess,
}: PaymentDialogProps) {
  const [status, setStatus] = useState<'idle' | 'checking' | 'ready' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const [amount, setAmount] = useState<string>(agreement.rentAmount.toString());
  const [isDeposit, setIsDeposit] = useState<boolean>(false);
  const [dueDate, setDueDate] = useState<Date | undefined>(new Date());
  const [paymentMethod, setPaymentMethod] = useState<'crypto'>('crypto');
  
  // Check wallet when dialog opens
  if (isOpen && status === 'idle') {
    setStatus('checking');
    checkWallet();
  }

  async function checkWallet() {
    try {
      const hasWallet = walletService.hasWallet(userId);
      if (hasWallet) {
        setStatus('ready');
        
        // If it's a tenant, verify they have enough ETH
        if (userType === 'tenant') {
          const wallet = walletService.getWallet(userId);
          if (wallet) {
            await web3Service.createLocalWallet(wallet.privateKey);
            const balance = await web3Service.getWalletBalance();
            const balanceNum = parseFloat(balance) / 1e18;
            const amountNum = parseFloat(amount);
            
            if (balanceNum < amountNum) {
              setStatus('error');
              setErrorMessage(`Insufficient funds. Your balance is ${balanceNum.toFixed(4)} ETH, but the payment requires ${amountNum} ETH. Please fund your wallet from the Blockchain page.`);
            }
          }
        }
      } else {
        setStatus('error');
        setErrorMessage('You need to create a blockchain wallet first. Go to the Blockchain page to create one.');
      }
    } catch (error) {
      console.error('Error checking wallet:', error);
      setStatus('error');
      setErrorMessage('Failed to check wallet status. Please try again later.');
    }
  }

  function resetForm() {
    setAmount(agreement.rentAmount.toString());
    setIsDeposit(false);
    setDueDate(new Date());
    setErrorMessage(null);
    setStatus('idle');
  }

  function validateForm() {
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      setErrorMessage('Please enter a valid amount');
      return false;
    }
    
    if (!dueDate) {
      setErrorMessage('Please select a due date');
      return false;
    }
    
    return true;
  }

  async function handleRequestPayment() {
    try {
      if (!validateForm()) {
        setStatus('error');
        return;
      }

      setStatus('processing');
      setErrorMessage(null);

      // For now, we'll just simulate the payment request
      // In a real app, you would send a notification to the tenant
      setTimeout(() => {
        toast({
          title: 'Payment Requested',
          description: `Payment request for ${amount} ETH has been sent to the tenant.`,
        });
        
        setStatus('success');
        
        // Close dialog after a delay
        setTimeout(() => {
          resetForm();
          onClose();
        }, 2000);
      }, 1500);
    } catch (error) {
      console.error('Error requesting payment:', error);
      setStatus('error');
      setErrorMessage((error as Error).message || 'Failed to request payment. Please try again later.');
    }
  }

  async function handleMakePayment() {
    try {
      if (!validateForm()) {
        setStatus('error');
        return;
      }

      setStatus('processing');
      setErrorMessage(null);

      // Prepare payment data
      const paymentData: Omit<PaymentData, 'id' | 'blockchainId' | 'transactionHash' | 'status' | 'paidDate'> = {
        agreementId: agreement.id,
        amount: parseFloat(amount),
        paymentMethod: 'crypto',
        dueDate: dueDate as Date,
        isDeposit: isDeposit,
      };

      // Make payment on blockchain
      const result = await propertyService.makePayment(
        paymentData,
        userId
      );

      // Handle success
      setStatus('success');
      toast({
        title: 'Payment Successful',
        description: `Your payment of ${amount} ETH has been processed on the blockchain.`,
      });

      // Call success callback with the paymentId
      if (onSuccess && result.id) {
        onSuccess(result.id);
      }

      // Close dialog after a delay
      setTimeout(() => {
        resetForm();
        onClose();
      }, 2000);

    } catch (error) {
      console.error('Error making payment:', error);
      setStatus('error');
      setErrorMessage((error as Error).message || 'Failed to make payment. Please try again later.');
    }
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  const title = userType === 'landlord' ? 'Request Payment' : 'Make Payment';
  const description = userType === 'landlord' 
    ? 'Request a payment from your tenant via blockchain' 
    : 'Make a secure payment to your landlord via blockchain';

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {status === 'checking' && (
          <div className="flex flex-col items-center justify-center py-6">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
            <p>Checking wallet status...</p>
          </div>
        )}

        {status === 'ready' && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="agreement-details">Rental Agreement</Label>
              <Input 
                id="agreement-details" 
                value={`Property ID: ${agreement.propertyId} - ${isDeposit ? 'Security Deposit' : 'Monthly Rent'}`} 
                disabled 
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="amount">Amount (ETH)</Label>
                {userType === 'landlord' && (
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="is-deposit" className="text-sm">Security Deposit</Label>
                    <Switch 
                      id="is-deposit" 
                      checked={isDeposit} 
                      onCheckedChange={(checked) => {
                        setIsDeposit(checked);
                        setAmount(checked ? agreement.securityDeposit.toString() : agreement.rentAmount.toString());
                      }}
                    />
                  </div>
                )}
              </div>
              <Input 
                id="amount" 
                type="number" 
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                readOnly={userType === 'tenant'} // Tenants can't modify the amount
              />
            </div>

            <div className="space-y-2">
              <Label>Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label>Payment Method</Label>
              <RadioGroup
                defaultValue="crypto"
                className="grid grid-cols-1 gap-4 mt-2"
                value={paymentMethod}
                onValueChange={(value) => setPaymentMethod(value as 'crypto')}
              >
                <div>
                  <RadioGroupItem value="crypto" id="crypto" className="peer sr-only" />
                  <Label
                    htmlFor="crypto"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 hover:border-orange-200 peer-data-[state=checked]:border-orange-500 peer-data-[state=checked]:bg-orange-50"
                  >
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-orange-600" />
                      <span className="text-sm font-medium">Cryptocurrency (ETH)</span>
                    </div>
                    <span className="text-xs text-gray-500 mt-1">Secure blockchain payment</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        )}

        {status === 'processing' && (
          <div className="flex flex-col items-center justify-center py-6">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
            <p>{userType === 'landlord' ? 'Sending payment request...' : 'Processing payment...'}</p>
            <p className="text-xs text-muted-foreground mt-2">
              This may take a few moments
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center justify-center py-6">
            <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
            <p className="font-medium">{userType === 'landlord' ? 'Payment Requested Successfully!' : 'Payment Successful!'}</p>
            <p className="text-sm text-muted-foreground mt-2">
              {userType === 'landlord' 
                ? 'The tenant will be notified about this payment request' 
                : 'Your payment has been recorded on the blockchain'}
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center justify-center py-6">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <p className="font-medium">Error</p>
            <p className="text-sm text-center text-muted-foreground mt-2">
              {errorMessage || 'An unexpected error occurred. Please try again.'}
            </p>
          </div>
        )}

        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
          {(status === 'ready' || status === 'error') && (
            <>
              <Button
                type="button"
                variant="secondary"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={userType === 'landlord' ? handleRequestPayment : handleMakePayment}
                disabled={status !== 'ready'}
              >
                {userType === 'landlord' ? 'Request Payment' : 'Pay Now'}
              </Button>
            </>
          )}
          {(status === 'success' || status === 'processing') && (
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={status === 'processing'}
            >
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 