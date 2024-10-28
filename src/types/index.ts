export type UserRole = 'customer' | 'sales';

export type User = {
  id: string;
  email: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  createdAt: string;
  salesRepId?: string; // Only for customers
};

export type ClaimStatus =
  | 'Gather Required Documents'
  | 'Calculate Taxable Income'
  | 'Fill Out the Tax Return Form'
  | 'Submit the Tax Return'
  | 'Receive Confirmation'
  | 'Tax Assessment'
  | 'Receive Refund'
  | 'Keep Records';

export type StatusProgress = 'not_started' | 'in_progress' | 'completed';

export type StatusUpdate = {
  status: ClaimStatus;
  progress: StatusProgress;
  comment: string;
  updatedAt: string;
  updatedBy: string;
};

export type Document = {
  id: string;
  name: string;
  url: string;
  type: string;
  uploadedAt: string;
  uploadedBy: string;
};

export type TaxClaim = {
  id: string;
  customerId: string;
  salesRepId: string;
  year: number;
  statusUpdates: Record<ClaimStatus, StatusUpdate>;
  documents: Document[];
  createdAt: string;
  updatedAt: string;
  isComplete: boolean;
};