import { useRef, useEffect, useState } from 'react';

const SVG_STRINGS = {
  stone: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <path d="M20,70 C10,40 40,20 60,30 C80,40 90,60 80,80 C70,95 30,95 20,70 Z" fill="#7f8c8d"/>
    <path d="M30,65 C25,45 45,35 60,40" stroke="#95a5a6" stroke-width="4" fill="none" stroke-linecap="round"/>
  </svg>`,
  branch: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <path d="M15,85 L85,15 L95,25 L25,95 Z" fill="#8b4513"/>
    <path d="M25,75 L75,25" stroke="#5c2e0b" stroke-width="4"/>
    <path d="M50,50 L30,30" stroke="#8b4513" stroke-width="8" stroke-linecap="round"/>
    <circle cx="30" cy="30" r="12" fill="#27ae60"/>
    <circle cx="70" cy="40" r="10" fill="#27ae60"/>
  </svg>`,
  seed: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <ellipse cx="50" cy="70" rx="30" ry="15" fill="#5c3a21"/>
    <circle cx="40" cy="65" r="4" fill="#f1c40f"/>
    <circle cx="55" cy="60" r="4" fill="#f1c40f"/>
    <circle cx="65" cy="70" r="4" fill="#f1c40f"/>
  </svg>`,
  growing: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <path d="M50,80 Q50,50 30,30" stroke="#2ecc71" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M50,80 Q50,60 70,40" stroke="#2ecc71" stroke-width="6" fill="none" stroke-linecap="round"/>
    <ellipse cx="30" cy="30" rx="15" ry="8" fill="#2ecc71" transform="rotate(45 30 30)"/>
    <ellipse cx="70" cy="40" rx="12" ry="6" fill="#2ecc71" transform="rotate(-45 70 40)"/>
    <path d="M50,80 L50,60" stroke="#27ae60" stroke-width="8" stroke-linecap="round"/>
  </svg>`,
  wheat: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <path d="M40,90 L40,20 M50,90 L50,15 M60,90 L60,25" stroke="#f1c40f" stroke-width="4" stroke-linecap="round"/>
    <circle cx="40" cy="20" r="6" fill="#f39c12"/><circle cx="40" cy="35" r="6" fill="#f39c12"/>
    <circle cx="50" cy="15" r="6" fill="#f39c12"/><circle cx="50" cy="30" r="6" fill="#f39c12"/>
    <circle cx="60" cy="25" r="6" fill="#f39c12"/><circle cx="60" cy="40" r="6" fill="#f39c12"/>
  </svg>`,
  tomato: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <path d="M50,90 Q40,60 50,20" stroke="#2ecc71" stroke-width="6" fill="none" stroke-linecap="round"/>
    <circle cx="35" cy="50" r="15" fill="#e74c3c"/>
    <circle cx="65" cy="40" r="12" fill="#e74c3c"/>
    <circle cx="45" cy="25" r="14" fill="#e74c3c"/>
    <path d="M35,35 L35,50 M65,28 L65,40 M45,11 L45,25" stroke="#27ae60" stroke-width="3"/>
  </svg>`,
  sunflower: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <path d="M50,90 L50,40" stroke="#2ecc71" stroke-width="8" stroke-linecap="round"/>
    <path d="M50,70 Q70,70 80,50" stroke="#2ecc71" stroke-width="6" fill="none" stroke-linecap="round"/>
    <circle cx="50" cy="35" r="25" fill="#f1c40f"/>
    <circle cx="50" cy="35" r="15" fill="#8e44ad"/>
    <circle cx="50" cy="35" r="10" fill="#2c3e50"/>
  </svg>`,
  pumpkin: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <path d="M20,80 Q50,90 80,80" stroke="#2ecc71" stroke-width="6" fill="none" stroke-linecap="round"/>
    <ellipse cx="50" cy="65" rx="35" ry="25" fill="#e67e22"/>
    <ellipse cx="50" cy="65" rx="20" ry="25" fill="#d35400"/>
    <ellipse cx="50" cy="65" rx="8" ry="25" fill="#e67e22"/>
    <path d="M50,40 Q40,25 60,20" stroke="#27ae60" stroke-width="6" fill="none" stroke-linecap="round"/>
  </svg>`,
  robot: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <rect x="15" y="10" width="70" height="20" fill="#2c3e50" rx="5"/>
    <rect x="15" y="70" width="70" height="20" fill="#2c3e50" rx="5"/>
    <circle cx="50" cy="50" r="35" fill="#3498db" stroke="#1f3a52" stroke-width="4"/>
    <path d="M 60 50 A 20 20 0 0 0 80 30 L 95 50 L 80 70 A 20 20 0 0 0 60 50 Z" fill="#f1c40f" stroke="#1f3a52" stroke-width="2"/>
  </svg>`
};

const makeSvgUri = (svgStr) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgStr)}`;

export default function GameCanvasSprite({ cols, rows, cells, robot, onCellClick }) {
	const canvasRef = useRef(null);
	const [svgs, setSvgs] = useState({});

	useEffect(() => {
		const loaded = {};
		let toLoad = Object.keys(SVG_STRINGS).length;
		for (const [key, str] of Object.entries(SVG_STRINGS)) {
			const img = new Image();
			img.onload = () => {
				loaded[key] = img;
				toLoad--;
				if (toLoad === 0) setSvgs(loaded);
			};
			img.src = makeSvgUri(str);
		}
	}, []);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext('2d');
		const W = canvas.width;
		const H = canvas.height;
		
		const cellW = Math.min(Math.floor(W / Math.max(cols, 1)), Math.floor(H / Math.max(rows, 1)));
		const cellH = cellW;
		const offsetX = Math.floor((W - cols * cellW) / 2);
		const offsetY = Math.floor((H - rows * cellH) / 2);

		ctx.clearRect(0, 0, W, H);
		ctx.imageSmoothingEnabled = true;

		const drawProceduralGround = (px, py, cx, cy, isWatered, isLocked) => {
			const normalColor = '#cda171'; 
			const wateredColor = '#6c441f'; 
			const lockedColor = '#2b332b'; 

			ctx.save();
			ctx.beginPath();
			ctx.rect(px, py, cellW, cellH);
			ctx.clip();

			ctx.fillStyle = isLocked ? lockedColor : (isWatered ? wateredColor : normalColor);
			ctx.fillRect(px, py, cellW, cellH);

			const noiseCount = isLocked ? 8 : 15;
			for (let i = 0; i < noiseCount; i++) {
				const hash = Math.abs(Math.sin(cx * 12.9898 + cy * 78.233 + i * 13.54)) * 10000;
				const rX = hash % 1;
				const rY = (hash * 10) % 1;
				const detailType = (hash * 100) % 3;
				const sizeRatio = 0.05 + ((hash * 1000) % 0.1);
				
				const w = cellW * sizeRatio;
				const h = cellH * sizeRatio;
				
				if (detailType < 1.5) {
				   ctx.fillStyle = 'rgba(0, 0, 0, 0.15)'; 
				} else if (detailType < 2.5) {
				   ctx.fillStyle = 'rgba(255, 255, 255, 0.12)'; 
				} else {
				   ctx.fillStyle = (!isLocked && !isWatered) ? 'rgba(70, 140, 50, 0.3)' : 'rgba(0,0,0,0.1)';
				}

				ctx.fillRect(px + rX * cellW, py + rY * cellH, w, h);
			}
			ctx.restore();
		};

		const drawEntity = (key, px, py) => {
			if (!svgs[key]) return;
			const p = 0.1; 
			ctx.drawImage(svgs[key], px + cellW * p, py + cellH * p, cellW * (1 - p*2), cellH * (1 - p*2));
		};

		for (let y = 0; y < rows; y++) {
			for (let x = 0; x < cols; x++) {
				const px = offsetX + x * cellW;
				const py = offsetY + y * cellH;
				
				const cell = cells[y]?.[x];
				const state = cell ? cell.state : 'LOCKED';
				
				const isWatered = (state === 'GROWING' || state === 'HARVESTABLE');
				
				if (state === 'LOCKED') {
					drawProceduralGround(px, py, x, y, false, true);
				} else {
					drawProceduralGround(px, py, x, y, isWatered, false);
					
					if (state === 'STONE') {
						drawEntity('stone', px, py);
					} else if (state === 'BRANCH') {
						drawEntity('branch', px, py);
					} else if (state === 'SEEDED') {
						drawEntity('seed', px, py);
					} else if (state === 'GROWING') {
						drawEntity('growing', px, py);
					} else if (state === 'HARVESTABLE') {
						const plantType = cell.plantType || 'wheat';
						drawEntity(plantType, px, py);
					}
				}

				ctx.strokeStyle = 'rgba(0,0,0,0.3)';
				ctx.lineWidth = 1;
				ctx.strokeRect(px, py, cellW, cellH);
			}
		}

		if (robot && svgs.robot) {
			const px = offsetX + robot.x * cellW;
			const py = offsetY + robot.y * cellH;
			
			const charW = cellW * 0.8;
			const charH = cellH * 0.8;
			const charPx = px + (cellW - charW) / 2;
			const charPy = py + (cellH - charH) / 2;
			
			const cx = charPx + charW / 2;
			const cy = charPy + charH / 2;

			ctx.save();
			ctx.translate(cx, cy);

			let angle = 0;
			if (robot.dir === 0) angle = -Math.PI / 2;      
			else if (robot.dir === 1) angle = 0;            
			else if (robot.dir === 2) angle = Math.PI / 2;  
			else if (robot.dir === 3) angle = Math.PI;      
			ctx.rotate(angle);

			ctx.drawImage(svgs.robot, -charW / 2, -charH / 2, charW, charH);

			ctx.restore();
		}
	}, [cells, cols, rows, robot, svgs]);

	const handleCanvasClick = (e) => {
		if (!onCellClick) return;
		const canvas = canvasRef.current;
		if (!canvas) return;
		const rect = canvas.getBoundingClientRect();
		const W = canvas.width;
		const H = canvas.height;

		const scaleX = canvas.width / rect.width;
		const scaleY = canvas.height / rect.height;
		const mouseX = (e.clientX - rect.left) * scaleX;
		const mouseY = (e.clientY - rect.top) * scaleY;

		const cellW = Math.min(Math.floor(W / Math.max(cols, 1)), Math.floor(H / Math.max(rows, 1)));
		const cellH = cellW;
		const offsetX = Math.floor((W - cols * cellW) / 2);
		const offsetY = Math.floor((H - rows * cellH) / 2);

		const cx = Math.floor((mouseX - offsetX) / cellW);
		const cy = Math.floor((mouseY - offsetY) / cellH);

		if (cx >= 0 && cx < cols && cy >= 0 && cy < rows) {
			onCellClick(cx, cy);
		}
	};

	return (
		<canvas
			ref={canvasRef}
			width={800}
			height={800}
			onClick={handleCanvasClick}
			style={{
				width: '100%',
				height: '100%',
				objectFit: 'contain',
				cursor: onCellClick ? 'pointer' : 'default',
				border: '2px solid var(--border-subtle)',
				borderRadius: '8px',
				backgroundColor: '#1a2a1a',
				imageRendering: 'auto',
			}}
		/>
	);
}
