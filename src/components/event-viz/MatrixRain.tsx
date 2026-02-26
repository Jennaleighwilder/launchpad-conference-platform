'use client';

import { useRef, useEffect } from 'react';

const KATAKANA = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789';

export function MatrixRain({ color = '#EC4899' }: { color?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = (canvas.width = canvas.offsetWidth);
    const H = (canvas.height = canvas.offsetHeight);
    const fontSize = 14;
    const cols = Math.floor(W / fontSize);
    const drops: number[] = Array(cols).fill(1);

    const draw = () => {
      ctx.fillStyle = 'rgba(10,10,10,0.05)';
      ctx.fillRect(0, 0, W, H);
      ctx.font = `${fontSize}px monospace`;
      ctx.fillStyle = color;

      for (let i = 0; i < drops.length; i++) {
        const char = KATAKANA[Math.floor(Math.random() * KATAKANA.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        ctx.globalAlpha = y > H * 0.5 ? 0.3 : 0.9;
        ctx.fillText(char, x, y);
        if (y > H && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(draw);
    };
    draw();
  }, [color]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ opacity: 0.6 }} />;
}
