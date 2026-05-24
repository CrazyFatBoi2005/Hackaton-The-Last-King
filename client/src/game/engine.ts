import { GAME_CONFIG } from './config'
import {
  chebyshevDistance,
  coordKey,
  directionFromVector,
  getInputVector,
  getPawnStrikeCells,
  getSpawnCoord,
  getViewport,
  getVisibleCells,
  isCoordInViewport,
  stepToward,
} from './world'
import type {
  EnemyState,
  GameIntent,
  GameState,
  GridCoord,
  InputState,
  RenderFrame,
  VisualEffectState,
  XpDropState,
} from './types'

export function createInitialGameState(phase: GameState['phase'] = 'menu'): GameState {
  return {
    phase,
    nowMs: 0,
    player: {
      coord: { x: 0, y: 0 },
      facing: 'east',
      hp: GAME_CONFIG.playerMaxHp,
      maxHp: GAME_CONFIG.playerMaxHp,
      nextMoveAtMs: 0,
      invulnerableUntilMs: 0,
    },
    enemies: [],
    xpDrops: [],
    weapon: {
      id: 'pawnStrike',
      cooldownMs: GAME_CONFIG.pawnStrikeCooldownMs,
      damage: GAME_CONFIG.pawnStrikeDamage,
      range: GAME_CONFIG.pawnStrikeRange,
      readyAtMs: 450,
    },
    effects: [],
    nextSpawnAtMs: 250,
    enemyCounter: 0,
    dropCounter: 0,
    effectCounter: 0,
    stats: {
      kills: 0,
      xp: 0,
      level: 1,
      elapsedMs: 0,
    },
  }
}

export function applyIntent(state: GameState, intent: GameIntent): GameState {
  if (intent.type === 'start' || intent.type === 'restart') {
    return createInitialGameState('playing')
  }

  return state
}

export function stepGame(state: GameState, input: InputState, dtMs: number): GameState {
  if (state.phase !== 'playing') {
    return state
  }

  let next = {
    ...state,
    nowMs: state.nowMs + dtMs,
    stats: {
      ...state.stats,
      elapsedMs: state.stats.elapsedMs + dtMs,
    },
  }

  next = movePlayer(next, input)
  next = spawnEnemies(next)
  next = moveEnemies(next)
  next = fireWeapon(next)
  next = collectXp(next)
  next = applyContactDamage(next)
  next = expireEffects(next)

  return next
}

export function getRenderFrame(state: GameState): RenderFrame {
  const viewport = getViewport(state.player.coord)
  const playerIsInvulnerable = state.player.invulnerableUntilMs > state.nowMs

  return {
    phase: state.phase,
    viewport,
    cells: getVisibleCells(viewport),
    entities: [
      {
        id: 'player',
        kind: 'player',
        spriteKey: 'king',
        coord: state.player.coord,
        hpPercent: state.player.hp / state.player.maxHp,
        facing: state.player.facing,
        isInvulnerable: playerIsInvulnerable,
      },
      ...state.enemies
        .filter((enemy) => isCoordInViewport(enemy.coord, viewport))
        .map((enemy) => ({
          id: enemy.id,
          kind: 'enemy' as const,
          spriteKey: 'enemy-pawn' as const,
          coord: enemy.coord,
          hpPercent: enemy.hp / enemy.maxHp,
        })),
      ...state.xpDrops
        .filter((drop) => isCoordInViewport(drop.coord, viewport))
        .map((drop) => ({
          id: drop.id,
          kind: 'xp' as const,
          spriteKey: 'xp-shard' as const,
          coord: drop.coord,
        })),
    ],
    effects: state.effects
      .filter((effect) =>
        effect.cells
          ? effect.cells.some((cell) => isCoordInViewport(cell, viewport))
          : isCoordInViewport(effect.coord, viewport),
      )
      .map((effect) => ({
        id: effect.id,
        kind: effect.kind,
        coord: effect.coord,
        cells: effect.cells,
        value: effect.value,
      })),
    hud: {
      hp: state.player.hp,
      maxHp: state.player.maxHp,
      kills: state.stats.kills,
      xp: state.stats.xp,
      level: state.stats.level,
      elapsedMs: state.stats.elapsedMs,
      enemyCount: state.enemies.length,
    },
  }
}

function movePlayer(state: GameState, input: InputState): GameState {
  const { dx, dy } = getInputVector(input)

  if ((dx === 0 && dy === 0) || state.nowMs < state.player.nextMoveAtMs) {
    return state
  }

  const facing = directionFromVector(dx, dy, state.player.facing)

  return {
    ...state,
    player: {
      ...state.player,
      coord: {
        x: state.player.coord.x + dx,
        y: state.player.coord.y + dy,
      },
      facing,
      nextMoveAtMs: state.nowMs + GAME_CONFIG.playerMoveCooldownMs,
    },
  }
}

function spawnEnemies(state: GameState): GameState {
  if (state.nowMs < state.nextSpawnAtMs || state.enemies.length >= GAME_CONFIG.enemyMaxCount) {
    return state
  }

  const spawnCount = state.stats.elapsedMs > 30_000 ? 2 : 1
  const enemies = [...state.enemies]
  let enemyCounter = state.enemyCounter

  for (let index = 0; index < spawnCount && enemies.length < GAME_CONFIG.enemyMaxCount; index += 1) {
    enemyCounter += 1
    enemies.push({
      id: `enemy-${enemyCounter}`,
      coord: getSpawnCoord(state.player.coord),
      hp: GAME_CONFIG.enemyHp,
      maxHp: GAME_CONFIG.enemyHp,
      nextMoveAtMs: state.nowMs + GAME_CONFIG.enemyMoveCooldownMs,
    })
  }

  return {
    ...state,
    enemies,
    enemyCounter,
    nextSpawnAtMs: state.nowMs + GAME_CONFIG.enemySpawnIntervalMs,
  }
}

