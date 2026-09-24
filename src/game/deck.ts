import type { CardFace, Difficulty, Rank, Suit } from './types'

export const SUIT_SYMBOL: Record<Suit, string> = {
  hearts: '♥',
  spades: '♠',
  diamonds: '♦',
  clubs: '♣',
}

export const RANK_LABEL: Record<Rank, string> = {
  1: 'A',
  2: '2',
  3: '3',
  4: '4',
  5: '5',
  6: '6',
  7: '7',
  8: '8',
  9: '9',
  10: '10',
  11: 'J',
  12: 'Q',
  13: 'K',
}

export function isRed(suit: Suit): boolean {
  return suit === 'hearts' || suit === 'diamonds'
}

export function suitsForDifficulty(difficulty: Difficulty): Suit[] {
  if (difficulty === 'easy') {
    return ['hearts']
  }
  if (difficulty === 'medium') {
    return ['hearts', 'spades']
  }
  return ['hearts', 'spades', 'diamonds', 'clubs']
}

/** Build 104 cards for spider: 8 full suits worth, distributed by difficulty. */
export function createSpiderDeck(difficulty: Difficulty): CardFace[] {
  const suits = suitsForDifficulty(difficulty)
  const decksPerSuit = 8 / suits.length
  const cards: CardFace[] = []
  let seq = 0
  for (const suit of suits) {
    for (let d = 0; d < decksPerSuit; d += 1) {
      for (let rank = 1; rank <= 13; rank += 1) {
        cards.push({
          id: `${suit}-${rank}-${d}-${seq}`,
          suit,
          rank: rank as Rank,
        })
        seq += 1
      }
    }
  }
  return cards
}

/** Mulberry32 seeded PRNG */
export function createRng(seed: number): () => number {
  let t = seed >>> 0
  return function next(): number {
    t += 0x6d2b79f5
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

export function shuffleWithSeed<T>(items: T[], seed: number): T[] {
  const arr = [...items]
  const rnd = createRng(seed)
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rnd() * (i + 1))
    const a = arr[i]
    const b = arr[j]
    if (a === undefined || b === undefined) {
      continue
    }
    arr[i] = b
    arr[j] = a
  }
  return arr
}

export function randomSeed(): number {
  return (Math.random() * 0xffffffff) >>> 0
}
