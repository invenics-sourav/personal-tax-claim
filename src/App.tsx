import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { SignIn } from '@/pages/auth/SignIn';
import { FinalizeSignIn } from '@/pages/auth/FinalizeSignIn';
import { CustomerDashboard } from '@/pages/customer/Dashboard';
import { SalesRepDashboard } from '@/pages/sales/Dashboard';
import { Toaster } from '@/components/ui/toaster';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return currentUser ? <>{children}</> : <Navigate to="/signin" />;
}

function App() {
  const { userData } = useAuth();

  return (
    <>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/finalize-signin" element={<FinalizeSignIn />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              {userData?.role === 'sales' ? (
                <SalesRepDashboard />
              ) : (
                <CustomerDashboard />
              )}
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;