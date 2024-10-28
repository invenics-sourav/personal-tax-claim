import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ClaimProgress } from './ClaimProgress';
import { TaxClaim, ClaimStatus, StatusProgress } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface ClaimDetailsProps {
  claim: TaxClaim | null;
  onClose: () => void;
  readOnly?: boolean;
}

const CLAIM_STAGES: ClaimStatus[] = [
  'Gather Required Documents',
  'Calculate Taxable Income',
  'Fill Out the Tax Return Form',
  'Submit the Tax Return',
  'Receive Confirmation',
  'Tax Assessment',
  'Receive Refund',
  'Keep Records'
];

export function ClaimDetails({
  claim,
  onClose,
  readOnly = false,
}: ClaimDetailsProps) {
  const [selectedStage, setSelectedStage] = useState<ClaimStatus>(CLAIM_STAGES[0]);
  const [progress, setProgress] = useState<StatusProgress>('not_started');
  const [comment, setComment] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  if (!claim) return null;

  const handleUpdateStatus = async () => {
    if (!claim || readOnly) return;
    setIsUpdating(true);

    try {
      const claimRef = doc(db, 'claims', claim.id);
      await updateDoc(claimRef, {
        [`statusUpdates.${selectedStage}`]: {
          progress,
          comment,
          updatedAt: new Date().toISOString(),
        },
        updatedAt: new Date().toISOString(),
      });

      toast({
        title: 'Success',
        description: 'Claim status updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update claim status',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={!!claim} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Claim Details - {claim.id}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <ClaimProgress claim={claim} />

          {!readOnly && (
            <div className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <label className="text-sm font-medium">Update Stage</label>
                  <Select
                    value={selectedStage}
                    onValueChange={(value) => setSelectedStage(value as ClaimStatus)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select stage" />
                    </SelectTrigger>
                    <SelectContent>
                      {CLAIM_STAGES.map((stage) => (
                        <SelectItem key={stage} value={stage}>
                          {stage}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Progress</label>
                  <Select
                    value={progress}
                    onValueChange={(value) => setProgress(value as StatusProgress)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select progress" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="not_started">Not Started</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Comment</label>
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment about this status update..."
                    className="mt-1"
                  />
                </div>

                <Button
                  onClick={handleUpdateStatus}
                  disabled={isUpdating || !comment}
                >
                  {isUpdating ? 'Updating...' : 'Update Status'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}