import { useEffect, useState } from 'react'
import { LeaderboardPanel } from './LeaderboardPanel'
import type { Difficulty } from '@/game/types'
import {
  fetchLeaderboard,
  getPlayerId,
  loadLeaderboard,
  setPlayerId,
  type LeaderboardBoard,
} from '@/lib/leaderboard'

interface LeaderboardModalProps {
  difficulty: Difficulty
  onClose: () => void
}

export function LeaderboardModal({ difficulty, onClose }: LeaderboardModalProps) {
  const [board, setBoard] = useState<LeaderboardBoard>(() => loadLeaderboard())
  const [shared, setShared] = useState<boolean | null>(null)
  const [playerId, setPlayerIdState] = useState(() => getPlayerId())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    void (async () => {
      const result = await fetchLeaderboard()
      if (!cancelled) {
        setBoard(result.board)
        setShared(result.shared)
        setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lb-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-felt-dark border border-gold/40 shadow-felt px-4 sm:px-6 py-5 text-cream"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-3">
          <h2 id="lb-title" className="font-display text-2xl text-gold-bright">
            排行榜
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-cream/70 hover:text-cream text-sm px-2 py-1"
          >
            关闭
          </button>
        </div>

        <label className="mb-3 flex items-center gap-2 text-xs text-cream/70">
          <span className="shrink-0">你的 ID</span>
          <input
            value={playerId}
            maxLength={16}
            onChange={(e) => {
              const v = e.target.value.slice(0, 16)
              setPlayerIdState(v)
              setPlayerId(v)
            }}
            className="flex-1 rounded-lg bg-black/25 border border-gold/30 px-2 py-1.5 text-cream text-sm outline-none focus:border-gold-bright"
          />
        </label>

        {loading ? (
          <p className="py-8 text-center text-sm text-cream/50">加载中…</p>
        ) : (
          <LeaderboardPanel board={board} activeDifficulty={difficulty} shared={shared} />
        )}
      </div>
    </div>
  )
}
