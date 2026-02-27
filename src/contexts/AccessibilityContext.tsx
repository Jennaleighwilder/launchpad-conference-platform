'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';

export type AccessibilityPrefs = {
  dyslexia: boolean;
  adhdFocus: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
  textSize: 'normal' | 'large' | 'xlarge';
};

const defaultPrefs: AccessibilityPrefs = {
  dyslexia: false,
  adhdFocus: false,
  highContrast: false,
  reducedMotion: false,
  textSize: 'normal',
};

const STORAGE_KEY = 'launchpad-a11y';

const AccessibilityContext = createContext<{
  prefs: AccessibilityPrefs;
  setPref: <K extends keyof AccessibilityPrefs>(key: K, value: AccessibilityPrefs[K]) => void;
  togglePref: (key: keyof AccessibilityPrefs) => void;
} | null>(null);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [prefs, setPrefs] = useState<AccessibilityPrefs>(defaultPrefs);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        queueMicrotask(() => setPrefs({ ...defaultPrefs, ...JSON.parse(stored) }));
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch {}
  }, [prefs]);

  const setPref = useCallback(<K extends keyof AccessibilityPrefs>(key: K, value: AccessibilityPrefs[K]) => {
    setPrefs((p) => ({ ...p, [key]: value }));
  }, []);

  const togglePref = useCallback((key: keyof AccessibilityPrefs) => {
    setPrefs((p) => ({ ...p, [key]: !(p[key] as boolean) }));
  }, []);

  return (
    <AccessibilityContext.Provider value={{ prefs, setPref, togglePref }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error('useAccessibility must be used within AccessibilityProvider');
  return ctx;
}
