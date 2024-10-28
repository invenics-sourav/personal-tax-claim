import { Badge } from '@/components/ui/badge';
import { ClaimStatus } from '@/types';

const statusConfig: Record<
  ClaimStatus,
  { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
> = {
  submitted: { label: 'Submitted', variant: 'secondary' },
  under_review: { label: 'Under Review', variant: 'default' },
  info_needed: { label: 'Info Needed', variant: 'outline' },
  approved: { label: 'Approved', variant: 'default' },
  rejected: { label: 'Rejected', variant: 'destructive' },
};

export function ClaimStatusBadge({ status }: { status: ClaimStatus }) {
  const config = statusConfig[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}