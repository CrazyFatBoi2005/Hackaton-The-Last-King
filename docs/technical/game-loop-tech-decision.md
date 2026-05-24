# Game Loop Tech Decision

## Recommendation

Build the MVP on the existing Vite + React + TypeScript client, but keep the game loop as a pure TypeScript engine instead of baking gameplay into React components.

The selected stack is:

- Vite for dev server and production static build.
- React for screen orchestration, HUD, level-up cards, result modals, and the visible board renderer.
- Plain TypeScript modules for world math, fixed-step game loop, enemies, weapons, collisions, XP, waves, and effects.
- DOM/CSS grid for the rendered chess viewport, with absolute overlay layers for entities, attacks, XP, and damage numbers.
- No backend, accounts, leaderboard, multiplayer, or live AI API in the game loop.

This is still a deliberate re-evaluation after the infinite-board change. Phaser and PixiJS are stronger canvas renderers, but the MVP only needs to render a small moving viewport over an unbounded logical grid. A pure TS engine plus a 13x13 or 15x15 DOM viewport gives the fastest path to a complete survival loop in a 5-hour hackathon while keeping clean handoff points for graphics and progression agents.

## Evaluated Options

| Option | Current docs/license check | Strengths | Costs for Chess Survivors | Decision |
| --- | --- | --- | --- | --- |
| Phaser 3 + TypeScript | Phaser docs/repo checked 2026-05-24. Phaser has built-in cameras with viewport/world-view concepts and default cameras have no bounds. Phaser repo is MIT licensed. Current repo metadata shows Phaser has moved beyond the old Phaser 3-only assumption, so version pinning would need care. | Mature game framework, built-in scene loop, input, cameras, WebGL/Canvas rendering, collision options. Best if we want a full canvas game engine. | Adds a second app architecture next to React. Level-up UI/cards/HUD still need React-like UI or Phaser UI work. Infinite chess cells are still custom procedural rendering. Version churn adds setup risk during a short jam. | Do not use for MVP. Good fallback if the team pivots to a canvas-first action game. |
| PixiJS + custom game loop | PixiJS v8 docs checked 2026-05-24. Pixi render loop uses a Ticker on requestAnimationFrame and a retained scene graph. PixiJS repo is MIT licensed. | Excellent rendering performance, sprites, particles, filters, WebGL/WebGPU abstraction. Could make many effects smoother than DOM. | It is renderer-first, not a full game engine. We still write state, movement, collisions, pause, upgrades, waves, and UI integration. More setup than needed for a 15x15 viewport. | Not for MVP. Keep as a later render-adapter option if visual density becomes the bottleneck. |
| Vite React + DOM/CSS viewport | Vite docs checked 2026-05-24. Vite supports React TS scaffolds and `vite build` outputs static production assets. React and Vite are MIT licensed. | Already scaffolded in `client`. Fastest path for HUD, modals, keyboard input, retry flow, and responsive layout. Infinite board is cheap because only visible cells render and parity comes from world coords. | React should not re-render huge entity lists every frame. Must keep engine pure and render only a bounded frame snapshot. CSS effects need discipline to avoid layout thrash. | Chosen. |
| Excalibur | Docs/repo checked 2026-05-24. Excalibur is a TypeScript HTML5 canvas engine, BSD 2-Clause licensed. Docs note game state is not provided out of the box. | Nice TypeScript-first engine with actors, canvas, cameras, collision/debug helpers. | Still requires our own state model. Actor/canvas model is heavier than the discrete grid MVP, and less convenient for React level-up screens. Repo notes 0.x rough edges/breaking-change risk. | Not for MVP. Reasonable if a future branch wants a TypeScript canvas engine. |
| KAPLAY/Kaboom | KAPLAY docs/repo checked 2026-05-24. It is a JS/TS HTML5 game library and MIT licensed. | Very fast arcade prototyping, friendly API, examples/playground. | API style is optimized for quick object scripts, not shared inter-agent contracts. Strict chess-grid world math, upgrades, and pauseable state machine would still be custom. Docs are evolving. | Not for MVP. Useful for tiny arcade prototypes, not this shared-agent architecture. |

