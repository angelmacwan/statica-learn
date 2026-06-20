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
const CODE_KEY = 'statica-robot-gardener-code-save';

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

	checkBlock() {
		const cell = this.cells[`${this.x},${this.y}`];
		if (!cell) return 'empty';
		if (cell.state === 'STONE') return 'stone';
		if (cell.state === 'BRANCH') return 'branch';
		if (cell.state === 'HARVESTABLE') return 'ready';
		if (cell.plantType) return cell.plantType;
		return 'empty';
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

export default function RobotGardenerGameModule() {
	const [skulptReady, setSkulptReady] = useState(false);
	const [animating, setAnimating] = useState(false);
	const [editorCode, setEditorCode] = useState(() => {
		return localStorage.getItem(CODE_KEY) || "print('Starting bot...')\nmove_forward()\n";
	});
	const [consoleLines, setConsoleLines] = useState([]);
	const [leftTab, setLeftTab] = useState('api');
	const [expandedApi, setExpandedApi] = useState(null);

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

		const log = result.log || [];
		if (log.length === 0) {
			setAnimating(false);
			if (!result.success) {
				setConsoleLines((prev) => [...prev, `[ERROR]: ${result.error}`]);
			}
			return;
		}

		// Playback
		let step = 0;
		const tickAnim = () => {
			if (step >= log.length) {
				setAnimating(false);
				if (!result.success) {
					setConsoleLines((prev) => [...prev, `[ERROR]: ${result.error}`]);
				}
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

	const handleStop = () => {
		if (animTimerRef.current) {
			clearTimeout(animTimerRef.current);
			animTimerRef.current = null;
		}
		setAnimating(false);
		setConsoleLines((prev) => [...prev, '[SYSTEM]: Execution stopped by user.']);
	};

	const handleReset = () => {
		if (!window.confirm('All progress will be lost, and your money will reset to zero. Are you sure you want to reset the game?')) {
			return;
		}
		setGameState({
			money: INITIAL_MONEY,
			tier: 1,
			cells: {},
			rx: 0,
			ry: 0,
			rdir: 1,
		});
		setConsoleLines(['[SYSTEM]: Game reset to tier 1.']);
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
						borderRight: '1px solid var(--border-subtle)',
						backgroundColor: 'var(--ui-01)',
					}}
				>
					<div
						style={{
							display: 'flex',
							borderBottom: '1px solid var(--border-subtle)',
						}}
					>
						<button
							style={{
								flex: 1,
								padding: '1rem',
								background:
									leftTab === 'api'
										? 'transparent'
										: 'var(--ui-02)',
								border: 'none',
								borderBottom:
									leftTab === 'api'
										? '2px solid var(--color-yellow)'
										: 'none',
								color:
									leftTab === 'api'
										? 'var(--text-primary)'
										: 'var(--text-secondary)',
								cursor: 'pointer',
								fontWeight: 'bold',
							}}
							onClick={() => setLeftTab('api')}
						>
							API
						</button>
						<button
							style={{
								flex: 1,
								padding: '1rem',
								background:
									leftTab === 'plants'
										? 'transparent'
										: 'var(--ui-02)',
								border: 'none',
								borderBottom:
									leftTab === 'plants'
										? '2px solid var(--color-yellow)'
										: 'none',
								color:
									leftTab === 'plants'
										? 'var(--text-primary)'
										: 'var(--text-secondary)',
								cursor: 'pointer',
								fontWeight: 'bold',
							}}
							onClick={() => setLeftTab('plants')}
						>
							Plants
						</button>
					</div>

					<div
						style={{ padding: '1rem', overflowY: 'auto', flex: 1 }}
					>
						{leftTab === 'api' && (
							<div
								style={{
									display: 'flex',
									flexDirection: 'column',
									gap: '0.75rem',
								}}
							>
								{[
									{ id: 'move_forward', label: 'move_forward()', doc: 'Moves the robot one tile forward in the direction it is currently facing. Fails if it hits the edge of the farm.' },
									{ id: 'turn_right', label: 'turn_right()', doc: 'Turns the robot 90 degrees clockwise.' },
									{ id: 'turn_left', label: 'turn_left()', doc: 'Turns the robot 90 degrees counter-clockwise.' },
									{ id: 'plant', label: "plant('wheat'|'tomato'|'sunflower'|'pumpkin')", doc: 'Plants a seed of the specified type on the current tile. Costs money. Tile must be empty.' },
									{ id: 'water', label: 'water()', doc: 'Waters the seed on the current tile, causing it to start growing.' },
									{ id: 'harvest', label: 'harvest()', doc: 'Harvests a fully grown plant on the current tile and adds its value to your money.' },
									{ id: 'use_pickaxe', label: 'use_pickaxe()', doc: 'Destroys a stone obstacle on the current tile, freeing up the space.' },
									{ id: 'use_axe', label: 'use_axe()', doc: 'Destroys a wooden branch obstacle on the current tile, freeing up the space.' },
									{ id: 'check_block', label: 'check_block()', doc: "Returns a string representing what is on the current tile. Possible values: 'empty', 'stone', 'branch', 'ready', 'wheat', 'tomato', 'sunflower', 'pumpkin'." },
									{ id: 'reset_bot', label: 'reset_bot()', doc: 'Instantly teleports the robot back to the starting coordinates (0, 0) and faces it East.' },
									{ id: 'get_money', label: 'get_money()', doc: 'Returns your current total money as an integer.' },
									{ id: 'get_farm_size', label: 'get_farm_size()', doc: 'Returns a tuple (width, height) representing the current size of the farm grid.' },
									{ id: 'get_position', label: 'get_position()', doc: "Returns a tuple (x, y) representing the robot's current coordinates." },
									{ id: 'print', label: 'print(msg)', doc: 'Prints a message to the console for debugging.' },
								].map(cmd => (
									<div key={cmd.id} style={{ display: 'flex', flexDirection: 'column' }}>
										<span
											className="rg-cmd-pill"
											onClick={() => setExpandedApi(expandedApi === cmd.id ? null : cmd.id)}
											style={{
												fontSize: '1rem',
												padding: '0.5rem 1rem',
												cursor: 'pointer',
												userSelect: 'none',
												border: expandedApi === cmd.id ? '2px solid var(--color-yellow)' : '2px solid transparent',
												whiteSpace: 'normal',
												wordBreak: 'break-all',
												display: 'inline-block'
											}}
										>
											{cmd.label}
										</span>
										{expandedApi === cmd.id && (
											<div style={{ marginTop: '0.5rem', padding: '0.75rem', backgroundColor: 'rgba(0,0,0,0.15)', borderRadius: '6px', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
												{cmd.doc}
											</div>
										)}
									</div>
								))}
							</div>
						)}
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
												marginBottom: '0.5rem',
											}}
										>
											{p.icon} {p.name}
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
						{animating ? (
							<button
								className="btn btn-primary"
								style={{ backgroundColor: 'var(--color-danger)', borderColor: 'var(--color-danger)', color: 'white' }}
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
