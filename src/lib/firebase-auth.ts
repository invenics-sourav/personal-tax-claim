/**
 * Firebase Authentication Service
 * 
 * This module provides authentication-related functionality using Firebase Auth.
 * It handles user creation, password management, and access control for sales representatives.
 */

import { 
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

/**
 * Creates a new customer account with temporary password and sends reset email
 * 
 * @param email - Customer's email address
 * @param firstName - Customer's first name
 * @param lastName - Customer's last name
 * @param salesRepId - ID of the sales representative
 * @returns Promise<string> - The created user's ID
 */
export async function createCustomerAccount(
  email: string,
  firstName: string,
  lastName: string,
  salesRepId: string
): Promise<string> {
  try {
    // Generate a temporary password
    const tempPassword = Math.random().toString(36).slice(-8);
    
    // Create the user account in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, tempPassword);
    const userId = userCredential.user.uid;

    // Create user document in Firestore
    await setDoc(doc(db, 'users', userId), {
      id: userId,
      email,
      firstName,
      lastName,
      role: 'customer',
      salesRepId,
      createdAt: new Date().toISOString(),
    });

    // Send password reset email to customer
    await sendPasswordResetEmail(auth, email);

    return userId;
  } catch (error) {
    console.error('Error creating customer account:', error);
    throw error;
  }
}

/**
 * Changes the user's password after re-authentication
 * 
 * @param currentPassword - User's current password
 * @param newPassword - Desired new password
 */
export async function changeUserPassword(
  currentPassword: string,
  newPassword: string
): Promise<void> {
  const user = auth.currentUser;
  if (!user || !user.email) throw new Error('No authenticated user');

  try {
    // Re-authenticate user before password change
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);

    // Update password
    await updatePassword(user, newPassword);
  } catch (error) {
    console.error('Error changing password:', error);
    throw error;
  }
}

/**
 * Verifies if an email is authorized for sales representative access
 * 
 * @param email - Email address to check
 * @returns Promise<boolean> - Whether the email is authorized
 */
export async function checkSalesRepAccess(email: string): Promise<boolean> {
  try {
    const allowedEmailsRef = collection(db, 'allowedSalesEmails');
    const q = query(allowedEmailsRef, where('email', '==', email));
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  } catch (error) {
    console.error('Error checking sales rep access:', error);
    return false;
  }
}