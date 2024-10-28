import { createContext, useContext, useEffect, useState } from 'react';
import { 
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { User } from '@/types';
import { getUser, getTestUserIds, isDummyDataEnabled } from '@/lib/data-service';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userData: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  sendLoginLink: (email: string) => Promise<void>;
  completeLoginWithLink: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const actionCodeSettings = {
  url: window.location.origin + '/finalize-signin',
  handleCodeInApp: true,
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isDummyDataEnabled()) {
      // Use test sales user for dummy data
      const { salesId } = getTestUserIds();
      getUser(salesId).then(user => {
        setUserData(user);
        setLoading(false);
      });
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const userDoc = await getUser(user.uid);
        setUserData(userDoc);
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    if (isDummyDataEnabled()) {
      const { salesId } = getTestUserIds();
      const user = await getUser(salesId);
      setUserData(user);
      return;
    }

    await signInWithEmailAndPassword(auth, email, password);
  };

  const sendLoginLink = async (email: string) => {
    if (isDummyDataEnabled()) return;
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    localStorage.setItem('emailForSignIn', email);
  };

  const completeLoginWithLink = async (email: string) => {
    if (isDummyDataEnabled()) return;
    
    if (isSignInWithEmailLink(auth, window.location.href)) {
      try {
        await signInWithEmailLink(auth, email, window.location.href);
      } catch (error) {
        console.error('Error completing sign-in with link:', error);
        throw error;
      }
    }
  };

  const signOut = async () => {
    if (isDummyDataEnabled()) {
      setUserData(null);
      return;
    }

    await firebaseSignOut(auth);
  };

  const value = {
    currentUser,
    userData,
    loading,
    signIn,
    signOut,
    sendLoginLink,
    completeLoginWithLink
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}