'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { supabaseAuth } from '@/lib/auth';

/** Redirects to /login if auth is configured but user is not logged in */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (supabaseAuth && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0A0A0A' }}>
        <div className="text-center" style={{ color: 'var(--color-text-muted)' }}>Loading...</div>
      </div>
    );
  }

  if (supabaseAuth && !user) {
    return null;
  }

  return <>{children}</>;
}
