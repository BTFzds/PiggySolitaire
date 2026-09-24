import { describe, expect, it } from 'vitest'
import { createNewGame } from './deal'
import {
  canDealFromStock,
  canPlaceOn,
  findAutoMove,
  findCompletableRunStart,
  isMovableRun,
} from './moves'
import { clickCard, dealStock, undo } from './engine'
import type { TableauCard } from './types'

function card(
  suit: TableauCard['suit'],
  rank: TableauCard['rank'],
  faceUp = true,
  id?: string,
): TableauCard {
  return {
    id: id ?? `${suit}-${rank}-${Math.random()}`,
    suit,
    rank,
    faceUp,
  }
}

describe('isMovableRun / canPlaceOn', () => {
  it('allows same-suit descending run and rejects broken runs', () => {
    const col = [card('hearts', 5), card('hearts', 4), card('hearts', 3)]
    expect(isMovableRun(col, 0)).toBe(true)
    expect(isMovableRun(col, 1)).toBe(true)

    const mixed = [card('hearts', 5), card('spades', 4)]
    expect(isMovableRun(mixed, 0)).toBe(false)

    const gap = [card('hearts', 5), card('hearts', 3)]
    expect(isMovableRun(gap, 0)).toBe(false)
  })

  it('allows place on empty or rank+1 any suit', () => {
    expect(canPlaceOn(card('hearts', 7), [])).toBe(true)
    expect(canPlaceOn(card('hearts', 7), [card('spades', 8)])).toBe(true)
    expect(canPlaceOn(card('hearts', 7), [card('hearts', 9)])).toBe(false)
  })
})

describe('findCompletableRunStart', () => {
  it('detects K→A same-suit sequence at column end', () => {
    const run: TableauCard[] = []
    for (let r = 13; r >= 1; r -= 1) {
      run.push(card('hearts', r as TableauCard['rank']))
    }
    expect(findCompletableRunStart(run)).toBe(0)

    const partial = run.slice(0, 12)
    expect(findCompletableRunStart(partial)).toBe(-1)
  })
})

describe('deal stock constraint', () => {
  it('blocks deal when any column is empty', () => {
    const tableau = Array.from({ length: 10 }, (_, i) =>
      i === 3 ? [] : [card('hearts', 5)],
    )
    expect(canDealFromStock(tableau, 50)).toBe(false)
    const full = Array.from({ length: 10 }, () => [card('hearts', 5)])
    expect(canDealFromStock(full, 50)).toBe(true)
    expect(canDealFromStock(full, 9)).toBe(false)
  })
})

describe('click move and undo', () => {
  it('auto-moves a card onto a valid target and undo restores', () => {
    const state = createNewGame('easy', 42)
    // Build a controlled mini board
    const controlled = {
      ...state,
      tableau: [
        [card('hearts', 8), card('hearts', 7)],
        [card('hearts', 9)],
        [card('hearts', 2)],
        [card('hearts', 3)],
        [card('hearts', 4)],
        [card('hearts', 5)],
        [card('hearts', 6)],
        [card('hearts', 10)],
        [card('hearts', 11)],
        [card('hearts', 12)],
      ],
      stock: state.stock,
      history: [],
    }

    // 8-7 整段落到 9 上（单点 7 无法落到 9）
    const move = findAutoMove(controlled.tableau, 0, 0)
    expect(move).toEqual({ fromCol: 0, cardIndex: 0, toCol: 1 })

    const after = clickCard(controlled, 0, 0, 1000)
    expect(after.state.tableau[0]?.map((c) => c.rank)).toEqual([])
    expect(after.state.tableau[1]?.map((c) => c.rank)).toEqual([9, 8, 7])
    expect(after.state.moves).toBe(1)
    expect(after.state.timerStartedAt).toBe(1000)

    const undone = undo(after.state)
    expect(undone.tableau[0]?.map((c) => c.rank)).toEqual([8, 7])
    expect(undone.tableau[1]?.map((c) => c.rank)).toEqual([9])
    expect(undone.moves).toBe(0)
  })

  it('shakes when card cannot move', () => {
    const state = createNewGame('easy', 1)
    const controlled = {
      ...state,
      tableau: Array.from({ length: 10 }, (_, i) =>
        i === 0 ? [card('hearts', 5)] : [card('hearts', 3)],
      ),
      history: [],
    }
    const result = clickCard(controlled, 0, 0, 1)
    expect(result.shook).toEqual({ col: 0, cardIndex: 0 })
    expect(result.state.moves).toBe(0)
  })

  it('refuses stock deal with empty column', () => {
    const state = createNewGame('easy', 7)
    const controlled = {
      ...state,
      tableau: Array.from({ length: 10 }, (_, i) =>
        i === 0 ? [] : [card('hearts', 5)],
      ),
      stock: state.stock,
      history: [],
    }
    const result = dealStock(controlled, 2)
    expect(result.state.stock.length).toBe(controlled.stock.length)
  })
})

describe('createNewGame deal layout', () => {
  it('deals 54 face layout and 50 stock for easy hearts', () => {
    const g = createNewGame('easy', 99)
    expect(g.tableau).toHaveLength(10)
    const total = g.tableau.reduce((n, c) => n + c.length, 0)
    expect(total).toBe(54)
    expect(g.stock).toHaveLength(50)
    expect(g.tableau.every((col) => col.length > 0 && col[col.length - 1]?.faceUp)).toBe(
      true,
    )
    expect(g.tableau.flat().every((c) => c.suit === 'hearts')).toBe(true)
  })
})
