'use client';

import { useEffect } from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';

export function AccessibilityBody() {
  const { prefs } = useAccessibility();

  useEffect(() => {
    const html = document.documentElement;

    html.dataset.dyslexia = String(prefs.dyslexia);
    html.dataset.adhdFocus = String(prefs.adhdFocus);
    html.dataset.highContrast = String(prefs.highContrast);
    html.dataset.reducedMotion = String(prefs.reducedMotion);
    html.dataset.textSize = prefs.textSize;
  }, [prefs]);

  return null;
}