Sources checked:

- Phaser cameras: https://docs.phaser.io/phaser/concepts/cameras
- Phaser repo/license: https://github.com/phaserjs/phaser
- PixiJS render loop: https://pixijs.com/8.x/guides/concepts/render-loop
- PixiJS license: https://github.com/pixijs/pixijs/blob/dev/LICENSE
- Vite production build: https://vite.dev/guide/build
- Vite guide/license: https://vite.dev/guide/ and https://github.com/vitejs/vite/blob/main/LICENSE
- React license: https://github.com/facebook/react/blob/main/LICENSE
- Excalibur docs/repo: https://excaliburjs.com/ and https://github.com/excaliburjs/Excalibur
- KAPLAY docs/repo: https://kaplayjs.com/docs/guides/ and https://github.com/kaplayjs/kaplay

## Chosen Architecture

Use a headless game engine that produces a render snapshot each tick:

```text
Keyboard input
  -> input queue
  -> fixed-step engine update
  -> game state
  -> render frame snapshot
  -> React board/HUD/modals
```

The engine owns all gameplay rules. React only dispatches player intents and renders the latest `RenderFrame`.

Recommended timing:

- `requestAnimationFrame` loop in a React hook.
- Fixed simulation step of 100ms or 125ms for grid movement, enemy movement, cooldowns, collisions, XP pickup, and wave timers.
- Visual interpolation via CSS transitions for movement and short-lived effects.
- Pause simulation when phase is `levelUp`, `gameOver`, or `victory`.

Game phases:

- `menu`
- `playing`
- `levelUp`
- `gameOver`
- `victory`

The current `server` can remain a health-check/demo shell, but the game must not depend on it.

## Core Modules

Create these under `client/src/game`:

- `types.ts`: shared game contracts for coordinates, entities, weapons, upgrades, effects, events, phases, and render frames.
- `config.ts`: viewport size, tick length, spawn margins, cleanup margins, enemy stats, XP thresholds, player stats, and weapon defaults.
- `world.ts`: coordinate helpers, parity, viewport bounds, world-to-screen mapping, spawn-ring cell selection, visibility checks.
- `engine.ts`: `createInitialGameState`, `stepGame`, `applyIntent`, phase transitions, result calculation.
- `input.ts`: keyboard-to-grid-intent mapping and input buffering.
- `systems/enemySystem.ts`: spawn cadence, enemy movement, despawn/redirect rules.
- `systems/weaponSystem.ts`: cooldowns, chess attack patterns, attack hit resolution.
- `systems/collisionSystem.ts`: king/enemy overlap, i-frames, damage events.
- `systems/xpSystem.ts`: XP drops, pickup radius, level thresholds.
- `systems/upgradeSystem.ts`: generate 3 cards, apply selected upgrade, resume play.
- `systems/waveSystem.ts`: elapsed-time wave escalation and optional boss trigger.
- `systems/effectSystem.ts`: damage numbers, hit flashes, attack telegraphs, death pops, XP pickup effects.
- `useGameLoop.ts`: React hook that owns the RAF, fixed-step accumulator, pause/resume, and dispatch API.

Create/adjust these under `client/src/components`:

- `GameBoard.tsx`: renders visible cells, entity layer, attack/effect layer, XP layer, and the player.
- `Hud.tsx`: HP, XP bar, level, timer, kills, active weapons.
- `LevelUpModal.tsx`: three upgrade cards, keyboard shortcuts optional.
- `ResultModal.tsx`: game over/victory stats and retry.
- `StartScreen.tsx`: first screen/start state, not a marketing page.

## Data Contracts For Other Agents

These should be interfaces, not ad hoc objects hidden inside React components.

### Shared Coordinates

