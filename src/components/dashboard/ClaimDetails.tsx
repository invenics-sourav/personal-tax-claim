import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ClaimStatusBadge } from './ClaimStatusBadge';
import { TaxClaim, StatusUpdate, ClaimStatus } from '@/types';
import { formatDate } from '@/lib/utils';

interface ClaimDetailsProps {
  claim: TaxClaim | null;
  onClose: () => void;
  onUpdateStatus: (
    claimId: string,
    status: ClaimStatus,
    comment: string
  ) => void;
}

export function ClaimDetails({
  claim,
  onClose,
  onUpdateStatus,
}: ClaimDetailsProps) {
  const [newStatus, setNewStatus] = useState<ClaimStatus>('under_review');
  const [comment, setComment] = useState('');

  if (!claim) return null;

  const handleStatusUpdate = () => {
    onUpdateStatus(claim.id, newStatus, comment);
    setComment('');
  };

  return (
    <Dialog open={!!claim} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>Claim Details - {claim.id}</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="details" className="h-full">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          <div className="mt-4 h-[calc(100%-4rem)]">
            <TabsContent value="details" className="h-full">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Current Status</label>
                  <div className="mt-1">
                    <ClaimStatusBadge status={claim.status} />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Amount</label>
                  <Input
                    value={claim.amount.toString()}
                    readOnly
                    className="mt-1"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium">Update Status</label>
                  <select
                    className="w-full mt-1 p-2 border rounded"
                    value={newStatus}
                    onChange={(e) =>
                      setNewStatus(e.target.value as ClaimStatus)
                    }
                  >
                    <option value="under_review">Under Review</option>
                    <option value="info_needed">Info Needed</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium">Comment</label>
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="mt-1"
                    placeholder="Add a comment about this status update..."
                  />
                </div>
                <div className="col-span-2">
                  <Button
                    onClick={handleStatusUpdate}
                    disabled={!comment}
                    className="w-full"
                  >
                    Update Status
                  </Button>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="documents" className="h-full">
              <ScrollArea className="h-full">
                {claim.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 border-b"
                  >
                    <div>
                      <p className="font-medium">{doc.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Uploaded {formatDate(doc.uploadedAt)}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </div>
                ))}
              </ScrollArea>
            </TabsContent>
            <TabsContent value="history" className="h-full">
              <ScrollArea className="h-full">
                {claim.statusHistory.map((update: StatusUpdate) => (
                  <div
                    key={update.id}
                    className="mb-4 p-4 border rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <ClaimStatusBadge status={update.status} />
                      <span className="text-sm text-muted-foreground">
                        {formatDate(update.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm">{update.comment}</p>
                  </div>
                ))}
              </ScrollArea>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}