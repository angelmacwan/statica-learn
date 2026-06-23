import { useState, useEffect, useRef, useCallback } from 'react';
import Header from '../components/Header.jsx';
import GameCanvasSprite from '../components/GameCanvasSprite.jsx';
import GameCodeEditor from '../components/GameCodeEditor.jsx';
import { GameExecutor } from '../game/GameExecutor.js';

const SKULPT_CDN = 'https://skulpt.org/js/skulpt.min.js';
const SKULPT_STDLIB = 'https://skulpt.org/js/skulpt-stdlib.js';

const BOT_SPEED_COSTS = [0, 100, 500, 2500, 10000]; // Levels 1 to 5
const BOT_SPEED_ANIM = [200, 150, 100, 50, 20]; // Animation delays in ms

const PLANT_SPEED_COSTS = [0, 50, 200, 1000, 5000]; // Levels 1 to 5
const PLANT_SPEED_MODIFIERS = [1, 0.8, 0.6, 0.4, 0.2]; // Growth time multipliers

// Pickaxe upgrade — required for meteor removal
const PICKAXE_COST = 500; // cost to upgrade pickaxe to "upgraded"

// Coin spawn config
const COIN_VALUES = [10, 20, 25, 50, 75, 100]; // possible coin values
const COIN_WEIGHTS = [40, 25, 15, 10, 6, 4]; // relative spawn weights (lower value = higher weight)
const COIN_WEIGHT_TOTAL = COIN_WEIGHTS.reduce((a, b) => a + b, 0);

function pickCoinValue() {
	let r = Math.random() * COIN_WEIGHT_TOTAL;
	for (let i = 0; i < COIN_VALUES.length; i++) {
		r -= COIN_WEIGHTS[i];
		if (r <= 0) return COIN_VALUES[i];
	}
	return COIN_VALUES[0];
}

function loadScript(src) {
	return new Promise((resolve, reject) => {
		if (document.querySelector(`script[src="${src}"]`)) {
			resolve();
			return;
		}
		const s = document.createElement('script');
		s.src = src;
		s.onload = resolve;
		s.onerror = reject;
		document.head.appendChild(s);
	});
}

const GRID_TIERS = [
	{ level: 1, cols: 3, rows: 1, cost: 0 },
	{ level: 2, cols: 3, rows: 3, cost: 50 },
	{ level: 3, cols: 6, rows: 6, cost: 300 },
	{ level: 4, cols: 9, rows: 9, cost: 1500 },
	{ level: 5, cols: 12, rows: 12, cost: 5000 },
	{ level: 6, cols: 24, rows: 24, cost: 25000 },
];

const PLANTS = {
	wheat: {
		id: 'wheat',
		name: 'Wheat',
		cost: 2,
		growTime: 10,
		value: 5,
		icon: '🌾',
	},
	tomato: {
		id: 'tomato',
		name: 'Tomato',
		cost: 5,
		growTime: 30,
		value: 15,
		icon: '🍅',
	},
	sunflower: {
		id: 'sunflower',
		name: 'Sunflower',
		cost: 15,
		growTime: 60,
		value: 40,
		icon: '🌻',
	},
	pumpkin: {
		id: 'pumpkin',
		name: 'Pumpkin',
		cost: 40,
		growTime: 120,
		value: 120,
		icon: '🎃',
	},
};

const INITIAL_MONEY = 10;
const PROGRESS_KEY = 'statica-robot-gardener-game-save-v3';
const CODE_KEY = 'statica-robot-gardener-code-save';

class VirtualGame {
	constructor(state) {
		this.x = state.rx ?? 0;
		this.y = state.ry ?? 0;
		this.dir = state.rdir ?? 1; // 0=N, 1=E, 2=S, 3=W
		this.money = state.money;
		this.tier = state.tier;
		this.cells = JSON.parse(JSON.stringify(state.cells));
		this.time = Date.now();
		this.botSpeedLevel = state.botSpeedLevel || 1;
		this.plantUpgrades = state.plantUpgrades || {
			wheat: 1,
			tomato: 1,
			sunflower: 1,
			pumpkin: 1,
		};
		this.hasUpgradedPickaxe = state.hasUpgradedPickaxe || false;
		this.animSpeed = BOT_SPEED_ANIM[this.botSpeedLevel - 1] || 200;
	}

	advanceTime(ms = 200) {
		this.time += ms;
	}

	moveForward(grid) {
		const DIR_DELTAS = [
			{ dx: 0, dy: -1 },
			{ dx: 1, dy: 0 },
			{ dx: 0, dy: 1 },
			{ dx: -1, dy: 0 },
		];
		const d = DIR_DELTAS[this.dir];
		const nx = this.x + d.dx;
		const ny = this.y + d.dy;
		const currentTier = GRID_TIERS.find((t) => t.level === this.tier);
		if (
			nx >= 0 &&
			nx < currentTier.cols &&
			ny >= 0 &&
			ny < currentTier.rows
		) {
			this.x = nx;
			this.y = ny;
		} else {
			throw new Error(`Out of bounds`);
		}
	}
	turnRight() {
		this.dir = (this.dir + 1) % 4;
	}
	turnLeft() {
		this.dir = (this.dir + 3) % 4;
	}

	plant(grid, type) {
		if (!PLANTS[type]) throw new Error(`Unknown plant: ${type}`);
		if (this.money < PLANTS[type].cost) throw new Error(`Not enough money`);
		const key = `${this.x},${this.y}`;
		const existingCell = this.cells[key];
		if (existingCell && existingCell.state === 'METEOR')
			throw new Error(
				'Cannot plant on a meteor! Use use_upgraded_pickaxe() to clear it first.',
			);
		if (existingCell && existingCell.state !== 'EMPTY')
			throw new Error(`Cell not empty`);
		this.money -= PLANTS[type].cost;
		this.cells[key] = { state: 'SEEDED', plantType: type };
		return { key, cell: this.cells[key] };
	}

	water() {
		const key = `${this.x},${this.y}`;
		const cell = this.cells[key];
		if (cell && cell.state === 'METEOR')
			throw new Error(
				'Cannot water a meteor tile! Use use_upgraded_pickaxe() to clear it first.',
			);
		if (!cell || cell.state !== 'SEEDED')
			throw new Error(`Nothing to water`);
		this.cells[key] = {
			...cell,
			state: 'WATERED',
			plantTime: this.time,
		};
		return { key, cell: this.cells[key] };
	}