```ts
export type GridCoord = {
  x: number
  y: number
}

export type Direction =
  | 'north'
  | 'south'
  | 'west'
  | 'east'
  | 'northWest'
  | 'northEast'
  | 'southWest'
  | 'southEast'
```

### Render Contract For Graphics Agent

```ts
export type SpriteKey =
  | 'king'
  | 'enemy-pawn'
  | 'enemy-rook'
  | 'enemy-knight'
  | 'enemy-bishop'
  | 'enemy-queen'
  | 'xp-shard'

export type EffectKey =
  | 'pawn-strike'
  | 'knight-pulse'
  | 'bishop-ray'
  | 'rook-charge'
  | 'queen-decree'
  | 'hit-flash'
  | 'death-pop'
  | 'damage-number'
  | 'xp-pickup'

export type RenderEntity = {
  id: string
  spriteKey: SpriteKey
  coord: GridCoord
  hpPercent?: number
  facing?: Direction
  isInvulnerable?: boolean
  state?: 'idle' | 'moving' | 'hit' | 'dying' | 'telegraphing'
}

export type RenderEffect = {
  id: string
  effectKey: EffectKey
  coord: GridCoord
  cells?: GridCoord[]
  value?: number
  createdAtMs: number
  expiresAtMs: number
}

export type RenderFrame = {
  phase: GamePhase
  viewport: Viewport
  cells: BoardCell[]
  entities: RenderEntity[]
  effects: RenderEffect[]
  hud: HudState
}
```

The graphics agent should style `SpriteKey` and `EffectKey`. It should not modify engine rules.

### Weapons And Upgrades For Meta Progression Agent

```ts
export type WeaponId =
  | 'pawnStrike'
  | 'knightPulse'
  | 'bishopRay'
  | 'rookCharge'
  | 'queenDecree'
  | 'kingAura'

export type WeaponDefinition = {
  id: WeaponId
  name: string
  piece: 'pawn' | 'knight' | 'bishop' | 'rook' | 'queen' | 'king'
  description: string
  baseCooldownMs: number
  baseDamage: number
  maxLevel: number
  effectKey: EffectKey
}

export type UpgradeDefinition = {
  id: string
  title: string
  description: string
  rarity: 'common' | 'rare' | 'legendary'
  iconKey: string
  requires?: {
    weaponId?: WeaponId
    minLevel?: number
  }
  apply: UpgradePatch
}

export type UpgradePatch = {
  unlockWeaponId?: WeaponId
  weaponDelta?: Partial<{
    damageMultiplier: number
    cooldownMultiplier: number
    rangeBonus: number
    extraTriggers: number
    pierceBonus: number
  }>
  playerDelta?: Partial<{
    maxHp: number
    pickupRadius: number
    moveCooldownMs: number
    globalCooldownMultiplier: number
  }>
}
```

The meta progression agent should provide data definitions and patches. It should not call engine internals directly.

### Game Events For Audio/Feedback Agents

```ts
export type GameEvent =
  | { type: 'enemyHit'; enemyId: string; damage: number; coord: GridCoord }
  | { type: 'enemyKilled'; enemyId: string; coord: GridCoord }
  | { type: 'kingDamaged'; damage: number; hp: number; coord: GridCoord }
  | { type: 'xpCollected'; amount: number; coord: GridCoord }
  | { type: 'levelUp'; level: number }
  | { type: 'weaponFired'; weaponId: WeaponId; cells: GridCoord[] }
  | { type: 'gameOver'; stats: RunStats }
  | { type: 'victory'; stats: RunStats }
```

## Damage Numbers Strategy

Damage numbers should be visual effects generated from combat events, not independent gameplay entities.

Flow:

1. `weaponSystem` resolves a hit and emits `enemyHit`.
2. `effectSystem` creates a `RenderEffect` with `effectKey: 'damage-number'`, `value: damage`, and a TTL around 650-800ms.
3. `GameBoard` maps the world coord into the current viewport and renders the number in an absolute overlay above the cell.
4. CSS handles upward drift, fade, and slight scale.
5. Expired effects are removed by `effectSystem`.

