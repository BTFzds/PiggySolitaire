import type { Handler } from '@netlify/functions'
import { getStore } from '@netlify/blobs'
import type { Difficulty } from '../../src/game/types'
import {
  defaultBoard,
  insertEntry,
  mergeBoards,
  type LeaderboardBoard,
  type LeaderboardEntry,
} from '../../src/lib/leaderboard-core'

/**
 * Shared leaderboard (Netlify Blobs).
 * Local Vite has no Blobs — frontend falls back to localStorage.
 */
export const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json',
  }

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' }
  }

  try {
    const store = getStore('piggy-leaderboard')

    if (event.httpMethod === 'GET') {
      const raw = await store.get('board', { type: 'json' })
      const board = mergeBoards((raw as Partial<LeaderboardBoard> | null) ?? null)
      return { statusCode: 200, headers, body: JSON.stringify(board) }
    }

    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}') as {
        difficulty?: Difficulty
        entry?: Omit<LeaderboardEntry, 'seeded'>
      }
      if (!body.difficulty || !body.entry?.id || typeof body.entry.score !== 'number') {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'bad request' }) }
      }
      const raw = await store.get('board', { type: 'json' })
      const current = mergeBoards((raw as Partial<LeaderboardBoard> | null) ?? defaultBoard())
      const next = insertEntry(current, body.difficulty, {
        id: String(body.entry.id).slice(0, 16),
        score: body.entry.score,
        elapsedMs: body.entry.elapsedMs ?? 0,
        at: body.entry.at ?? Date.now(),
      })
      await store.setJSON('board', next)
      return { statusCode: 200, headers, body: JSON.stringify(next) }
    }

    return { statusCode: 405, headers, body: JSON.stringify({ error: 'method not allowed' }) }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unavailable'
    return {
      statusCode: 503,
      headers,
      body: JSON.stringify({ error: message, fallback: true }),
    }
  }
}
