'use client';

import { useRef, useEffect } from 'react';

export function Constellation({ color = '#34D399' }: { color?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = (canvas.width = canvas.offsetWidth);
    const H = (canvas.height = canvas.offsetHeight);
    const stars = Array.from({ length: 35 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      size: 1 + Math.random() * 2,
    }));
    const links: [number, number][] = [];
    for (let i = 0; i < stars.length; i++) {
      for (let j = i + 1; j < stars.length; j++) {
        const dx = stars[j].x - stars[i].x;
        const dy = stars[j].y - stars[i].y;
        if (Math.sqrt(dx * dx + dy * dy) < 180) links.push([i, j]);
      }
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(10,10,10,0.04)';
      ctx.fillRect(0, 0, W, H);

      stars.forEach((s, i) => {
        s.x += s.vx;
        s.y += s.vy;
        if (s.x < 0 || s.x > W) s.vx *= -1;
        if (s.y < 0 || s.y > H) s.vy *= -1;
      });

      links.forEach(([a, b]) => {
        const s1 = stars[a];
        const s2 = stars[b];
        const dx = s2.x - s1.x;
        const dy = s2.y - s1.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
          ctx.beginPath();
          ctx.moveTo(s1.x, s1.y);
          ctx.lineTo(s2.x, s2.y);
          ctx.strokeStyle = color;
          ctx.globalAlpha = 0.2 * (1 - dist / 200);
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });

      stars.forEach((s) => {
        ctx.globalAlpha = 0.6 + Math.sin(Date.now() * 0.002 + s.x) * 0.3;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.shadowColor = color;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      ctx.globalAlpha = 1;
      requestAnimationFrame(animate);
    };
    animate();
  }, [color]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ opacity: 0.6 }} />;
}
