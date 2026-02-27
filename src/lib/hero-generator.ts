/**
 * Free hero image generation — no API keys required.
 * - Pollinations.ai: custom prompts, real AI-generated images
 * - CSS gradients: abstract/minimal styles, zero cost
 */

/** Pollinations.ai — free AI image generation, no API key */
export function getPollinationsUrl(prompt: string, width = 1920, height = 1080): string {
  const encoded = encodeURIComponent(prompt);
  return `https://image.pollinations.ai/prompt/${encoded}?width=${width}&height=${height}&nologo=true`;
}

function hashSlug(slug: string): number {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash = ((hash << 5) - hash) + slug.charCodeAt(i);
  return Math.abs(hash);
}

/** CSS gradient background — unique per event, zero cost */
export function generateHeroCSS(style: string, slug: string): string {
  const hash = hashSlug(slug);
  const hue1 = hash % 360;
  const hue2 = (hue1 + 40 + (hash % 60)) % 360;
  const hue3 = (hue1 + 180 + (hash % 30)) % 360;

  const palettes: Record<string, () => string> = {
    tech: () =>
      `linear-gradient(135deg, hsl(${hue1}, 80%, 8%) 0%, hsl(${hue2}, 70%, 15%) 50%, hsl(${hue3}, 60%, 5%) 100%)`,
    nature: () =>
      `linear-gradient(160deg, hsl(${120 + (hash % 40)}, 50%, 12%) 0%, hsl(${140 + (hash % 30)}, 40%, 20%) 50%, hsl(${100 + (hash % 30)}, 30%, 8%) 100%)`,
    urban: () =>
      `linear-gradient(145deg, hsl(${210 + (hash % 30)}, 20%, 10%) 0%, hsl(${220 + (hash % 20)}, 30%, 18%) 50%, hsl(${200 + (hash % 20)}, 15%, 6%) 100%)`,
    abstract: () =>
      `linear-gradient(${hash % 360}deg, hsl(${hue1}, 90%, 15%) 0%, hsl(${hue2}, 85%, 25%) 40%, hsl(${hue3}, 80%, 10%) 100%)`,
    conference: () =>
      `linear-gradient(180deg, hsl(${200 + (hash % 40)}, 30%, 8%) 0%, hsl(${220 + (hash % 20)}, 40%, 15%) 100%)`,
  };
  const generator = palettes[style] || palettes.abstract;
  return generator();
}

/** SVG pattern overlay for visual interest */
export function generateHeroSVG(slug: string): string {
  const hash = hashSlug(slug);
  const patterns = [
    '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><circle cx="20" cy="20" r="1" fill="rgba(255,255,255,0.05)"/></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><line x1="0" y1="40" x2="40" y2="0" stroke="rgba(255,255,255,0.03)" stroke-width="1"/></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" width="60" height="52"><polygon points="30,2 56,15 56,37 30,50 4,37 4,15" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1"/></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><path d="M20,0v40M0,20h40" stroke="rgba(255,255,255,0.02)" stroke-width="1"/></svg>',
  ];
  return patterns[hash % patterns.length];
}
