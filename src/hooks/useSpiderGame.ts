import { useCallback, useEffect, useRef, useState } from 'react'
import { createNewGame } from '@/game/deal'
import { randomSeed } from '@/game/deck'
import { gameReducer, stockDealsRemaining } from '@/game/engine'
import { canDealFromStock } from '@/game/moves'
import type { Difficulty, GameState, HintRef, MoveRef } from '@/game/types'

interface UiExtras {
  shook: { col: number; cardIndex: number; token: number } | null
  hint: HintRef | null
  lastMove: MoveRef | null
  elapsedMs: number
}

function initState(difficulty: Difficulty = 'easy'): GameState {
  return createNewGame(difficulty, randomSeed())
}

export function useSpiderGame(initialDifficulty: Difficulty = 'easy') {
  const [state, setState] = useState(() => initState(initialDifficulty))
  const [ui, setUi] = useState<UiExtras>({
    shook: null,
    hint: null,
    lastMove: null,
    elapsedMs: 0,
  })
  const hintClearRef = useRef<number | null>(null)
  const wonElapsedRef = useRef(0)

  useEffect(() => {
    if (state.timerStartedAt === null) {
      return
    }
    if (state.won) {
      wonElapsedRef.current = Date.now() - state.timerStartedAt
      setUi((u) => ({ ...u, elapsedMs: wonElapsedRef.current }))
      return
    }
    const tick = (): void => {
      setUi((u) => ({
        ...u,
        elapsedMs: Date.now() - (state.timerStartedAt as number),
      }))
    }
    tick()
    const id = window.setInterval(tick, 500)
    return () => window.clearInterval(id)
  }, [state.timerStartedAt, state.won])

  const apply = useCallback((action: Parameters<typeof gameReducer>[1]) => {
    setState((prev) => {
      const result = gameReducer(prev, action)
      setUi((u) => {
        let hint = u.hint
        if (action.type === 'HINT') {
          hint = result.hint ?? null
        } else if (
          action.type === 'CLICK_CARD' ||
          action.type === 'DEAL_STOCK' ||
          action.type === 'NEW_GAME' ||
          action.type === 'RESTART_DEAL' ||
          action.type === 'SET_DIFFICULTY'
        ) {
          hint = null
        }
        const elapsedMs =
          result.state.timerStartedAt === null
            ? 0
            : Date.now() - result.state.timerStartedAt
        return {
          ...u,
          shook: result.shook ? { ...result.shook, token: Date.now() } : u.shook,
          hint,
          lastMove: result.lastMove ?? null,
          elapsedMs,
        }
      })
      return result.state
    })
  }, [])

  const resetUi = useCallback(() => {
    setUi({ shook: null, hint: null, lastMove: null, elapsedMs: 0 })
    wonElapsedRef.current = 0
  }, [])

  const newGame = useCallback(
    (difficulty?: Difficulty) => {
      apply({ type: 'NEW_GAME', difficulty: difficulty ?? state.difficulty })
      resetUi()
    },
    [apply, resetUi, state.difficulty],
  )

  const restartDeal = useCallback(() => {
    apply({ type: 'RESTART_DEAL' })
    resetUi()
  }, [apply, resetUi])

  const setDifficulty = useCallback(
    (difficulty: Difficulty) => {
      apply({ type: 'SET_DIFFICULTY', difficulty })
      resetUi()
    },
    [apply, resetUi],
  )

  const onCardClick = useCallback(
    (col: number, cardIndex: number) => {
      apply({ type: 'CLICK_CARD', col, cardIndex })
    },
    [apply],
  )

  const deal = useCallback(() => {
    apply({ type: 'DEAL_STOCK' })
  }, [apply])

  const undoMove = useCallback(() => {
    apply({ type: 'UNDO' })
  }, [apply])

  const showHint = useCallback(() => {
    if (hintClearRef.current) {
      window.clearTimeout(hintClearRef.current)
    }
    apply({ type: 'HINT' })
    hintClearRef.current = window.setTimeout(() => {
      setUi((u) => ({ ...u, hint: null }))
    }, 3500)
  }, [apply])

  return {
    state,
    shook: ui.shook,
    hint: ui.hint,
    lastMove: ui.lastMove,
    elapsedMs: ui.elapsedMs,
    dealsLeft: stockDealsRemaining(state.stock.length),
    canDeal: canDealFromStock(state.tableau, state.stock.length),
    canUndo: state.history.length > 0,
    newGame,
    restartDeal,
    setDifficulty,
    onCardClick,
    deal,
    undoMove,
    showHint,
  }
}
