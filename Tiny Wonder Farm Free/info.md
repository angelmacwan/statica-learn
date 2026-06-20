# Tiny Wonder Farm Free - Asset Pack Reference Guide

## Asset Pack Overview

**Pack Name:** Tiny Wonder Farm Free  
**Asset Type:** Pixel art sprite sheets and tilesets for 2D farming/adventure game  
**Art Style:** Cute, top-down isometric-inspired pixel art  
**Base Resolution:** 16x16 pixel grid (primary sprite unit)

---

## Directory Structure

```
Tiny Wonder Farm Free/
├── characters/
│   ├── main character/
│   │   ├── walk and idle.png (192x72)
│   │   ├── portrait male.png (64x64)
│   │   └── portrait female.png (64x64)
│   └── main character old/ (deprecated version, use "main character" folder)
├── objects&items/
│   ├── farm objects free.png (144x191)
│   ├── furniture free.png (80x48)
│   ├── items free.png (80x48)
│   └── plants free.png (80x96)
└── tilemaps/
    ├── spring farm tilemap.png (144x320)
    ├── farm inside free.png (96x128)
    └── farm bridges free.png (192x176)
```

---

## CHARACTER ASSETS

### Main Character - Walk & Idle Animation

**File:** `characters/main character/walk and idle.png`  
**Dimensions:** 192x72 pixels  
**Frame Size:** 32x32 pixels per frame  
**Total Frames:** 6 frames horizontally

**Frame Layout (left to right):**

- Frame 0: Idle pose (default standing)
- Frame 1: Walk frame 1 (left leg forward)
- Frame 2: Walk frame 2 (neutral stance)
- Frame 3: Walk frame 3 (right leg forward)
- Frame 4: Walk frame 4 (neutral stance)
- Frame 5: Walk frame 5 (alternative pose/rest)

**Usage Notes:**

- One animation row covers all movement frames
- Use frames 0-2 for walking loop (3 frames, ~200ms per frame for smooth animation)
- Frame 0 for idle/stationary states
- Character faces downward (south direction) in this spritesheet
- Transparent background (PNG with alpha channel)

**Recommended Animation Timing:**

- Walk cycle: 60-80ms per frame (8-10 FPS) for natural movement
- Idle: Single frame, no animation

---

### Character Portraits

**Files:**

- `characters/main character/portrait male.png` (64x64)
- `characters/main character/portrait female.png` (64x64)

**Usage:**

- Full-body character portraits, not animated
- Use for UI menus, character selection, dialogue boxes
- Facing forward/slightly angled
- Include in-game UI layer or dialogue panel

---

## OBJECTS & ITEMS ASSETS

### Farm Objects

**File:** `objects&items/farm objects free.png`  
**Dimensions:** 144x191 pixels  
**Estimated Grid:** ~16x16 base with varying heights

**Contents (typical farm objects):**

- Fences and gates
- Planting beds and rows
- Farm structures (sheds, crates)
- Water troughs and barrels
- Signage

**Placement Notes:**

- Objects have varying heights (some ~32px, some ~48px)
- Use for static world decoration and farm infrastructure
- Layer objects based on Y-position (bottom of sprite) for proper depth sorting

---

### Furniture

**File:** `objects&items/furniture free.png`  
**Dimensions:** 80x48 pixels  
**Grid Layout:** ~16x16 pixel base units (approximately 5 items wide, 3 items tall)

**Typical Contents:**

- Chairs, tables, benches
- Shelving, storage
- Indoor decorative elements
- Beds, cots

**Usage:**

- Indoor/house decoration
- Place in farm interiors (combines with "farm inside" tilemap)
- Non-interactive decoration

---

### Items/Collectibles

**File:** `objects&items/items free.png`  
**Dimensions:** 80x48 pixels  
**Grid Layout:** ~16x16 pixel base units (approximately 5 items wide, 3 items tall)

**Typical Contents:**

- Harvestable crops (vegetables, fruits)
- Resource pickups (seeds, tools)
- Quest items
- Currency items (coins, gems)

**Usage:**

- World pickups that player can collect
- Should play pickup animation when collected
- Implement collision detection for collection

---

### Plants/Crops

**File:** `objects&items/plants free.png`  
**Dimensions:** 80x96 pixels  
**Grid Layout:** ~16x16 pixel base units (approximately 5 items wide, 6 items tall)

