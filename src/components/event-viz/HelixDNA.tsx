'use client';

import { useRef, useEffect } from 'react';

export function HelixDNA({ color = '#D4AF37' }: { color?: string }) {
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
    const radius = Math.min(W, H) * 0.25;
    const strandCount = 2;
    let t = 0;

    const animate = () => {
      ctx.fillStyle = 'rgba(10,10,10,0.08)';
      ctx.fillRect(0, 0, W, H);

      for (let s = 0; s < strandCount; s++) {
        const phase = s * Math.PI;
        ctx.beginPath();
        for (let i = 0; i <= 60; i++) {
          const angle = (i / 60) * Math.PI * 4 + t * 0.02;
          const x = cx + Math.cos(angle + phase) * radius;
          const y = cy + (i / 60) * H * 0.6 - H * 0.3 + Math.sin(angle + phase) * radius * 0.3;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = color;
        ctx.globalAlpha = 0.4 + s * 0.3;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      for (let i = 0; i <= 12; i++) {
        const angle = (i / 12) * Math.PI * 4 + t * 0.02;
        const x1 = cx + Math.cos(angle) * radius;
        const y1 = cy + (i / 12) * H * 0.6 - H * 0.3 + Math.sin(angle) * radius * 0.3;
        const x2 = cx + Math.cos(angle + Math.PI) * radius;
        const y2 = cy + (i / 12) * H * 0.6 - H * 0.3 + Math.sin(angle + Math.PI) * radius * 0.3;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = color;
        ctx.globalAlpha = 0.5;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
      t++;
      requestAnimationFrame(animate);
    };
    animate();
  }, [color]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ opacity: 0.5 }} />;
}
