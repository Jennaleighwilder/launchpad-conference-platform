'use client';

import { useEffect, useState } from 'react';
import { getEventTheme, type EventTheme } from '@/lib/event-themes';

export interface PromoteEventData {
  name: string;
  topic: string;
  city: string;
  date: string;
  description?: string;
  tagline: string;
  speakers: { name: string; role: string }[];
  tracks: string[];
  pricing: { early_bird: string; regular: string; vip?: string; currency: string };
  venue: { name: string; address: string };
  slug: string;
}

const PROMO_TABS = [
  { id: 'social', label: 'Social', icon: '📱' },
  { id: 'communities', label: 'Communities', icon: '👥' },
  { id: 'email', label: 'Email', icon: '✉️' },
  { id: 'partners', label: 'Partners', icon: '🤝' },
  { id: 'seo', label: 'SEO', icon: '🔍' },
  { id: 'ads', label: 'Ads', icon: '📢' },
] as const;

const PROMO_AGENTS = ['socialBlitzBot', 'communityBot', 'emailBot', 'partnerBot', 'seoBot', 'retargetBot'];

const DEFAULT_THEME: EventTheme = {
  id: 'default',
  name: 'Default',
  fontDisplay: 'var(--font-display)',
  fontMono: "'JetBrains Mono', monospace",
  bg: '#050505',
  accent: '#4FFFDF',
  text: '#f5f5f5',
  textMuted: '#888888',
  cardBg: 'rgba(255,255,255,0.03)',
  cardBorder: 'rgba(255,255,255,0.06)',
  buttonRadius: '0.5rem',
  heroOverlay: '',
  heroImages: [],
};