**Growth Stages (typical pattern):**

- Row 1: Seeds/planted stage
- Row 2: Early growth
- Row 3: Mid growth
- Row 4: Ready to harvest
- Additional rows: Variants or alternative plants

**Usage:**

- Represent crop growth progression
- Cycle through frames as in-game time progresses
- Use for visual feedback on farm productivity
- Implement growth state machine (seed -> growing -> harvestable -> harvested)

---

## TILEMAP & ENVIRONMENT ASSETS

### Spring Farm Tilemap

**File:** `tilemaps/spring farm tilemap.png`  
**Dimensions:** 144x320 pixels  
**Base Tile Size:** 16x16 pixels  
**Grid Layout:** 9 tiles wide x 20 tiles tall

**Contents:**

- Grass and dirt ground tiles
- Water tiles (ponds, streams)
- Fence tiles (corners, straights, gates)
- Decorative ground elements
- Path/road tiles

**Intended Use:**

- Terrain layer base (grassland exterior farm)
- Spring/warm season aesthetic
- Build outdoor farm maps using tilemap editor or programmatically

**Typical Tilemap Construction:**

```
Tile Index Reference (9 columns, variable rows):
[0,0] [1,0] [2,0] [3,0] [4,0] [5,0] [6,0] [7,0] [8,0]
[0,1] [1,1] [2,1] ...
etc.
```

---

### Farm Interior (Indoor)

**File:** `tilemaps/farm inside free.png`  
**Dimensions:** 96x128 pixels  
**Base Tile Size:** 16x16 pixels  
**Grid Layout:** 6 tiles wide x 8 tiles tall

**Contents:**

- Wooden floor tiles
- Wall sections
- Door frames
- Shelving/storage fixtures
- Interior walls (varying patterns)

**Usage:**

- Indoor farm buildings (house, barn, shed)
- Combine with furniture assets for complete interiors
- Layer above furniture for wall depth

---

### Farm Bridges

**File:** `tilemaps/farm bridges free.png`  
**Dimensions:** 192x176 pixels  
**Base Tile Size:** 16x16 pixels  
**Grid Layout:** 12 tiles wide x 11 tiles tall

**Contents:**

- Wooden bridge sections (straight, corners, ramps)
- Bridge railings
- Connection tiles (wood to grass transitions)

**Usage:**

- Connect map sections over water
- Visual transitions between terrain types
- Elevation/depth hints for player navigation

---

## TECHNICAL IMPLEMENTATION GUIDE

### Spritesheet Data Structure

When loading sprites into your game, use this format:

```javascript
const assetPack = {
	characters: {
		mainCharacter: {
			walkAndIdle: {
				source: 'characters/main character/walk and idle.png',
				dimensions: { width: 192, height: 72 },
				frameSize: { width: 32, height: 32 },
				totalFrames: 6,
				frames: {
					idle: 0,
					walk1: 1,
					walk2: 2,
					walk3: 3,
					walk4: 4,
					walk5: 5,
				},
			},
			portraitMale: {
				source: 'characters/main character/portrait male.png',
				dimensions: { width: 64, height: 64 },
			},
			portraitFemale: {
				source: 'characters/main character/portrait female.png',
				dimensions: { width: 64, height: 64 },
			},
		},
	},
	objects: {
		farmObjects: {
			source: 'objects&items/farm objects free.png',
			dimensions: { width: 144, height: 191 },
			baseUnit: 16,
		},
		furniture: {
			source: 'objects&items/furniture free.png',
			dimensions: { width: 80, height: 48 },
			gridSize: { cols: 5, rows: 3 },
		},
		items: {
			source: 'objects&items/items free.png',
			dimensions: { width: 80, height: 48 },
			gridSize: { cols: 5, rows: 3 },
		},
		plants: {
			source: 'objects&items/plants free.png',
			dimensions: { width: 80, height: 96 },
			gridSize: { cols: 5, rows: 6 },
			growthStages: 6,
		},
	},
	tilemaps: {
		springFarm: {
			source: 'tilemaps/spring farm tilemap.png',
			dimensions: { width: 144, height: 320 },
			tileSize: 16,
			gridSize: { cols: 9, rows: 20 },
		},
		farmInside: {
			source: 'tilemaps/farm inside free.png',
			dimensions: { width: 96, height: 128 },
			tileSize: 16,
			gridSize: { cols: 6, rows: 8 },
		},
		farmBridges: {
			source: 'tilemaps/farm bridges free.png',
			dimensions: { width: 192, height: 176 },
			tileSize: 16,
			gridSize: { cols: 12, rows: 11 },
		},
	},
};
```

