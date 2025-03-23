'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, ExternalLink, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';

interface TransactionDetailsProps {
  transactionHash: string;
  amount: string;
  timestamp: Date | string;
  from: string;
  to: string;
  confirmations?: number;
  blockNumber?: number;
  isDeposit?: boolean;
  status?: 'pending' | 'confirmed' | 'failed';
  onClose?: () => void;
}

export function TransactionDetails({
  transactionHash,
  amount,
  timestamp,
  from,
  to,
  confirmations = 12,
  blockNumber = 123456,
  isDeposit = false,
  status = 'confirmed',
  onClose,
}: TransactionDetailsProps) {
  const [loading, setLoading] = useState(false);

  // Format addresses for display
  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.substring(0, 8)}...${address.substring(address.length - 6)}`;
  };

  // Format timestamp
  const formatTimestamp = (value: Date | string) => {
    const date = typeof value === 'string' ? new Date(value) : value;
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  // Get status icon and color
  const getStatusDetails = () => {
    switch (status) {
      case 'confirmed':
        return {
          icon: <CheckCircle className="h-5 w-5" />,
          color: 'text-green-500',
          bgColor: 'bg-green-100',
          label: 'Confirmed',
        };
      case 'pending':
        return {
          icon: <Clock className="h-5 w-5" />,
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-100',
          label: 'Pending',
        };
      case 'failed':
        return {
          icon: <AlertCircle className="h-5 w-5" />,
          color: 'text-red-500',
          bgColor: 'bg-red-100',
          label: 'Failed',
        };
      default:
        return {
          icon: <Clock className="h-5 w-5" />,
          color: 'text-gray-500',
          bgColor: 'bg-gray-100',
          label: 'Unknown',
        };
    }
  };

  const statusDetails = getStatusDetails();

  // Handle copy transaction hash
  const handleCopyHash = () => {
    navigator.clipboard.writeText(transactionHash);
    toast({
      title: 'Copied to clipboard',
      description: 'Transaction hash has been copied to clipboard',
    });
  };

  // Handle view on block explorer
  const handleViewOnExplorer = () => {
    // In a real app, this would link to the actual block explorer
    // For now, open a dummy URL
    window.open(`https://etherscan.io/tx/${transactionHash}`, '_blank');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Transaction Details</CardTitle>
            <CardDescription>
              {isDeposit ? 'Security Deposit Payment' : 'Rent Payment'} on the Blockchain
            </CardDescription>
          </div>
          <Badge className={cn('text-xs px-2 py-1', statusDetails.bgColor, statusDetails.color)}>
            <span className="flex items-center gap-1">
              {statusDetails.icon}
              {statusDetails.label}
            </span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-1">Transaction Hash</p>
          <div className="flex items-center gap-2">
            <code className="text-xs bg-gray-100 p-1 rounded">{formatAddress(transactionHash)}</code>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6"
              onClick={handleCopyHash}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
            </Button>
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Amount</p>
            <p className="font-medium">{amount} ETH</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Type</p>
            <p className="font-medium">{isDeposit ? 'Security Deposit' : 'Rent Payment'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Timestamp</p>
            <p className="font-medium">{formatTimestamp(timestamp)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Block Number</p>
            <p className="font-medium">{blockNumber}</p>
          </div>
        </div>

        <Separator />

        <div>
          <p className="text-sm text-muted-foreground mb-1">From</p>
          <code className="text-xs bg-gray-100 p-1 rounded">{from}</code>
          <p className="text-xs text-muted-foreground mt-1">Tenant</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground mb-1">To</p>
          <code className="text-xs bg-gray-100 p-1 rounded">{to}</code>
          <p className="text-xs text-muted-foreground mt-1">Landlord</p>
        </div>

        <Separator />

        <div>
          <p className="text-sm text-muted-foreground mb-1">Confirmations</p>
          <div className="flex items-center gap-2">
            <span className="font-medium">{confirmations}</span>
            {status === 'confirmed' && (
              <Badge variant="outline" className="text-xs text-green-500 border-green-200 bg-green-50">
                Finalized
              </Badge>
            )}
            {status === 'pending' && confirmations > 0 && (
              <Badge variant="outline" className="text-xs text-yellow-500 border-yellow-200 bg-yellow-50">
                In Progress
              </Badge>
            )}
          </div>
          {status === 'pending' && (
            <p className="text-xs text-muted-foreground mt-1">
              Transaction is being processed. It typically takes 12 confirmations to be fully confirmed.
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2 sm:flex-row sm:justify-end sm:space-x-2 sm:space-y-0">
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        )}
        <Button variant="default" className="gap-2" onClick={handleViewOnExplorer}>
          <ExternalLink className="h-4 w-4" />
          View on Explorer
        </Button>
      </CardFooter>
    </Card>
  );
} 