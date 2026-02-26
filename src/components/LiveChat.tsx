'use client';

import { useState, useRef, useEffect } from 'react';

const QUICK_REPLIES = [
  'How does event generation work?',
  'What\'s the pricing?',
  'Tell me about the affiliate program',
  'Careers at Launchpad?',
  'GDPR / privacy?',
];

const BOT_RESPONSES: Record<string, string> = {
  'how does event generation work?': 'You enter topic, city, date, capacity, budget, and vibe. Our 5-agent AI swarm generates speakers, venue, schedule, pricing, and branding in under 60 seconds. Try it at /create!',
  'what\'s the pricing?': 'We have Free (1 event), Pro ($29/mo, unlimited), and Enterprise (custom). Early bird: free until March 28. See /pricing for details.',
  'tell me about the affiliate program': 'Earn 40% recurring on every Pro subscription you refer. Influencers, podcasters, event creators — apply at /affiliate.',
  'careers at launchpad?': 'We\'re hiring! Founding roles at Wintercircus Ghent. Check /careers for open positions: Software Engineer, AI/ML Engineer, Growth Marketing, Product Designer, DevOps.',
  'gdpr / privacy?': 'We\'re GDPR compliant and EU AI Act ready. EU data residency (Frankfurt), no data selling, one-click erasure. See our privacy section on the landing page.',
};

function getBotResponse(input: string): string {
  const lower = input.toLowerCase().trim();
  for (const [key, response] of Object.entries(BOT_RESPONSES)) {
    if (lower.includes(key) || key.includes(lower)) return response;
  }
  if (lower.includes('event') || lower.includes('generate')) return BOT_RESPONSES['how does event generation work?'];
  if (lower.includes('price') || lower.includes('cost')) return BOT_RESPONSES['what\'s the pricing?'];
  if (lower.includes('affiliate') || lower.includes('refer')) return BOT_RESPONSES['tell me about the affiliate program'];
  if (lower.includes('career') || lower.includes('job') || lower.includes('hiring')) return BOT_RESPONSES['careers at launchpad?'];
  if (lower.includes('gdpr') || lower.includes('privacy') || lower.includes('data')) return BOT_RESPONSES['gdpr / privacy?'];
  return 'Thanks for your message! I can help with: event generation, pricing, the affiliate program, careers, or GDPR/privacy. Try asking about one of those.';
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export function LiveChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  useEffect(() => {
    if (open) setUnread(0);
  }, [open]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: `${Date.now()}-u`, text: text.trim(), sender: 'user', timestamp: new Date() };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      const botText = getBotResponse(text);
      const botMsg: Message = { id: `${Date.now()}-b`, text: botText, sender: 'bot', timestamp: new Date() };
      setMessages((m) => [...m, botMsg]);
      setTyping(false);
      if (!open) setUnread((u) => u + 1);
    }, 800 + Math.random() * 400);
  };

  const handleQuickReply = (text: string) => {
    sendMessage(text);
  };

  return (
    <>
      {/* Chat bubble */}
      <button
        onClick={() => { setOpen(!open); if (!open) inputRef.current?.focus(); }}
        className="fixed bottom-6 right-6 z-[9998] w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-105"
        style={{ background: 'var(--color-accent)', color: 'var(--color-bg)', boxShadow: '0 0 20px rgba(79,255,223,0.4)' }}
        aria-label="Open chat"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-xs font-bold" style={{ background: '#EF4444', color: 'white' }}>
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {/* Chat window */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-[9998] w-[380px] max-w-[calc(100vw-3rem)] rounded-2xl overflow-hidden flex flex-col shadow-2xl"
          style={{ background: 'rgba(10,10,10,0.98)', border: '1px solid rgba(79,255,223,0.2)', boxShadow: '0 0 40px rgba(79,255,223,0.2)', height: 480 }}
        >
          <div className="px-4 py-3 flex items-center justify-between" style={{ background: 'rgba(79,255,223,0.1)', borderBottom: '1px solid rgba(79,255,223,0.2)' }}>
            <span className="font-semibold" style={{ color: 'var(--color-accent)' }}>Launchpad AI</span>
            <button onClick={() => setOpen(false)} className="text-sm" style={{ color: 'var(--color-text-muted)' }}>✕</button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ background: 'rgba(10,10,10,0.5)' }}>
            {messages.length === 0 && (
              <div className="text-sm mb-4" style={{ color: 'var(--color-text-muted)' }}>
                Hi! I can help with event generation, pricing, affiliate program, careers, or GDPR. Ask anything.
              </div>
            )}
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className="max-w-[85%] rounded-xl px-4 py-2 text-sm"
                  style={{
                    background: m.sender === 'user' ? 'var(--color-accent)' : 'rgba(255,255,255,0.05)',
                    color: m.sender === 'user' ? 'var(--color-bg)' : 'var(--color-text)',
                    border: m.sender === 'bot' ? '1px solid rgba(255,255,255,0.08)' : 'none',
                  }}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="rounded-xl px-4 py-2 text-sm" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <span className="animate-pulse">...</span>
                </div>
              </div>
            )}
            {messages.length === 0 && (
              <div className="flex flex-wrap gap-2">
                {QUICK_REPLIES.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleQuickReply(q)}
                    className="text-xs px-3 py-2 rounded-lg transition-all hover:border-[var(--color-accent)]"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--color-text-muted)' }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <form
            onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
            className="p-4 flex gap-2"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              className="flex-1 px-4 py-2 rounded-lg text-sm outline-none"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--color-text)' }}
            />
            <button type="submit" className="px-4 py-2 rounded-lg font-medium text-sm" style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}>
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}
