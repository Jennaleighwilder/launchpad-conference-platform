'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

const LANGUAGES = [
  { label: 'English', value: 'en' },
  { label: 'Español', value: 'es' },
  { label: 'Français', value: 'fr' },
  { label: 'Deutsch', value: 'de' },
  { label: 'Italiano', value: 'it' },
  { label: 'Português', value: 'pt' },
  { label: '日本語', value: 'ja' },
  { label: '中文', value: 'zh-CN' },
  { label: '한국어', value: 'ko' },
  { label: 'العربية', value: 'ar' },
];

declare global {
  interface Window {
    google?: { translate: { TranslateElement: new (config: object, el: string) => void } };
    googleTranslateElementInit?: () => void;
  }
}

function googleTranslateElementInit() {
  if (typeof window !== 'undefined' && window.google?.translate) {
    new window.google.translate.TranslateElement(
      {
        pageLanguage: 'en',
        includedLanguages: LANGUAGES.map((l) => l.value).join(','),
        layout: (window.google.translate.TranslateElement as { InlineLayout?: { SIMPLE: number } }).InlineLayout?.SIMPLE ?? 0,
        autoDisplay: false,
      },
      'google_translate_element'
    );
  }
}

function getCurrentLang(): string {
  if (typeof document === 'undefined') return 'en';
  const match = document.cookie.match(/googtrans=([^;]+)/);
  if (!match) return 'en';
  const parts = match[1].split('/');
  return parts[parts.length - 1] || 'en';
}

export function GoogleTranslateWidget() {
  const [currentLang, setCurrentLang] = useState('en');

  useEffect(() => {
    setCurrentLang(getCurrentLang());
  }, []);

  const onChange = (value: string) => {
    if (value === 'en') {
      document.cookie = 'googtrans=; path=/; max-age=0';
    } else {
      document.cookie = `googtrans=/en/${value}; path=/; max-age=31536000`;
    }
    window.location.reload();
  };

  return (
    <>
      <div id="google_translate_element" className="sr-only" aria-hidden="true" />
      <Script
        src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
        onLoad={() => {
          window.googleTranslateElementInit = googleTranslateElementInit;
          googleTranslateElementInit();
        }}
      />
      <div className="mt-2 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <span className="block mb-1 text-xs" style={{ color: 'var(--color-text-muted)' }}>
          Language / Idioma
        </span>
        <select
          value={currentLang}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded px-2 py-1.5 text-sm"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'var(--color-text)',
          }}
          aria-label="Select language"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
