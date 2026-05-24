import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { EMPTY_INPUT, GAME_CONFIG } from './config'
import { applyIntent, createInitialGameState, getRenderFrame, stepGame } from './engine'
import type { GameIntent, GameState, InputState } from './types'

const MOVEMENT_KEYS: Record<string, keyof InputState> = {
  ArrowUp: 'up',
  KeyW: 'up',
  ArrowDown: 'down',
  KeyS: 'down',
  ArrowLeft: 'left',
  KeyA: 'left',
  ArrowRight: 'right',
  KeyD: 'right',
}

export function useGameLoop() {
  const [gameState, setGameState] = useState<GameState>(() => createInitialGameState())
  const stateRef = useRef(gameState)
  const inputRef = useRef<InputState>({ ...EMPTY_INPUT })
  const releaseTimersRef = useRef<Partial<Record<keyof InputState, number>>>({})
  const lastFrameAtRef = useRef<number | null>(null)

  const setSyncedState = useCallback((nextState: GameState) => {
    stateRef.current = nextState
    setGameState(nextState)
  }, [])

  const dispatch = useCallback(
    (intent: GameIntent) => {
      setSyncedState(applyIntent(stateRef.current, intent))
      lastFrameAtRef.current = null
    },
    [setSyncedState],
  )

  useEffect(() => {
    const releaseTimers = releaseTimersRef.current

    function setKey(code: string, pressed: boolean) {
      const mappedKey = MOVEMENT_KEYS[code]

      if (!mappedKey) {
        return false
      }

      const releaseTimer = releaseTimers[mappedKey]

      if (releaseTimer) {
        window.clearTimeout(releaseTimer)
      }

      inputRef.current = {
        ...inputRef.current,
        [mappedKey]: pressed,
      }

      return true
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (setKey(event.code, true)) {
        event.preventDefault()
      }
    }

    function handleKeyUp(event: KeyboardEvent) {
      const mappedKey = MOVEMENT_KEYS[event.code]

      if (mappedKey) {
        releaseTimers[mappedKey] = window.setTimeout(() => {
          inputRef.current = {
            ...inputRef.current,
            [mappedKey]: false,
          }
        }, GAME_CONFIG.inputTapBufferMs)
        event.preventDefault()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      Object.values(releaseTimers).forEach((timer) => {
        if (timer) {
          window.clearTimeout(timer)
        }
      })
    }
  }, [])

  useEffect(() => {
    let frameId = 0

    function animate(frameAt: number) {
      const lastFrameAt = lastFrameAtRef.current ?? frameAt
      const deltaMs = Math.min(frameAt - lastFrameAt, GAME_CONFIG.maxFrameDeltaMs)
      lastFrameAtRef.current = frameAt
      const nextState = stepGame(stateRef.current, inputRef.current, deltaMs)

      if (nextState !== stateRef.current) {
        setSyncedState(nextState)
      }

      frameId = window.requestAnimationFrame(animate)
    }

    frameId = window.requestAnimationFrame(animate)

    return () => window.cancelAnimationFrame(frameId)
  }, [setSyncedState])

  const frame = useMemo(() => getRenderFrame(gameState), [gameState])

  return {
    gameState,
    frame,
    dispatch,
  }
}
