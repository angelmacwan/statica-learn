# Robot Gardener - Gameplay Edition Specification

## 1. Overview

The Gameplay Edition of "Robot Gardener" shifts the focus from learning basics to an engaging, progression-driven farming simulation. The primary objective is to earn money by growing and harvesting crops, allowing the player to unlock new plant types and expand their farmable land.

## 2. Core Gameplay Loop

1. **Planting**: The player purchases seeds and plants them on empty plots.
2. **Watering**: Seeds require water to begin their growth cycle.
3. **Waiting**: Crops take time (in real-time seconds or ticks) to grow.
4. **Harvesting**: Fully grown crops can be harvested to yield money.
5. **Upgrading**: Earned money is reinvested to buy better seeds, expand land, or clear obstacles.

## 3. Entities & Graphics (Emoji Phase)

For the initial implementation, we will use emojis to represent the game state. This will be replaced by sprite graphics in a later phase.

| Entity         |  Emoji  | Description                                    |
| :------------- | :-----: | :--------------------------------------------- |
| Empty Plot     |   🟫    | Ready for planting.                            |
| Seed           |   🌱    | Just planted, needs water.                     |
| Watered Crop   |   💧    | Growing crop.                                  |
| Fully Grown    | 🌻 / 🍅 | Ready to harvest (varies by plant type).       |
| Stone          |   🪨    | Blocks planting, requires a Pickaxe to remove. |
| Branch         |   🪵    | Blocks planting, requires an Axe to remove.    |
| Pickaxe        |   ⛏️    | Tool used to destroy stones.                   |
| Axe            |   🪓    | Tool used to destroy branches.                 |
| Watering Can   |   🚿    | Tool used to water seeds.                      |
| Harvest Sickle |   🌾    | Tool used to harvest crops.                    |

## 4. Progression System

### 4.1. Land Expansion

The player starts with a small plot and can purchase expansions. Each tier significantly increases the farming area but comes with an exponentially higher cost.

|   Tier    | Dimensions | Total Plots | Upgrade Cost |
| :-------: | :--------: | :---------: | :----------: |
| 1 (Start) |   1 x 3    |      3      |     Free     |
|     2     |   3 x 3    |      9      |     $50      |
|     3     |   6 x 6    |     36      |     $300     |
|     4     |   9 x 9    |     81      |    $1,500    |
|     5     |  12 x 12   |     144     |    $5,000    |
|  6 (Max)  |  24 x 24   |     576     |   $25,000    |

### 4.2. Plant Types

Different plants offer varying risk/reward profiles based on seed cost, growth time, and harvest value.

| Plant     | Emoji | Seed Cost | Growth Time | Harvest Value | Profit/Time Ratio |
| :-------- | :---: | :-------: | :---------: | :-----------: | :---------------: |
| Wheat     |  🌾   |    $2     |     10s     |      $5       |     Moderate      |
| Tomato    |  🍅   |    $5     |     30s     |      $15      |       High        |
| Sunflower |  🌻   |    $15    |     60s     |      $40      |      Steady       |
| Pumpkin   |  🎃   |    $40    |    120s     |     $120      |      Premium      |

## 5. Obstacles & Maintenance

To prevent idle gameplay from being too easy, obstacles will spawn dynamically.

- **Spawning Mechanic**: If an empty plot (🟫) is left unplanted for a random duration (e.g., 2-5 minutes), there is a chance for a Stone (🪨) or Branch (🪵) to spawn.
- **Clearing Obstacles**:
    - **Stone**: Requires the player to equip/use the **Pickaxe**.
    - **Branch**: Requires the player to equip/use the **Axe**.
    - _Optional design choice_: Using tools costs a small amount of stamina or money, or they need to be bought once.

## 6. Implementation Steps

1. **Grid Data Structure**: Create a 2D array or map system that can dynamically resize when land is upgraded.
2. **State Machine**: Implement a state machine for each plot: `EMPTY` -> `SEEDED` -> `GROWING` -> `HARVESTABLE` or `EMPTY` -> `OBSTACLE`.
3. **Game Loop / Tick System**: Implement a background timer that processes growth times and random obstacle spawns.
4. **Economy Manager**: Create a class/store to track money, handle seed purchases, land upgrades, and harvest payouts.
5. **UI & Interaction**:
    - Render the grid using HTML/CSS grid.
    - Implement click handlers for tools (plant, water, harvest, pickaxe, axe).
6. **Sprite Integration (Future)**: Structure the rendering logic so that swapping emojis `div.innerHTML = "🌱"` for image tags or canvas draw calls `ctx.drawImage(...)` is seamless.
