import { useState, useEffect, useRef, useCallback } from 'react';
import Header from '../components/Header.jsx';
import GameCanvasSprite from '../components/GameCanvasSprite.jsx';
import GameCodeEditor from '../components/GameCodeEditor.jsx';
import { GameExecutor } from '../game/GameExecutor.js';

const SKULPT_CDN = 'https://skulpt.org/js/skulpt.min.js';
const SKULPT_STDLIB = 'https://skulpt.org/js/skulpt-stdlib.js';
const ANIM_SPEED = 200;

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
const PROGRESS_KEY = 'statica-robot-gardener-game-save';

class VirtualGame {
	constructor(state) {
		this.x = state.rx ?? 0;
		this.y = state.ry ?? 0;
		this.dir = state.rdir ?? 1; // 0=N, 1=E, 2=S, 3=W
		this.money = state.money;
		this.tier = state.tier;
		this.cells = JSON.parse(JSON.stringify(state.cells));
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
			const cell = this.cells[`${nx},${ny}`];
			if (cell && (cell.state === 'STONE' || cell.state === 'BRANCH')) {
				throw new Error(`Cannot move into ${cell.state}`);
			}
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
		if (this.cells[key] && this.cells[key].state !== 'EMPTY')
			throw new Error(`Cell not empty`);
		this.money -= PLANTS[type].cost;
		this.cells[key] = { state: 'SEEDED', plantType: type };
		return { key, cell: this.cells[key] };
	}

