import type { CSSProperties } from 'react'
import { getScreenPosition, isCoordInViewport } from '../game/world'
import type { RenderFrame } from '../game/types'

const ASSET_ROOT = '/assets/chess-survivors'

const SPRITE_SRC = {
  king: `${ASSET_ROOT}/piece-last-king.svg`,
  'enemy-pawn': `${ASSET_ROOT}/piece-corrupted-pawn.svg`,
  'xp-shard': `${ASSET_ROOT}/fx-xp-shard.svg`,
} as const

type GameBoardProps = {
  frame: RenderFrame
}

export function GameBoard({ frame }: GameBoardProps) {
  const gridStyle = {
    '--board-cols': frame.viewport.width,
    '--board-rows': frame.viewport.height,
  } as CSSProperties

  return (
    <section className="game-board-shell" aria-label="Chess Survivors game board">
      <div className="board-coordinate">
        ({frame.viewport.center.x}, {frame.viewport.center.y})
      </div>

      <div className="game-board" style={gridStyle}>
        {frame.cells.map((cell) => (
          <div
            className={`board-cell board-cell--${cell.parity}`}
            key={cell.key}
            style={{
              gridColumn: getScreenPosition(cell.coord, frame.viewport).col + 1,
              gridRow: getScreenPosition(cell.coord, frame.viewport).row + 1,
            }}
          />
        ))}

        <div className="effect-layer">
          {frame.effects.map((effect) => {
            if (effect.cells) {
              return effect.cells
                .filter((cell) => isCoordInViewport(cell, frame.viewport))
                .map((cell) => (
                  <div
                    className={`board-effect board-effect--${effect.kind}`}
                    key={`${effect.id}-${cell.x}-${cell.y}`}
                    style={gridPosition(cell, frame)}
                  />
                ))
            }

            return (
              <div
                className={`board-effect board-effect--${effect.kind}`}
                key={effect.id}
                style={gridPosition(effect.coord, frame)}
              >
                {effect.kind === 'damage-number' ? effect.value : null}
              </div>
            )
          })}
        </div>

        <div className="entity-layer">
          {frame.entities.map((entity) => (
            <div
              className={`board-entity board-entity--${entity.kind} ${
                entity.isInvulnerable ? 'board-entity--invulnerable' : ''
              }`}
              key={entity.id}
              style={gridPosition(entity.coord, frame)}
            >
              <img src={SPRITE_SRC[entity.spriteKey]} alt="" draggable="false" />
              {entity.kind === 'enemy' && typeof entity.hpPercent === 'number' ? (
                <span className="enemy-health">
                  <span style={{ transform: `scaleX(${entity.hpPercent})` }} />
                </span>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function gridPosition(coord: { x: number; y: number }, frame: RenderFrame): CSSProperties {
  const position = getScreenPosition(coord, frame.viewport)

  return {
    gridColumn: position.col + 1,
    gridRow: position.row + 1,
  }
}
