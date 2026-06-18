import { useRef, useEffect, useCallback } from 'react';
import { DIRECTIONS } from '../game/Robot.js';


const CELL_COLORS = {
  empty:        '#1a2a1a',
  soil:         '#5c3d1a',
  water_source: '#0d3b5e',
  seed:         '#3d6b2c',
  plant:        '#2ea84f',
  mature:       '#f5c518',
  wall:         '#2a2a2a',
  goal:         '#4b0082',
};

const CELL_BORDER = {
  empty:        '#223322',
  soil:         '#7a5530',
  water_source: '#1b5c8a',
  seed:         '#4a8a38',
  plant:        '#38c060',
  mature:       '#f5d750',
  wall:         '#444444',
  goal:         '#8a2be2',
};

const DIR_ARROW = { N: '↑', E: '→', S: '↓', W: '←' };

export default function GameCanvas({ gridSize, cells, robot, animating }) {
  const canvasRef = useRef(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    const cellW = Math.floor(W / gridSize);
    const cellH = Math.floor(H / gridSize);

    ctx.clearRect(0, 0, W, H);

    // Draw cells
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const type = cells[y]?.[x] || 'empty';
        const px = x * cellW;
        const py = y * cellH;

        // Background
        ctx.fillStyle = CELL_COLORS[type] || CELL_COLORS.empty;
        ctx.fillRect(px, py, cellW, cellH);

        // Border
        ctx.strokeStyle = CELL_BORDER[type] || '#223322';
        ctx.lineWidth = 1;
        ctx.strokeRect(px + 0.5, py + 0.5, cellW - 1, cellH - 1);

        // Cell emoji / icon
        const emoji = getCellEmoji(type);
        if (emoji) {
          ctx.font = `${Math.floor(cellW * 0.45)}px serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(emoji, px + cellW / 2, py + cellH / 2);
        }
      }
    }

    // Draw robot
    if (robot) {
      const rx = robot.x * cellW;
      const ry = robot.y * cellH;

      // Robot body glow
      ctx.shadowColor = '#4589ff';
      ctx.shadowBlur = animating ? 16 : 8;

      // Robot body
      const pad = Math.floor(cellW * 0.12);
      const bodyW = cellW - pad * 2;
      const bodyH = cellH - pad * 2;
      const radius = 6;

      ctx.fillStyle = '#1a3a6a';
      roundRect(ctx, rx + pad, ry + pad, bodyW, bodyH, radius);
      ctx.fill();

      ctx.strokeStyle = '#4589ff';
      ctx.lineWidth = 2;
      roundRect(ctx, rx + pad, ry + pad, bodyW, bodyH, radius);
      ctx.stroke();

      ctx.shadowBlur = 0;

      // Direction arrow
      const arrowDir = DIRECTIONS[robot.dir];
      ctx.fillStyle = '#7ab8ff';
      ctx.font = `bold ${Math.floor(cellW * 0.38)}px monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(DIR_ARROW[arrowDir], rx + cellW / 2, ry + cellH / 2);

      // Eyes (small circles)
      const eyeR = Math.max(2, Math.floor(cellW * 0.07));
      ctx.fillStyle = '#4589ff';
      const eyeOffsets = getEyeOffsets(arrowDir, cellW, cellH);
      for (const [ex, ey] of eyeOffsets) {
        ctx.beginPath();
        ctx.arc(rx + ex, ry + ey, eyeR, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Grid lines overlay
    ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= gridSize; x++) {
      ctx.beginPath();
      ctx.moveTo(x * cellW, 0);
      ctx.lineTo(x * cellW, H);
      ctx.stroke();
    }
    for (let y = 0; y <= gridSize; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * cellH);
      ctx.lineTo(W, y * cellH);
      ctx.stroke();
    }
  }, [cells, robot, gridSize, animating]);

  useEffect(() => { draw(); }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={400}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
        imageRendering: 'pixelated',
      }}
    />
  );
}

function getCellEmoji(type) {
  switch (type) {
    case 'soil':         return '🟫';
    case 'water_source': return '💧';
    case 'seed':         return '🌱';
    case 'plant':        return '🌿';
    case 'mature':       return '🌾';
    case 'wall':         return '🧱';
    case 'goal':         return '⭐';
    default:             return null;
  }
}

function getEyeOffsets(dir, cw, ch) {
  const cx = cw / 2, cy = ch / 2;
  const spread = cw * 0.2;
  switch (dir) {
    case 'N': return [[cx - spread, cy - ch*0.22], [cx + spread, cy - ch*0.22]];
    case 'S': return [[cx - spread, cy + ch*0.22], [cx + spread, cy + ch*0.22]];
    case 'E': return [[cx + cw*0.22, cy - spread], [cx + cw*0.22, cy + spread]];
    case 'W': return [[cx - cw*0.22, cy - spread], [cx - cw*0.22, cy + spread]];
    default:  return [];
  }
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
