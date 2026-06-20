# Custom Tileset Requirements

If you want to create your own tileset and assets for the Robot Gardener game, you will need to replace the 4 main image files currently being used. All sprites are drawn at **16x16 pixels**, and the game expects certain sprites to be at specific coordinates within your sprite sheets.

Here is the exact checklist of what you need to create:

## 1. Tilemap (`tilemap.png`)

This is the base grid for the farm. The game calculates coordinates assuming a grid of 16x16 tiles, with **9 tiles per row**.

- **Tile Index 1 (X: 16, Y: 0): Farmable Dirt**
    - This is drawn for any unlocked cell where you can plant seeds.
- **Tile Index 8 (X: 128, Y: 0): Locked Area**
    - This is drawn for land that hasn't been bought yet (usually dark grass, a fence pattern, or water).

## 2. Plants (`plants.png`)

This sheet contains the growth stages for crops. The game reads rows (Y-coordinates in multiples of 16px).

- **Row 0 (X: 0, Y: 0): Seeded Stage**
    - Just planted dirt/seeds.
- **Row 2 (X: 0, Y: 32): Growing Stage**
    - A small sprout or mid-growth plant.
- **Row 3 (X: 0, Y: 48): Harvestable Stage**
    - The fully mature crop ready to be harvested.

_(Note: Currently, the game uses the same sprites for all crop types, but you can expand the canvas logic later to read different columns for wheat, tomato, sunflower, etc.)_

## 3. Objects & Obstacles (`objects.png`)

Obstacles that spawn dynamically on empty plots.

- **Stone (X: 0, Y: 48)**
    - A rock that must be cleared with a pickaxe.
- **Branch/Wood (X: 16, Y: 48)**
    - A wooden branch or log that must be cleared with an axe.

## 4. Character (`character.png`)

The player/robot sprite. The game expects 4 directional facings, each on a different row. You only need the first frame (X: 0) of each row.

- **Row 0 (X: 0, Y: 0): Facing South / Down**
- **Row 1 (X: 0, Y: 16): Facing North / Up**
- **Row 2 (X: 0, Y: 32): Facing East / Right**
- **Row 3 (X: 0, Y: 48): Facing West / Left**

---

### How to use your new assets:

Once you've drawn your sprite sheets, place them in your `public/assets/` folder and update the `ASSETS` dictionary at the top of `src/components/GameCanvasSprite.jsx` to point to your new file paths:

```javascript
const ASSETS = {
	tilemap: '/assets/my_custom_farm/tilemap.png',
	plants: '/assets/my_custom_farm/plants.png',
	character: '/assets/my_custom_farm/character.png',
	objects: '/assets/my_custom_farm/objects.png',
};
```
