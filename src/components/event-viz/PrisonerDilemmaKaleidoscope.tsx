'use client';

import { useRef, useEffect, useState } from 'react';

/** Prisoner's Dilemma on a lattice — museum-style cellular automata (inspired by Complexity Explorables) */
export function PrisonerDilemmaKaleidoscope({
  size = 64,
  cellSize = 6,
  colors = { cooperator: '#4FFFDF', defector: '#1a1a2e', flipToC: '#7dd3fc', flipToD: '#f472b6' },
  speed = 120,
}: {
  size?: number;
  cellSize?: number;
  colors?: { cooperator: string; defector: string; flipToC: string; flipToD: string };
  speed?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gridRef = useRef<number[][]>([]);
  const nextRef = useRef<number[][]>([]);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = size;
    const H = size;

    // Initialize: all cooperate except center defector (creates kaleidoscope)
    if (gridRef.current.length === 0) {
      gridRef.current = Array(H)
        .fill(0)
        .map(() => Array(W).fill(1));
      gridRef.current[Math.floor(H / 2)][Math.floor(W / 2)] = 0;
      nextRef.current = gridRef.current.map((r) => [...r]);
    }

    const T = 1.6; // temptation to defect
    const R = 1.0; // reward for mutual cooperation
    const P = 0.1; // punishment for mutual defection
    const S = 0.0; // sucker's payoff

    const getPayoff = (me: number, other: number): number => {
      if (me === 1 && other === 1) return R;
      if (me === 1 && other === 0) return S;
      if (me === 0 && other === 1) return T;
      return P;
    };

    const getNeighbors = (x: number, y: number): [number, number][] => {
      const n: [number, number][] = [];
      for (let dy = -1; dy <= 1; dy++)
        for (let dx = -1; dx <= 1; dx++) {
          const nx = (x + dx + W) % W;
          const ny = (y + dy + H) % H;
          n.push([nx, ny]);
        }
      return n;
    };

    const computePayoff = (x: number, y: number): number => {
      const grid = gridRef.current;
      let total = 0;
      const neighbors = getNeighbors(x, y);
      for (const [nx, ny] of neighbors) {
        if (nx === x && ny === y) continue;
        total += getPayoff(grid[y][x], grid[ny][nx]);
      }
      return total;
    };

    let interval: ReturnType<typeof setInterval>;
    if (playing) {
      interval = setInterval(() => {
        const grid = gridRef.current;
        const next = nextRef.current;

        for (let y = 0; y < H; y++) {
          for (let x = 0; x < W; x++) {
            const neighbors = getNeighbors(x, y);
            let bestPayoff = -1;
            let bestState = grid[y][x];
            for (const [nx, ny] of neighbors) {
              const p = computePayoff(nx, ny);
              if (p > bestPayoff) {
                bestPayoff = p;
                bestState = grid[ny][nx];
              }
            }
            next[y][x] = bestState;
          }
        }

        for (let y = 0; y < H; y++)
          for (let x = 0; x < W; x++) grid[y][x] = next[y][x];
      }, speed);
    }

    const draw = () => {
      const grid = gridRef.current;
      const cw = cellSize;
      const ch = cellSize;
      canvas.width = W * cw;
      canvas.height = H * ch;

      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const state = grid[y][x];
          const color = state === 1 ? colors.cooperator : colors.defector;
          ctx.fillStyle = color;
          ctx.fillRect(x * cw, y * ch, cw, ch);
        }
      }
    };

    const raf = () => {
      draw();
      requestAnimationFrame(raf);
    };
    raf();

    return () => {
      if (playing) clearInterval(interval);
    };
  }, [size, cellSize, colors, speed, playing]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        className="rounded-lg w-full max-w-md mx-auto block"
        style={{ imageRendering: 'pixelated' }}
      />
      <button
        onClick={() => setPlaying((p) => !p)}
        className="absolute bottom-2 right-2 px-3 py-1 rounded text-xs font-mono"
        style={{ background: 'rgba(0,0,0,0.6)', color: colors.cooperator, border: `1px solid ${colors.cooperator}40` }}
      >
        {playing ? '⏸ Pause' : '▶ Play'}
      </button>
    </div>
  );
}
