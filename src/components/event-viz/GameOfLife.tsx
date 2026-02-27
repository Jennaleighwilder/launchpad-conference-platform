'use client';

import { useRef, useEffect, useState } from 'react';

/** Conway's Game of Life — museum-style interactive exhibit */
export function GameOfLife({
  width = 80,
  height = 60,
  cellSize = 8,
  color = '#A78BFA',
  speed = 80,
}: {
  width?: number;
  height?: number;
  cellSize?: number;
  color?: string;
  speed?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gridRef = useRef<number[][]>([]);
  const [playing, setPlaying] = useState(true);

  const initRandom = (g: number[][], density = 0.25) => {
    for (let y = 0; y < height; y++)
      for (let x = 0; x < width; x++) g[y][x] = Math.random() < density ? 1 : 0;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (gridRef.current.length === 0) {
      gridRef.current = Array(height)
        .fill(0)
        .map(() => Array(width).fill(0));
      initRandom(gridRef.current, 0.2);
    }

    const countNeighbors = (x: number, y: number): number => {
      let c = 0;
      for (let dy = -1; dy <= 1; dy++)
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          const nx = (x + dx + width) % width;
          const ny = (y + dy + height) % height;
          c += gridRef.current[ny][nx];
        }
      return c;
    };

    let interval: ReturnType<typeof setInterval>;
    if (playing) {
      interval = setInterval(() => {
        const next = gridRef.current.map((r) => [...r]);
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const n = countNeighbors(x, y);
            const alive = gridRef.current[y][x];
            if (alive && (n < 2 || n > 3)) next[y][x] = 0;
            else if (!alive && n === 3) next[y][x] = 1;
          }
        }
        gridRef.current = next;
      }, speed);
    }

    const draw = () => {
      canvas.width = width * cellSize;
      canvas.height = height * cellSize;
      ctx.fillStyle = 'rgba(10,10,10,0.95)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const grid = gridRef.current;
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          if (grid[y][x]) {
            ctx.fillStyle = color;
            ctx.shadowColor = color;
            ctx.shadowBlur = 4;
            ctx.fillRect(x * cellSize, y * cellSize, cellSize - 1, cellSize - 1);
            ctx.shadowBlur = 0;
          }
        }
      }
    };

    let rafId: number;
    const loop = () => {
      draw();
      rafId = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(rafId);
      if (playing) clearInterval(interval);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps -- initRandom is stable
  }, [width, height, cellSize, color, speed, playing]);

  return (
    <div className="relative">
      <canvas ref={canvasRef} className="rounded-lg block" style={{ imageRendering: 'pixelated' }} />
      <button
        onClick={() => setPlaying((p) => !p)}
        className="absolute bottom-2 right-2 px-3 py-1 rounded text-xs font-mono"
        style={{ background: 'rgba(0,0,0,0.6)', color, border: `1px solid ${color}60` }}
      >
        {playing ? '⏸ Pause' : '▶ Play'}
      </button>
    </div>
  );
}
