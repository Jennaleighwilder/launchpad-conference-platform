'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn, signInWithGoogle } from '@/lib/auth';
import { useAuth } from '@/components/AuthProvider';

const BETA_TESTER_MODE = process.env.NEXT_PUBLIC_BETA_TESTER_MODE === 'true';

export default function LoginPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: '#0A0A0A' }}>
        <div className="text-center" style={{ color: 'var(--color-text-muted)' }}>Loading...</div>
      </main>
    );
  }

  if (user) {
    router.replace('/dashboard');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const { error: err } = await signIn(email, password);
      if (err) {
        setError(err.message || 'Sign in failed');
        return;
      }
      router.push('/dashboard');
    } catch {
      setError('Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setSubmitting(true);
    try {
      const { error: err } = await signInWithGoogle();
      if (err) {
        setError(err.message || 'Google sign in failed');
      }
    } catch {
      setError('Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4" style={{ background: '#0A0A0A', color: '#f5f5f5' }}>
      <div className="w-full max-w-md">
        <Link href="/" className="inline-flex items-center gap-2 text-sm mb-8 hover:opacity-80 transition-opacity" style={{ color: 'var(--color-text-muted)' }}>
          ← Back to Launchpad
        </Link>
        <div
          className="rounded-2xl p-8"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <h1 className="text-2xl font-semibold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
            Log in
          </h1>
          <p className="text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>
            Access your dashboard and events
          </p>

          <button
            onClick={handleGoogle}
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg mb-4 transition-all hover:opacity-90 disabled:opacity-50"
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
            }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Sign in with Google
          </button>

          {BETA_TESTER_MODE && (
            <div className="mb-4">
              <Link
                href="/dashboard"
                className="block w-full text-center py-3 px-4 rounded-lg transition-all hover:opacity-90"
                style={{
                  background: 'rgba(79,255,223,0.1)',
                  border: '1px solid rgba(79,255,223,0.3)',
                  color: 'var(--color-accent)',
                }}
              >
                <span className="font-medium">Try without signing in</span>
                <span className="block text-xs mt-1 opacity-90" style={{ color: 'var(--color-text-muted)' }}>
                  Beta tester — no Google or account required
                </span>
              </Link>
              <p className="text-xs mt-2 text-center" style={{ color: 'var(--color-text-muted)' }}>
                Create events, explore the dashboard, and test the full app. No sign-up needed.
              </p>
            </div>
          )}

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }} />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2" style={{ background: 'rgba(255,255,255,0.03)', color: 'var(--color-text-muted)' }}>
                or continue with email
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg outline-none"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
            color: '#f5f5f5',
                }}
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg outline-none"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
            color: '#f5f5f5',
                }}
                placeholder="••••••••"
              />
            </div>
            {error && (
              <p className="text-sm" style={{ color: '#EF4444' }}>
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-lg font-medium transition-all hover:opacity-90 disabled:opacity-50"
              style={{ background: 'var(--color-accent)', color: '#0A0A0A' }}
            >
              {submitting ? 'Signing in...' : 'Log in'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="font-medium" style={{ color: 'var(--color-accent)' }}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
