'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { supabaseAuth } from '@/lib/auth';

const BETA_TESTER_MODE = process.env.NEXT_PUBLIC_BETA_TESTER_MODE === 'true';

/** Redirects to /login if auth is configured but user is not logged in (unless beta tester mode or optional) */
export function RequireAuth({ children, optional }: { children: React.ReactNode; optional?: boolean }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (BETA_TESTER_MODE) return;
    if (optional) return;
    if (supabaseAuth && !user) {
      router.replace('/login');
    }
  }, [user, loading, router, optional]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0A0A0A' }}>
        <div className="text-center" style={{ color: 'var(--color-text-muted)' }}>Loading...</div>
      </div>
    );
  }

  if (!BETA_TESTER_MODE && !optional && supabaseAuth && !user) {
    return null;
  }

  return <>{children}</>;
}
