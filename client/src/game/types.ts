export type GamePhase = 'menu' | 'playing' | 'gameOver'

export type Direction =
  | 'north'
  | 'south'
  | 'west'
  | 'east'
  | 'northWest'
  | 'northEast'
  | 'southWest'
  | 'southEast'

export type GridCoord = {
  x: number
  y: number
}

export type InputState = {
  up: boolean
  down: boolean
  left: boolean
  right: boolean
}

export type PlayerState = {
  coord: GridCoord
  facing: Direction
  hp: number
  maxHp: number
  invulnerableUntilMs: number
}

export type EnemyState = {
  id: string
  coord: GridCoord
  hp: number
  maxHp: number
}

export type XpDropState = {
  id: string
  coord: GridCoord
  amount: number
}

export type WeaponState = {
  id: 'pawnStrike'
  cooldownMs: number
  damage: number
  range: number
  readyAtMs: number
}

export type EffectKind =
  | 'pawn-strike'
  | 'hit-flash'
  | 'death-pop'
  | 'damage-number'
  | 'king-hit'
  | 'xp-pickup'

export type VisualEffectState = {
  id: string
  kind: EffectKind
  coord: GridCoord
  cells?: GridCoord[]
  value?: number
  expiresAtMs: number
}

export type RunStats = {
  kills: number
  xp: number
  level: number
  elapsedMs: number
}

export type GameState = {
  phase: GamePhase
  nowMs: number
  player: PlayerState
  enemies: EnemyState[]
  xpDrops: XpDropState[]
  weapon: WeaponState
  effects: VisualEffectState[]
  nextSpawnAtMs: number
  enemyCounter: number
  dropCounter: number
  effectCounter: number
  stats: RunStats
}

export type BoardCell = {
  coord: GridCoord
  key: string
  parity: 'light' | 'dark'
}

export type Viewport = {
  center: GridCoord
  radiusX: number
  radiusY: number
  minX: number
  maxX: number
  minY: number
  maxY: number
  width: number
  height: number
}

export type RenderEntity = {
  id: string
  kind: 'player' | 'enemy' | 'xp'
  spriteKey: 'king' | 'enemy-pawn' | 'xp-shard'
  coord: GridCoord
  hpPercent?: number
  facing?: Direction
  isInvulnerable?: boolean
}

export type RenderEffect = {
  id: string
  kind: EffectKind
  coord: GridCoord
  cells?: GridCoord[]
  value?: number
}

export type HudState = {
  hp: number
  maxHp: number
  kills: number
  xp: number
  level: number
  elapsedMs: number
  enemyCount: number
}

export type RenderFrame = {
  phase: GamePhase
  viewport: Viewport
  cells: BoardCell[]
  entities: RenderEntity[]
  effects: RenderEffect[]
  hud: HudState
}

export type GameIntent = { type: 'start' } | { type: 'restart' }
