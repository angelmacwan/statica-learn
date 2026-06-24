import { useRef, useEffect, useMemo } from 'react';
import { CellState } from '../game/MazeEngine.js';

// Directions: 0=N,1=E,2=S,3=W — angles for robot arrow
const DIR_ANGLE = [-Math.PI / 2, 0, Math.PI / 2, Math.PI];

// Color palette
const COLORS = {
  wall: '#0f172a',
  wallLight: '#1e293b',
  floor: '#1e293b',
  floorVisited: '#0f2b1a',
  floorDiscovered: '#141c2e',
  floorHidden: '#0a0a0f',
  goal: '#22c55e',
  goalGlow: 'rgba(34,197,94,0.4)',
  robotBody: '#60a5fa',
  robotAccent: '#f59e0b',
  robotBorder: '#1e40af',
  startCell: '#7c3aed',
  gridLine: 'rgba(255,255,255,0.05)',
  fog: 'rgba(5,8,18,0.82)',
};

export default function MazeCanvas({ cols, rows, walls, robotState, goalX, goalY, fogOfWar, levelVisible }) {
  const canvasRef = useRef(null);

  // Memoize static maze paths — only recalculate when walls/size changes
  const mazeKey = useMemo(() => `${cols}x${rows}`, [cols, rows]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !walls) return;
    
    // Defensive check: Ensure walls is a valid 2D array matching cols and rows
    if (walls.length < rows) return;
    for (let y = 0; y < rows; y++) {
      if (!walls[y] || walls[y].length < cols) return;
    }

    const ctx = canvas.getContext('2d');

    const W = canvas.width;
    const H = canvas.height;
    const PADDING = 16;
    const availW = W - PADDING * 2;
    const availH = H - PADDING * 2;
    const cellSize = Math.min(Math.floor(availW / cols), Math.floor(availH / rows));
    const gridW = cellSize * cols;
    const gridH = cellSize * rows;
    const ox = Math.floor((W - gridW) / 2);
    const oy = Math.floor((H - gridH) / 2);

    ctx.clearRect(0, 0, W, H);

    // Background
    ctx.fillStyle = '#07090f';
    ctx.fillRect(0, 0, W, H);

    const fog = robotState?.fog;

    // ── Draw cells ───────────────────────────────────────────────────────────
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const px = ox + x * cellSize;
        const py = oy + y * cellSize;

        const cellFog = fog ? fog[y]?.[x] : CellState.VISITED;
        const isHidden = fogOfWar && cellFog === CellState.UNKNOWN;
        const isDiscovered = fogOfWar && cellFog === CellState.DISCOVERED;
        const isVisited = !fogOfWar || cellFog === CellState.VISITED;

        // Cell floor
        if (isHidden && !levelVisible) {
          ctx.fillStyle = COLORS.floorHidden;
        } else if (isDiscovered && fogOfWar && !levelVisible) {
          ctx.fillStyle = COLORS.floorDiscovered;
        } else {
          // Slight tint for start cell
          if (x === 0 && y === 0) {
            ctx.fillStyle = '#1a0a3a';
          } else if (x === goalX && y === goalY) {
            ctx.fillStyle = '#0a2016';
          } else {
            ctx.fillStyle = isVisited ? COLORS.floorVisited : COLORS.floor;
          }
        }
        ctx.fillRect(px, py, cellSize, cellSize);

        // Grid line subtle texture
        if (!isHidden || levelVisible) {
          ctx.strokeStyle = COLORS.gridLine;
          ctx.lineWidth = 0.5;
          ctx.strokeRect(px, py, cellSize, cellSize);
        }

        // Goal marker
        if (x === goalX && y === goalY && (isVisited || levelVisible || !fogOfWar)) {
          // Glow behind
          const grad = ctx.createRadialGradient(
            px + cellSize / 2, py + cellSize / 2, 0,
            px + cellSize / 2, py + cellSize / 2, cellSize * 0.65
          );
          grad.addColorStop(0, 'rgba(34,197,94,0.35)');
          grad.addColorStop(1, 'rgba(34,197,94,0)');
          ctx.fillStyle = grad;
          ctx.fillRect(px, py, cellSize, cellSize);

          // Flag emoji/text
          const fontSize = Math.max(10, Math.floor(cellSize * 0.45));
          ctx.font = `${fontSize}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('🏁', px + cellSize / 2, py + cellSize / 2);
        }

        // Start marker (only on level 1 style or when visited)
        if (x === 0 && y === 0 && (isVisited || levelVisible || !fogOfWar)) {
          const fontSize = Math.max(8, Math.floor(cellSize * 0.38));
          ctx.font = `${fontSize}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('🚀', px + cellSize / 2, py + cellSize / 2 - cellSize * 0.05);
        }
      }
    }

    // ── Draw walls ───────────────────────────────────────────────────────────
    const wallThick = Math.max(2, Math.floor(cellSize * 0.12));

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const px = ox + x * cellSize;
        const py = oy + y * cellSize;

        const cellFog = fog ? fog[y]?.[x] : CellState.VISITED;
        const shouldDraw = levelVisible || !fogOfWar ||
          cellFog !== CellState.UNKNOWN ||
          // also draw walls of discovered neighbors
          (fog?.[y - 1]?.[x] != null && fog[y - 1][x] !== CellState.UNKNOWN) ||
          (fog?.[y]?.[x - 1] != null && fog[y][x - 1] !== CellState.UNKNOWN);

        if (!shouldDraw) continue;

        const w = walls[y]?.[x];
        if (w === undefined) continue;
        ctx.fillStyle = COLORS.wall;

        // North wall
        if (w & 1) ctx.fillRect(px, py, cellSize, wallThick);
        // East wall
        if (w & 2) ctx.fillRect(px + cellSize - wallThick, py, wallThick, cellSize);
        // South wall
        if (w & 4) ctx.fillRect(px, py + cellSize - wallThick, cellSize, wallThick);
        // West wall
        if (w & 8) ctx.fillRect(px, py, wallThick, cellSize);
      }
    }

    // Outer border
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.strokeRect(ox, oy, gridW, gridH);

    // ── Draw fog overlay ─────────────────────────────────────────────────────
    if (fogOfWar && !levelVisible && fog) {
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          if (fog[y]?.[x] === CellState.UNKNOWN) {
            const px = ox + x * cellSize;
            const py = oy + y * cellSize;
            ctx.fillStyle = 'rgba(5,8,18,0.92)';
            ctx.fillRect(px, py, cellSize, cellSize);
          }
        }
      }
    }

    // ── Draw robot ───────────────────────────────────────────────────────────
    if (robotState) {
      const { x: rx, y: ry, dir } = robotState;
      const px = ox + rx * cellSize;
      const py = oy + ry * cellSize;
      const cx = px + cellSize / 2;
      const cy = py + cellSize / 2;
      const r = cellSize * 0.32;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(DIR_ANGLE[dir]);

      // Glow
      const glow = ctx.createRadialGradient(0, 0, r * 0.3, 0, 0, r * 1.5);
      glow.addColorStop(0, 'rgba(96,165,250,0.3)');
      glow.addColorStop(1, 'rgba(96,165,250,0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(0, 0, r * 1.5, 0, Math.PI * 2);
      ctx.fill();

      // Body circle
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fillStyle = COLORS.robotBody;
      ctx.fill();
      ctx.strokeStyle = COLORS.robotBorder;
      ctx.lineWidth = Math.max(1, cellSize * 0.04);
      ctx.stroke();

      // Direction arrow
      ctx.beginPath();
      ctx.moveTo(r * 0.15, 0);
      ctx.lineTo(r * 0.75, 0);
      ctx.strokeStyle = COLORS.robotAccent;
      ctx.lineWidth = Math.max(1.5, cellSize * 0.06);
      ctx.lineCap = 'round';
      ctx.stroke();

      // Arrowhead
      ctx.beginPath();
      ctx.moveTo(r * 0.75, 0);
      ctx.lineTo(r * 0.5, -r * 0.22);
      ctx.lineTo(r * 0.5, r * 0.22);
      ctx.closePath();
      ctx.fillStyle = COLORS.robotAccent;
      ctx.fill();

      // Eyes
      ctx.beginPath();
      ctx.arc(-r * 0.22, -r * 0.3, r * 0.12, 0, Math.PI * 2);
      ctx.arc(-r * 0.22, r * 0.3, r * 0.12, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      ctx.restore();
    }
   
  }, [robotState, walls, cols, rows, goalX, goalY, fogOfWar, levelVisible, mazeKey]);

  return (
    <canvas
      ref={canvasRef}
      width={700}
      height={700}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        borderRadius: '10px',
        backgroundColor: '#07090f',
        display: 'block',
      }}
    />
  );
}
