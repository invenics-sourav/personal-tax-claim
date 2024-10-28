import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { TaxClaim } from '@/types';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ClaimsTable } from '@/components/claims/ClaimsTable';
import { ClaimDetails } from '@/components/claims/ClaimDetails';
import { ClaimProgress } from '@/components/claims/ClaimProgress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Clock, CheckCircle } from 'lucide-react';

export function CustomerDashboard() {
  const { userData } = useAuth();
  const [claims, setClaims] = useState<TaxClaim[]>([]);
  const [selectedClaim, setSelectedClaim] = useState<TaxClaim | null>(null);

  useEffect(() => {
    if (!userData?.id) return;

    const claimsQuery = query(
      collection(db, 'claims'),
      where('customerId', '==', userData.id)
    );

    const unsubscribe = onSnapshot(claimsQuery, (snapshot) => {
      const claimsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as TaxClaim[];
      setClaims(claimsData);
    });

    return () => unsubscribe();
  }, [userData?.id]);

  const activeClaims = claims.filter((claim) => !claim.isComplete);
  const completedClaims = claims.filter((claim) => claim.isComplete);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Welcome back, {userData?.firstName || 'Customer'}</h1>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Claims</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{claims.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Claims</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeClaims.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Claims</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedClaims.length}</div>
            </CardContent>
          </Card>
        </div>

        {selectedClaim && (
          <Card>
            <CardHeader>
              <CardTitle>Claim Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <ClaimProgress claim={selectedClaim} />
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Your Claims</CardTitle>
          </CardHeader>
          <CardContent>
            <ClaimsTable
              claims={claims}
              onViewClaim={setSelectedClaim}
            />
          </CardContent>
        </Card>

        <ClaimDetails
          claim={selectedClaim}
          onClose={() => setSelectedClaim(null)}
          readOnly
        />
      </div>
    </DashboardLayout>
  );
}