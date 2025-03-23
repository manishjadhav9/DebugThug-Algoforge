'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AddToBlockchainDialog } from '@/components/blockchain/add-to-blockchain-dialog';
import { CreateAgreementDialog } from '@/components/blockchain/create-agreement-dialog';
import { Blocks, AlertCircle, Check, ExternalLink } from 'lucide-react';
import walletService from '@/lib/blockchain/wallet-service';
import { useUser } from '@/hooks';
import { toast } from '@/components/ui/use-toast';

interface PropertyBlockchainCardProps {
  property: any; // Replace with your property type
  tenants?: { id: string; name: string }[];
}

export function PropertyBlockchainCard({ property, tenants = [] }: PropertyBlockchainCardProps) {
  const { user } = useUser();
  const userId = user?.id || 'user-1'; // Fallback for development

  const [hasWallet, setHasWallet] = useState(false);
  const [isAddToBlockchainOpen, setIsAddToBlockchainOpen] = useState(false);
  const [isCreateAgreementOpen, setIsCreateAgreementOpen] = useState(false);

  // Check if user has a wallet on component mount
  useEffect(() => {
    const checkWallet = () => {
      const hasUserWallet = walletService.hasWallet(userId);
      setHasWallet(hasUserWallet);
    };

    checkWallet();
  }, [userId]);

  // Handle successful blockchain addition
  const handleBlockchainSuccess = (blockchainId: number) => {
    // In a real app, you would update the property in your database
    // to include the blockchain ID
    toast({
      title: 'Property Added to Blockchain',
      description: `Property was successfully added with blockchain ID: ${blockchainId}`,
    });
  };

  // Handle successful agreement creation
  const handleAgreementSuccess = (agreementId: number) => {
    // In a real app, you would update the UI to show the new agreement
    toast({
      title: 'Rental Agreement Created',
      description: `Rental agreement was successfully created with ID: ${agreementId}`,
    });
  };

  // Handle view on blockchain explorer
  const handleViewOnExplorer = () => {
    if (!property.blockchainId) return;
    
    // In a real app, this would link to the actual block explorer
    // For now, open a dummy URL
    window.open(`https://etherscan.io/address/${property.blockchainId}`, '_blank');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Blocks className="h-5 w-5 text-orange-500" />
              Blockchain Integration
            </CardTitle>
            <CardDescription>
              Manage this property on the blockchain for secure, transparent transactions
            </CardDescription>
          </div>
          {property.blockchainId && (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <Check className="mr-1 h-3 w-3" />
              On Blockchain
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!hasWallet && (
          <div className="flex items-center p-3 bg-amber-50 text-amber-700 rounded-md border border-amber-200">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            <p className="text-sm">
              You need to create a blockchain wallet to use these features. 
              Visit the <a href="/dashboard/landlord/blockchain" className="underline font-medium">Blockchain</a> page to get started.
            </p>
          </div>
        )}

        {property.blockchainId ? (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Blockchain ID</p>
              <code className="text-xs bg-gray-100 p-1 rounded">{property.blockchainId}</code>
            </div>
            
            <Separator />
            
            <div>
              <p className="text-sm text-muted-foreground mb-1">Status</p>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                  Active
                </Badge>
                <p className="text-sm">Ready for rental agreements and payments</p>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <p className="text-sm text-muted-foreground mb-1">Rental Agreements</p>
              {property.agreements && property.agreements.length > 0 ? (
                <div className="space-y-2 mt-2">
                  {property.agreements.map((agreement: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                      <div>
                        <p className="text-sm font-medium">Agreement #{agreement.id}</p>
                        <p className="text-xs text-muted-foreground">
                          {agreement.tenantName || 'Tenant'} • {agreement.status}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm">View</Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No rental agreements yet</p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 px-4 border-2 border-dashed border-gray-200 rounded-lg">
            <Blocks className="h-12 w-12 text-gray-300 mb-3" />
            <h3 className="text-lg font-medium mb-1">Not on Blockchain</h3>
            <p className="text-sm text-center text-muted-foreground mb-4">
              Add this property to the blockchain to enable secure rental agreements and payments
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col space-y-2 sm:flex-row sm:justify-end sm:space-x-2 sm:space-y-0">
        {property.blockchainId ? (
          <>
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={handleViewOnExplorer}
            >
              <ExternalLink className="h-4 w-4" />
              View on Explorer
            </Button>
            <Button 
              className="gap-2"
              onClick={() => setIsCreateAgreementOpen(true)}
              disabled={!hasWallet || tenants.length === 0}
            >
              Create Rental Agreement
            </Button>
          </>
        ) : (
          <Button 
            className="gap-2"
            onClick={() => setIsAddToBlockchainOpen(true)}
            disabled={!hasWallet}
          >
            <Blocks className="h-4 w-4" />
            Add to Blockchain
          </Button>
        )}
      </CardFooter>

      {/* Dialogs */}
      <AddToBlockchainDialog
        property={property}
        isOpen={isAddToBlockchainOpen}
        onClose={() => setIsAddToBlockchainOpen(false)}
        userId={userId}
        onSuccess={handleBlockchainSuccess}
      />

      <CreateAgreementDialog
        propertyId={property.id}
        propertyTitle={property.title}
        tenantOptions={tenants}
        isOpen={isCreateAgreementOpen}
        onClose={() => setIsCreateAgreementOpen(false)}
        userId={userId}
        onSuccess={handleAgreementSuccess}
      />
    </Card>
  );
} 