	harvest() {
		const key = `${this.x},${this.y}`;
		const cell = this.cells[key];
		if (!cell || cell.state !== 'HARVESTABLE')
			throw new Error(`Nothing to harvest`);
		const val = PLANTS[cell.plantType].value;
		this.money += val;
		delete this.cells[key];
		return { key, cell: null };
	}

	clear(grid, obstacle) {
		const key = `${this.x},${this.y}`;
		const cell = this.cells[key];
		if (obstacle === 'METEOR') {
			// Any cell that is part of the meteor (origin or satellite) can be targeted
			if (!cell || cell.state !== 'METEOR')
				throw new Error('No meteor here');
			if (!this.hasUpgradedPickaxe)
				throw new Error(
					'You need the upgraded pickaxe to remove a meteor! Buy it in the Shop.',
				);
			// Remove all 4 meteor cells
			const ox = cell.meteorOrigin ? this.x : cell.originX;
			const oy = cell.meteorOrigin ? this.y : cell.originY;
			const keysToDelete = [
				`${ox},${oy}`,
				`${ox + 1},${oy}`,
				`${ox},${oy + 1}`,
				`${ox + 1},${oy + 1}`,
			];
			for (const k of keysToDelete) delete this.cells[k];
			return {
				key,
				cell: null,
				meteorRemoved: true,
				originX: ox,
				originY: oy,
			};
		}
		if (!cell || cell.state !== obstacle)
			throw new Error(`No ${obstacle} here`);
		delete this.cells[key];
		return { key, cell: null };
	}

	pickupCoin() {
		const key = `${this.x},${this.y}`;
		const cell = this.cells[key];
		if (!cell || cell.state !== 'COIN') throw new Error('No coin here');
		const val = cell.value || 10;
		this.money += val;
		delete this.cells[key];
		return { key, value: val };
	}

	checkBlock() {
		const cell = this.cells[`${this.x},${this.y}`];
		if (!cell) return 'empty';
		if (cell.state === 'STONE') return 'stone';
		if (cell.state === 'BRANCH') return 'branch';
		if (cell.state === 'METEOR') return 'meteor';
		if (cell.state === 'COIN') return 'coin';

		if (cell.state === 'WATERED' || cell.state === 'GROWING') {
			const p = PLANTS[cell.plantType];
			if (p) {
				const upgradeLevel = this.plantUpgrades[cell.plantType] || 1;
				const modifier = PLANT_SPEED_MODIFIERS[upgradeLevel - 1] || 1;
				const actualGrowTime = p.growTime * modifier;

				const elapsed = this.time - cell.plantTime;
				if (elapsed >= actualGrowTime * 1000) {
					cell.state = 'HARVESTABLE';
				} else if (elapsed >= actualGrowTime * 500) {
					cell.state = 'GROWING';
				}
			}
		}

		if (cell.state === 'HARVESTABLE') return 'ready';
		if (cell.state === 'SEEDED') return 'seeded';
		if (cell.plantType) return cell.plantType;
		return 'empty';
	}

	getCoins() {
		// Returns a list of [x, y] pairs for all coin tiles on the map
		const coinPositions = [];
		for (const key of Object.keys(this.cells)) {
			if (this.cells[key] && this.cells[key].state === 'COIN') {
				const [cx, cy] = key.split(',').map(Number);
				coinPositions.push([cx, cy]);
			}
		}
		return coinPositions;
	}

	resetBot() {
		this.x = 0;
		this.y = 0;
		this.dir = 1; // Facing East
	}

	buyLand() {
		const next = GRID_TIERS.find((t) => t.level === this.tier + 1);
		if (!next) throw new Error(`Max level reached`);
		if (this.money < next.cost) throw new Error(`Not enough money`);
		this.money -= next.cost;
		this.tier = next.level;
		return true;
	}
	getFarmSize() {
		const currentTier = GRID_TIERS.find((t) => t.level === this.tier);
		return [currentTier.cols, currentTier.rows];
	}
}

// ── Meteor Toast Component ──────────────────────────────────────────────────
// Injects keyframe CSS once, then renders a sliding toast.
let _meteorToastStyleInjected = false;
function ensureMeteorToastStyle() {
	if (_meteorToastStyleInjected) return;
	_meteorToastStyleInjected = true;
	const style = document.createElement('style');
	style.textContent = `
		@keyframes meteorToastSlideIn {
			from { transform: translateX(calc(100% + 1.5rem)); opacity: 0; }
			to   { transform: translateX(0); opacity: 1; }
		}
		@keyframes meteorToastSlideOut {
			from { transform: translateX(0); opacity: 1; }
			to   { transform: translateX(calc(100% + 1.5rem)); opacity: 0; }
		}
		.meteor-toast {
			animation: meteorToastSlideIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both;
		}
		.meteor-toast.dismissing {
			animation: meteorToastSlideOut 0.3s ease-in both;
		}
	`;
	document.head.appendChild(style);
}

