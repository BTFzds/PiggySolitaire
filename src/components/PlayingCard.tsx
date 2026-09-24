import type { CSSProperties } from 'react'
import { isRed, RANK_LABEL, SUIT_SYMBOL } from '@/game/deck'
import type { TableauCard } from '@/game/types'

export type CardSize = 'xs' | 'sm' | 'md'
export type HintRole = 'source' | 'target'

interface PlayingCardProps {
  card?: TableauCard
  faceDown?: boolean
  size?: CardSize
  placeholder?: boolean
  selected?: boolean
  hintRole?: HintRole | null
  shaking?: boolean
  onClick?: () => void
  className?: string
  style?: CSSProperties
}

const SIZE_BOX: Record<CardSize, string> = {
  xs: 'w-[2.15rem] h-[3.05rem] text-[10px]',
  sm: 'w-[2.55rem] h-[3.6rem] text-[11px]',
  md: 'w-[3.1rem] h-[4.35rem] text-xs sm:w-14 sm:h-20 sm:text-sm',
}

export function PlayingCard({
  card,
  faceDown,
  size = 'sm',
  placeholder,
  selected,
  hintRole,
  shaking,
  onClick,
  className = '',
  style,
}: PlayingCardProps) {
  const box = SIZE_BOX[size]

  if (placeholder) {
    const targetEmpty = hintRole === 'target'
    return (
      <div
        className={`${box} rounded-md border-2 border-dashed shrink-0 ${
          targetEmpty
            ? 'border-emerald-200 bg-emerald-300/25 shadow-hint-target animate-hint-pulse'
            : 'border-white/30 bg-black/10'
        } ${className}`}
        style={style}
        aria-label="空列"
      />
    )
  }

  const interactive = Boolean(onClick)
  const hintCls =
    hintRole === 'source'
      ? 'shadow-hint animate-hint-pulse z-20'
      : hintRole === 'target'
        ? 'shadow-hint-target animate-hint-pulse z-20'
        : selected
          ? 'ring-2 ring-gold-bright'
          : ''
  const shakeCls = shaking ? 'animate-card-shake' : ''

  const shellCls = `${box} ${hintCls} ${shakeCls} rounded-md shadow-card shrink-0 overflow-hidden ${
    interactive ? 'cursor-pointer active:scale-[0.98]' : 'cursor-default'
  } ${className}`

  if (faceDown || !card) {
    const back = (
      <div
        style={style}
        className={`${shellCls} card-back border-2 border-gold-bright/70`}
        aria-label="牌背"
      >
        <span className="relative z-[1] text-white/90 font-display text-base leading-none drop-shadow-sm">
          ♦
        </span>
      </div>
    )
    if (!interactive) {
      return back
    }
    return (
      <button type="button" onClick={onClick} className="p-0 border-0 bg-transparent">
        {back}
      </button>
    )
  }

  const red = isRed(card.suit)
  const label = RANK_LABEL[card.rank]
  const isWide = label.length > 1

  const face = (
    <div
      style={style}
      className={`${shellCls} bg-cream border border-black/10 relative text-left ${
        red ? 'text-suit-red' : 'text-suit-black'
      }`}
      aria-label={`${label}${SUIT_SYMBOL[card.suit]}`}
    >
      <div className="absolute top-[2px] left-[2px] leading-none font-extrabold flex flex-col items-center">
        <span className={`tabular-nums ${isWide ? 'tracking-tighter' : ''}`}>{label}</span>
        <span className="mt-[2px] text-[0.9em]">{SUIT_SYMBOL[card.suit]}</span>
      </div>
      <div className="absolute inset-0 flex items-center justify-center text-lg sm:text-xl leading-none pointer-events-none opacity-90">
        {SUIT_SYMBOL[card.suit]}
      </div>
    </div>
  )

  if (!interactive) {
    return face
  }
  return (
    <button type="button" onClick={onClick} className="p-0 border-0 bg-transparent block">
      {face}
    </button>
  )
}
