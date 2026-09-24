import { PlayingCard } from './PlayingCard'

interface StockPileProps {
  dealsLeft: number
  canDeal: boolean
  onDeal: () => void
}

export function StockPile({ dealsLeft, canDeal, onDeal }: StockPileProps) {
  const disabled = !canDeal || dealsLeft <= 0

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onDeal}
        disabled={disabled}
        className="relative disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label={disabled ? '无法发牌' : '从牌库发牌'}
        title={
          disabled
            ? dealsLeft <= 0
              ? '牌库已空'
              : '有空列时不能发牌'
            : '发牌到每一列'
        }
      >
        {dealsLeft > 0 ? (
          <PlayingCard faceDown size="sm" />
        ) : (
          <PlayingCard size="sm" placeholder />
        )}
        {dealsLeft > 0 && (
          <span className="pointer-events-none absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-wood text-[10px] font-bold text-gold-bright border border-gold/50 px-1">
            {dealsLeft}
          </span>
        )}
      </button>
      <div className="text-xs text-cream/85 leading-tight">
        <div className="font-medium">牌库</div>
        <div>剩余 {dealsLeft} 次</div>
      </div>
    </div>
  )
}
