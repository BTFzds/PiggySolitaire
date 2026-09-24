export type { CardFace, Difficulty, GameState, HintRef, MoveRef, Rank, Suit, TableauCard } from './types'
export {
  COLUMN_COUNT,
  FOUNDATION_TARGET,
  INITIAL_DEALT,
  STOCK_DEALS,
} from './types'
export { createNewGame, recreateSameDeal, dealInitial, snapshotOf } from './deal'
export {
  RANK_LABEL,
  SUIT_SYMBOL,
  isRed,
  randomSeed,
  createSpiderDeck,
  shuffleWithSeed,
  suitsForDifficulty,
} from './deck'
export {
  isMovableRun,
  canPlaceOn,
  listValidTargets,
  findAutoMove,
  findHint,
  canDealFromStock,
  flipExposed,
  findCompletableRunStart,
} from './moves'
export {
  gameReducer,
  clickCard,
  dealStock,
  undo,
  stockDealsRemaining,
} from './engine'
export type { GameAction, GameActionResult } from './engine'
export {
  computeScore,
  computeRawScore,
  SCORE_START,
  SCORE_PER_MOVE,
  SCORE_PER_UNDO,
  SCORE_PER_FOUNDATION,
} from './score'