export function PromoteModal({
  open,
  onClose,
  event,
  theme = DEFAULT_THEME,
  accentColor,
}: {
  open: boolean;
  onClose: () => void;
  event: PromoteEventData;
  theme?: EventTheme;
  accentColor?: string;
}) {
  const [promoData, setPromoData] = useState<any>(null);
  const [promoLoading, setPromoLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('social');
  const [agentStates, setAgentStates] = useState<Record<string, 'pending' | 'running' | 'done'>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const color = accentColor ?? theme.accent;

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleGenerate = async () => {
    setPromoLoading(true);
    setPromoData(null);
    try {
      const res = await fetch('/api/events/promote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: event.name,
          topic: event.topic || 'Tech',
          city: event.city,
          date: event.date,
          description: event.description || event.tagline || '',
          tagline: event.tagline || '',
          speakers: event.speakers.map((s) => ({ name: s.name, role: s.role || '' })),
          tracks: event.tracks.length ? event.tracks : ['Main'],
          pricing: event.pricing ? {
            early_bird: String(event.pricing.early_bird || ''),
            regular: String(event.pricing.regular || ''),
            vip: String(event.pricing.vip || ''),
            currency: event.pricing.currency || 'USD',
          } : { early_bird: '0', regular: '0', vip: '0', currency: 'USD' },
          venue: event.venue ? { name: event.venue.name, address: event.venue.address || '' } : { name: '', address: '' },
          slug: event.slug,
        }),
      });
      const data = await res.json();
      if (data.promo) setPromoData(data.promo);
      else setPromoData({ social: {}, communities: [], emails: { emails: [] }, partners: [], seo: {}, ads: {}, agentTimings: {}, errors: data.errors || [] });
    } catch {
      setPromoData({ social: {}, communities: [], emails: { emails: [] }, partners: [], seo: {}, ads: {}, agentTimings: {}, errors: ['Failed to generate'] });
    } finally {
      setPromoLoading(false);
    }
  };

  useEffect(() => {
    if (!open) return;
    setPromoData(null);
    setPromoLoading(false);
    setActiveTab('social');
  }, [open]);

  useEffect(() => {
    if (!promoLoading) return;
    setAgentStates(Object.fromEntries(PROMO_AGENTS.map((n) => [n, 'pending'])));
    const delays = [0, 400, 800, 1200, 1600, 2000];
    PROMO_AGENTS.forEach((name, i) => {
      setTimeout(() => setAgentStates((s) => ({ ...s, [name]: 'running' })), delays[i]);
    });
  }, [promoLoading]);

  useEffect(() => {
    if (!promoLoading && promoData) {
      PROMO_AGENTS.forEach((name) => setAgentStates((s) => ({ ...s, [name]: 'done' })));
    }
  }, [promoLoading, promoData]);

  if (!open) return null;

  const cardStyle = { background: theme.cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: theme.buttonRadius };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.9)' }}>
      <div className="w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col rounded-2xl" style={{ ...cardStyle, borderColor: `${color}40` }}>
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: theme.cardBorder }}>
          <h2 className="text-xl font-semibold" style={{ fontFamily: theme.fontDisplay, color: theme.text }}>Promotion Kit</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:opacity-80" style={{ color: theme.textMuted }} aria-label="Close">✕</button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {!promoData && !promoLoading && (
            <div className="text-center py-12">
              <p className="mb-6" style={{ color: theme.textMuted }}>Generate social posts, email drafts, SEO content, and ad copy in one click.</p>
              <button onClick={handleGenerate} className="px-8 py-4 font-semibold rounded-xl inline-flex items-center gap-2" style={{ background: color, color: theme.bg }}>
                🚀 Generate Promotion Kit
              </button>
            </div>
          )}
          {promoLoading && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {PROMO_AGENTS.map((name) => (
                <div key={name} className="p-4 rounded-xl flex items-center gap-3" style={cardStyle}>
                  <span className="text-2xl">{agentStates[name] === 'done' ? '✅' : agentStates[name] === 'running' ? '⚡' : '⏳'}</span>
                  <span className="text-sm" style={{ color: theme.text }}>{name.replace(/Bot$/, '')}</span>
                </div>
              ))}
            </div>
          )}
          {promoData && !promoLoading && (
            <>
              <div className="flex gap-2 flex-wrap mb-6">
                {PROMO_TABS.map((t) => (
                  <button key={t.id} onClick={() => setActiveTab(t.id)} className="px-4 py-2 text-sm rounded-lg transition-colors"
                    style={{ background: activeTab === t.id ? `${color}30` : theme.cardBg, border: `1px solid ${activeTab === t.id ? color : theme.cardBorder}`, color: activeTab === t.id ? color : theme.text }}>
                    {t.icon} {t.label}
                  </button>
                ))}
              </div>
              <div className="space-y-4">
                {activeTab === 'social' && promoData.social && (
                  <div className="space-y-4">
                    {['linkedin', 'twitter', 'instagram'].map((platform) => (
                      <div key={platform}>
                        <h3 className="text-sm font-semibold mb-2 uppercase" style={{ color: color }}>{platform}</h3>
                        {(promoData.social[platform] || []).map((post: any, i: number) => (
                          <div key={i} className="p-4 rounded-xl mb-3 relative" style={cardStyle}>
                            <p className="text-sm mb-2" style={{ color: theme.text }}>{post.text}</p>
                            {post.hashtags && <p className="text-xs mb-2" style={{ color: theme.textMuted }}>{post.hashtags}</p>}
                            <button onClick={() => copyText(post.text + (post.hashtags ? '\n' + post.hashtags : ''), `s-${platform}-${i}`)} className="absolute top-2 right-2 px-2 py-1 text-xs rounded" style={{ background: `${color}20`, color: color }}>
                              {copiedId === `s-${platform}-${i}` ? 'Copied!' : '📋 Copy'}
                            </button>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
                {activeTab === 'communities' && promoData.communities && (
                  <div className="space-y-3">
                    {(promoData.communities || []).map((c: any, i: number) => (
                      <div key={i} className="p-4 rounded-xl relative" style={cardStyle}>
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium" style={{ color: theme.text }}>{c.platform}: {c.name}</span>
                          <span className="text-xs" style={{ color: color }}>{c.relevance}</span>
                        </div>
                        <p className="text-sm mb-2" style={{ color: theme.textMuted }}>{c.draft_post}</p>
                        <button onClick={() => copyText(c.draft_post, `c-${i}`)} className="px-2 py-1 text-xs rounded" style={{ background: `${color}20`, color: color }}>
                          {copiedId === `c-${i}` ? 'Copied!' : '📋 Copy'}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {activeTab === 'email' && promoData.emails?.emails && (
                  <div className="space-y-4">
                    {(promoData.emails.emails || []).map((e: any, i: number) => (
                      <div key={i} className="p-4 rounded-xl relative" style={cardStyle}>
                        <h3 className="font-medium mb-2" style={{ color: color }}>{e.name} (Day {e.send_day})</h3>
                        <p className="text-sm mb-1" style={{ color: theme.text }}>A: {e.subject_a}</p>
                        <p className="text-sm mb-2" style={{ color: theme.text }}>B: {e.subject_b}</p>
                        <pre className="text-xs whitespace-pre-wrap mb-2 p-2 rounded" style={{ background: 'rgba(0,0,0,0.3)', color: theme.textMuted }}>{e.body_text}</pre>
                        <button onClick={() => copyText(`${e.subject_a}\n\n${e.body_text}`, `e-${i}`)} className="px-2 py-1 text-xs rounded" style={{ background: `${color}20`, color: color }}>
                          {copiedId === `e-${i}` ? 'Copied!' : '📋 Copy'}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {activeTab === 'partners' && promoData.partners && (
                  <div className="space-y-3">
                    {(promoData.partners || []).map((p: any, i: number) => (
                      <div key={i} className="p-4 rounded-xl relative" style={cardStyle}>
                        <div className="flex justify-between mb-2">
                          <span className="font-medium" style={{ color: theme.text }}>{p.name}</span>
                          <span className="text-xs" style={{ color: color }}>{p.partnership_type}</span>
                        </div>
                        <p className="text-sm mb-2" style={{ color: theme.textMuted }}>{p.outreach_email_draft}</p>
                        <button onClick={() => copyText(p.outreach_email_draft, `p-${i}`)} className="px-2 py-1 text-xs rounded" style={{ background: `${color}20`, color: color }}>
                          {copiedId === `p-${i}` ? 'Copied!' : '📋 Copy'}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {activeTab === 'seo' && promoData.seo && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl" style={cardStyle}>
                      <h3 className="font-medium mb-2" style={{ color: color }}>Meta</h3>
                      <p className="text-sm mb-1" style={{ color: theme.text }}>{promoData.seo.meta_title}</p>
                      <p className="text-sm mb-2" style={{ color: theme.textMuted }}>{promoData.seo.meta_description}</p>
                      <button onClick={() => copyText(promoData.seo.meta_title + '\n' + promoData.seo.meta_description, 'seo-meta')} className="px-2 py-1 text-xs rounded" style={{ background: `${color}20`, color: color }}>
                        {copiedId === 'seo-meta' ? 'Copied!' : '📋 Copy'}
                      </button>
                    </div>
                    <div className="p-4 rounded-xl" style={cardStyle}>
                      <h3 className="font-medium mb-2" style={{ color: color }}>Schema.org JSON-LD</h3>
                      <pre className="text-xs overflow-x-auto p-2 rounded mb-2" style={{ background: 'rgba(0,0,0,0.3)', color: theme.textMuted }}>{JSON.stringify(promoData.seo.schema_json || {}, null, 2)}</pre>
                      <button onClick={() => copyText(JSON.stringify(promoData.seo.schema_json || {}, null, 2), 'seo-schema')} className="px-2 py-1 text-xs rounded" style={{ background: `${color}20`, color: color }}>
                        {copiedId === 'seo-schema' ? 'Copied!' : '📋 Copy'}
                      </button>
                    </div>
                    <div className="p-4 rounded-xl" style={cardStyle}>
                      <h3 className="font-medium mb-2" style={{ color: color }}>Blog outlines</h3>
                      {(promoData.seo.blog_outlines || []).map((b: any, i: number) => (
                        <p key={i} className="text-sm mb-1" style={{ color: theme.text }}>• {b.title}</p>
                      ))}
                    </div>
                  </div>
                )}
                {activeTab === 'ads' && promoData.ads && (
                  <div className="space-y-4">
                    {['meta', 'google', 'linkedin'].map((platform) => (
                      <div key={platform}>
                        <h3 className="text-sm font-semibold mb-2 uppercase" style={{ color: color }}>{platform}</h3>
                        {(promoData.ads[platform] || []).map((ad: any, i: number) => (
                          <div key={`${platform}-${i}`} className="p-4 rounded-xl mb-3 relative" style={cardStyle}>
                            <p className="font-medium text-sm mb-1" style={{ color: theme.text }}>{ad.headline}</p>
                            <p className="text-sm mb-1" style={{ color: theme.textMuted }}>{ad.body}</p>
                            <p className="text-xs mb-2" style={{ color: theme.textMuted }}>Audience: {ad.audience_targeting} · Budget: {ad.suggested_daily_budget}</p>
                            <button onClick={() => copyText(`${ad.headline}\n${ad.body}`, `ad-${platform}-${i}`)} className="px-2 py-1 text-xs rounded" style={{ background: `${color}20`, color: color }}>
                              {copiedId === `ad-${platform}-${i}` ? 'Copied!' : '📋 Copy'}
                            </button>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
