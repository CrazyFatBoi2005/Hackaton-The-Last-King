import { useEffect, useState } from 'react'
import './App.css'

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
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>

        <div className="intro">
          <p className="label">main game workspace</p>
          <h1>Hackaton Game</h1>
          <p>
            React client and classic Express server are connected. Next step is
            choosing the core game loop and building the first playable minute.
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
