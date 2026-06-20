import { useRef, useEffect, useState, useCallback } from 'react';

const ASSETS = {
	tilemap: '/assets/Tiny Wonder Farm Free/tilemaps/spring farm tilemap.png',
	plants: '/assets/Tiny Wonder Farm Free/objects&items/plants free.png',
	character:
		'/assets/Tiny Wonder Farm Free/characters/main character/walk and idle.png',
	objects:
		'/assets/Tiny Wonder Farm Free/objects&items/farm objects free.png',
};

function useGameAssets() {
	const [loaded, setLoaded] = useState(false);
	const imagesRef = useRef({});

	useEffect(() => {
		let loadedCount = 0;
		const total = Object.keys(ASSETS).length;

		for (const [key, src] of Object.entries(ASSETS)) {
			const img = new Image();
			img.src = src;
			img.onload = () => {
				imagesRef.current[key] = img;
				loadedCount++;
				if (loadedCount === total) {
					setLoaded(true);
				}
			};
			img.onerror = () => {
				console.error(`Failed to load image: ${src}`);
				loadedCount++;
				if (loadedCount === total) {
					setLoaded(true);
				}
			};
		}
	}, []);

	return { loaded, images: imagesRef.current };
}

export default function GameCanvasSprite({
	cols,
	rows,
	cells,
	robot,
	onCellClick,
}) {
	const canvasRef = useRef(null);
	const { loaded, images } = useGameAssets();

	const draw = useCallback(() => {
		const canvas = canvasRef.current;
		if (!canvas || !loaded) return;
		const ctx = canvas.getContext('2d');
		const W = canvas.width;
		const H = canvas.height;

		const cellW = Math.min(Math.floor(W / cols), Math.floor(H / rows));
		const cellH = cellW;
		const offsetX = Math.floor((W - cols * cellW) / 2);
		const offsetY = Math.floor((H - rows * cellH) / 2);

		ctx.clearRect(0, 0, W, H);
		ctx.imageSmoothingEnabled = false;

		// Procedural ground function
		const drawProceduralGround = (px, py, cx, cy, isWatered, isLocked) => {
			// Base dirt colors
			const normalColor = '#cda171'; // Slightly warmer dry dirt
			const wateredColor = '#6c441f'; // Rich dark wet soil
			const lockedColor = '#2b332b'; // Darker for locked

			ctx.save(); // Save context before clipping

			// Define cell path for clipping so no procedural details spill out of bounds
			ctx.beginPath();
			ctx.rect(px, py, cellW, cellH);
			ctx.clip();

			// Fill base color
			ctx.fillStyle = isLocked
				? lockedColor
				: isWatered
					? wateredColor
					: normalColor;
			ctx.fillRect(px, py, cellW, cellH);

			// Procedural detail pass (pebbles, dirt clumps, tiny weeds)
			// We use a pseudo-random hash based on coordinates to keep it static
			const noiseCount = isLocked ? 8 : 15; // More details on unlocked land

			for (let i = 0; i < noiseCount; i++) {
				const hash =
					Math.abs(Math.sin(cx * 12.9898 + cy * 78.233 + i * 13.54)) *
					10000;
				const rX = hash % 1;
				const rY = (hash * 10) % 1;
				const detailType = (hash * 100) % 3; // 0: dark clump, 1: light pebble, 2: green weed
				const sizeRatio = 0.05 + ((hash * 1000) % 0.1); // Small details between 5% and 15% of cell width

				const w = cellW * sizeRatio;
				const h = cellH * sizeRatio;

				// Colors
				if (detailType < 1.5) {
					ctx.fillStyle = 'rgba(0, 0, 0, 0.15)'; // Dark dirt clump
				} else if (detailType < 2.5) {
					ctx.fillStyle = 'rgba(255, 255, 255, 0.12)'; // Light pebble / sand
				} else {
					// Tiny green weed/moss (only on unlocked dry soil, not locked)
					ctx.fillStyle =
						!isLocked && !isWatered
							? 'rgba(70, 140, 50, 0.3)'
							: 'rgba(0,0,0,0.1)';
				}

				ctx.fillRect(px + rX * cellW, py + rY * cellH, w, h);
			}

			ctx.restore(); // Remove clipping mask
		};

		const drawPlant = (row, px, py) => {
			if (!images.plants) return;
			const tileSize = 16;
			const tx = 0;
			const ty = row * tileSize;
			ctx.drawImage(
				images.plants,
				tx,
				ty,
				tileSize,
				tileSize,
				px,
				py,
				cellW,
				cellH,
			);
		};

		const drawObject = (tx, ty, tw, th, px, py) => {
			if (!images.objects) return;
			ctx.drawImage(images.objects, tx, ty, tw, th, px, py, cellW, cellH);
		};

		for (let y = 0; y < rows; y++) {
			for (let x = 0; x < cols; x++) {
				const px = offsetX + x * cellW;
				const py = offsetY + y * cellH;

				const cell = cells[y]?.[x];
				const state = cell ? cell.state : 'LOCKED';

				const isWatered =
					state === 'GROWING' || state === 'HARVESTABLE';

				if (state === 'LOCKED') {
					drawProceduralGround(px, py, x, y, false, true);
				} else {
					// Draw procedural ground behind everything
					drawProceduralGround(px, py, x, y, isWatered, false);

					if (state === 'STONE') {
						drawObject(0, 48, 16, 16, px, py);
					} else if (state === 'BRANCH') {
						drawObject(16, 48, 16, 16, px, py);
					} else if (state === 'SEEDED') {
						drawPlant(0, px, py);
					} else if (state === 'GROWING') {
						drawPlant(2, px, py);
					} else if (state === 'HARVESTABLE') {
						drawPlant(3, px, py);
					}
				}

				ctx.strokeStyle = 'rgba(0,0,0,0.3)';
				ctx.lineWidth = 1;
				ctx.strokeRect(px, py, cellW, cellH);
			}
		}

		// Draw robot
		if (robot) {
			const px = offsetX + robot.x * cellW;
			const py = offsetY + robot.y * cellH;
			
			const charW = cellW * 0.7;
			const charH = cellH * 0.7;
			const charPx = px + (cellW - charW) / 2;
			const charPy = py + (cellH - charH) / 2;
			
			const cx = charPx + charW / 2;
			const cy = charPy + charH / 2;
			const r = Math.min(charW, charH) * 0.45;

			ctx.save();
			ctx.translate(cx, cy);

			// Rotate canvas based on direction
			// 0=N (Up), 1=E (Right), 2=S (Down), 3=W (Left)
			let angle = 0;
			if (robot.dir === 0) angle = -Math.PI / 2;      // Up
			else if (robot.dir === 1) angle = 0;            // Right
			else if (robot.dir === 2) angle = Math.PI / 2;  // Down
			else if (robot.dir === 3) angle = Math.PI;      // Left
			ctx.rotate(angle);

			// Draw Treads (Wheels)
			ctx.fillStyle = '#2c3e50';
			ctx.fillRect(-r * 0.7, -r * 1.1, r * 1.4, r * 0.5);
			ctx.fillRect(-r * 0.7, r * 0.6, r * 1.4, r * 0.5);

			// Draw Main Body (Dome)
			ctx.beginPath();
			ctx.arc(0, 0, r, 0, Math.PI * 2);
			ctx.fillStyle = '#3498db'; // Robot Blue
			ctx.fill();
			ctx.strokeStyle = '#1f3a52';
			ctx.lineWidth = 2;
			ctx.stroke();

			// Draw Visor (Shows direction)
			ctx.beginPath();
			ctx.arc(r * 0.2, 0, r * 0.6, -Math.PI/2.2, Math.PI/2.2);
			ctx.lineTo(r * 0.9, 0);
			ctx.closePath();
			ctx.fillStyle = '#f1c40f'; // Glowing Yellow Eye
			ctx.fill();
			ctx.stroke();

			ctx.restore();
		}
	}, [cells, cols, rows, loaded, images, robot]);

	useEffect(() => {
		draw();
	}, [draw]);

	const handleCanvasClick = (e) => {
		if (!onCellClick) return;
		const canvas = canvasRef.current;
		if (!canvas) return;
		const rect = canvas.getBoundingClientRect();
		const W = canvas.width;
		const H = canvas.height;

		const scaleX = canvas.width / rect.width;
		const scaleY = canvas.height / rect.height;

		const clickX = (e.clientX - rect.left) * scaleX;
		const clickY = (e.clientY - rect.top) * scaleY;

		const cellW = Math.min(Math.floor(W / cols), Math.floor(H / rows));
		const cellH = cellW;
		const offsetX = Math.floor((W - cols * cellW) / 2);
		const offsetY = Math.floor((H - rows * cellH) / 2);

		const x = Math.floor((clickX - offsetX) / cellW);
		const y = Math.floor((clickY - offsetY) / cellH);

		if (x >= 0 && x < cols && y >= 0 && y < rows) {
			onCellClick(x, y);
		}
	};

	return (
		<canvas
			ref={canvasRef}
			width={600}
			height={600}
			onClick={handleCanvasClick}
			style={{
				width: '100%',
				maxWidth: '600px',
				aspectRatio: '1/1',
				display: 'block',
				margin: '0 auto',
				imageRendering: 'pixelated',
				cursor: onCellClick ? 'pointer' : 'default',
				border: '2px solid var(--border-subtle)',
				borderRadius: '8px',
				backgroundColor: '#1a2a1a',
			}}
		/>
	);
}
