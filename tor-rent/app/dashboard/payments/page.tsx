"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ArrowDown, ArrowUp, Calendar, Download, Filter, Wallet } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"

// Static payment data
const transactions = [
  {
    id: "1",
    type: "outgoing",
    amount: "0.05 ETH",
    description: "Monthly rent payment for Modern Apartment",
    date: "Mar 15, 2025",
    status: "completed",
    recipient: "Sarah Johnson",
    transactionHash: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t",
    property: "Modern Apartment",
  },
  {
    id: "2",
    type: "outgoing",
    amount: "0.03 ETH",
    description: "Monthly rent payment for Studio Loft",
    date: "Mar 1, 2025",
    status: "completed",
    recipient: "Alex Thompson",
    transactionHash: "0x2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1a",
    property: "Studio Loft",
  },
  {
    id: "3",
    type: "outgoing",
    amount: "0.01 ETH",
    description: "Rental fee for Professional DSLR Camera",
    date: "Feb 20, 2025",
    status: "completed",
    recipient: "Michael Chen",
    transactionHash: "0x3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1a2b",
    property: "Professional DSLR Camera",
  },
  {
    id: "4",
    type: "incoming",
    amount: "0.1 ETH",
    description: "Security deposit refund for Downtown Condo",
    date: "Jan 5, 2025",
    status: "completed",
    sender: "Robert Garcia",
    transactionHash: "0x4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1a2b3c",
    property: "Downtown Condo",
  },
  {
    id: "5",
    type: "outgoing",
    amount: "0.07 ETH",
    description: "Monthly rent payment for Cozy Townhouse",
    date: "Mar 1, 2025",
    status: "pending",
    recipient: "Robert Garcia",
    transactionHash: "0x5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1a2b3c4d",
    property: "Cozy Townhouse",
  },
]

export default function PaymentsPage() {
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [filter, setFilter] = useState("all")

  // Filter transactions based on type
  const filteredTransactions = transactions.filter((transaction) => {
    if (filter === "all") return true
    if (filter === "incoming") return transaction.type === "incoming"
    if (filter === "outgoing") return transaction.type === "outgoing"
    if (filter === "pending") return transaction.status === "pending"
    return true
  })

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Payments</h1>
          <p className="text-gray-500">Manage your blockchain-based payments and transactions</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-orange-100 p-3">
                  <Wallet className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Wallet Balance</p>
                  <p className="text-2xl font-bold">0.45 ETH</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-green-100 p-3">
                  <ArrowDown className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Income (Last 30 days)</p>
                  <p className="text-2xl font-bold">0.1 ETH</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-red-100 p-3">
                  <ArrowUp className="h-6 w-6 text-red-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Expenses (Last 30 days)</p>
                  <p className="text-2xl font-bold">0.16 ETH</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>View your payment history and transaction details</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Transactions</option>
                <option value="incoming">Incoming</option>
                <option value="outgoing">Outgoing</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Description</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Amount</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b">
                      <td className="px-4 py-3 text-sm">{transaction.date}</td>
                      <td className="px-4 py-3 text-sm">{transaction.description}</td>
                      <td className="px-4 py-3 text-sm">
                        <div
                          className={`flex items-center ${
                            transaction.type === "incoming" ? "text-green-500" : "text-red-500"
                          }`}
                        >
                          {transaction.type === "incoming" ? "+" : "-"}
                          {transaction.amount}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <Badge
                          className={`${
                            transaction.status === "completed"
                              ? "bg-green-500"
                              : transaction.status === "pending"
                                ? "bg-orange-500"
                                : "bg-blue-500"
                          }`}
                        >
                          {transaction.status === "completed"
                            ? "Completed"
                            : transaction.status === "pending"
                              ? "Pending"
                              : "Failed"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8"
                                onClick={() => setSelectedTransaction(transaction)}
                              >
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Transaction Details</DialogTitle>
                                <DialogDescription>View detailed information about this transaction</DialogDescription>
                              </DialogHeader>
                              {selectedTransaction && (
                                <div className="space-y-4">
                                  <div className="rounded-lg border p-4">
                                    <div className="flex items-center justify-between">
                                      <span className="text-gray-500">Transaction Type</span>
                                      <Badge
                                        className={
                                          selectedTransaction.type === "incoming" ? "bg-green-500" : "bg-red-500"
                                        }
                                      >
                                        {selectedTransaction.type === "incoming" ? "Incoming" : "Outgoing"}
                                      </Badge>
                                    </div>
                                  </div>
                                  <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                      <p className="text-sm text-gray-500">Amount</p>
                                      <p className="font-medium">{selectedTransaction.amount}</p>
                                    </div>
                                    <div className="space-y-2">
                                      <p className="text-sm text-gray-500">Date</p>
                                      <p className="font-medium">{selectedTransaction.date}</p>
                                    </div>
                                    <div className="space-y-2">
                                      <p className="text-sm text-gray-500">Status</p>
                                      <Badge
                                        className={`${
                                          selectedTransaction.status === "completed"
                                            ? "bg-green-500"
                                            : selectedTransaction.status === "pending"
                                              ? "bg-orange-500"
                                              : "bg-blue-500"
                                        }`}
                                      >
                                        {selectedTransaction.status === "completed"
                                          ? "Completed"
                                          : selectedTransaction.status === "pending"
                                            ? "Pending"
                                            : "Failed"}
                                      </Badge>
                                    </div>
                                    <div className="space-y-2">
                                      <p className="text-sm text-gray-500">Property</p>
                                      <p className="font-medium">{selectedTransaction.property}</p>
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <p className="text-sm text-gray-500">Description</p>
                                    <p className="font-medium">{selectedTransaction.description}</p>
                                  </div>
                                  <div className="space-y-2">
                                    <p className="text-sm text-gray-500">
                                      {selectedTransaction.type === "incoming" ? "Sender" : "Recipient"}
                                    </p>
                                    <p className="font-medium">
                                      {selectedTransaction.type === "incoming"
                                        ? selectedTransaction.sender
                                        : selectedTransaction.recipient}
                                    </p>
                                  </div>
                                  <div className="space-y-2">
                                    <p className="text-sm text-gray-500">Transaction Hash</p>
                                    <p className="font-medium break-all">{selectedTransaction.transactionHash}</p>
                                  </div>
                                  <div className="flex justify-end">
                                    <Button className="bg-orange-500 hover:bg-orange-600">
                                      <Download className="mr-2 h-4 w-4" />
                                      Download Receipt
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Payments</CardTitle>
            <CardDescription>View your scheduled payments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4 rounded-lg border p-4">
                <Calendar className="mt-0.5 h-5 w-5 text-orange-500" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Monthly Rent: Modern Apartment</h3>
                    <p className="font-bold">0.05 ETH</p>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">Due on April 15, 2025</p>
                  <div className="mt-4 flex justify-end">
                    <Button className="bg-orange-500 hover:bg-orange-600">Pay Now</Button>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-4 rounded-lg border p-4">
                <Calendar className="mt-0.5 h-5 w-5 text-orange-500" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Monthly Rent: Studio Loft</h3>
                    <p className="font-bold">0.03 ETH</p>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">Due on April 1, 2025</p>
                  <div className="mt-4 flex justify-end">
                    <Button className="bg-orange-500 hover:bg-orange-600">Pay Now</Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

