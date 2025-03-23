import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { formatDate, formatDateTime } from "@/lib/utils/date"
import { BlockchainAgreement } from "@/lib/blockchain-agreement"
import { CheckCircle2, AlertTriangle, ExternalLink } from "lucide-react"

interface AgreementDetailsProps {
  agreement: BlockchainAgreement;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AgreementDetailsDialog({ agreement, open, onOpenChange }: AgreementDetailsProps) {
  // Format timestamp for display
  const formattedTimestamp = formatDateTime(new Date(agreement.timestamp));
  
  // Determine if agreement is verified on blockchain (in a real app, this would check actual blockchain)
  const isVerified = agreement.blockNumber > 0 && agreement.transactionHash.startsWith("0x");
  
  // Generate mock etherscan URL (in a real app, this would use actual network)
  const explorerUrl = `https://etherscan.io/tx/${agreement.transactionHash}`;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Rental Agreement Details</DialogTitle>
          <DialogDescription>
            Agreement for {agreement.property.title}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-1">
          <div className="space-y-6 p-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold">Property Details</h3>
                <div className="mt-2 space-y-2">
                  <p><span className="font-medium">Title:</span> {agreement.property.title}</p>
                  <p><span className="font-medium">Location:</span> {agreement.property.location}</p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Tenant Information</h3>
                <div className="mt-2 space-y-2">
                  <p><span className="font-medium">Name:</span> {agreement.tenant.name}</p>
                  <p><span className="font-medium">Email:</span> {agreement.tenant.email}</p>
                  <p><span className="font-medium">Wallet:</span> {agreement.tenant.walletAddress}</p>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold">Agreement Terms</h3>
              <div className="mt-2 grid grid-cols-2 gap-4">
                <div>
                  <p className="font-medium">Duration</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(agreement.startDate)} - {formatDate(agreement.endDate)}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Monthly Rent</p>
                  <p className="text-sm text-muted-foreground">
                    ₹{agreement.rentAmount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Status</p>
                  <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-50 text-green-700">
                    {agreement.status}
                  </span>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold flex items-center">
                Blockchain Verification 
                {isVerified ? (
                  <CheckCircle2 className="ml-2 h-5 w-5 text-green-500" />
                ) : (
                  <AlertTriangle className="ml-2 h-5 w-5 text-amber-500" />
                )}
              </h3>
              <div className="mt-2 space-y-3">
                <div className="bg-slate-50 p-4 rounded-md border">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Blockchain Status:</span>
                    <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-50 text-green-700">
                      Confirmed
                    </span>
                  </div>
                  
                  <div className="mt-3 grid grid-cols-1 gap-2">
                    <p className="text-sm">
                      <span className="font-medium">Transaction Hash:</span> 
                      <span className="font-mono text-xs ml-1">{agreement.transactionHash}</span>
                      <a 
                        href={explorerUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="ml-2 inline-flex items-center text-blue-500 hover:text-blue-700"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </p>
                    <p className="text-sm"><span className="font-medium">Block Number:</span> {agreement.blockNumber}</p>
                    <p className="text-sm"><span className="font-medium">Timestamp:</span> {formattedTimestamp}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-500">
                  This agreement is permanently recorded on the Ethereum blockchain and cannot be altered or deleted.
                  The transaction hash serves as proof of the agreement's authenticity.
                </p>
              </div>
            </div>

            {agreement.termsAndConditions && (
              <>
                <Separator />
                <div>
                  <h3 className="text-lg font-semibold">Terms and Conditions</h3>
                  <ul className="mt-2 list-disc pl-5 space-y-1">
                    {agreement.termsAndConditions.map((term, index) => (
                      <li key={index} className="text-sm text-muted-foreground">{term}</li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            {agreement.specialConditions && agreement.specialConditions.length > 0 && (
              <>
                <Separator />
                <div>
                  <h3 className="text-lg font-semibold">Special Conditions</h3>
                  <ul className="mt-2 list-disc pl-5 space-y-1">
                    {agreement.specialConditions.map((condition, index) => (
                      <li key={index} className="text-sm text-muted-foreground">{condition}</li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
} 