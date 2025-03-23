'use client';

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronDown, ChevronUp, ExternalLink, Search, Check, Clock, XCircle } from 'lucide-react';
import { TransactionDetails } from '@/components/blockchain/transaction-details';

interface Transaction {
  id: string;
  transactionHash: string;
  amount: string;
  timestamp: string;
  from: string;
  to: string;
  confirmations: number;
  blockNumber: number;
  isDeposit?: boolean;
  status: 'confirmed' | 'pending' | 'failed';
  type: 'payment' | 'deposit' | 'refund' | 'agreement' | 'other';
  propertyId?: string;
  propertyTitle?: string;
}

interface TransactionListProps {
  transactions: Transaction[];
  isLoading?: boolean;
}

export function TransactionList({ transactions = [], isLoading = false }: TransactionListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortField, setSortField] = useState('timestamp');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Format address for display
  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Format timestamp
  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            <Check className="h-3 w-3 mr-1" />
            Confirmed
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case 'failed':
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
            <XCircle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Get transaction type badge
  const getTypeBadge = (type: string, isDeposit?: boolean) => {
    switch (type) {
      case 'payment':
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Payment</Badge>;
      case 'deposit':
        return <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">Deposit</Badge>;
      case 'refund':
        return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">Refund</Badge>;
      case 'agreement':
        return <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100">Agreement</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">Other</Badge>;
    }
  };

  // Filter and sort transactions
  const filteredTransactions = transactions
    .filter((transaction) => {
      // Apply type filter
      if (filterType !== 'all' && transaction.type !== filterType) {
        return false;
      }
      
      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          transaction.transactionHash.toLowerCase().includes(query) ||
          transaction.from.toLowerCase().includes(query) ||
          transaction.to.toLowerCase().includes(query) ||
          (transaction.propertyTitle && transaction.propertyTitle.toLowerCase().includes(query))
        );
      }
      
      return true;
    })
    .sort((a, b) => {
      // Apply sorting
      if (sortField === 'timestamp') {
        return sortDirection === 'asc'
          ? new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          : new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      }
      
      if (sortField === 'amount') {
        const aAmount = parseFloat(a.amount.replace(/[^0-9.-]+/g, ''));
        const bAmount = parseFloat(b.amount.replace(/[^0-9.-]+/g, ''));
        return sortDirection === 'asc' ? aAmount - bAmount : bAmount - aAmount;
      }
      
      return 0;
    });

  // Handle transaction click
  const handleTransactionClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500" />
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search transactions..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="payment">Payments</SelectItem>
            <SelectItem value="deposit">Deposits</SelectItem>
            <SelectItem value="refund">Refunds</SelectItem>
            <SelectItem value="agreement">Agreements</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredTransactions.length === 0 ? (
        <div className="py-10 text-center">
          <p className="text-gray-500">No transactions found</p>
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px] cursor-pointer" onClick={() => handleSort('timestamp')}>
                  <div className="flex items-center">
                    Date
                    {sortField === 'timestamp' && (
                      sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('amount')}>
                  <div className="flex items-center">
                    Amount
                    {sortField === 'amount' && (
                      sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow 
                  key={transaction.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleTransactionClick(transaction)}
                >
                  <TableCell className="font-medium">
                    {formatDate(transaction.timestamp)}
                  </TableCell>
                  <TableCell>{getTypeBadge(transaction.type, transaction.isDeposit)}</TableCell>
                  <TableCell>{transaction.amount}</TableCell>
                  <TableCell className="font-mono text-xs">{formatAddress(transaction.from)}</TableCell>
                  <TableCell className="font-mono text-xs">{formatAddress(transaction.to)}</TableCell>
                  <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`https://etherscan.io/tx/${transaction.transactionHash}`, '_blank');
                      }}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {selectedTransaction && (
        <TransactionDetails
          transactionHash={selectedTransaction.transactionHash}
          amount={selectedTransaction.amount}
          timestamp={selectedTransaction.timestamp}
          from={selectedTransaction.from}
          to={selectedTransaction.to}
          confirmations={selectedTransaction.confirmations}
          blockNumber={selectedTransaction.blockNumber}
          isDeposit={selectedTransaction.isDeposit}
          status={selectedTransaction.status}
          onClose={() => setSelectedTransaction(null)}
        />
      )}
    </div>
  );
} 