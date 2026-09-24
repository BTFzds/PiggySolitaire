import type { Difficulty } from '../game/types'
import {
  defaultBoard,
  insertEntry,
  mergeBoards,
  type LeaderboardBoard,
  type LeaderboardEntry,
  DIFFICULTY_LABEL,
  formatLeaderboardTime,
} from './leaderboard-core'

export type { LeaderboardBoard, LeaderboardEntry }
export {
  defaultBoard,
  insertEntry,
  mergeBoards,
  DIFFICULTY_LABEL,
  formatLeaderboardTime,
}

const STORAGE_KEY = 'piggy-solitaire-leaderboard-v1'
const PLAYER_ID_KEY = 'piggy-solitaire-player-id'
const ONBOARD_KEY = 'piggy-solitaire-onboarded'
const API_URL = '/api/leaderboard'

function readLocalBoard(): LeaderboardBoard {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return defaultBoard()
    }
    return mergeBoards(JSON.parse(raw) as Partial<LeaderboardBoard>)
  } catch {
    return defaultBoard()
  }
}

function writeLocalBoard(board: LeaderboardBoard): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(board))
}

export function loadLeaderboard(): LeaderboardBoard {
  return readLocalBoard()
}

export function saveLeaderboard(board: LeaderboardBoard): void {
  writeLocalBoard(board)
}

async function fetchRemoteBoard(): Promise<LeaderboardBoard | null> {
  try {
    const res = await fetch(API_URL, { method: 'GET' })
    if (!res.ok) {
      return null
    }
    const data = (await res.json()) as Partial<LeaderboardBoard>
    if (data && 'fallback' in data && data.fallback) {
      return null
    }
    return mergeBoards(data)
  } catch {
    return null
  }
}

export async function fetchLeaderboard(): Promise<{
  board: LeaderboardBoard
  shared: boolean
}> {
  const remote = await fetchRemoteBoard()
  if (remote) {
    writeLocalBoard(remote)
    return { board: remote, shared: true }
  }
  return { board: readLocalBoard(), shared: false }
}

export function addWinEntry(
  difficulty: Difficulty,
  entry: Omit<LeaderboardEntry, 'seeded'>,
): LeaderboardBoard {
  const next = insertEntry(readLocalBoard(), difficulty, entry)
  writeLocalBoard(next)
  return next
}

export async function submitWinEntry(
  difficulty: Difficulty,
  entry: Omit<LeaderboardEntry, 'seeded'>,
): Promise<{ board: LeaderboardBoard; shared: boolean }> {
  const localNext = addWinEntry(difficulty, entry)
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ difficulty, entry }),
    })
    if (res.ok) {
      const data = (await res.json()) as Partial<LeaderboardBoard>
      const board = mergeBoards(data, localNext)
      writeLocalBoard(board)
      return { board, shared: true }
    }
  } catch {
    /* local only */
  }
  return { board: localNext, shared: false }
}

export function hasOnboarded(): boolean {
  try {
    return localStorage.getItem(ONBOARD_KEY) === '1' && Boolean(peekPlayerId())
  } catch {
    return false
  }
}

export function markOnboarded(): void {
  localStorage.setItem(ONBOARD_KEY, '1')
}

export function peekPlayerId(): string | null {
  try {
    const existing = localStorage.getItem(PLAYER_ID_KEY)
    if (existing && existing.trim()) {
      return existing.trim().slice(0, 16)
    }
  } catch {
    /* ignore */
  }
  return null
}

export function getPlayerId(): string {
  const existing = peekPlayerId()
  if (existing) {
    return existing
  }
  const id = `玩家${Math.floor(1000 + Math.random() * 9000)}`
  setPlayerId(id)
  return id
}

export function setPlayerId(id: string): void {
  const cleaned = id.trim().slice(0, 16) || '玩家'
  localStorage.setItem(PLAYER_ID_KEY, cleaned)
}
