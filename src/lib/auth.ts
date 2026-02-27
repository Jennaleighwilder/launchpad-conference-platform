import { createClient, type User, type Session } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const supabaseAuth =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : (null as ReturnType<typeof createClient> | null);

export async function signUp(email: string, password: string) {
  if (!supabaseAuth) return { data: null, error: new Error('Supabase not configured') };
  const { data, error } = await supabaseAuth.auth.signUp({ email, password });
  return { data, error };
}

export async function signIn(email: string, password: string) {
  if (!supabaseAuth) return { data: null, error: new Error('Supabase not configured') };
  const { data, error } = await supabaseAuth.auth.signInWithPassword({ email, password });
  return { data, error };
}

export async function signInWithGoogle() {
  if (!supabaseAuth) return { data: null, error: new Error('Supabase not configured') };
  const { data, error } = await supabaseAuth.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${typeof window !== 'undefined' ? window.location.origin : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard` },
  });
  return { data, error };
}

export async function signOut() {
  if (!supabaseAuth) return { error: null };
  const { error } = await supabaseAuth.auth.signOut();
  return { error };
}

export async function getUser(): Promise<User | null> {
  if (!supabaseAuth) return null;
  const { data: { user } } = await supabaseAuth.auth.getUser();
  return user;
}

export async function getSession(): Promise<Session | null> {
  if (!supabaseAuth) return null;
  const { data: { session } } = await supabaseAuth.auth.getSession();
  return session;
}

/** Server-side: get user from Authorization Bearer token */
export async function getServerUser(req: Request): Promise<User | null> {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  const token = authHeader.slice(7);
  try {
    const { createServiceClient } = await import('@/lib/supabase');
    const supabase = createServiceClient();
    const { data: { user } } = await supabase.auth.getUser(token);
    return user;
  } catch {
    return null;
  }
}
