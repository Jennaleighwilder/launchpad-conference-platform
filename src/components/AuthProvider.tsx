'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabaseAuth, signOut as authSignOut } from '@/lib/auth';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContext {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthCtx = createContext<AuthContext>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
});
export const useAuth = () => useContext(AuthCtx);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabaseAuth) {
      setLoading(false);
      return;
    }
    supabaseAuth.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabaseAuth.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await authSignOut();
    setUser(null);
    setSession(null);
  };

  return (
    <AuthCtx.Provider value={{ user, session, loading, signOut: handleSignOut }}>
      {children}
    </AuthCtx.Provider>
  );
}
