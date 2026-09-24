import { useEffect, useState } from 'react'
import { formatTime } from './TopBar'
import { LeaderboardPanel } from './LeaderboardPanel'
import type { Difficulty } from '@/game/types'
import {
  getPlayerId,
  loadLeaderboard,
  submitWinEntry,
  type LeaderboardBoard,
} from '@/lib/leaderboard'

interface WinModalProps {
  difficulty: Difficulty
  elapsedMs: number
  moves: number
  undos: number
  score: number
  onAgain: () => void
}

export function WinModal({
  difficulty,
  elapsedMs,
  moves,
  undos,
  score,
  onAgain,
}: WinModalProps) {
  const playerId = getPlayerId()
  const [board, setBoard] = useState<LeaderboardBoard>(() => loadLeaderboard())
  const [shared, setShared] = useState<boolean | null>(null)
  const [savedAt, setSavedAt] = useState<number | null>(null)
  const [saving, setSaving] = useState(true)

  useEffect(() => {
    let cancelled = false
    const at = Date.now()
    void (async () => {
      const result = await submitWinEntry(difficulty, {
        id: playerId,
        score,
        elapsedMs,
        at,
      })
      if (!cancelled) {
        setBoard(result.board)
        setShared(result.shared)
        setSavedAt(at)
        setSaving(false)
      }
    })()
    return () => {
      cancelled = true
    }
    // once per win mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="win-title"
    >
      <div className="w-full max-w-md my-4 rounded-2xl bg-felt-dark border border-gold/40 shadow-felt px-4 sm:px-6 py-5 text-cream">
        <p className="font-display text-3xl text-gold-bright text-center" id="win-title">
          胜利！
        </p>
        <p className="mt-1 text-sm text-cream/80 text-center">
          {playerId} · 八副牌已收齐
        </p>

        <div className="mt-4 flex justify-center gap-4 text-sm tabular-nums flex-wrap">
          <div className="text-center">
            <div className="text-cream/60 text-xs">分数</div>
            <div className="text-lg font-semibold text-gold-bright">{score}</div>
          </div>
          <div className="text-center">
            <div className="text-cream/60 text-xs">用时</div>
            <div className="text-lg font-semibold">{formatTime(elapsedMs)}</div>
          </div>
          <div className="text-center">
            <div className="text-cream/60 text-xs">步数</div>
            <div className="text-lg font-semibold">{moves}</div>
          </div>
          <div className="text-center">
            <div className="text-cream/60 text-xs">撤销</div>
            <div className="text-lg font-semibold">{undos}</div>
          </div>
        </div>

        <p className="mt-4 mb-2 text-sm font-medium text-gold-bright/90">排行榜</p>
        {saving ? (
          <p className="py-6 text-center text-sm text-cream/50">正在写入成绩…</p>
        ) : (
          <LeaderboardPanel
            board={board}
            activeDifficulty={difficulty}
            highlight={savedAt ? { id: playerId, at: savedAt } : null}
            shared={shared}
            compact
          />
        )}

        <button
          type="button"
          onClick={onAgain}
          className="mt-5 w-full rounded-xl bg-gold text-felt-dark font-semibold py-2.5 hover:bg-gold-bright active:scale-[0.99]"
        >
          再来一局
        </button>
      </div>
    </div>
  )
}
