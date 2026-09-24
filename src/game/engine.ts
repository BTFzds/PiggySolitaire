import { createNewGame, recreateSameDeal, restoreSnapshot, snapshotOf } from './deal'
import { randomSeed } from './deck'
import {
  canDealFromStock,
  findAutoMove,
  findCompletableRunStart,
  findHint,
  flipExposed,
  isMovableRun,
} from './moves'
import type { Difficulty, GameState, HintRef, MoveRef } from './types'
import { COLUMN_COUNT, FOUNDATION_TARGET } from './types'

export type GameAction =
  | { type: 'NEW_GAME'; difficulty?: Difficulty; seed?: number }
  | { type: 'RESTART_DEAL' }
  | { type: 'SET_DIFFICULTY'; difficulty: Difficulty }
  | { type: 'CLICK_CARD'; col: number; cardIndex: number }
  | { type: 'DEAL_STOCK' }
  | { type: 'UNDO' }
  | { type: 'HINT' }

export interface GameActionResult {
  state: GameState
  /** UI feedback when click cannot move */
  shook?: { col: number; cardIndex: number }
  hint?: HintRef | null
  /** Last successful auto-move for land animation */
  lastMove?: MoveRef
}

function ensureTimer(state: GameState, now: number): GameState {
  if (state.timerStartedAt !== null) {
    return state
  }
  return { ...state, timerStartedAt: now }
}

function pushHistory(state: GameState): GameState {
  return {
    ...state,
    history: [...state.history, snapshotOf(state)],
  }
}

function collectCompletedRuns(state: GameState): GameState {
  let next = state
  let changed = true
  while (changed) {
    changed = false
    for (let col = 0; col < COLUMN_COUNT; col += 1) {
      const column = next.tableau[col]
      if (!column) {
        continue
      }
      const start = findCompletableRunStart(column)
      if (start >= 0) {
        const tableau = next.tableau.map((c) => c.map((card) => ({ ...card })))
        tableau[col] = flipExposed(column.slice(0, start).map((c) => ({ ...c })))
        next = {
          ...next,
          tableau,
          foundations: next.foundations + 1,
        }
        changed = true
        break
      }
    }
  }
  if (next.foundations >= FOUNDATION_TARGET) {
    return { ...next, won: true }
  }
  return next
}

function applyMove(state: GameState, move: MoveRef, now: number): GameState {
  let next = pushHistory(ensureTimer(state, now))
  const tableau = next.tableau.map((col) => col.map((c) => ({ ...c })))
  const from = tableau[move.fromCol]
  const to = tableau[move.toCol]
  if (!from || !to) {
    return state
  }
  const moving = from.splice(move.cardIndex)
  tableau[move.fromCol] = flipExposed(from)
  tableau[move.toCol] = [...to, ...moving]
  next = {
    ...next,
    tableau,
    moves: next.moves + 1,
  }
  return collectCompletedRuns(next)
}

export function dealStock(state: GameState, now: number): GameActionResult {
  if (!canDealFromStock(state.tableau, state.stock.length)) {
    return { state }
  }
  let next = pushHistory(ensureTimer(state, now))
  const stock = [...next.stock]
  const tableau = next.tableau.map((col) => col.map((c) => ({ ...c })))
  for (let col = 0; col < COLUMN_COUNT; col += 1) {
    const card = stock.shift()
    if (!card) {
      break
    }
    const column = tableau[col] ?? []
    column.push({ ...card, faceUp: true })
    tableau[col] = column
  }
  next = {
    ...next,
    stock,
    tableau,
    moves: next.moves + 1,
  }
  next = collectCompletedRuns(next)
  return { state: next }
}

export function clickCard(
  state: GameState,
  col: number,
  cardIndex: number,
  now: number,
): GameActionResult {
  if (state.won) {
    return { state }
  }
  const column = state.tableau[col]
  if (!column || !isMovableRun(column, cardIndex)) {
    return { state, shook: { col, cardIndex } }
  }
  const move = findAutoMove(state.tableau, col, cardIndex)
  if (!move) {
    return { state, shook: { col, cardIndex } }
  }
  const next = applyMove(state, move, now)
  return { state: next, lastMove: move }
}

export function undo(state: GameState): GameState {
  if (state.history.length === 0) {
    return state
  }
  const history = [...state.history]
  const snap = history.pop()
  if (!snap) {
    return state
  }
  const restored = restoreSnapshot(state, snap)
  return { ...restored, history }
}

export function gameReducer(state: GameState, action: GameAction, now = Date.now()): GameActionResult {
  switch (action.type) {
    case 'NEW_GAME': {
      const difficulty = action.difficulty ?? state.difficulty
      const seed = action.seed ?? randomSeed()
      return { state: createNewGame(difficulty, seed) }
    }
    case 'RESTART_DEAL':
      return { state: recreateSameDeal(state) }
    case 'SET_DIFFICULTY':
      return { state: createNewGame(action.difficulty, randomSeed()) }
    case 'CLICK_CARD':
      return clickCard(state, action.col, action.cardIndex, now)
    case 'DEAL_STOCK':
      return dealStock(state, now)
    case 'UNDO':
      return { state: undo(state) }
    case 'HINT':
      return { state, hint: findHint(state.tableau) }
    default:
      return { state }
  }
}

export function stockDealsRemaining(stockLength: number): number {
  return Math.floor(stockLength / COLUMN_COUNT)
}

export { findHint, canDealFromStock, isMovableRun, findAutoMove }
