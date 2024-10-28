import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export function FinalizeSignIn() {
  const [error, setError] = useState<string | null>(null);
  const { completeLoginWithLink } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem('emailForSignIn');
    if (!email) {
      setError('No email found. Please try signing in again.');
      return;
    }

    const finalize = async () => {
      try {
        await completeLoginWithLink(email);
        localStorage.removeItem('emailForSignIn');
        navigate('/dashboard');
      } catch (err) {
        setError('Failed to complete sign-in. Please try again.');
      }
    };

    finalize();
  }, [completeLoginWithLink, navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-destructive">
              Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Completing Sign In
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    </div>
  );
}