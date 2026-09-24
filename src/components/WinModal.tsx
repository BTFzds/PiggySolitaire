import { formatTime } from './TopBar'

interface WinModalProps {
  elapsedMs: number
  moves: number
  onAgain: () => void
}

export function WinModal({ elapsedMs, moves, onAgain }: WinModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="win-title"
    >
      <div className="w-full max-w-sm rounded-2xl bg-felt-dark border border-gold/40 shadow-felt px-6 py-7 text-center text-cream">
        <p className="font-display text-3xl text-gold-bright" id="win-title">
          胜利！
        </p>
        <p className="mt-2 text-sm text-cream/80">八副牌已收齐，猪猪为你鼓掌</p>
        <div className="mt-5 flex justify-center gap-6 text-sm tabular-nums">
          <div>
            <div className="text-cream/60 text-xs">用时</div>
            <div className="text-lg font-semibold">{formatTime(elapsedMs)}</div>
          </div>
          <div>
            <div className="text-cream/60 text-xs">步数</div>
            <div className="text-lg font-semibold">{moves}</div>
          </div>
        </div>
        <button
          type="button"
          onClick={onAgain}
          className="mt-6 w-full rounded-xl bg-gold text-felt-dark font-semibold py-2.5 hover:bg-gold-bright active:scale-[0.99]"
        >
          再来一局
        </button>
      </div>
    </div>
  )
}
