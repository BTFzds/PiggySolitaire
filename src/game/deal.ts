import { createSpiderDeck, shuffleWithSeed } from './deck'
import type {
  CardFace,
  Difficulty,
  GameSnapshot,
  GameState,
  TableauCard,
} from './types'
import { COLUMN_COUNT, INITIAL_DEALT } from './types'

function cloneTableau(tableau: TableauCard[][]): TableauCard[][] {
  return tableau.map((col) => col.map((c) => ({ ...c })))
}

function cloneStock(stock: CardFace[]): CardFace[] {
  return stock.map((c) => ({ ...c }))
}

export function snapshotOf(state: GameState): GameSnapshot {
  return {
    tableau: cloneTableau(state.tableau),
    stock: cloneStock(state.stock),
    foundations: state.foundations,
    timerStartedAt: state.timerStartedAt,
    won: state.won,
  }
}

export function restoreSnapshot(state: GameState, snap: GameSnapshot): GameState {
  return {
    ...state,
    tableau: cloneTableau(snap.tableau),
    stock: cloneStock(snap.stock),
    foundations: snap.foundations,
    timerStartedAt: snap.timerStartedAt,
    won: snap.won,
  }
}

/** Deal layout: cols 0–3 get 6, cols 4–9 get 5; only tops face-up. */
export function dealInitial(
  difficulty: Difficulty,
  seed: number,
): Pick<GameState, 'tableau' | 'stock'> {
  const shuffled = shuffleWithSeed(createSpiderDeck(difficulty), seed)
  const dealt = shuffled.slice(0, INITIAL_DEALT)
  const stock = shuffled.slice(INITIAL_DEALT)
  const columnSizes = [6, 6, 6, 6, 5, 5, 5, 5, 5, 5]

  const tableau: TableauCard[][] = Array.from({ length: COLUMN_COUNT }, () => [])
  let idx = 0
  for (let col = 0; col < COLUMN_COUNT; col += 1) {
    const n = columnSizes[col] ?? 5
    const column: TableauCard[] = []
    for (let i = 0; i < n; i += 1) {
      const face = dealt[idx]
      idx += 1
      if (!face) {
        break
      }
      column.push({
        ...face,
        faceUp: i === n - 1,
      })
    }
    tableau[col] = column
  }

  return { tableau, stock }
}

export function createNewGame(difficulty: Difficulty, seed: number): GameState {
  const { tableau, stock } = dealInitial(difficulty, seed)
  return {
    difficulty,
    seed,
    tableau,
    stock,
    foundations: 0,
    moves: 0,
    undos: 0,
    scoreForcedZero: false,
    timerStartedAt: null,
    won: false,
    history: [],
  }
}

export function recreateSameDeal(state: GameState): GameState {
  return createNewGame(state.difficulty, state.seed)
}
