'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, loading, isAdmin } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        if (isAdmin) {
          router.push('/admin');
        } else {
          router.push('/hotels');
        }
      } else {
        router.push('/login');
      }
    }
  }, [isAuthenticated, loading, isAdmin, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">HotelApp</h1>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