	water() {
		const key = `${this.x},${this.y}`;
		if (!this.cells[key] || this.cells[key].state !== 'SEEDED')
			throw new Error(`Nothing to water`);
		this.cells[key] = {
			...this.cells[key],
			state: 'GROWING',
			plantTime: Date.now(),
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
		if (!cell || cell.state !== obstacle)
			throw new Error(`No ${obstacle} here`);
		delete this.cells[key];
		return { key, cell: null };
	}

	checkCell() {
		const cell = this.cells[`${this.x},${this.y}`];
		return cell ? cell.state : 'EMPTY';
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

export default function RobotGardenerGameModule() {
	const [skulptReady, setSkulptReady] = useState(false);
	const [animating, setAnimating] = useState(false);
	const [editorCode, setEditorCode] = useState(
		"print('Starting bot...')\nmove_forward()\n",
	);
	const [consoleLines, setConsoleLines] = useState([]);

	const [gameState, setGameState] = useState(() => {
		const saved = localStorage.getItem(PROGRESS_KEY);
		if (saved) {
			try {
				return JSON.parse(saved);
			} catch (e) {}
		}
		return {
			money: INITIAL_MONEY,
			tier: 1,
			cells: {}, // key: "x,y", value: { state, plantType, plantTime }
			rx: 0,
			ry: 0,
			rdir: 1, // Robot pos
		};
	});

	const executorRef = useRef(new GameExecutor());
	const animTimerRef = useRef(null);

	useEffect(() => {
		localStorage.setItem(PROGRESS_KEY, JSON.stringify(gameState));
	}, [gameState]);

	useEffect(() => {
		(async () => {
			try {
				await loadScript(SKULPT_CDN);
				await loadScript(SKULPT_STDLIB);
				setSkulptReady(true);
			} catch (e) {}
		})();
	}, []);

	// Growth Tick
	useEffect(() => {
		if (animating) return; // Pause growth while animating to prevent conflicts
		const tick = setInterval(() => {
			setGameState((prev) => {
				let changed = false;
				const newCells = { ...prev.cells };
				const now = Date.now();
				const currentTier = GRID_TIERS.find(
					(t) => t.level === prev.tier,
				);

				for (let y = 0; y < currentTier.rows; y++) {
					for (let x = 0; x < currentTier.cols; x++) {
						const key = `${x},${y}`;
						const cell = newCells[key];
						if (cell) {
							if (cell.state === 'GROWING') {
								const plantInfo = PLANTS[cell.plantType];
								if (plantInfo) {
									const elapsedSeconds =
										(now - cell.plantTime) / 1000;
									if (elapsedSeconds >= plantInfo.growTime) {
										newCells[key] = {
											...cell,
											state: 'HARVESTABLE',
										};
										changed = true;
									}
								}
							}
						} else {
							if (Math.random() < 0.005) {
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
				if (changed) return { ...prev, cells: newCells };
				return prev;
			});
		}, 1000);
		return () => clearInterval(tick);
	}, [animating]);

	const handleRun = async () => {
		if (!skulptReady || animating) return;
		clearTimeout(animTimerRef.current);
		setAnimating(true);
		setConsoleLines([]);

		const vGame = new VirtualGame(gameState);
		const result = await executorRef.current.execute(
			editorCode,
			vGame,
			vGame,
		);

		setConsoleLines(
			result.output ? result.output.split('\n').filter(Boolean) : [],
		);

		if (!result.success) {
			setConsoleLines((prev) => [...prev, `[ERROR]: ${result.error}`]);
			setAnimating(false);
			return;
		}

		const log = result.log || [];
		if (log.length === 0) {
			setAnimating(false);
			return;
		}

		// Playback
		let step = 0;
		const tickAnim = () => {
			if (step >= log.length) {
				setAnimating(false);
				return;
			}
			const action = log[step];

			setGameState((prev) => {
				const next = {
					...prev,
					rx: action.robot.x,
					ry: action.robot.y,
					rdir: action.robot.dir,
					money: action.robot.money,
				};
				if (action.cellKey) {
					const cells = { ...next.cells };
					if (action.cellData === null) {
						delete cells[action.cellKey];
					} else {
						cells[action.cellKey] = action.cellData;
					}
					next.cells = cells;
				}
				if (action.type === 'buy_land') {
					next.tier = action.robot.tier || prev.tier + 1; // vGame already bumped the tier, but let's increment safely
					const nTier = GRID_TIERS.find((t) => t.cost <= next.money); // Hack: use precise tier logic if needed
					// Actually, virtualGame updated money, so just sync tier
					const currentPossibleTier = GRID_TIERS.slice()
						.reverse()
						.find((t) => t.cost <= INITIAL_MONEY + prev.money);
					// Safest is to just re-evaluate tier based on log if needed, or simply increment.
					next.tier = prev.tier + 1;
				}
				return next;
			});

			step++;
			animTimerRef.current = setTimeout(tickAnim, ANIM_SPEED);
		};
		tickAnim();
	};

	const handleReset = () => {
		setGameState({
			money: INITIAL_MONEY,
			tier: 1,
			cells: {},
			rx: 0,
			ry: 0,
			rdir: 1,
		});
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
				{/* Far Left: API Reference Sidebar */}
				<div
					style={{
						width: '300px',
						display: 'flex',
						flexDirection: 'column',
						padding: '1rem',
						borderRight: '1px solid var(--border-subtle)',
						backgroundColor: 'var(--ui-01)',
						overflowY: 'auto',
					}}
				>
					<h3 style={{ margin: '0 0 1rem 0', fontSize: '1.4rem' }}>
						API Reference
					</h3>
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							gap: '0.75rem',
						}}
					>
						<span
							className="rg-cmd-pill"
							style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}
						>
							move_forward()
						</span>
						<span
							className="rg-cmd-pill"
							style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}
						>
							turn_right()
						</span>
						<span
							className="rg-cmd-pill"
							style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}
						>
							turn_left()
						</span>
						<span
							className="rg-cmd-pill"
							style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}
						>
							plant(str)
						</span>
						<span
							className="rg-cmd-pill"
							style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}
						>
							water()
						</span>
						<span
							className="rg-cmd-pill"
							style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}
						>
							harvest()
						</span>
						<span
							className="rg-cmd-pill"
							style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}
						>
							use_pickaxe()
						</span>
						<span
							className="rg-cmd-pill"
							style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}
						>
							use_axe()
						</span>
						<span
							className="rg-cmd-pill"
							style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}
						>
							check_cell()
						</span>
						<span
							className="rg-cmd-pill"
							style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}
						>
							get_money()
						</span>
						<span
							className="rg-cmd-pill"
							style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}
						>
							get_farm_size()
						</span>
						<span
							className="rg-cmd-pill"
							style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}
						>
							get_position()
						</span>
						<span
							className="rg-cmd-pill"
							style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}
						>
							print(msg)
						</span>
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
							<div style={{ color: 'var(--text-secondary)' }}>
								Land: {displayCols}x{displayRows}
							</div>
							{nextTier && (
								<button
									className="btn btn-primary"
									style={{
										padding: '0.25rem 0.75rem',
										fontSize: '0.875rem',
									}}
									disabled={
										gameState.money < nextTier.cost ||
										animating
									}
									onClick={handleUpgrade}
								>
									Buy Land {nextTier.cols}x{nextTier.rows} ($
									{nextTier.cost})
								</button>
							)}
						</div>
					</div>

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
						<button
							className="btn btn-primary"
							onClick={handleRun}
							disabled={animating || !skulptReady}
						>
							{animating ? '⏳ Running…' : '▶ Run Code'}
						</button>
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
						<div className="rg-console-body">
							{consoleLines.map((l, i) => (
								<div key={i}>&gt; {l}</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