function MeteorToast({ toast, onClose }) {
	const [dismissing, setDismissing] = useState(false);

	// Ensure CSS is injected
	ensureMeteorToastStyle();

	const handleClose = () => {
		setDismissing(true);
		setTimeout(() => {
			onClose();
		}, 300); // wait for slide-out animation
	};

	return (
		<div
			className={`meteor-toast${dismissing ? ' dismissing' : ''}`}
			style={{
				width: '340px',
				background:
					'linear-gradient(135deg, rgba(192,57,43,0.97), rgba(100,10,10,0.98))',
				border: '1px solid #e74c3c',
				borderRadius: '10px',
				boxShadow:
					'0 4px 24px rgba(231,76,60,0.55), 0 2px 8px rgba(0,0,0,0.4)',
				padding: '0.9rem 1rem 0.9rem 1rem',
				color: '#fff',
				display: 'flex',
				alignItems: 'flex-start',
				gap: '0.75rem',
				pointerEvents: 'auto',
			}}
		>
			<span style={{ fontSize: '1.6rem', lineHeight: 1, flexShrink: 0 }}>
				☄️
			</span>
			<div style={{ flex: 1, minWidth: 0 }}>
				<div
					style={{
						fontWeight: 'bold',
						fontSize: '0.95rem',
						marginBottom: '0.3rem',
					}}
				>
					☄️ METEOR IMPACT!
				</div>
				<div
					style={{
						fontSize: '0.8rem',
						fontWeight: 'normal',
						opacity: 0.9,
						lineHeight: 1.5,
					}}
				>
					Landed at ({toast.x}, {toast.y})! That 2×2 area is now{' '}
					<strong>blocked</strong>. Use{' '}
					<code
						style={{
							background: 'rgba(255,255,255,0.18)',
							padding: '1px 5px',
							borderRadius: '3px',
							fontSize: '0.78rem',
						}}
					>
						use_upgraded_pickaxe()
					</code>{' '}
					on any of its tiles to clear it.
				</div>
			</div>
			<button
				onClick={handleClose}
				title="Dismiss"
				style={{
					background: 'rgba(255,255,255,0.15)',
					border: 'none',
					borderRadius: '50%',
					width: '24px',
					height: '24px',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					cursor: 'pointer',
					color: '#fff',
					fontSize: '0.85rem',
					fontWeight: 'bold',
					flexShrink: 0,
					lineHeight: 1,
					padding: 0,
					marginLeft: '0.25rem',
					transition: 'background 0.15s',
				}}
				onMouseEnter={(e) =>
					(e.currentTarget.style.background = 'rgba(255,255,255,0.3)')
				}
				onMouseLeave={(e) =>
					(e.currentTarget.style.background = 'rgba(255,255,255,0.15)')
				}
			>
				✕
			</button>
		</div>
	);
}

