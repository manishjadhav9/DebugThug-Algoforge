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
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import propertyService, { AgreementData } from '@/lib/blockchain/property-service';
import walletService from '@/lib/blockchain/wallet-service';

interface CreateAgreementDialogProps {
  propertyId: number;
  propertyTitle: string;
  tenantOptions: { id: string; name: string }[];
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onSuccess?: (agreementId: number) => void;
}

export function CreateAgreementDialog({
  propertyId,
  propertyTitle,
  tenantOptions,
  isOpen,
  onClose,
  userId,
  onSuccess,
}: CreateAgreementDialogProps) {
  const [status, setStatus] = useState<'idle' | 'checking' | 'ready' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const [selectedTenant, setSelectedTenant] = useState<string>('');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [rentAmount, setRentAmount] = useState<string>('');
  const [securityDeposit, setSecurityDeposit] = useState<string>('');
  const [conditions, setConditions] = useState<string>('');

  // Reset form and check wallet when dialog opens
  if (isOpen && status === 'idle') {
    setStatus('checking');
    checkWallet();
  }

  async function checkWallet() {
    try {
      const hasWallet = walletService.hasWallet(userId);
      if (hasWallet) {
        setStatus('ready');
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
    setSelectedTenant('');
    setStartDate(undefined);
    setEndDate(undefined);
    setRentAmount('');
    setSecurityDeposit('');
    setConditions('');
    setErrorMessage(null);
    setStatus('idle');
  }

  function validateForm() {
    if (!selectedTenant) {
      setErrorMessage('Please select a tenant');
      return false;
    }
    if (!startDate) {
      setErrorMessage('Please select a start date');
      return false;
    }
    if (!endDate) {
      setErrorMessage('Please select an end date');
      return false;
    }
    if (startDate >= endDate) {
      setErrorMessage('End date must be after start date');
      return false;
    }
    if (!rentAmount || isNaN(parseFloat(rentAmount)) || parseFloat(rentAmount) <= 0) {
      setErrorMessage('Please enter a valid rent amount');
      return false;
    }
    if (!securityDeposit || isNaN(parseFloat(securityDeposit)) || parseFloat(securityDeposit) < 0) {
      setErrorMessage('Please enter a valid security deposit amount');
      return false;
    }
    
    return true;
  }

  async function handleCreateAgreement() {
    try {
      if (!validateForm()) {
        setStatus('error');
        return;
      }

      setStatus('processing');
      setErrorMessage(null);

      // Prepare agreement data
      const agreementData: Omit<AgreementData, 'id' | 'blockchainId'> = {
        propertyId,
        tenantId: selectedTenant,
        landlordId: userId,
        startDate: startDate as Date,
        endDate: endDate as Date,
        rentAmount: parseFloat(rentAmount),
        securityDeposit: parseFloat(securityDeposit),
        status: 'pending',
        paymentStatus: 'pending',
        conditions: conditions || 'Standard lease agreement terms apply.',
      };

      // Create agreement on blockchain
      const result = await propertyService.createRentalAgreement(
        agreementData,
        userId
      );

      // Handle success
      setStatus('success');
      toast({
        title: 'Agreement Created',
        description: `Rental agreement was successfully created on the blockchain with ID: ${result.blockchainId}`,
      });

      // Call success callback with the agreementId
      if (onSuccess && result.id) {
        onSuccess(result.id);
      }

      // Close dialog after a delay
      setTimeout(() => {
        resetForm();
        onClose();
      }, 2000);

    } catch (error) {
      console.error('Error creating rental agreement:', error);
      setStatus('error');
      setErrorMessage((error as Error).message || 'Failed to create rental agreement. Please try again later.');
    }
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Blockchain Rental Agreement</DialogTitle>
          <DialogDescription>
            Create a secure and transparent rental agreement on the blockchain.
          </DialogDescription>
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
              <Label htmlFor="property-id">Property</Label>
              <Input 
                id="property-id" 
                value={`${propertyTitle} (ID: ${propertyId})`} 
                disabled 
              />
            </div>

            <div>
              <Label htmlFor="tenant">Select Tenant</Label>
              <Select 
                value={selectedTenant} 
                onValueChange={setSelectedTenant}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a tenant" />
                </SelectTrigger>
                <SelectContent>
                  {tenantOptions.map((tenant) => (
                    <SelectItem key={tenant.id} value={tenant.id}>
                      {tenant.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                      disabled={(date) => 
                        startDate ? date < startDate : false
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="rent-amount">Monthly Rent ($)</Label>
                <Input 
                  id="rent-amount" 
                  type="number" 
                  placeholder="1200.00"
                  value={rentAmount}
                  onChange={(e) => setRentAmount(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="security-deposit">Security Deposit ($)</Label>
                <Input 
                  id="security-deposit" 
                  type="number" 
                  placeholder="1200.00"
                  value={securityDeposit}
                  onChange={(e) => setSecurityDeposit(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="conditions">Additional Conditions</Label>
              <Textarea 
                id="conditions" 
                placeholder="Enter any additional terms or conditions..." 
                className="h-24"
                value={conditions}
                onChange={(e) => setConditions(e.target.value)}
              />
            </div>
          </div>
        )}

        {status === 'processing' && (
          <div className="flex flex-col items-center justify-center py-6">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
            <p>Creating agreement on blockchain...</p>
            <p className="text-xs text-muted-foreground mt-2">
              This may take a few moments
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center justify-center py-6">
            <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
            <p className="font-medium">Agreement Successfully Created!</p>
            <p className="text-sm text-muted-foreground mt-2">
              The rental agreement is now registered on the blockchain
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
                onClick={handleCreateAgreement}
                disabled={status !== 'ready'}
              >
                Create Agreement
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