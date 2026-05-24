import { GAME_CONFIG } from './config'
import type { BoardCell, Direction, GridCoord, InputState, Viewport } from './types'

export function coordKey(coord: GridCoord) {
  return `${coord.x}:${coord.y}`
}

export function getCellParity(coord: GridCoord): BoardCell['parity'] {
  return Math.abs(coord.x + coord.y) % 2 === 0 ? 'light' : 'dark'
}

export function getViewport(center: GridCoord): Viewport {
  const radius = GAME_CONFIG.viewportRadius

  return {
    center,
    radiusX: radius,
    radiusY: radius,
    minX: center.x - radius,
    maxX: center.x + radius,
    minY: center.y - radius,
    maxY: center.y + radius,
    width: radius * 2 + 1,
    height: radius * 2 + 1,
  }
}

export function getVisibleCells(viewport: Viewport): BoardCell[] {
  const cells: BoardCell[] = []

  for (let y = viewport.minY; y <= viewport.maxY; y += 1) {
    for (let x = viewport.minX; x <= viewport.maxX; x += 1) {
      const coord = { x, y }

      cells.push({
        coord,
        key: coordKey(coord),
        parity: getCellParity(coord),
      })
    }
  }

  return cells
}

export function isCoordInViewport(coord: GridCoord, viewport: Viewport) {
  return (
    coord.x >= viewport.minX &&
    coord.x <= viewport.maxX &&
    coord.y >= viewport.minY &&
    coord.y <= viewport.maxY
  )
}

export function getScreenPosition(coord: GridCoord, viewport: Viewport) {
  return {
    col: coord.x - viewport.minX,
    row: coord.y - viewport.minY,
  }
}

export function getInputVector(input: InputState) {
  const dx = Number(input.right) - Number(input.left)
  const dy = Number(input.down) - Number(input.up)

  return { dx, dy }
}

export function directionFromVector(dx: number, dy: number, fallback: Direction): Direction {
  if (dx === 0 && dy < 0) return 'north'
  if (dx === 0 && dy > 0) return 'south'
  if (dx < 0 && dy === 0) return 'west'
  if (dx > 0 && dy === 0) return 'east'
  if (dx < 0 && dy < 0) return 'northWest'
  if (dx > 0 && dy < 0) return 'northEast'
  if (dx < 0 && dy > 0) return 'southWest'
  if (dx > 0 && dy > 0) return 'southEast'

  return fallback
}

export function directionVector(direction: Direction) {
  switch (direction) {
    case 'north':
      return { dx: 0, dy: -1 }
    case 'south':
      return { dx: 0, dy: 1 }
    case 'west':
      return { dx: -1, dy: 0 }
    case 'east':
      return { dx: 1, dy: 0 }
    case 'northWest':
      return { dx: -1, dy: -1 }
    case 'northEast':
      return { dx: 1, dy: -1 }
    case 'southWest':
      return { dx: -1, dy: 1 }
    case 'southEast':
      return { dx: 1, dy: 1 }
  }
}

export function chebyshevDistance(a: GridCoord, b: GridCoord) {
  return Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y))
}

export function stepToward(from: GridCoord, to: GridCoord): GridCoord {
  return {
    x: from.x + Math.sign(to.x - from.x),
    y: from.y + Math.sign(to.y - from.y),
  }
}

export function getPawnStrikeCells(origin: GridCoord, facing: Direction, range: number) {
  const { dx, dy } = directionVector(facing)
  const cells: GridCoord[] = []

  for (let distance = 1; distance <= range; distance += 1) {
    cells.push({
      x: origin.x + dx * distance,
      y: origin.y + dy * distance,
    })
  }

  return cells
}

export function getSpawnCoord(center: GridCoord): GridCoord {
  const distance =
    GAME_CONFIG.enemySpawnMinDistance +
    Math.floor(
      Math.random() *
        (GAME_CONFIG.enemySpawnMaxDistance - GAME_CONFIG.enemySpawnMinDistance + 1),
    )
  const side = Math.floor(Math.random() * 4)
  const offset = Math.floor(Math.random() * (distance * 2 + 1)) - distance

  if (side === 0) return { x: center.x + offset, y: center.y - distance }
  if (side === 1) return { x: center.x + distance, y: center.y + offset }
  if (side === 2) return { x: center.x + offset, y: center.y + distance }

  return { x: center.x - distance, y: center.y + offset }
}
