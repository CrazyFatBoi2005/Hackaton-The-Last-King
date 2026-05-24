import type { HudState } from '../game/types'

type ResultModalProps = {
  hud: HudState
  onRetry: () => void
}

export function ResultModal({ hud, onRetry }: ResultModalProps) {
  return (
    <section className="result-modal" aria-label="Game over">
      <p className="label">Game Over</p>
      <h2>The king has fallen</h2>
      <p>
        Survived {formatTime(hud.elapsedMs)} with {hud.kills} kills and {hud.xp} XP.
      </p>
      <button className="primary-button" type="button" onClick={onRetry}>
        Retry
      </button>
    </section>
  )
}

function formatTime(ms: number) {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}
