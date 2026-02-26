'use client';

import { useRef, useEffect } from 'react';

export function RadarSweep({ primary = '#1E3A8A', secondary = '#DC2626' }: { primary?: string; secondary?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = (canvas.width = canvas.offsetWidth);
    const H = (canvas.height = canvas.offsetHeight);
    const cx = W / 2;
    const cy = H / 2;
    const maxR = Math.min(W, H) * 0.45;
    const blips = Array.from({ length: 12 }, () => ({
      angle: Math.random() * Math.PI * 2,
      r: Math.random() * maxR * 0.8,
      size: 2 + Math.random() * 3,
    }));
    let sweepAngle = 0;

    const animate = () => {
      ctx.fillStyle = 'rgba(10,10,10,0.06)';
      ctx.fillRect(0, 0, W, H);

      for (let r = 1; r <= 4; r++) {
        ctx.beginPath();
        ctx.arc(cx, cy, (maxR * r) / 4, 0, Math.PI * 2);
        ctx.strokeStyle = primary;
        ctx.globalAlpha = 0.15;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(a) * maxR, cy + Math.sin(a) * maxR);
        ctx.strokeStyle = primary;
        ctx.globalAlpha = 0.1;
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(sweepAngle) * maxR, cy + Math.sin(sweepAngle) * maxR);
      ctx.strokeStyle = secondary;
      ctx.globalAlpha = 0.8;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.shadowColor = secondary;
      ctx.shadowBlur = 12;
      ctx.stroke();
      ctx.shadowBlur = 0;
      sweepAngle += 0.015;

      blips.forEach((b) => {
        const x = cx + Math.cos(b.angle) * b.r;
        const y = cy + Math.sin(b.angle) * b.r;
        ctx.beginPath();
        ctx.arc(x, y, b.size, 0, Math.PI * 2);
        ctx.fillStyle = secondary;
        ctx.globalAlpha = 0.6 + Math.sin(Date.now() * 0.003 + b.angle) * 0.3;
        ctx.fill();
        ctx.shadowColor = secondary;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      ctx.globalAlpha = 1;
      requestAnimationFrame(animate);
    };
    animate();
  }, [primary, secondary]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ opacity: 0.7 }} />;
}
