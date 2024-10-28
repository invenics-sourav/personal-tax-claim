import { User, TaxClaim, ClaimStatus } from '@/types';

// Test user IDs
export const TEST_SALES_ID = 'TEST_SALES_001';
export const TEST_CUSTOMER_ID = 'TEST_CUSTOMER_001';

export const mockUsers: User[] = [
  {
    id: TEST_SALES_ID,
    email: 'sales@test.com',
    firstName: 'John',
    lastName: 'Smith',
    role: 'sales',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: TEST_CUSTOMER_ID,
    email: 'customer@test.com',
    firstName: 'Jane',
    lastName: 'Doe',
    role: 'customer',
    salesRepId: TEST_SALES_ID,
    createdAt: '2024-01-02T00:00:00Z',
  },
];

const claimStatuses: ClaimStatus[] = [
  'Gather Required Documents',
  'Calculate Taxable Income',
  'Fill Out the Tax Return Form',
  'Submit the Tax Return',
  'Receive Confirmation',
  'Tax Assessment',
  'Receive Refund',
  'Keep Records',
];

export const mockClaims: TaxClaim[] = [
  {
    id: 'CLAIM_001',
    customerId: TEST_CUSTOMER_ID,
    salesRepId: TEST_SALES_ID,
    year: 2024,
    statusUpdates: {
      'Gather Required Documents': {
        status: 'Gather Required Documents',
        progress: 'completed',
        comment: 'All documents received and verified',
        updatedAt: '2024-01-15T10:00:00Z',
        updatedBy: TEST_SALES_ID,
      },
      'Calculate Taxable Income': {
        status: 'Calculate Taxable Income',
        progress: 'in_progress',
        comment: 'Processing calculations',
        updatedAt: '2024-01-16T14:30:00Z',
        updatedBy: TEST_SALES_ID,
      },
    },
    documents: [
      {
        id: 'DOC_001',
        name: 'W-2 Form',
        url: 'https://example.com/w2.pdf',
        type: 'application/pdf',
        uploadedAt: '2024-01-14T09:00:00Z',
        uploadedBy: TEST_CUSTOMER_ID,
      },
      {
        id: 'DOC_002',
        name: '1099 Form',
        url: 'https://example.com/1099.pdf',
        type: 'application/pdf',
        uploadedAt: '2024-01-14T09:15:00Z',
        uploadedBy: TEST_CUSTOMER_ID,
      },
    ],
    createdAt: '2024-01-14T08:00:00Z',
    updatedAt: '2024-01-16T14:30:00Z',
    isComplete: false,
  },
  {
    id: 'CLAIM_002',
    customerId: TEST_CUSTOMER_ID,
    salesRepId: TEST_SALES_ID,
    year: 2023,
    statusUpdates: {
      'Gather Required Documents': {
        status: 'Gather Required Documents',
        progress: 'completed',
        comment: 'All documents received',
        updatedAt: '2023-12-01T10:00:00Z',
        updatedBy: TEST_SALES_ID,
      },
      'Calculate Taxable Income': {
        status: 'Calculate Taxable Income',
        progress: 'completed',
        comment: 'Calculations completed',
        updatedAt: '2023-12-05T15:00:00Z',
        updatedBy: TEST_SALES_ID,
      },
      'Fill Out the Tax Return Form': {
        status: 'Fill Out the Tax Return Form',
        progress: 'completed',
        comment: 'Form completed',
        updatedAt: '2023-12-10T11:00:00Z',
        updatedBy: TEST_SALES_ID,
      },
      'Submit the Tax Return': {
        status: 'Submit the Tax Return',
        progress: 'completed',
        comment: 'Submitted successfully',
        updatedAt: '2023-12-15T16:00:00Z',
        updatedBy: TEST_SALES_ID,
      },
      'Receive Confirmation': {
        status: 'Receive Confirmation',
        progress: 'completed',
        comment: 'Confirmation received',
        updatedAt: '2023-12-20T09:00:00Z',
        updatedBy: TEST_SALES_ID,
      },
    },
    documents: [
      {
        id: 'DOC_003',
        name: 'Complete Tax Return',
        url: 'https://example.com/tax-return-2023.pdf',
        type: 'application/pdf',
        uploadedAt: '2023-12-15T16:00:00Z',
        uploadedBy: TEST_SALES_ID,
      },
    ],
    createdAt: '2023-12-01T08:00:00Z',
    updatedAt: '2023-12-20T09:00:00Z',
    isComplete: true,
  },
];