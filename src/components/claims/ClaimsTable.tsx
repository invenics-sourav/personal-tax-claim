import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { TaxClaim } from '@/types';
import { formatDate } from '@/lib/utils';

interface ClaimsTableProps {
  claims: TaxClaim[];
  onViewClaim: (claim: TaxClaim) => void;
}

export function ClaimsTable({ claims, onViewClaim }: ClaimsTableProps) {
  const getStatusColor = (progress: string) => {
    switch (progress) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCurrentStage = (claim: TaxClaim) => {
    const stages = Object.entries(claim.statusUpdates);
    const currentStage = stages.find(([_, status]) => status.progress === 'in_progress');
    return currentStage ? currentStage[0] : 'Not Started';
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Current Stage</TableHead>
          <TableHead>Last Updated</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {claims.map((claim) => (
          <TableRow key={claim.id}>
            <TableCell className="font-medium">{claim.id}</TableCell>
            <TableCell>{claim.customerId}</TableCell>
            <TableCell>
              <Badge variant="secondary">
                {getCurrentStage(claim)}
              </Badge>
            </TableCell>
            <TableCell>{formatDate(claim.updatedAt)}</TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onViewClaim(claim)}>
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}