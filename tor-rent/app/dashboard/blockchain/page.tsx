'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import { Loader2 } from 'lucide-react';

export default function BlockchainRedirectPage() {
  const router = useRouter();
  const { user, isLoading } = useUser();

  useEffect(() => {
    if (!isLoading) {
      // If user is a landlord, redirect to landlord blockchain
      if (user?.type === 'landlord') {
        router.push('/dashboard/landlord/blockchain');
      } else {
        // For tenants or any other user type, redirect to tenant blockchain
        router.push('/dashboard/tenant/blockchain');
      }
    }
  }, [router, user, isLoading]);

  return (
    <div className="flex items-center justify-center min-h-[50vh] flex-col">
      <Loader2 className="h-8 w-8 animate-spin text-orange-500 mb-2" />
      <p>Redirecting to the appropriate blockchain page...</p>
    </div>
  );
} 