Rules:

- Do not let damage numbers affect collisions, XP, enemy AI, or layout.
- Coalesce repeated low-value hits on the same cell if too many numbers appear.
- If the game is overloaded near the deadline, damage numbers are the first juice feature to reduce, not core combat/XP.

## Infinite Board / Camera Strategy

The board is infinite in logic and finite in rendering.

World rules:

- Every important object uses integer `GridCoord` world coordinates.
- Coordinates can be negative or positive without bounds.
- Cells are not stored unless an entity/effect/drop references them.
- Cell color is generated from `(x + y) % 2`.

Camera/viewport rules:

- The camera center follows `player.coord`.
- MVP viewport should be 13x13 or 15x15, with odd dimensions so the king can sit near center.
- `Viewport` stores `center`, `radiusX`, `radiusY`, `minX`, `maxX`, `minY`, `maxY`.
- World-to-screen mapping is deterministic:

```ts
screenCol = coord.x - viewport.minX
screenRow = coord.y - viewport.minY
```

Spawn rules:

- Enemies spawn in a band outside the visible viewport, for example 1-3 cells beyond viewport edges.
- Spawns should choose from the ring, not from cells inside the viewport.
- Avoid immediate unfair contact by rejecting cells within a minimum Manhattan/Chebyshev distance from the king.
- Despawn or redirect enemies that are far outside `viewport + cleanupMargin`.
- Because there are no walls, waves should spawn around all sides and bias some spawns toward the player's movement direction to prevent endless straight-line escape.

Collision rules:

- Grid overlap is enough for MVP hit detection.
- King takes damage when an enemy shares the king's coord and `invulnerableUntilMs <= now`.
- Weapon attacks resolve by generated chess-pattern cells against enemy coords.
- Continuous physics, pathfinding, and pixel-perfect collision are out of scope.

## Testing And Verification

Minimum verification:

- `npm run build --workspace client`
- `npm run lint --workspace client`
- Browser smoke test of:
  - start run;
  - WASD/arrow movement;
  - camera follows king across negative and positive coords;
  - enemies spawn outside the viewport;
  - autoattacks damage/kill enemies;
  - XP collection opens level-up pause;
  - choosing an upgrade resumes;
  - i-frames prevent instant repeated damage;
  - game over and retry reset state;
  - production preview loads without console errors.

Pure TS functions worth unit testing if a test runner is added:

- `getCellParity(coord)`
- `getViewport(center, radius)`
- `worldToScreen(coord, viewport)`
- `getSpawnRing(viewport, margin)`
- weapon pattern functions for pawn, knight, bishop, rook, queen
- XP threshold and level-up choice generation

## Risks And Cuts

Risk: React re-renders too much.

Mitigation: render only a bounded viewport and nearby entities, keep effect TTLs short, memoize cells, and keep simulation state outside component-local UI fragments. Avoid per-pixel animation in React state.

Risk: DOM effects become visually chaotic.

Mitigation: keep attack highlights cell-based, cap simultaneous damage numbers, and prioritize readability over particles.

Risk: Infinite board removes pressure.

Mitigation: spawn around the viewport ring, increase density over time, introduce faster enemy types, and bias some spawns in front of long straight movement.

Risk: Too many systems for 5 hours.

Cut order:

1. Queen's Decree and boss phase.
2. Complex enemy behaviors beyond pawn/rook/knight.
3. Damage-number polish/coalescing.
4. Mobile controls.
5. Sound.

Do not cut:

- infinite board/camera;
- king movement;
- enemies and damage/i-frames;
- at least two automatic weapons;
- XP drops;
- level-up pause;
- game over/retry;
- production build.

Final implementation rule: add Phaser/Pixi/Excalibur/KAPLAY only if the team explicitly decides to rewrite rendering. For the MVP, the engine contracts above are the source of truth.
