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

interface AgreementDetailsProps {
  agreement: {
    id: string;
    property: {
      title: string;
      location: string;
    };
    tenant: {
      name: string;
      email: string;
      walletAddress: string;
    };
    startDate: Date;
    endDate: Date;
    rentAmount: number;
    status: string;
    termsAndConditions?: string[];
    specialConditions?: string[];
    transactionHash: string;
    blockNumber: number;
    timestamp: number;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AgreementDetailsDialog({ agreement, open, onOpenChange }: AgreementDetailsProps) {
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
              <h3 className="text-lg font-semibold">Blockchain Details</h3>
              <div className="mt-2 space-y-2">
                <p><span className="font-medium">Transaction Hash:</span> {agreement.transactionHash}</p>
                <p><span className="font-medium">Block Number:</span> {agreement.blockNumber}</p>
                <p><span className="font-medium">Timestamp:</span> {formatDateTime(new Date(agreement.timestamp))}</p>
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