import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  setDoc,
  updateDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { mockUsers, mockClaims, TEST_SALES_ID, TEST_CUSTOMER_ID } from './mock-data';
import { User, TaxClaim, ClaimStatus } from '@/types';

const USE_DUMMY_DATA = import.meta.env.VITE_USE_DUMMY_DATA === 'true';

// User Operations
export async function getUser(userId: string): Promise<User | null> {
  if (USE_DUMMY_DATA) {
    return mockUsers.find(user => user.id === userId) || null;
  }

  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    return userDoc.exists() ? userDoc.data() as User : null;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

export async function getUsersByRole(role: 'sales' | 'customer'): Promise<User[]> {
  if (USE_DUMMY_DATA) {
    return mockUsers.filter(user => user.role === role);
  }

  try {
    const usersQuery = query(collection(db, 'users'), where('role', '==', role));
    const snapshot = await getDocs(usersQuery);
    return snapshot.docs.map(doc => doc.data() as User);
  } catch (error) {
    console.error('Error fetching users by role:', error);
    return [];
  }
}

export async function getCustomersBySalesRep(salesRepId: string): Promise<User[]> {
  if (USE_DUMMY_DATA) {
    return mockUsers.filter(user => user.role === 'customer' && user.salesRepId === salesRepId);
  }

  try {
    const customersQuery = query(
      collection(db, 'users'),
      where('role', '==', 'customer'),
      where('salesRepId', '==', salesRepId)
    );
    const snapshot = await getDocs(customersQuery);
    return snapshot.docs.map(doc => doc.data() as User);
  } catch (error) {
    console.error('Error fetching customers:', error);
    return [];
  }
}

// Claims Operations
export async function getClaim(claimId: string): Promise<TaxClaim | null> {
  if (USE_DUMMY_DATA) {
    return mockClaims.find(claim => claim.id === claimId) || null;
  }

  try {
    const claimDoc = await getDoc(doc(db, 'claims', claimId));
    return claimDoc.exists() ? claimDoc.data() as TaxClaim : null;
  } catch (error) {
    console.error('Error fetching claim:', error);
    return null;
  }
}

export async function getClaimsByCustomer(customerId: string): Promise<TaxClaim[]> {
  if (USE_DUMMY_DATA) {
    return mockClaims.filter(claim => claim.customerId === customerId);
  }

  try {
    const claimsQuery = query(collection(db, 'claims'), where('customerId', '==', customerId));
    const snapshot = await getDocs(claimsQuery);
    return snapshot.docs.map(doc => doc.data() as TaxClaim);
  } catch (error) {
    console.error('Error fetching customer claims:', error);
    return [];
  }
}

export async function getClaimsBySalesRep(salesRepId: string): Promise<TaxClaim[]> {
  if (USE_DUMMY_DATA) {
    return mockClaims.filter(claim => claim.salesRepId === salesRepId);
  }

  try {
    const claimsQuery = query(collection(db, 'claims'), where('salesRepId', '==', salesRepId));
    const snapshot = await getDocs(claimsQuery);
    return snapshot.docs.map(doc => doc.data() as TaxClaim);
  } catch (error) {
    console.error('Error fetching sales rep claims:', error);
    return [];
  }
}

export async function updateClaimStatus(
  claimId: string,
  status: ClaimStatus,
  comment: string,
  updatedBy: string
): Promise<void> {
  if (USE_DUMMY_DATA) {
    const claim = mockClaims.find(c => c.id === claimId);
    if (claim) {
      claim.statusUpdates[status] = {
        status,
        progress: 'in_progress',
        comment,
        updatedAt: new Date().toISOString(),
        updatedBy,
      };
      claim.updatedAt = new Date().toISOString();
    }
    return;
  }

  try {
    const claimRef = doc(db, 'claims', claimId);
    await updateDoc(claimRef, {
      [`statusUpdates.${status}`]: {
        status,
        progress: 'in_progress',
        comment,
        updatedAt: Timestamp.now(),
        updatedBy,
      },
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating claim status:', error);
    throw error;
  }
}

// Test Helper Functions
export function getTestUserIds() {
  return {
    salesId: TEST_SALES_ID,
    customerId: TEST_CUSTOMER_ID,
  };
}

export function isDummyDataEnabled() {
  return USE_DUMMY_DATA;
}