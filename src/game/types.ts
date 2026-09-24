/** Spider Solitaire ranks: Ace=1 … King=13 */
export type Rank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13

export type Suit = 'hearts' | 'spades' | 'diamonds' | 'clubs'

export type Difficulty = 'easy' | 'medium' | 'hard'

export interface CardFace {
  id: string
  suit: Suit
  rank: Rank
}

export interface TableauCard extends CardFace {
  faceUp: boolean
}

export interface MoveRef {
  fromCol: number
  cardIndex: number
  toCol: number
}

export interface HintRef {
  fromCol: number
  cardIndex: number
  toCol: number
}

export interface GameState {
  difficulty: Difficulty
  seed: number
  tableau: TableauCard[][]
  stock: CardFace[]
  /** Completed same-suit K→A runs (0–8) */
  foundations: number
  moves: number
  /** Epoch ms when first player action happened; null until then */
  timerStartedAt: number | null
  won: boolean
  history: GameSnapshot[]
}

export interface GameSnapshot {
  tableau: TableauCard[][]
  stock: CardFace[]
  foundations: number
  moves: number
  timerStartedAt: number | null
  won: boolean
}

export const COLUMN_COUNT = 10
export const FOUNDATION_TARGET = 8
export const STOCK_DEALS = 5
export const INITIAL_DEALT = 54
