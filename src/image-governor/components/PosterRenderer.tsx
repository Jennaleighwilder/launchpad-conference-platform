'use client';

import React, { useMemo } from 'react';

// ============================================================================
// IMAGE GOVERNOR — POSTER RENDERER
// ============================================================================
// The REAL designer. Assembles AI backplates with programmatic typography.
// Text is NEVER part of the AI image. All typography is HTML/CSS overlay.
// ============================================================================

interface LayoutZone {
  x: number; y: number; width: number; height: number;
}

interface LayoutTemplate {
  id: string;
  imageActiveZone: LayoutZone;
  textSafeZones: LayoutZone[];
  textAlign: 'left' | 'center' | 'right';
  requiresGradient: boolean;
  gradientDirection?: string;
  aspectRatio: string;
}

interface ColorPalette {
  primary: string; secondary: string; accent: string;
  text: string; textLight: string; background: string; overlay: string;
}

interface FontPairing {
  display: { family: string; weight: number; style: string; googleUrl: string; letterSpacing: string; textTransform: string; };
  body: { family: string; weight: number; googleUrl: string; letterSpacing: string; };
  scale: { heroTitle: number; subtitle: number; body: number; caption: number; cta: number; };
}

export interface PosterContent {
  title: string;
  subtitle?: string;
  date?: string;
  location?: string;
  ctaText?: string;
  details?: string;
}

export interface PosterRendererProps {
  imageUrl: string;
  layout: LayoutTemplate;
  palette: ColorPalette;
  fonts: FontPairing;
  content: PosterContent;
  width?: number;
  className?: string;
}

function buildGradient(layout: LayoutTemplate, palette: ColorPalette): string {
  if (!layout.requiresGradient) return 'none';
  const o = palette.overlay;
  switch (layout.gradientDirection) {
    case 'to bottom': return `linear-gradient(to bottom, transparent 0%, transparent 40%, ${o} 75%, ${o} 100%)`;
    case 'to top':    return `linear-gradient(to top, transparent 0%, transparent 30%, ${o} 70%, ${o} 100%)`;
    case 'radial':    return `radial-gradient(ellipse at center, ${o} 0%, transparent 70%)`;
    default:          return `linear-gradient(to bottom, transparent 0%, ${o} 100%)`;
  }
}

const PosterRenderer: React.FC<PosterRendererProps> = ({
  imageUrl, layout, palette, fonts, content, width = 800, className = '',
}) => {
  const [w, h] = layout.aspectRatio.split(':').map(Number);
  const height = Math.round(width * (h / w));
  const gradient = useMemo(() => buildGradient(layout, palette), [layout, palette]);
  const textColor = layout.requiresGradient ? palette.textLight : palette.text;
  const sf = width / 800;
  const sc = {
    heroTitle: Math.round(fonts.scale.heroTitle * sf),
    subtitle: Math.round(fonts.scale.subtitle * sf),
    body: Math.round(fonts.scale.body * sf),
    cta: Math.round(fonts.scale.cta * sf),
  };

  return (
    <>
      <link href={fonts.display.googleUrl} rel="stylesheet" />
      <link href={fonts.body.googleUrl} rel="stylesheet" />
      <div className={className} style={{ position: 'relative', width, height, overflow: 'hidden', borderRadius: 8, backgroundColor: palette.background }}>
        {/* LAYER 1: Backplate image */}
        <div style={{
          position: 'absolute',
          top: `${layout.imageActiveZone.y}%`, left: `${layout.imageActiveZone.x}%`,
          width: `${layout.imageActiveZone.width}%`, height: `${layout.imageActiveZone.height}%`,
          backgroundImage: `url(${imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center',
        }} />
        {/* LAYER 2: Gradient safety overlay */}
        {layout.requiresGradient && (
          <div style={{ position: 'absolute', inset: 0, background: gradient, pointerEvents: 'none' }} />
        )}
        {/* LAYER 3: Typography overlays in safe zones */}
        {layout.textSafeZones.map((zone, i) => (
          <div key={i} style={{
            position: 'absolute', top: `${zone.y}%`, left: `${zone.x}%`,
            width: `${zone.width}%`, height: `${zone.height}%`,
            display: 'flex', flexDirection: 'column',
            justifyContent: i === 0 ? 'flex-end' : 'flex-start',
            textAlign: layout.textAlign as React.CSSProperties['textAlign'], padding: `${2 * sf}%`, boxSizing: 'border-box',
          }}>
            {i === 0 && (<>
              <h1 style={{
                fontFamily: `'${fonts.display.family}', serif`, fontWeight: fonts.display.weight,
                fontSize: sc.heroTitle, letterSpacing: fonts.display.letterSpacing,
                textTransform: fonts.display.textTransform as React.CSSProperties['textTransform'], color: textColor,
                margin: 0, lineHeight: 1.05,
                textShadow: layout.requiresGradient ? '0 2px 20px rgba(0,0,0,0.5)' : 'none',
              }}>{content.title}</h1>
              {content.subtitle && (
                <p style={{ fontFamily: `'${fonts.body.family}', sans-serif`, fontSize: sc.subtitle,
                  color: textColor, margin: `${8*sf}px 0 0`, opacity: 0.85 }}>{content.subtitle}</p>
              )}
              {(content.date || content.location) && (
                <p style={{ fontFamily: `'${fonts.body.family}', sans-serif`, fontWeight: 600,
                  fontSize: sc.body, color: palette.accent, margin: `${12*sf}px 0 0` }}>
                  {[content.date, content.location].filter(Boolean).join(' · ')}
                </p>
              )}
            </>)}
            {i === 1 && (<>
              {content.details && (
                <p style={{ fontFamily: `'${fonts.body.family}', sans-serif`, fontSize: sc.body,
                  color: textColor, margin: 0, opacity: 0.8 }}>{content.details}</p>
              )}
              {content.ctaText && (
                <span style={{ fontFamily: `'${fonts.body.family}', sans-serif`, fontWeight: 600,
                  fontSize: sc.cta, color: palette.background, backgroundColor: palette.accent,
                  padding: `${8*sf}px ${24*sf}px`, borderRadius: 4, display: 'inline-block',
                  marginTop: 12*sf }}>{content.ctaText}</span>
              )}
            </>)}
          </div>
        ))}
      </div>
    </>
  );
};

export default PosterRenderer;
