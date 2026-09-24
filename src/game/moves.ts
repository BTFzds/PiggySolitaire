import type { HintRef, MoveRef, TableauCard } from './types'
import { COLUMN_COUNT } from './types'

/** Same-suit descending consecutive face-up run from cardIndex to end. */
export function isMovableRun(column: TableauCard[], cardIndex: number): boolean {
  if (cardIndex < 0 || cardIndex >= column.length) {
    return false
  }
  const start = column[cardIndex]
  if (!start || !start.faceUp) {
    return false
  }
  for (let i = cardIndex; i < column.length - 1; i += 1) {
    const a = column[i]
    const b = column[i + 1]
    if (!a || !b || !b.faceUp) {
      return false
    }
    if (a.suit !== b.suit || a.rank !== b.rank + 1) {
      return false
    }
  }
  return true
}

export function canPlaceOn(
  movingTop: TableauCard,
  destination: TableauCard[] | undefined,
): boolean {
  if (!destination || destination.length === 0) {
    return true
  }
  const top = destination[destination.length - 1]
  if (!top || !top.faceUp) {
    return false
  }
  return top.rank === movingTop.rank + 1
}

export function listValidTargets(
  tableau: TableauCard[][],
  fromCol: number,
  cardIndex: number,
): number[] {
  const column = tableau[fromCol]
  if (!column || !isMovableRun(column, cardIndex)) {
    return []
  }
  const movingTop = column[cardIndex]
  if (!movingTop) {
    return []
  }
  const targets: number[] = []
  for (let toCol = 0; toCol < COLUMN_COUNT; toCol += 1) {
    if (toCol === fromCol) {
      continue
    }
    if (canPlaceOn(movingTop, tableau[toCol])) {
      targets.push(toCol)
    }
  }
  return targets
}

/**
 * Prefer continuing same suit, then any non-empty, then empty.
 * Among same preference, pick lowest column index (stable "next").
 */
export function pickBestTarget(
  tableau: TableauCard[][],
  fromCol: number,
  cardIndex: number,
  targets: number[],
): number | null {
  if (targets.length === 0) {
    return null
  }
  const column = tableau[fromCol]
  const movingTop = column?.[cardIndex]
  if (!movingTop) {
    return null
  }

  const score = (toCol: number): number => {
    const dest = tableau[toCol]
    if (!dest || dest.length === 0) {
      return 2
    }
    const top = dest[dest.length - 1]
    if (top && top.suit === movingTop.suit) {
      return 0
    }
    return 1
  }

  const sorted = [...targets].sort((a, b) => {
    const d = score(a) - score(b)
    return d !== 0 ? d : a - b
  })
  return sorted[0] ?? null
}

export function findAutoMove(
  tableau: TableauCard[][],
  fromCol: number,
  cardIndex: number,
): MoveRef | null {
  const targets = listValidTargets(tableau, fromCol, cardIndex)
  const toCol = pickBestTarget(tableau, fromCol, cardIndex, targets)
  if (toCol === null) {
    return null
  }
  return { fromCol, cardIndex, toCol }
}

/** Scan columns left→right for any legal move (hint). */
export function findHint(tableau: TableauCard[][]): HintRef | null {
  for (let fromCol = 0; fromCol < COLUMN_COUNT; fromCol += 1) {
    const column = tableau[fromCol]
    if (!column) {
      continue
    }
    for (let cardIndex = 0; cardIndex < column.length; cardIndex += 1) {
      const move = findAutoMove(tableau, fromCol, cardIndex)
      if (move) {
        // Skip trivial: moving within same build that doesn't free or help —
        // still valid; prefer moves onto non-empty first via pickBestTarget
        return move
      }
    }
  }
  return null
}

export function canDealFromStock(tableau: TableauCard[][], stockLength: number): boolean {
  if (stockLength < COLUMN_COUNT) {
    return false
  }
  return tableau.every((col) => col.length > 0)
}

/** After removing cards, flip new top if face-down. */
export function flipExposed(column: TableauCard[]): TableauCard[] {
  if (column.length === 0) {
    return column
  }
  const next = column.map((c) => ({ ...c }))
  const top = next[next.length - 1]
  if (top && !top.faceUp) {
    next[next.length - 1] = { ...top, faceUp: true }
  }
  return next
}

/** Detect completed K→A same-suit run at column end; return start index or -1. */
export function findCompletableRunStart(column: TableauCard[]): number {
  if (column.length < 13) {
    return -1
  }
  const start = column.length - 13
  const first = column[start]
  if (!first || !first.faceUp || first.rank !== 13) {
    return -1
  }
  for (let i = 0; i < 13; i += 1) {
    const card = column[start + i]
    if (!card || !card.faceUp) {
      return -1
    }
    if (card.suit !== first.suit) {
      return -1
    }
    if (card.rank !== 13 - i) {
      return -1
    }
  }
  return start
}
