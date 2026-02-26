'use client';

import Link from 'next/link';

/** Renders markdown-like content: ## headings, **bold**, [links](url), `code` */
export function BlogContent({ content }: { content: string }) {
  const blocks = content.split(/\n\n+/);

  return (
    <div className="prose prose-invert max-w-none" style={{ color: 'var(--color-text)' }}>
      {blocks.map((block, i) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // ## Heading
        if (trimmed.startsWith('## ')) {
          return (
            <h2 key={i} className="text-2xl font-semibold mt-10 mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              {parseInline(trimmed.slice(3))}
            </h2>
          );
        }

        // ### Subheading
        if (trimmed.startsWith('### ')) {
          return (
            <h3 key={i} className="text-xl font-semibold mt-8 mb-3" style={{ fontFamily: 'var(--font-display)' }}>
              {parseInline(trimmed.slice(4))}
            </h3>
          );
        }

        // Bullet list
        if (trimmed.startsWith('- ') || trimmed.match(/^- /m)) {
          const items = trimmed.split(/\n(?=- )/).map((line) => line.replace(/^- /, '').trim());
          return (
            <ul key={i} className="list-disc list-inside mb-4 space-y-2" style={{ color: 'var(--color-text-muted)' }}>
              {items.map((item, j) => (
                <li key={j}>{parseInline(item)}</li>
              ))}
            </ul>
          );
        }

        return (
          <p key={i} className="mb-4 leading-relaxed">
            {parseInline(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

function parseInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    const linkMatch = remaining.match(/^\[([^\]]+)\]\(([^)]+)\)/);
    if (linkMatch) {
      const [, linkText, url] = linkMatch;
      if (url.startsWith('/') || url.startsWith('#')) {
        parts.push(<Link key={key++} href={url} className="underline hover:no-underline" style={{ color: 'var(--color-accent)' }}>{linkText}</Link>);
      } else {
        parts.push(<a key={key++} href={url} target="_blank" rel="noopener noreferrer" className="underline hover:no-underline" style={{ color: 'var(--color-accent)' }}>{linkText} ↗</a>);
      }
      remaining = remaining.slice(linkMatch[0].length);
      continue;
    }

    const boldMatch = remaining.match(/^\*\*([^*]+)\*\*/);
    if (boldMatch) {
      parts.push(<strong key={key++}>{parseInline(boldMatch[1])}</strong>);
      remaining = remaining.slice(boldMatch[0].length);
      continue;
    }

    const codeMatch = remaining.match(/^`([^`]+)`/);
    if (codeMatch) {
      parts.push(<code key={key++} className="px-1.5 py-0.5 rounded text-sm" style={{ background: 'rgba(255,255,255,0.08)', fontFamily: 'var(--font-mono)' }}>{codeMatch[1]}</code>);
      remaining = remaining.slice(codeMatch[0].length);
      continue;
    }

    const nextSpecial = remaining.search(/\[|\*\*|`/);
    if (nextSpecial === -1) {
      parts.push(remaining);
      break;
    }
    if (nextSpecial > 0) {
      parts.push(remaining.slice(0, nextSpecial));
      remaining = remaining.slice(nextSpecial);
    } else {
      parts.push(remaining[0]);
      remaining = remaining.slice(1);
    }
  }

  return parts.length === 1 ? parts[0] : <>{parts}</>;
}