export default function RobotGardenerGameModule() {
	const [skulptReady, setSkulptReady] = useState(false);
	const [animating, setAnimating] = useState(false);
	const [editorCode, setEditorCode] = useState(() => {
		return (
			localStorage.getItem(CODE_KEY) ||
			"print('Starting bot...')\nmove_forward()\n"
		);
	});
	const [consoleText, setConsoleText] = useState('');
	const [leftTab, setLeftTab] = useState('api');
	const [expandedApi, setExpandedApi] = useState(null);
	// Toast state: array of {id, x, y} for each active meteor alert
	const [meteorToasts, setMeteorToasts] = useState([]);
	const meteorToastTimers = useRef({});

	const [gameState, setGameState] = useState(() => {
		const saved = localStorage.getItem(PROGRESS_KEY);
		if (saved) {
			try {
				const parsed = JSON.parse(saved);
				if (!parsed.botSpeedLevel) parsed.botSpeedLevel = 1;
				if (!parsed.plantUpgrades)
					parsed.plantUpgrades = {
						wheat: 1,
						tomato: 1,
						sunflower: 1,
						pumpkin: 1,
					};
				if (parsed.hasUpgradedPickaxe === undefined)
					parsed.hasUpgradedPickaxe = false;
				return parsed;
			} catch (e) {}
		}
		return {
			money: INITIAL_MONEY,
			tier: 1,
			cells: {}, // key: "x,y", value: { state, plantType, plantTime }
			rx: 0,
			ry: 0,
			rdir: 1, // Robot pos
			botSpeedLevel: 1,
			plantUpgrades: { wheat: 1, tomato: 1, sunflower: 1, pumpkin: 1 },
			hasUpgradedPickaxe: false,
		};
	});

	const executorRef = useRef(new GameExecutor());
	const animTimerRef = useRef(null);

	useEffect(() => {
		localStorage.setItem(PROGRESS_KEY, JSON.stringify(gameState));
	}, [gameState]);

	useEffect(() => {
		localStorage.setItem(CODE_KEY, editorCode);
	}, [editorCode]);

	useEffect(() => {
		(async () => {
			try {
				await loadScript(SKULPT_CDN);
				await loadScript(SKULPT_STDLIB);
				setSkulptReady(true);
			} catch (e) {}
		})();
	}, []);

	// Growth Tick + Meteor + Coin Events
	useEffect(() => {
		const tick = setInterval(() => {
			setGameState((prev) => {
				let changed = false;
				const newCells = { ...prev.cells };
				const now = Date.now();
				const currentTier = GRID_TIERS.find(
					(t) => t.level === prev.tier,
				);
				const plantUpgrades = prev.plantUpgrades || {
					wheat: 1,
					tomato: 1,
					sunflower: 1,
					pumpkin: 1,
				};

				for (let y = 0; y < currentTier.rows; y++) {
					for (let x = 0; x < currentTier.cols; x++) {
						const key = `${x},${y}`;
						const cell = newCells[key];
						if (cell) {
							if (
								cell.state === 'WATERED' ||
								cell.state === 'GROWING'
							) {
								const plantInfo = PLANTS[cell.plantType];
								if (plantInfo) {
									const upgradeLevel =
										plantUpgrades[cell.plantType] || 1;
									const modifier =
										PLANT_SPEED_MODIFIERS[
											upgradeLevel - 1
										] || 1;
									const actualGrowTime =
										plantInfo.growTime * modifier;
									const elapsedSeconds =
										(now - cell.plantTime) / 1000;
									if (elapsedSeconds >= actualGrowTime) {
										newCells[key] = {
											...cell,
											state: 'HARVESTABLE',
										};
										changed = true;
									} else if (
										elapsedSeconds >= actualGrowTime / 2 &&
										cell.state === 'WATERED'
									) {
										newCells[key] = {
											...cell,
											state: 'GROWING',
										};
										changed = true;
									}
								}
							}
						} else {
							// Random obstacle spawn on empty tiles
							if (Math.random() < 0.003) {
								newCells[key] = {
									state:
										Math.random() > 0.5
											? 'STONE'
											: 'BRANCH',
								};
								changed = true;
							}
						}
					}
				}

				// ── Meteor Event (tier >= 3, i.e. 6x6+) ────────────────────
				// Check if a meteor already exists; if not, random chance to spawn one
				if (prev.tier >= 3) {
					const hasMeteor = Object.values(newCells).some(
						(c) => c && c.state === 'METEOR',
					);
					if (!hasMeteor && Math.random() < 0.004) {
						// Pick a random top-left corner for 2x2 meteor within bounds
						const mx = Math.floor(
							Math.random() * (currentTier.cols - 1),
						);
						const my = Math.floor(
							Math.random() * (currentTier.rows - 1),
						);
						// Place meteor on 2x2 area, destroying any crops there
						const meteorCells = [
							[mx, my, true],
							[mx + 1, my, false],
							[mx, my + 1, false],
							[mx + 1, my + 1, false],
						];
						for (const [cx, cy, isOrigin] of meteorCells) {
							const ck = `${cx},${cy}`;
							newCells[ck] = isOrigin
								? { state: 'METEOR', meteorOrigin: true }
								: {
										state: 'METEOR',
										meteorOrigin: false,
										originX: mx,
										originY: my,
									};
						}
						changed = true;
						// Spawn a toast notification for this meteor
						const toastId = `meteor-${Date.now()}-${mx}-${my}`;
						setMeteorToasts((prev) => [
							...prev,
							{ id: toastId, x: mx, y: my },
						]);
						meteorToastTimers.current[toastId] = setTimeout(() => {
							setMeteorToasts((prev) =>
								prev.filter((t) => t.id !== toastId),
							);
							delete meteorToastTimers.current[toastId];
						}, 5000);
					}
				}

				// ── Coin Spawning (tier >= 5, i.e. 12x12+) ─────────────────
				if (prev.tier >= 5) {
					// Count existing coins, spawn if below limit
					const coinCount = Object.values(newCells).filter(
						(c) => c && c.state === 'COIN',
					).length;
					const maxCoins = Math.floor(
						currentTier.cols * currentTier.rows * 0.03,
					); // max 3% of tiles
					if (coinCount < maxCoins && Math.random() < 0.05) {
						// Find a random empty tile
						const emptyTiles = [];
						for (let cy = 0; cy < currentTier.rows; cy++) {
							for (let cx = 0; cx < currentTier.cols; cx++) {
								if (!newCells[`${cx},${cy}`])
									emptyTiles.push([cx, cy]);
							}
						}
						if (emptyTiles.length > 0) {
							const [cx, cy] =
								emptyTiles[
									Math.floor(
										Math.random() * emptyTiles.length,
									)
								];
							newCells[`${cx},${cy}`] = {
								state: 'COIN',
								value: pickCoinValue(),
							};
							changed = true;
						}
					}
				}

				if (changed) return { ...prev, cells: newCells };
				return prev;
			});
		}, 1000);
		return () => clearInterval(tick);
	}, []);

	const handleRun = async () => {
		if (!skulptReady || animating) return;
		clearTimeout(animTimerRef.current);
		setAnimating(true);

		const vGame = new VirtualGame(gameState);
		const result = await executorRef.current.execute(
			editorCode,
			vGame,
			vGame,
		);

		setConsoleText('');

		const log = result.log || [];
		if (log.length === 0) {
			setAnimating(false);
			if (!result.success) {
				setConsoleText((prev) => prev + `\n[ERROR]: ${result.error}\n`);
			}
			return;
		}

		const currentAnimSpeed = vGame.animSpeed;

		// Playback
		let step = 0;
		const tickAnim = () => {
			if (step >= log.length) {
				setAnimating(false);
				if (!result.success) {
					setConsoleText(
						(prev) => prev + `\n[ERROR]: ${result.error}\n`,
					);
				}
				return;
			}
			const action = log[step];

			if (action.type === 'wait') {
				setGameState((prev) => ({
					...prev,
					rx: action.robot.x,
					ry: action.robot.y,
					rdir: action.robot.dir,
				}));
				step++;
				animTimerRef.current = setTimeout(
					tickAnim,
					action.duration || currentAnimSpeed,
				);
				return;
			}

			if (action.type === 'move' || action.type === 'turn') {
				setGameState((prev) => ({
					...prev,
					rx: action.robot.x,
					ry: action.robot.y,
					rdir: action.robot.dir,
				}));
			} else if (
				action.type === 'plant' ||
				action.type === 'water' ||
				action.type === 'harvest' ||
				action.type === 'clear' ||
				action.type === 'coin'
			) {
				setGameState((prev) => {
					const newCells = { ...prev.cells };
					if (action.type === 'clear' && action.meteorRemoved) {
						// Remove all 4 meteor cells from the real state
						const ox = action.originX;
						const oy = action.originY;
						delete newCells[`${ox},${oy}`];
						delete newCells[`${ox + 1},${oy}`];
						delete newCells[`${ox},${oy + 1}`];
						delete newCells[`${ox + 1},${oy + 1}`];
					} else if (action.cellData === null) {
						delete newCells[action.cellKey];
					} else {
						newCells[action.cellKey] = action.cellData;
						if (action.type === 'water') {
							newCells[action.cellKey].plantTime = Date.now();
						}
					}
					return {
						...prev,
						money: action.robot.money,
						cells: newCells,
					};
				});
			} else if (action.type === 'print') {
				setConsoleText((prev) => prev + action.text);
			}

			step++;
			animTimerRef.current = setTimeout(tickAnim, currentAnimSpeed);
		};
		tickAnim();
	};

	const handleStop = () => {
		if (animTimerRef.current) {
			clearTimeout(animTimerRef.current);
			animTimerRef.current = null;
		}
		setAnimating(false);
		setConsoleText(
			(prev) => prev + '\n[SYSTEM]: Execution stopped by user.\n',
		);
	};

	const handleReset = () => {
		if (
			!window.confirm(
				'All progress will be lost, and your money will reset to zero. Are you sure you want to reset the game?',
			)
		) {
			return;
		}
		setGameState({
			money: INITIAL_MONEY,
			tier: 1,
			cells: {},
			rx: 0,
			ry: 0,
			rdir: 1,
			botSpeedLevel: 1,
			plantUpgrades: { wheat: 1, tomato: 1, sunflower: 1, pumpkin: 1 },
			hasUpgradedPickaxe: false,
		});
		setConsoleText('[SYSTEM]: Game reset to tier 1.\n');
	};

	const handleBuyUpgradedPickaxe = () => {
		if (gameState.money >= PICKAXE_COST && !gameState.hasUpgradedPickaxe) {
			setGameState((prev) => ({
				...prev,
				money: prev.money - PICKAXE_COST,
				hasUpgradedPickaxe: true,
			}));
		}
	};

	const handleUpgrade = () => {
		const nextTier = GRID_TIERS.find((t) => t.level === gameState.tier + 1);
		if (nextTier && gameState.money >= nextTier.cost) {
			setGameState((prev) => ({
				...prev,
				money: prev.money - nextTier.cost,
				tier: nextTier.level,
			}));
		}
	};

	const currentTier = GRID_TIERS.find((t) => t.level === gameState.tier);
	const displayCols = currentTier.cols;
	const displayRows = currentTier.rows;
	const nextTier = GRID_TIERS.find((t) => t.level === gameState.tier + 1);

	const cells2D = Array.from({ length: displayRows }, (_, y) =>
		Array.from({ length: displayCols }, (_, x) => {
			return gameState.cells[`${x},${y}`] || { state: 'EMPTY' };
		}),
	);

	return (
		<div
			className="rg-shell"
			style={{
				display: 'flex',
				flexDirection: 'column',
				height: '100vh',
				backgroundColor: 'var(--background)',
			}}
		>
			<Header
				currentIndex={0}
				challenges={[{ title: 'Robot Gardner Game', id: 'rg' }]}
				challengeData={{}}
				onGoTo={() => {}}
				sidebarOpen={false}
				onToggleSidebar={() => {}}
			/>
			<div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
				{/* Far Left: Sidebar */}
				<div
					style={{
						width: '310px',
						display: 'flex',
						flexDirection: 'column',
						borderRight: '1px solid var(--border-subtle)',
						backgroundColor: 'var(--ui-01)',
					}}
				>
					{/* Tab Strip */}
					<div
						style={{
							display: 'flex',
							borderBottom: '1px solid var(--border-subtle)',
							gap: '0',
						}}
					>
						{[
							['api', 'API'],
							['plants', 'Plants'],
							['shop', 'Shop'],
							['upgrades', 'Upgrades'],
						].map(([tab, label]) => (
							<button
								key={tab}
								onClick={() => setLeftTab(tab)}
								style={{
									flex: 1,
									padding: '0.75rem 0.25rem',
									background:
										leftTab === tab
											? 'transparent'
											: 'var(--ui-02)',
									border: 'none',
									borderBottom:
										leftTab === tab
											? '2px solid var(--color-yellow)'
											: '2px solid transparent',
									color:
										leftTab === tab
											? 'var(--text-primary)'
											: 'var(--text-secondary)',
									cursor: 'pointer',
									fontWeight:
										leftTab === tab ? 'bold' : 'normal',
									fontSize: '0.85rem',
									transition: 'all 0.15s',
								}}
							>
								{label}
							</button>
						))}
					</div>

					<div
						style={{
							padding: '0.75rem',
							overflowY: 'auto',
							flex: 1,
						}}
					>
						{/* ── API TAB ── */}
						{leftTab === 'api' &&
							(() => {
								const API_GROUPS = [
									{
										group: '🤖 Movement',
										color: '#4589ff',
										cmds: [
											{
												id: 'move_forward',
												sig: 'move_forward()',
												ret: 'None',
												doc: 'Moves the robot one tile forward in its facing direction. Throws if out of bounds.',
											},
											{
												id: 'turn_right',
												sig: 'turn_right()',
												ret: 'None',
												doc: 'Rotates the robot 90° clockwise.',
											},
											{
												id: 'turn_left',
												sig: 'turn_left()',
												ret: 'None',
												doc: 'Rotates the robot 90° counter-clockwise.',
											},
											{
												id: 'reset_bot',
												sig: 'reset_bot()',
												ret: 'None',
												doc: 'Teleports the robot back to (0, 0) facing East.',
											},
											{
												id: 'get_position',
												sig: 'get_position()',
												ret: '(x, y)',
												doc: "Returns the robot's current grid coordinates as a tuple.",
											},
										],
									},
									{
										group: '🌱 Farming',
										color: '#2ecc71',
										cmds: [
											{
												id: 'plant',
												sig: 'plant(type)',
												ret: 'None',
												doc: "Plants a seed on this tile. type = 'wheat' | 'tomato' | 'sunflower' | 'pumpkin'. Costs money. Tile must be empty.",
											},
											{
												id: 'water',
												sig: 'water()',
												ret: 'None',
												doc: 'Waters the seed on this tile, starting its growth timer.',
											},
											{
												id: 'harvest',
												sig: 'harvest()',
												ret: 'None',
												doc: 'Harvests a fully grown plant and adds its value to your money.',
											},
										],
									},
									{
										group: '⛏️ Tools',
										color: '#e67e22',
										cmds: [
											{
												id: 'use_pickaxe',
												sig: 'use_pickaxe()',
												ret: 'None',
												doc: 'Removes a stone obstacle on this tile.',
											},
											{
												id: 'use_axe',
												sig: 'use_axe()',
												ret: 'None',
												doc: 'Removes a branch obstacle on this tile.',
											},
											{
												id: 'use_upgraded_pickaxe',
												sig: 'use_upgraded_pickaxe()',
												ret: 'None',
												doc: '☄️ Removes a meteor (2×2) on this tile. Requires the Upgraded Pickaxe from the Shop.',
											},
										],
									},
									{
										group: '💰 Economy',
										color: '#f1c40f',
										cmds: [
											{
												id: 'get_money',
												sig: 'get_money()',
												ret: 'int',
												doc: 'Returns your current money balance.',
											},
											{
												id: 'pickup_coin',
												sig: 'pickup_coin()',
												ret: 'int',
												doc: '💵 Picks up a coin on this tile and adds its value to your money. Returns the coin value.',
											},
											{
												id: 'get_coins',
												sig: 'get_coins()',
												ret: 'list[(x,y)]',
												doc: '🗺️ Returns a list of (x, y) tuples for every coin currently on the farm.',
											},
										],
									},
									{
										group: '🔍 Sensing',
										color: '#9b59b6',
										cmds: [
											{
												id: 'check_block',
												sig: 'check_block()',
												ret: 'str',
												doc: "Returns what's on the current tile: 'empty', 'stone', 'branch', 'meteor', 'coin', 'seeded', 'ready', 'wheat', 'tomato', 'sunflower', 'pumpkin'.",
											},
											{
												id: 'get_farm_size',
												sig: 'get_farm_size()',
												ret: '(w, h)',
												doc: 'Returns the current farm dimensions as a (width, height) tuple.',
											},
											{
												id: 'print',
												sig: 'print(msg)',
												ret: 'None',
												doc: 'Outputs a message to the console for debugging.',
											},
										],
									},
								];
								return (
									<div
										style={{
											display: 'flex',
											flexDirection: 'column',
											gap: '1rem',
										}}
									>
										{API_GROUPS.map((grp) => (
											<div key={grp.group}>
												<div
													style={{
														fontSize: '0.7rem',
														fontWeight: 'bold',
														letterSpacing: '0.08em',
														textTransform:
															'uppercase',
														color: grp.color,
														marginBottom: '0.4rem',
														paddingBottom: '0.3rem',
														borderBottom: `1px solid ${grp.color}33`,
													}}
												>
													{grp.group}
												</div>
												<div
													style={{
														display: 'flex',
														flexDirection: 'column',
														gap: '0.3rem',
													}}
												>
													{grp.cmds.map((cmd) => (
														<div key={cmd.id}>
															<button
																onClick={() =>
																	setExpandedApi(
																		expandedApi ===
																			cmd.id
																			? null
																			: cmd.id,
																	)
																}
																style={{
																	display:
																		'flex',
																	alignItems:
																		'center',
																	justifyContent:
																		'space-between',
																	width: '100%',
																	textAlign:
																		'left',
																	padding:
																		'0.45rem 0.6rem',
																	background:
																		expandedApi ===
																		cmd.id
																			? `${grp.color}18`
																			: 'rgba(255,255,255,0.04)',
																	border: `1px solid ${expandedApi === cmd.id ? grp.color : 'transparent'}`,
																	borderRadius:
																		'6px',
																	cursor: 'pointer',
																	transition:
																		'all 0.15s',
																}}
															>
																<code
																	style={{
																		fontSize:
																			'0.82rem',
																		color: grp.color,
																		background:
																			'none',
																		padding: 0,
																		whiteSpace:
																			'nowrap',
																		overflow:
																			'hidden',
																		textOverflow:
																			'ellipsis',
																	}}
																>
																	{cmd.sig}
																</code>
																<span
																	style={{
																		fontSize:
																			'0.68rem',
																		color: 'var(--text-secondary)',
																		background:
																			'rgba(255,255,255,0.07)',
																		padding:
																			'1px 5px',
																		borderRadius:
																			'4px',
																		whiteSpace:
																			'nowrap',
																		flexShrink: 0,
																		marginLeft:
																			'0.4rem',
																	}}
																>
																	{cmd.ret}
																</span>
															</button>
															{expandedApi ===
																cmd.id && (
																<div
																	style={{
																		marginTop:
																			'0.25rem',
																		padding:
																			'0.6rem 0.75rem',
																		background:
																			'rgba(0,0,0,0.2)',
																		borderLeft: `3px solid ${grp.color}`,
																		borderRadius:
																			'0 6px 6px 0',
																		fontSize:
																			'0.82rem',
																		color: 'var(--text-secondary)',
																		lineHeight:
																			'1.5',
																	}}
																>
																	{cmd.doc}
																</div>
															)}
														</div>
													))}
												</div>
											</div>
										))}
									</div>
								);
							})()}

						{/* ── SHOP TAB ── */}
						{leftTab === 'shop' && (
							<div
								style={{
									display: 'flex',
									flexDirection: 'column',
									gap: '0.75rem',
								}}
							>
								<div
									style={{
										fontSize: '0.7rem',
										fontWeight: 'bold',
										letterSpacing: '0.08em',
										textTransform: 'uppercase',
										color: 'var(--text-secondary)',
										marginBottom: '0.25rem',
									}}
								>
									Tools
								</div>

								{/* Upgraded Pickaxe */}
								<div
									style={{
										background: gameState.hasUpgradedPickaxe
											? 'rgba(46,204,113,0.08)'
											: 'rgba(0,0,0,0.2)',
										padding: '1rem',
										borderRadius: '10px',
										border: gameState.hasUpgradedPickaxe
											? '1px solid #2ecc71'
											: '1px solid var(--border-subtle)',
									}}
								>
									<div
										style={{
											fontSize: '1.2rem',
											fontWeight: 'bold',
											marginBottom: '0.4rem',
											display: 'flex',
											alignItems: 'center',
											gap: '0.5rem',
										}}
									>
										<span>⛏️</span>
										<span>Upgraded Pickaxe</span>
										{gameState.hasUpgradedPickaxe && (
											<span
												style={{
													fontSize: '0.75rem',
													color: '#2ecc71',
													background:
														'rgba(46,204,113,0.15)',
													padding: '2px 8px',
													borderRadius: '999px',
												}}
											>
												OWNED
											</span>
										)}
									</div>
									<div
										style={{
											fontSize: '0.85rem',
											color: 'var(--text-secondary)',
											marginBottom: '0.75rem',
											lineHeight: '1.5',
										}}
									>
										☄️ Required to remove{' '}
										<strong>meteors</strong> from your farm.
										Once purchased, use{' '}
										<code
											style={{
												color: '#e67e22',
												background:
													'rgba(230,126,34,0.1)',
												padding: '1px 5px',
												borderRadius: '3px',
											}}
										>
											use_upgraded_pickaxe()
										</code>{' '}
										when standing on a meteor tile.
									</div>
									{gameState.hasUpgradedPickaxe ? (
										<div
											style={{
												color: '#2ecc71',
												fontWeight: 'bold',
												fontSize: '0.9rem',
												textAlign: 'center',
											}}
										>
											✅ Already in your toolkit
										</div>
									) : (
										<button
											className="btn btn-primary"
											style={{
												width: '100%',
												padding: '0.75rem',
												fontWeight: 'bold',
											}}
											disabled={
												gameState.money <
													PICKAXE_COST || animating
											}
											onClick={handleBuyUpgradedPickaxe}
										>
											Buy for ${PICKAXE_COST}
											{gameState.money < PICKAXE_COST && (
												<span
													style={{
														display: 'block',
														fontSize: '0.75rem',
														fontWeight: 'normal',
														opacity: 0.7,
													}}
												>
													Need $
													{PICKAXE_COST -
														gameState.money}{' '}
													more
												</span>
											)}
										</button>
									)}
								</div>

								{/* Coin info */}
								{gameState.tier >= 5 && (
									<div
										style={{
											background: 'rgba(243,156,18,0.08)',
											padding: '1rem',
											borderRadius: '10px',
											border: '1px solid rgba(243,156,18,0.3)',
										}}
									>
										<div
											style={{
												fontSize: '1.1rem',
												fontWeight: 'bold',
												marginBottom: '0.4rem',
											}}
										>
											💰 Gold Coins Active
										</div>
										<div
											style={{
												fontSize: '0.82rem',
												color: 'var(--text-secondary)',
												lineHeight: '1.5',
											}}
										>
											Coins spawn randomly on empty tiles.
											Walk over them and call{' '}
											<code style={{ color: '#f1c40f' }}>
												pickup_coin()
											</code>{' '}
											to collect. Use{' '}
											<code style={{ color: '#f1c40f' }}>
												get_coins()
											</code>{' '}
											to find all coin locations.
										</div>
										<div
											style={{
												marginTop: '0.5rem',
												fontSize: '0.78rem',
												color: 'var(--text-secondary)',
											}}
										>
											Values: $10 (common) → $100 (rare)
										</div>
									</div>
								)}
							</div>
						)}

						{/* ── PLANTS TAB ── */}
						{leftTab === 'plants' && (
							<div
								style={{
									display: 'flex',
									flexDirection: 'column',
									gap: '1rem',
								}}
							>
								{Object.values(PLANTS).map((p) => (
									<div
										key={p.id}
										style={{
											background: 'rgba(0,0,0,0.2)',
											padding: '1rem',
											borderRadius: '8px',
										}}
									>
										<div
											style={{
												fontSize: '1.2rem',
												fontWeight: 'bold',
												marginBottom: '0.25rem',
											}}
										>
											{p.icon} {p.name}
										</div>
										<div
											style={{
												fontSize: '0.85rem',
												color: 'var(--color-yellow)',
												marginBottom: '0.75rem',
											}}
										>
											<code>plant('{p.id}')</code>
										</div>
										<div
											style={{
												fontSize: '0.9rem',
												color: 'var(--text-secondary)',
												display: 'grid',
												gridTemplateColumns: '1fr 1fr',
												gap: '0.5rem',
											}}
										>
											<div>
												Cost:{' '}
												<span
													style={{
														color: '#e74c3c',
														fontWeight: 'bold',
													}}
												>
													-${p.cost}
												</span>
											</div>
											<div>
												Earn:{' '}
												<span
													style={{
														color: '#2ecc71',
														fontWeight: 'bold',
													}}
												>
													+${p.value}
												</span>
											</div>
											<div
												style={{ gridColumn: 'span 2' }}
											>
												Grow Time:{' '}
												<span
													style={{
														color: 'var(--text-primary)',
													}}
												>
													{p.growTime}s
												</span>
											</div>
										</div>
									</div>
								))}
							</div>
						)}
						{leftTab === 'upgrades' && (
							<div
								style={{
									display: 'flex',
									flexDirection: 'column',
									gap: '1rem',
								}}
							>
								{/* Land Upgrade */}
								<div
									style={{
										background: 'rgba(0,0,0,0.2)',
										padding: '1rem',
										borderRadius: '8px',
										border: '1px solid var(--border-subtle)',
									}}
								>
									<div
										style={{
											fontSize: '1.2rem',
											fontWeight: 'bold',
											marginBottom: '0.5rem',
										}}
									>
										🗺️ Expand Farm
									</div>
									<div
										style={{
											fontSize: '0.9rem',
											color: 'var(--text-secondary)',
											marginBottom: '0.5rem',
										}}
									>
										Current Size: {displayCols}x
										{displayRows}
									</div>
									{nextTier ? (
										<button
											className="btn btn-primary"
											style={{
												width: '100%',
												padding: '0.75rem',
												fontWeight: 'bold',
											}}
											disabled={
												gameState.money <
													nextTier.cost || animating
											}
											onClick={handleUpgrade}
										>
											Expand to {nextTier.cols}x
											{nextTier.rows} (${nextTier.cost})
										</button>
									) : (
										<div
											style={{
												color: 'var(--color-yellow)',
												fontWeight: 'bold',
												padding: '0.75rem',
												textAlign: 'center',
												background:
													'rgba(255,255,255,0.05)',
												borderRadius: '4px',
											}}
										>
											MAX SIZE REACHED
										</div>
									)}
								</div>

								{/* Bot Speed Upgrade */}
								<div
									style={{
										background: 'rgba(0,0,0,0.2)',
										padding: '1rem',
										borderRadius: '8px',
										border: '1px solid var(--border-subtle)',
									}}
								>
									<div
										style={{
											fontSize: '1.2rem',
											fontWeight: 'bold',
											marginBottom: '0.5rem',
										}}
									>
										⚡ Bot Speed
									</div>
									<div
										style={{
											fontSize: '0.9rem',
											color: 'var(--text-secondary)',
											marginBottom: '0.5rem',
										}}
									>
										Current: Level {gameState.botSpeedLevel}{' '}
										(
										{
											BOT_SPEED_ANIM[
												gameState.botSpeedLevel - 1
											]
										}
										ms per action)
									</div>
									{gameState.botSpeedLevel <
									BOT_SPEED_COSTS.length ? (
										<button
											className="btn btn-primary"
											style={{
												width: '100%',
												padding: '0.75rem',
												fontWeight: 'bold',
											}}
											disabled={
												gameState.money <
													BOT_SPEED_COSTS[
														gameState.botSpeedLevel
													] || animating
											}
											onClick={() => {
												const cost =
													BOT_SPEED_COSTS[
														gameState.botSpeedLevel
													];
												if (gameState.money >= cost) {
													setGameState((prev) => ({
														...prev,
														money:
															prev.money - cost,
														botSpeedLevel:
															prev.botSpeedLevel +
															1,
													}));
												}
											}}
										>
											Upgrade to Lvl{' '}
											{gameState.botSpeedLevel + 1} ($
											{
												BOT_SPEED_COSTS[
													gameState.botSpeedLevel
												]
											}
											)
										</button>
									) : (
										<div
											style={{
												color: 'var(--color-yellow)',
												fontWeight: 'bold',
												padding: '0.75rem',
												textAlign: 'center',
												background:
													'rgba(255,255,255,0.05)',
												borderRadius: '4px',
											}}
										>
											MAX LEVEL
										</div>
									)}
								</div>

								{/* Plant Upgrades */}
								{Object.values(PLANTS).map((p) => {
									const upgradeLevel =
										gameState.plantUpgrades[p.id] || 1;
									const cost =
										PLANT_SPEED_COSTS[upgradeLevel];
									return (
										<div
											key={p.id + '_upgrade'}
											style={{
												background: 'rgba(0,0,0,0.2)',
												padding: '1rem',
												borderRadius: '8px',
												border: '1px solid var(--border-subtle)',
											}}
										>
											<div
												style={{
													fontSize: '1.2rem',
													fontWeight: 'bold',
													marginBottom: '0.5rem',
												}}
											>
												{p.icon} {p.name} Growth
											</div>
											<div
												style={{
													fontSize: '0.9rem',
													color: 'var(--text-secondary)',
													marginBottom: '0.5rem',
												}}
											>
												Current: Level {upgradeLevel} (
												{(
													p.growTime *
													PLANT_SPEED_MODIFIERS[
														upgradeLevel - 1
													]
												).toFixed(1)}
												s)
											</div>
											{upgradeLevel <
											PLANT_SPEED_COSTS.length ? (
												<button
													className="btn btn-primary"
													style={{
														width: '100%',
														padding: '0.75rem',
														fontWeight: 'bold',
													}}
													disabled={
														gameState.money <
															cost || animating
													}
													onClick={() => {
														if (
															gameState.money >=
															cost
														) {
															setGameState(
																(prev) => ({
																	...prev,
																	money:
																		prev.money -
																		cost,
																	plantUpgrades:
																		{
																			...prev.plantUpgrades,
																			[p.id]:
																				upgradeLevel +
																				1,
																		},
																}),
															);
														}
													}}
												>
													Upgrade to Lvl{' '}
													{upgradeLevel + 1} (${cost})
												</button>
											) : (
												<div
													style={{
														color: 'var(--color-yellow)',
														fontWeight: 'bold',
														padding: '0.75rem',
														textAlign: 'center',
														background:
															'rgba(255,255,255,0.05)',
														borderRadius: '4px',
													}}
												>
													MAX LEVEL
												</div>
											)}
										</div>
									);
								})}
							</div>
						)}
					</div>
				</div>

				{/* Middle: Canvas */}
				<div
					style={{
						flex: 1,
						display: 'flex',
						flexDirection: 'column',
						padding: '1rem',
						borderRight: '1px solid var(--border-subtle)',
					}}
				>
					<div
						style={{
							marginBottom: '1rem',
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
						}}
					>
						<div
							style={{
								fontSize: '1.25rem',
								fontWeight: 'bold',
								color: 'var(--color-yellow)',
							}}
						>
							💰 ${gameState.money}
						</div>
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: '1rem',
							}}
						>
							<div
								style={{
									color: 'var(--text-secondary)',
									marginRight: '1rem',
								}}
							>
								Land: {displayCols}x{displayRows}
							</div>
						</div>
					</div>

					{/* Meteor Toasts – fixed overlay stacked vertically in top-right */}
					{meteorToasts.length > 0 && (
						<div
							style={{
								position: 'fixed',
								top: '5rem',
								right: '1.25rem',
								zIndex: 9999,
								display: 'flex',
								flexDirection: 'column',
								gap: '0.6rem',
								pointerEvents: 'none',
							}}
						>
							{meteorToasts.map((toast) => (
								<MeteorToast
									key={toast.id}
									toast={toast}
									onClose={() => {
										if (meteorToastTimers.current[toast.id]) {
											clearTimeout(
												meteorToastTimers.current[
													toast.id
												],
											);
											delete meteorToastTimers.current[
												toast.id
											];
										}
										setMeteorToasts((prev) =>
											prev.filter((t) => t.id !== toast.id),
										);
									}}
								/>
							))}
						</div>
					)}

					<div
						style={{
							flex: 1,
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							backgroundColor: '#111',
							borderRadius: '8px',
							overflow: 'hidden',
						}}
					>
						<GameCanvasSprite
							cols={displayCols}
							rows={displayRows}
							cells={cells2D}
							robot={{
								x: gameState.rx,
								y: gameState.ry,
								dir: gameState.rdir,
							}}
							onCellClick={() => {}}
						/>
					</div>
				</div>

				{/* Right: Editor & Console */}
				<div
					style={{
						width: '450px',
						display: 'flex',
						flexDirection: 'column',
					}}
				>
					<div
						className="rg-editor-toolbar"
						style={{
							padding: '1rem',
							borderBottom: '1px solid var(--border-subtle)',
						}}
					>
						<span className="rg-editor-label">
							Python Bot Script
						</span>
						<span className="rg-editor-hint">
							{skulptReady ? '✅ Ready' : '⏳ Loading…'}
						</span>
					</div>
					<div style={{ flex: 1, overflow: 'hidden' }}>
						<GameCodeEditor
							code={editorCode}
							onChange={setEditorCode}
							onRun={handleRun}
							disabled={animating || !skulptReady}
						/>
					</div>

					<div
						style={{
							padding: '1rem',
							borderTop: '1px solid var(--border-subtle)',
							display: 'flex',
							gap: '1rem',
						}}
					>
						{animating ? (
							<button
								className="btn btn-primary"
								style={{
									backgroundColor: 'var(--color-danger)',
									borderColor: 'var(--color-danger)',
									color: 'white',
								}}
								onClick={handleStop}
							>
								🛑 Stop Script
							</button>
						) : (
							<button
								className="btn btn-primary"
								onClick={handleRun}
								disabled={!skulptReady}
							>
								▶ Run Code
							</button>
						)}
						<button
							className="btn btn-ghost"
							onClick={handleReset}
							disabled={animating}
						>
							↺ Reset Game
						</button>
					</div>

					<div
						className="rg-console"
						style={{
							height: '200px',
							borderTop: '1px solid var(--border-subtle)',
						}}
					>
						<div className="rg-console-header">Console Output</div>
						<div
							className="rg-console-body"
							style={{
								whiteSpace: 'pre-wrap',
								fontFamily: 'monospace',
							}}
						>
							{consoleText}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
