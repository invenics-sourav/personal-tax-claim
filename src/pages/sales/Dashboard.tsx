import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { TaxClaim, User } from '@/types';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ClaimsTable } from '@/components/claims/ClaimsTable';
import { ClaimDetails } from '@/components/claims/ClaimDetails';
import { CustomerList } from '@/components/sales/CustomerList';
import { NewCustomerDialog } from '@/components/sales/NewCustomerDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, FileText, Clock } from 'lucide-react';

export function SalesRepDashboard() {
  const { userData } = useAuth();
  const [claims, setClaims] = useState<TaxClaim[]>([]);
  const [customers, setCustomers] = useState<User[]>([]);
  const [selectedClaim, setSelectedClaim] = useState<TaxClaim | null>(null);
  const [showNewCustomer, setShowNewCustomer] = useState(false);

  useEffect(() => {
    if (!userData?.id) return;

    const claimsQuery = query(
      collection(db, 'claims'),
      where('salesRepId', '==', userData.id)
    );

    const customersQuery = query(
      collection(db, 'users'),
      where('salesRepId', '==', userData.id)
    );

    const unsubscribeClaims = onSnapshot(claimsQuery, (snapshot) => {
      const claimsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as TaxClaim[];
      setClaims(claimsData);
    });

    const unsubscribeCustomers = onSnapshot(customersQuery, (snapshot) => {
      const customersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as User[];
      setCustomers(customersData);
    });

    return () => {
      unsubscribeClaims();
      unsubscribeCustomers();
    };
  }, [userData?.id]);

  const pendingClaims = claims.filter(
    (claim) => !claim.isComplete
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Sales Dashboard</h1>
          <Button onClick={() => setShowNewCustomer(true)}>
            Add New Customer
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{customers.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Claims</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingClaims.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Claims</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{claims.length}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Claims</CardTitle>
            </CardHeader>
            <CardContent>
              <ClaimsTable
                claims={claims.slice(0, 5)}
                onViewClaim={setSelectedClaim}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <CustomerList customers={customers} />
            </CardContent>
          </Card>
        </div>

        <ClaimDetails
          claim={selectedClaim}
          onClose={() => setSelectedClaim(null)}
          onUpdateStatus={async (status, comment) => {
            // Implement status update logic
          }}
        />

        <NewCustomerDialog
          open={showNewCustomer}
          onClose={() => setShowNewCustomer(false)}
          salesRepId={userData?.id || ''}
        />
      </div>
    </DashboardLayout>
  );
}