### Canvas Rendering Example

```javascript
// Draw character walk animation
function drawCharacter(ctx, image, frameIndex, x, y) {
	const frameWidth = 32;
	const frameHeight = 32;
	const sourceX = frameIndex * frameWidth;
	const sourceY = 0;

	ctx.drawImage(
		image,
		sourceX,
		sourceY, // Source position
		frameWidth,
		frameHeight, // Source dimensions
		x,
		y, // Destination position
		frameWidth * 2,
		frameHeight * 2, // Scaled 2x for visibility
	);
}

// Draw tilemap tile
function drawTile(ctx, tilesetImage, tileIndex, x, y, tileSize = 16) {
	const tilesPerRow = 9; // For spring farm tilemap
	const tileX = (tileIndex % tilesPerRow) * tileSize;
	const tileY = Math.floor(tileIndex / tilesPerRow) * tileSize;

	ctx.drawImage(
		tilesetImage,
		tileX,
		tileY,
		tileSize,
		tileSize,
		x,
		y,
		tileSize,
		tileSize,
	);
}

// Draw sprite from fixed grid
function drawSprite(ctx, spritesheet, gridX, gridY, x, y, spriteSize = 16) {
	const sourceX = gridX * spriteSize;
	const sourceY = gridY * spriteSize;

	ctx.drawImage(
		spritesheet,
		sourceX,
		sourceY,
		spriteSize,
		spriteSize,
		x,
		y,
		spriteSize,
		spriteSize,
	);
}
```

---

## ANIMATION TIMINGS

### Recommended Timings by Asset Type

| Asset Type         | Frame Delay (ms) | Effect                    |
| ------------------ | ---------------- | ------------------------- |
| Walk cycle         | 60-100           | Natural movement          |
| Plant growth pulse | 500-1000         | Gentle growth indication  |
| Item pickup        | 150-200          | Quick, satisfying collect |
| Idle breathing     | 800-1200         | Subtle character life     |
| Tool use           | 200-300          | Responsive feeling        |

---

## COLOR PALETTE NOTES

The asset pack uses a limited, warm color palette suitable for:

- HTML5 Canvas scaling (pixel-perfect when scaled 2x or 4x)
- Mobile-friendly rendering
- Retro aesthetic consistency

Recommended canvas scale: 2x or 4x (multiply all pixel dimensions)

---

## DEPTH SORTING

For correct visual layering:

**Layer Order (back to front):**

1. Tilemap base layer (terrain)
2. Static objects at far depth (fences, distant buildings)
3. Collectible items
4. Main character
5. Objects above character (overhanging trees, roof edges)
6. UI/HUD layer

**Depth Calculation:**

```javascript
depth = spriteY + spriteHeight; // Use bottom of sprite for Y-sort
// Sort all drawable objects by this depth value each frame
```

---

## LICENSE & USAGE

This asset pack is typically provided under a free/CC0 license allowing personal and commercial use. Confirm the specific license if distributing commercially.

---

## QUICK START CHECKLIST

- [ ] Load all PNG images as Image objects in your game engine
- [ ] Create sprite drawing functions for each asset type
- [ ] Implement animation loop (60 FPS target) for character walk cycle
- [ ] Set up tilemap rendering system with 16x16 base tile size
- [ ] Implement depth sorting for proper visual layering
- [ ] Test portrait UI integration
- [ ] Test plant growth state progression
- [ ] Verify collision boxes align with pixel art (typically 16x16 or smaller)

---

## DEBUGGING TIPS

**If sprites look blurry:**

- Ensure canvas rendering uses integer scaling (2x, 4x, not 1.5x)
- Check image interpolation settings (use `imageSmoothingEnabled = false`)

**If animations look choppy:**

- Verify frame timings are consistent with game loop (60 FPS)
- Check frame skip logic if game performance drops

**If depth sorting is wrong:**

- Verify Y-coordinate calculation includes full sprite height
- Check that all objects use same depth formula

**If tilesets misalign:**

- Confirm tile size matches metadata (16x16 for this pack)
- Verify grid position calculations use integer arithmetic
