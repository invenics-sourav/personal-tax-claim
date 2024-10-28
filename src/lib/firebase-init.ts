import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  Timestamp,
  connectFirestoreEmulator,
} from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';

// Initialize Firebase
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Connect to emulators in development
if (import.meta.env.DEV) {
  connectAuthEmulator(auth, 'http://localhost:9099');
  connectFirestoreEmulator(db, 'localhost', 8080);
}

// Collection names
const COLLECTIONS = {
  USERS: 'users',
  ALLOWED_SALES_EMAILS: 'allowedSalesEmails',
  CLAIMS: 'claims',
} as const;

// Sample data for initial setup
const sampleData = {
  users: [
    {
      id: 'sales1',
      email: 'sales@example.com',
      role: 'sales',
      firstName: 'John',
      lastName: 'Doe',
      createdAt: Timestamp.now(),
    },
    {
      id: 'customer1',
      email: 'customer@example.com',
      role: 'customer',
      firstName: 'Jane',
      lastName: 'Smith',
      salesRepId: 'sales1',
      createdAt: Timestamp.now(),
    },
  ],
  allowedSalesEmails: [
    {
      id: 'allowed1',
      email: 'sales@example.com',
      addedAt: Timestamp.now(),
      addedBy: 'admin',
    },
  ],
  claims: [
    {
      id: 'claim1',
      customerId: 'customer1',
      salesRepId: 'sales1',
      year: 2024,
      statusUpdates: {
        'Gather Required Documents': {
          progress: 'completed',
          comment: 'All documents received',
          updatedAt: Timestamp.now(),
          updatedBy: 'sales1',
        },
        'Calculate Taxable Income': {
          progress: 'in_progress',
          comment: 'Processing calculations',
          updatedAt: Timestamp.now(),
          updatedBy: 'sales1',
        },
      },
      documents: [
        {
          id: 'doc1',
          name: 'W-2 Form',
          url: 'https://example.com/w2.pdf',
          type: 'application/pdf',
          uploadedAt: Timestamp.now(),
          uploadedBy: 'customer1',
        },
      ],
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      isComplete: false,
    },
  ],
};

/**
 * Initializes a collection with sample data if it's empty
 */
async function initializeCollection(
  collectionName: keyof typeof COLLECTIONS,
  sampleDocs: any[]
) {
  const collectionRef = collection(db, COLLECTIONS[collectionName]);
  const snapshot = await getDocs(collectionRef);

  if (snapshot.empty) {
    console.log(`Initializing ${collectionName} collection with sample data...`);
    
    for (const document of sampleDocs) {
      await setDoc(doc(db, COLLECTIONS[collectionName], document.id), document);
    }
    
    console.log(`${collectionName} collection initialized successfully.`);
  } else {
    console.log(`${collectionName} collection already exists with data.`);
  }
}

/**
 * Initializes all collections with their schemas and sample data
 */
export async function initializeFirestore() {
  try {
    console.log('Starting Firestore initialization...');

    // Initialize collections in order (users first as they're referenced by others)
    await initializeCollection('USERS', sampleData.users);
    await initializeCollection('ALLOWED_SALES_EMAILS', sampleData.allowedSalesEmails);
    await initializeCollection('CLAIMS', sampleData.claims);

    console.log('Firestore initialization completed successfully.');
  } catch (error) {
    console.error('Error initializing Firestore:', error);
    throw error;
  }
}

// Export types
export interface User {
  id: string;
  email: string;
  role: 'customer' | 'sales';
  firstName: string;
  lastName: string;
  createdAt: Timestamp;
  salesRepId?: string;
}

export interface AllowedSalesEmail {
  id: string;
  email: string;
  addedAt: Timestamp;
  addedBy: string;
}

export interface Claim {
  id: string;
  customerId: string;
  salesRepId: string;
  year: number;
  statusUpdates: {
    [key: string]: {
      progress: 'not_started' | 'in_progress' | 'completed';
      comment: string;
      updatedAt: Timestamp;
      updatedBy: string;
    };
  };
  documents: Array<{
    id: string;
    name: string;
    url: string;
    type: string;
    uploadedAt: Timestamp;
    uploadedBy: string;
  }>;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isComplete: boolean;
}