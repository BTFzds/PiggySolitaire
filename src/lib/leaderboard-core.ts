import type { Difficulty } from '../game/types'

export interface LeaderboardEntry {
  id: string
  score: number
  elapsedMs: number
  at: number
  seeded?: boolean
}

export type LeaderboardBoard = Record<Difficulty, LeaderboardEntry[]>

export const MAX_ENTRIES = 20

const PLACEHOLDER_CHAMPION: Record<Difficulty, Omit<LeaderboardEntry, 'at' | 'seeded'>> = {
  easy: { id: 'BTFzds', score: 1180, elapsedMs: 12 * 60 * 1000 },
  medium: { id: 'BTFzds', score: 1050, elapsedMs: 18 * 60 * 1000 },
  hard: { id: 'BTFzds', score: 920, elapsedMs: 25 * 60 * 1000 },
}

export function defaultBoard(): LeaderboardBoard {
  const at = Date.UTC(2026, 0, 1)
  return {
    easy: [{ ...PLACEHOLDER_CHAMPION.easy, at, seeded: true }],
    medium: [{ ...PLACEHOLDER_CHAMPION.medium, at, seeded: true }],
    hard: [{ ...PLACEHOLDER_CHAMPION.hard, at, seeded: true }],
  }
}

export function sortEntries(list: LeaderboardEntry[]): LeaderboardEntry[] {
  return [...list].sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score
    }
    if (a.elapsedMs !== b.elapsedMs) {
      return a.elapsedMs - b.elapsedMs
    }
    return a.at - b.at
  })
}

export function mergeBoards(
  remote: Partial<LeaderboardBoard> | null | undefined,
  localFallback: LeaderboardBoard = defaultBoard(),
): LeaderboardBoard {
  const base = defaultBoard()
  const merge = (d: Difficulty): LeaderboardEntry[] => {
    const fromRemote = Array.isArray(remote?.[d]) ? remote[d]! : []
    const fromLocal = Array.isArray(localFallback[d]) ? localFallback[d] : []
    const combined = [...fromRemote, ...fromLocal]
    const hasChamp = combined.some((e) => e.id === 'BTFzds')
    const withChamp = hasChamp ? combined : [...base[d], ...combined]
    const seen = new Set<string>()
    const unique: LeaderboardEntry[] = []
    for (const e of withChamp) {
      const key = `${e.id}-${e.at}-${e.score}`
      if (seen.has(key)) {
        continue
      }
      seen.add(key)
      unique.push(e)
    }
    return sortEntries(unique).slice(0, MAX_ENTRIES)
  }
  return {
    easy: merge('easy'),
    medium: merge('medium'),
    hard: merge('hard'),
  }
}

export function insertEntry(
  board: LeaderboardBoard,
  difficulty: Difficulty,
  entry: Omit<LeaderboardEntry, 'seeded'>,
): LeaderboardBoard {
  const nextList = sortEntries([
    ...board[difficulty].filter((e) => !(e.seeded && e.id === entry.id)),
    { ...entry, seeded: false },
  ]).slice(0, MAX_ENTRIES)
  return { ...board, [difficulty]: nextList }
}

export function formatLeaderboardTime(ms: number): string {
  const total = Math.floor(ms / 1000)
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  easy: '简单',
  medium: '中等',
  hard: '困难',
}
