import { GAME_CONFIG } from './config'
import type { BoardCell, Direction, GridCoord, InputState, Viewport } from './types'

export function coordKey(coord: GridCoord) {
  return `${Math.round(coord.x)}:${Math.round(coord.y)}`
}

export function getCellParity(coord: GridCoord): BoardCell['parity'] {
  return Math.abs(Math.round(coord.x) + Math.round(coord.y)) % 2 === 0 ? 'light' : 'dark'
}

export function getViewport(center: GridCoord): Viewport {
  const radius = GAME_CONFIG.viewportRadius
  const anchorX = Math.floor(center.x)
  const anchorY = Math.floor(center.y)

  return {
    center,
    radiusX: radius,
    radiusY: radius,
    minX: anchorX - radius - 1,
    maxX: anchorX + radius + 1,
    minY: anchorY - radius - 1,
    maxY: anchorY + radius + 1,
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
    coord.x >= viewport.center.x - viewport.radiusX - 1 &&
    coord.x <= viewport.center.x + viewport.radiusX + 1 &&
    coord.y >= viewport.center.y - viewport.radiusY - 1 &&
    coord.y <= viewport.center.y + viewport.radiusY + 1
  )
}

export function getScreenPosition(coord: GridCoord, viewport: Viewport) {
  return {
    x: coord.x - viewport.center.x + viewport.radiusX,
    y: coord.y - viewport.center.y + viewport.radiusY,
  }
}

export function getInputVector(input: InputState) {
  const dx = Number(input.right) - Number(input.left)
  const dy = Number(input.down) - Number(input.up)

  return { dx, dy }
}

export function normalizeVector(dx: number, dy: number) {
  const length = Math.hypot(dx, dy)

  if (length === 0) {
    return { dx: 0, dy: 0 }
  }

  return {
    dx: dx / length,
    dy: dy / length,
  }
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

export function directionUnitVector(direction: Direction) {
  const vector = directionVector(direction)

  return normalizeVector(vector.dx, vector.dy)
}

export function directionRotationDeg(direction: Direction) {
  const vector = directionUnitVector(direction)

  return (Math.atan2(vector.dy, vector.dx) * 180) / Math.PI
}

export function chebyshevDistance(a: GridCoord, b: GridCoord) {
  return Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y))
}

export function distanceBetween(a: GridCoord, b: GridCoord) {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

export function moveToward(from: GridCoord, to: GridCoord, maxDistance: number): GridCoord {
  const dx = to.x - from.x
  const dy = to.y - from.y
  const distance = Math.hypot(dx, dy)

  if (distance === 0 || distance <= maxDistance) {
    return to
  }

  const scale = maxDistance / distance

  return {
    x: from.x + dx * scale,
    y: from.y + dy * scale,
  }
}

export function snapToCell(coord: GridCoord): GridCoord {
  return {
    x: Math.round(coord.x),
    y: Math.round(coord.y),
  }
}

export function getForwardArea(
  origin: GridCoord,
  facing: Direction,
  length: number,
  width: number,
  startOffset: number,
) {
  const forward = directionUnitVector(facing)

  return {
    center: {
      x: origin.x + forward.dx * (startOffset + length / 2),
      y: origin.y + forward.dy * (startOffset + length / 2),
    },
    length,
    width,
    rotationDeg: directionRotationDeg(facing),
  }
}

export function isCoordInForwardArea(
  coord: GridCoord,
  origin: GridCoord,
  facing: Direction,
  length: number,
  width: number,
  startOffset: number,
) {
  const forward = directionUnitVector(facing)
  const relX = coord.x - origin.x
  const relY = coord.y - origin.y
  const forwardDistance = relX * forward.dx + relY * forward.dy
  const sideDistance = Math.abs(relX * -forward.dy + relY * forward.dx)

  return (
    forwardDistance >= startOffset &&
    forwardDistance <= startOffset + length &&
    sideDistance <= width / 2
  )
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
