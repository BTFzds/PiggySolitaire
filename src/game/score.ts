/**
 * Windows XP / Win7 Spider scoring:
 * score = 500 − (moves + undos) + foundations × 100
 * Deals do not affect moves/score. Score may be negative.
 */
export const SCORE_START = 500
export const SCORE_PER_MOVE = 1
export const SCORE_PER_UNDO = 1
export const SCORE_PER_FOUNDATION = 100

export function computeRawScore(
  moves: number,
  undos: number,
  foundations: number,
): number {
  return (
    SCORE_START -
    moves * SCORE_PER_MOVE -
    undos * SCORE_PER_UNDO +
    foundations * SCORE_PER_FOUNDATION
  )
}

export function computeScore(
  moves: number,
  undos: number,
  foundations: number,
  scoreForcedZero = false,
): number {
  if (scoreForcedZero) {
    return 0
  }
  return computeRawScore(moves, undos, foundations)
}
