"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, FileText, Download, Eye } from "lucide-react"
import { AgreementDetailsDialog } from "@/components/agreement-details-dialog"
import { toast } from "sonner"
import { blockchainAgreementService, BlockchainAgreement } from "@/lib/blockchain-agreement"
import blockchainService from "@/lib/blockchain"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { formatDate } from "@/lib/utils/date"

export default function AgreementsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [agreements, setAgreements] = useState<BlockchainAgreement[]>([])
  const [selectedAgreement, setSelectedAgreement] = useState<BlockchainAgreement | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch agreements from blockchain
  useEffect(() => {
    const fetchAgreements = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Get wallet address
        const walletAddress = await blockchainService.getWalletAddress()
        
        // Fetch agreements for the landlord
        const fetchedAgreements = await blockchainAgreementService.getAgreements(walletAddress)
        setAgreements(fetchedAgreements)
      } catch (error) {
        console.error('Error fetching agreements:', error)
        setError('Failed to fetch agreements. Please try again later.')
        toast.error("Error", {
          description: "Failed to fetch agreements from blockchain"
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchAgreements()
  }, [])

  // Filter agreements based on search query
  const filteredAgreements = agreements.filter(agreement => 
    agreement.property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agreement.tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agreement.property.location.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Handle view agreement
  const handleViewAgreement = async (agreement: BlockchainAgreement) => {
    try {
      const details = await blockchainAgreementService.getAgreementDetails(agreement.id)
      if (details) {
        setSelectedAgreement(details)
        setIsDetailsOpen(true)
      } else {
        toast.error("Error", {
          description: "Failed to fetch agreement details"
        })
      }
    } catch (error) {
      console.error('Error viewing agreement:', error)
      toast.error("Error", {
        description: "Failed to fetch agreement details"
      })
    }
  }

  // Handle download agreement
  const handleDownloadAgreement = async (agreement: BlockchainAgreement) => {
    try {
      toast.success("Downloading agreement...", {
        description: `Agreement for ${agreement.property.title} will be downloaded shortly.`
      })

      const blob = await blockchainAgreementService.downloadAgreementPDF(agreement.id)
      
      // Create and download the file
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `rental-agreement-${agreement.id}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success("Download complete!", {
        description: "The agreement has been downloaded successfully."
      })
    } catch (error) {
      console.error('Error downloading agreement:', error)
      toast.error("Download failed", {
        description: "There was an error downloading the agreement. Please try again."
      })
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col gap-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Rental Agreements</h1>
            <p className="text-muted-foreground">
              Manage and view all your rental agreements on the blockchain
            </p>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search agreements..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-red-500">{error}</div>
            </CardContent>
          </Card>
        ) : filteredAgreements.length === 0 ? (
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground">
                {searchQuery ? "No agreements found matching your search." : "No agreements found on the blockchain."}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {filteredAgreements.map((agreement) => (
              <Card key={agreement.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="space-y-1">
                      <h3 className="font-semibold">{agreement.property.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {agreement.property.location}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Transaction: {agreement.transactionHash.slice(0, 10)}...
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Tenant</p>
                      <p className="text-sm text-muted-foreground">
                        {agreement.tenant.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {agreement.tenant.walletAddress}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Duration</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(agreement.startDate)} - {formatDate(agreement.endDate)}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Rent Amount</p>
                      <p className="text-sm text-muted-foreground">
                        ₹{agreement.rentAmount.toLocaleString()}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Status</p>
                      <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-50 text-green-700">
                        {agreement.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewAgreement(agreement)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDownloadAgreement(agreement)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {selectedAgreement && (
        <AgreementDetailsDialog
          agreement={selectedAgreement}
          open={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
        />
      )}
    </div>
  )
} 