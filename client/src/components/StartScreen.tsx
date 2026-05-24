type StartScreenProps = {
  onStart: () => void
}

export function StartScreen({ onStart }: StartScreenProps) {
  return (
    <section className="start-panel" aria-label="Start run">
      <div className="start-piece" aria-hidden="true">
        <img src="/assets/chess-survivors/piece-last-king.svg" alt="" />
      </div>
      <div>
        <p className="label">Chess Survivors</p>
        <h1>The Last King</h1>
        <p>Move the king. Survive the board. Pawn Strike fires automatically.</p>
        <button className="primary-button" type="button" onClick={onStart}>
          Start Run
        </button>
      </div>
    </section>
  )
}
