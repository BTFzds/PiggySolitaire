import { useMemo, useState } from 'react'
import type { Difficulty } from '@/game/types'
import {
  DIFFICULTY_LABEL,
  formatLeaderboardTime,
  type LeaderboardBoard,
  type LeaderboardEntry,
} from '@/lib/leaderboard'

interface LeaderboardPanelProps {
  board: LeaderboardBoard
  activeDifficulty: Difficulty
  highlight?: { id: string; at: number } | null
  compact?: boolean
  shared?: boolean | null
}

export function LeaderboardPanel({
  board,
  activeDifficulty,
  highlight = null,
  compact = false,
  shared = null,
}: LeaderboardPanelProps) {
  const [tab, setTab] = useState<Difficulty>(activeDifficulty)
  const rows = useMemo(() => board[tab] ?? [], [board, tab])

  return (
    <div className="w-full text-left">
      {shared !== null && (
        <p className="mb-2 text-[11px] text-cream/50">
          {shared ? '全站共享榜（Netlify）' : '本机榜（联网部署后可共享）'}
        </p>
      )}
      <div className="flex gap-1 mb-3">
        {(Object.keys(DIFFICULTY_LABEL) as Difficulty[]).map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setTab(d)}
            className={`flex-1 rounded-lg py-1.5 text-xs sm:text-sm font-medium border ${
              tab === d
                ? 'bg-gold/30 border-gold-bright text-gold-bright'
                : 'bg-wood/50 border-gold/25 text-cream/80'
            }`}
          >
            {DIFFICULTY_LABEL[d]}
          </button>
        ))}
      </div>

      <div
        className={`rounded-xl border border-gold/25 bg-black/20 overflow-hidden ${
          compact ? 'max-h-48' : 'max-h-64'
        } overflow-y-auto`}
      >
        <table className="w-full text-xs sm:text-sm">
          <thead className="sticky top-0 bg-felt-dark/95 text-cream/60">
            <tr>
              <th className="py-2 pl-3 text-left font-medium w-10">#</th>
              <th className="py-2 text-left font-medium">ID</th>
              <th className="py-2 text-right font-medium">分数</th>
              <th className="py-2 pr-3 text-right font-medium">用时</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={4} className="py-6 text-center text-cream/50">
                  暂无记录
                </td>
              </tr>
            )}
            {rows.map((row: LeaderboardEntry, i) => {
              const isHi =
                highlight && row.id === highlight.id && row.at === highlight.at && !row.seeded
              return (
                <tr
                  key={`${row.id}-${row.at}-${i}`}
                  className={`border-t border-white/5 ${
                    isHi ? 'bg-gold/20 text-gold-bright' : 'text-cream/90'
                  }`}
                >
                  <td className="py-1.5 pl-3 tabular-nums">{i + 1}</td>
                  <td className="py-1.5 truncate max-w-[7rem]">{row.id}</td>
                  <td className="py-1.5 text-right tabular-nums font-semibold">{row.score}</td>
                  <td className="py-1.5 pr-3 text-right tabular-nums">
                    {formatLeaderboardTime(row.elapsedMs)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
