import { Progress } from '@/components/ui/progress';
import { TaxClaim, ClaimStatus } from '@/types';

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

interface ClaimProgressProps {
  claim: TaxClaim;
}

export function ClaimProgress({ claim }: ClaimProgressProps) {
  const currentStageIndex = CLAIM_STAGES.findIndex(
    stage => claim.statusUpdates[stage]?.progress === 'in_progress'
  );

  const completedStages = CLAIM_STAGES.filter(
    stage => claim.statusUpdates[stage]?.progress === 'completed'
  ).length;

  const progress = ((completedStages + (currentStageIndex !== -1 ? 0.5 : 0)) / CLAIM_STAGES.length) * 100;

  return (
    <div className="space-y-4">
      <Progress value={progress} className="h-2" />
      
      <div className="grid gap-2">
        {CLAIM_STAGES.map((stage, index) => {
          const status = claim.statusUpdates[stage];
          const isActive = index === currentStageIndex;
          
          return (
            <div
              key={stage}
              className={`p-4 rounded-lg border ${
                isActive ? 'border-primary bg-primary/5' : 'border-border'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{stage}</span>
                <span className="text-sm text-muted-foreground">
                  {status?.progress === 'completed'
                    ? '✓ Completed'
                    : status?.progress === 'in_progress'
                    ? '⋯ In Progress'
                    : '○ Not Started'}
                </span>
              </div>
              {status?.comment && (
                <p className="mt-2 text-sm text-muted-foreground">
                  {status.comment}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}