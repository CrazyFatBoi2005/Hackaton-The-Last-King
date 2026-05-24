import type { HudState } from '../game/types'

type HudProps = {
  hud: HudState
}

export function Hud({ hud }: HudProps) {
  const hpPercent = Math.max(0, Math.min(1, hud.hp / hud.maxHp))

  return (
    <aside className="hud" aria-label="Run status">
      <div className="hud-primary">
        <div>
          <span className="hud-label">HP</span>
          <strong>
            {hud.hp}/{hud.maxHp}
          </strong>
        </div>
        <div className="hp-track" aria-hidden="true">
          <span style={{ transform: `scaleX(${hpPercent})` }} />
        </div>
      </div>

      <div className="hud-grid">
        <HudMetric label="Time" value={formatTime(hud.elapsedMs)} />
        <HudMetric label="Kills" value={hud.kills.toString()} />
        <HudMetric label="XP" value={hud.xp.toString()} />
        <HudMetric label="Level" value={hud.level.toString()} />
        <HudMetric label="Threats" value={hud.enemyCount.toString()} />
      </div>

      <div className="weapon-panel">
        <span className="hud-label">Weapon</span>
        <strong>Pawn Strike</strong>
        <p>Auto-fires in the king's facing direction.</p>
      </div>
    </aside>
  )
}

function HudMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="hud-metric">
      <span className="hud-label">{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function formatTime(ms: number) {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}
