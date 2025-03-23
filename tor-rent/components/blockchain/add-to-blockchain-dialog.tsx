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
import { toast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';
import propertyService, { PropertyData } from '@/lib/blockchain/property-service';
import walletService from '@/lib/blockchain/wallet-service';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface AddToBlockchainDialogProps {
  property: any; // Replace with your property type
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onSuccess?: (blockchainId: number) => void;
}

export function AddToBlockchainDialog({
  property,
  isOpen,
  onClose,
  userId,
  onSuccess,
}: AddToBlockchainDialogProps) {
  const [status, setStatus] = useState<'idle' | 'checking' | 'ready' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Check if the user has a wallet when the dialog opens
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

  async function handleAddToBlockchain() {
    try {
      setStatus('processing');
      setErrorMessage(null);

      // Check if the wallet has enough funds
      const wallet = walletService.getWallet(userId);
      if (!wallet || parseFloat(wallet.balance) < 0.01) {
        // Fund the wallet with test ETH if balance is too low
        toast({
          title: 'Funding Wallet',
          description: 'Your wallet needs test ETH for this transaction. Adding funds automatically...',
        });
        
        await walletService.fundWallet(userId, "1.0");
        
        // Update wallet balance
        await walletService.updateWalletBalance(userId);
      }

      // Convert the property to the format expected by propertyService
      const propertyData: Omit<PropertyData, 'id' | 'blockchainId'> = {
        title: property.title,
        description: property.description || '',
        location: property.location || '',
        price: property.price || 0,
        priceUnit: property.priceUnit || 'month',
        bedrooms: property.bedrooms || 0,
        bathrooms: property.bathrooms || 0,
        area: property.area || 0,
        areaUnit: property.areaUnit || 'sqft',
        amenities: property.amenities || [],
        images: property.images || [],
        status: property.status || 'available',
        coordinates: property.coordinates || { latitude: 0, longitude: 0 },
        ownerId: userId,
      };

      // Add property to blockchain
      const result = await propertyService.addProperty(propertyData, userId);

      // Handle success
      setStatus('success');
      toast({
        title: 'Property Added to Blockchain',
        description: `Your property was successfully added to the blockchain with ID: ${result.blockchainId}`,
      });

      // Call success callback with the blockchainId
      if (onSuccess && result.blockchainId) {
        onSuccess(result.blockchainId);
      }

      // Close dialog after a delay
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error adding property to blockchain:', error);
      setStatus('error');
      setErrorMessage((error as Error).message || 'Failed to add property to blockchain. Please try again later.');
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Property to Blockchain</DialogTitle>
          <DialogDescription>
            This will create an immutable record of your property on the blockchain.
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
              <h3 className="text-sm font-medium">Property Details</h3>
              <div className="mt-2 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-muted-foreground">Title:</span>
                  </div>
                  <div>{property.title}</div>
                  <div>
                    <span className="text-muted-foreground">Price:</span>
                  </div>
                  <div>
                    ${property.price} / {property.priceUnit}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Bedrooms:</span>
                  </div>
                  <div>{property.bedrooms}</div>
                  <div>
                    <span className="text-muted-foreground">Bathrooms:</span>
                  </div>
                  <div>{property.bathrooms}</div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <p className="text-sm">
                Adding this property to the blockchain will:
              </p>
              <ul className="text-sm list-disc pl-5 space-y-1">
                <li>Create a permanent, immutable record</li>
                <li>Enable secure digital rental agreements</li>
                <li>Allow transparent payment tracking</li>
                <li>Require a small transaction fee (covered by test ETH)</li>
              </ul>
            </div>
          </div>
        )}

        {status === 'processing' && (
          <div className="flex flex-col items-center justify-center py-6">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
            <p>Processing transaction...</p>
            <p className="text-xs text-muted-foreground mt-2">
              This may take a few moments
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center justify-center py-6">
            <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
            <p className="font-medium">Property Successfully Added!</p>
            <p className="text-sm text-muted-foreground mt-2">
              Your property is now registered on the blockchain
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
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleAddToBlockchain}
                disabled={status !== 'ready'}
              >
                Add to Blockchain
              </Button>
            </>
          )}
          {(status === 'success' || status === 'processing') && (
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
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