import type { Difficulty } from '@/game/types'

interface TopBarProps {
  difficulty: Difficulty
  moves: number
  elapsedMs: number
  foundations: number
  canUndo: boolean
  onDifficulty: (d: Difficulty) => void
  onNewGame: () => void
  onRestart: () => void
  onUndo: () => void
  onHint: () => void
}

function formatTime(ms: number): string {
  const total = Math.floor(ms / 1000)
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

const DIFF_LABEL: Record<Difficulty, string> = {
  easy: '简单',
  medium: '中等',
  hard: '困难',
}

export function TopBar({
  difficulty,
  moves,
  elapsedMs,
  foundations,
  canUndo,
  onDifficulty,
  onNewGame,
  onRestart,
  onUndo,
  onHint,
}: TopBarProps) {
  const btn =
    'rounded-lg px-2.5 py-1.5 text-xs sm:text-sm font-medium bg-wood/80 text-cream border border-gold/30 hover:bg-wood active:scale-[0.98] disabled:opacity-40'

  return (
    <header className="sticky top-0 z-30 border-b border-black/20 bg-felt-dark/95 backdrop-blur-sm px-2 pt-[max(0.5rem,env(safe-area-inset-top))] pb-2 shadow-felt">
      <div className="mx-auto max-w-5xl flex flex-col gap-2">
        <div className="flex items-end justify-between gap-2">
          <div className="min-w-0">
            <h1 className="font-display text-2xl sm:text-3xl text-cream tracking-wide leading-none">
              猪猪纸牌
            </h1>
            <p className="text-[11px] sm:text-xs text-cream/70 mt-0.5 truncate">
              猪猪纸牌 · 蜘蛛接龙
            </p>
          </div>
          <div className="flex shrink-0 gap-3 text-xs sm:text-sm text-cream/90 tabular-nums">
            <span>用时 {formatTime(elapsedMs)}</span>
            <span>步数 {moves}</span>
            <span>收列 {foundations}/8</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <label className="sr-only" htmlFor="diff">
            难度
          </label>
          <select
            id="diff"
            value={difficulty}
            onChange={(e) => onDifficulty(e.target.value as Difficulty)}
            className={`${btn} pr-6 appearance-none bg-[length:12px] bg-[right_0.5rem_center] bg-no-repeat`}
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23e2c078'%3E%3Cpath d='M3 4l3 4 3-4'/%3E%3C/svg%3E\")",
            }}
          >
            {(Object.keys(DIFF_LABEL) as Difficulty[]).map((d) => (
              <option key={d} value={d}>
                {DIFF_LABEL[d]}
              </option>
            ))}
          </select>
          <button type="button" className={btn} onClick={onNewGame}>
            新局
          </button>
          <button type="button" className={btn} onClick={onRestart}>
            重开
          </button>
          <button type="button" className={btn} onClick={onUndo} disabled={!canUndo}>
            撤销
          </button>
          <button type="button" className={btn} onClick={onHint}>
            提示
          </button>
        </div>
      </div>
    </header>
  )
}

export { formatTime }