function moveEnemies(state: GameState): GameState {
  const cleanupDistance = GAME_CONFIG.enemySpawnMaxDistance + GAME_CONFIG.viewportRadius + 5
  const enemies = state.enemies
    .filter((enemy) => chebyshevDistance(enemy.coord, state.player.coord) <= cleanupDistance)
    .map((enemy) => {
      if (state.nowMs < enemy.nextMoveAtMs) {
        return enemy
      }

      return {
        ...enemy,
        coord: stepToward(enemy.coord, state.player.coord),
        nextMoveAtMs: state.nowMs + GAME_CONFIG.enemyMoveCooldownMs,
      }
    })

  return {
    ...state,
    enemies,
  }
}

function fireWeapon(state: GameState): GameState {
  if (state.nowMs < state.weapon.readyAtMs) {
    return state
  }

  const attackCells = getPawnStrikeCells(
    state.player.coord,
    state.player.facing,
    state.weapon.range,
  )
  const hitKeys = new Set(attackCells.map(coordKey))
  const effects: VisualEffectState[] = [
    ...state.effects,
    createEffect(state, 'pawn-strike', state.player.coord, GAME_CONFIG.attackEffectMs, {
      cells: attackCells,
    }),
  ]
  const xpDrops: XpDropState[] = [...state.xpDrops]
  let effectCounter = state.effectCounter + 1
  let dropCounter = state.dropCounter
  let kills = state.stats.kills

  const enemies: EnemyState[] = []

  for (const enemy of state.enemies) {
    if (!hitKeys.has(coordKey(enemy.coord))) {
      enemies.push(enemy)
      continue
    }

    const hp = enemy.hp - state.weapon.damage
    effectCounter += 1
    effects.push({
      id: `effect-${effectCounter}`,
      kind: 'damage-number',
      coord: enemy.coord,
      value: state.weapon.damage,
      expiresAtMs: state.nowMs + GAME_CONFIG.damageNumberMs,
    })

    if (hp > 0) {
      effectCounter += 1
      effects.push({
        id: `effect-${effectCounter}`,
        kind: 'hit-flash',
        coord: enemy.coord,
        expiresAtMs: state.nowMs + GAME_CONFIG.hitEffectMs,
      })
      enemies.push({ ...enemy, hp })
      continue
    }

    kills += 1
    dropCounter += 1
    effectCounter += 1
    xpDrops.push({
      id: `xp-${dropCounter}`,
      coord: enemy.coord,
      amount: GAME_CONFIG.enemyXp,
    })
    effects.push({
      id: `effect-${effectCounter}`,
      kind: 'death-pop',
      coord: enemy.coord,
      expiresAtMs: state.nowMs + GAME_CONFIG.deathEffectMs,
    })
  }

  return {
    ...state,
    enemies,
    xpDrops,
    effects,
    dropCounter,
    effectCounter,
    weapon: {
      ...state.weapon,
      readyAtMs: state.nowMs + state.weapon.cooldownMs,
    },
    stats: {
      ...state.stats,
      kills,
    },
  }
}

function collectXp(state: GameState): GameState {
  const effects = [...state.effects]
  const remainingDrops: XpDropState[] = []
  let effectCounter = state.effectCounter
  let xp = state.stats.xp

  for (const drop of state.xpDrops) {
    if (chebyshevDistance(drop.coord, state.player.coord) > GAME_CONFIG.pickupRadius) {
      remainingDrops.push(drop)
      continue
    }

    xp += drop.amount
    effectCounter += 1
    effects.push({
      id: `effect-${effectCounter}`,
      kind: 'xp-pickup',
      coord: drop.coord,
      expiresAtMs: state.nowMs + GAME_CONFIG.xpPickupEffectMs,
    })
  }

  return {
    ...state,
    xpDrops: remainingDrops,
    effects,
    effectCounter,
    stats: {
      ...state.stats,
      xp,
    },
  }
}

function applyContactDamage(state: GameState): GameState {
  const isTouchingEnemy = state.enemies.some(
    (enemy) => enemy.coord.x === state.player.coord.x && enemy.coord.y === state.player.coord.y,
  )

  if (!isTouchingEnemy || state.nowMs < state.player.invulnerableUntilMs) {
    return state
  }

  const hp = Math.max(0, state.player.hp - GAME_CONFIG.playerContactDamage)
  const effect = createEffect(state, 'king-hit', state.player.coord, GAME_CONFIG.hitEffectMs)

  return {
    ...state,
    phase: hp <= 0 ? 'gameOver' : state.phase,
    effects: [...state.effects, effect],
    effectCounter: state.effectCounter + 1,
    player: {
      ...state.player,
      hp,
      invulnerableUntilMs: state.nowMs + GAME_CONFIG.playerInvulnerabilityMs,
    },
  }
}

function expireEffects(state: GameState): GameState {
  return {
    ...state,
    effects: state.effects.filter((effect) => effect.expiresAtMs > state.nowMs),
  }
}

function createEffect(
  state: GameState,
  kind: VisualEffectState['kind'],
  coord: GridCoord,
  ttlMs: number,
  extras: Pick<VisualEffectState, 'cells'> = {},
): VisualEffectState {
  return {
    id: `effect-${state.effectCounter + 1}`,
    kind,
    coord,
    expiresAtMs: state.nowMs + ttlMs,
    ...extras,
  }
}
