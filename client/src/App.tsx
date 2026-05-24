import './App.css'
import { GameBoard } from './components/GameBoard'
import { Hud } from './components/Hud'
import { ResultModal } from './components/ResultModal'
import { StartScreen } from './components/StartScreen'
import { useGameLoop } from './game/useGameLoop'

function App() {
  const { frame, dispatch } = useGameLoop()

  return (
    <main className="app-shell">
      <div className="game-layout">
        <header className="game-header">
          <div>
            <p className="label">Chess Survivors</p>
            <h1>Chess Survivors</h1>
          </div>
          <p>WASD / arrows move freely. Chess patterns still fire on the board grid.</p>
        </header>

        <div className="play-surface">
          <GameBoard frame={frame} />
          <Hud hud={frame.hud} />

          {frame.phase === 'menu' ? (
            <div className="modal-layer">
              <StartScreen onStart={() => dispatch({ type: 'start' })} />
            </div>
          ) : null}

          {frame.phase === 'gameOver' ? (
            <div className="modal-layer">
              <ResultModal hud={frame.hud} onRetry={() => dispatch({ type: 'restart' })} />
            </div>
          ) : null}
        </div>
      </div>
    </main>
  )
}

export default App
