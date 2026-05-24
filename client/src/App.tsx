import { useEffect, useState } from 'react'
import './App.css'

const previewMarkers: Record<number, string> = {
  3: 'bishop-ray',
  8: 'knight',
  10: 'pawn',
  17: 'pawn-strike',
  24: 'king',
  31: 'rook-charge',
  34: 'xp',
  38: 'rook',
  40: 'pawn',
  45: 'queen-shadow',
}

type HealthState =
  | { status: 'checking' }
  | { status: 'online'; service: string; time: string }
  | { status: 'offline'; message: string }

function App() {
  const [health, setHealth] = useState<HealthState>({ status: 'checking' })

  useEffect(() => {
    let active = true

    fetch('/api/health')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }

        return response.json() as Promise<{ service: string; time: string }>
      })
      .then((data) => {
        if (active) {
          setHealth({ status: 'online', service: data.service, time: data.time })
        }
      })
      .catch((error: Error) => {
        if (active) {
          setHealth({ status: 'offline', message: error.message })
        }
      })

    return () => {
      active = false
    }
  }, [])

  return (
    <main className="app-shell">
      <section className="game-start">
        <div className="game-board-preview" aria-hidden="true">
          {Array.from({ length: 49 }, (_, index) => {
            const marker = previewMarkers[index]

            return (
              <span
                key={index}
                className={`preview-cell${marker ? ` preview-cell--${marker}` : ''}`}
              />
            )
          })}
        </div>

        <div className="intro">
          <p className="label">dark royal fantasy prototype</p>
          <h1>Chess Survivors</h1>
          <p>
            Move the king. Survive the board. Choose royal upgrades.
          </p>

          <div className={`server-pill server-pill--${health.status}`}>
            <span className="status-dot" />
            {health.status === 'checking' && 'Checking server...'}
            {health.status === 'online' && `${health.service} online`}
            {health.status === 'offline' && `Server offline: ${health.message}`}
          </div>
        </div>
      </section>
    </main>
  )
}

export default App
