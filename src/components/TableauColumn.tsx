import { PlayingCard, type CardSize } from './PlayingCard'
import type { HintRef, TableauCard } from '@/game/types'

interface TableauColumnProps {
  columnIndex: number
  cards: TableauCard[]
  size: CardSize
  overlap: number
  shook?: { col: number; cardIndex: number; token: number } | null
  hint: HintRef | null
  onCardClick: (col: number, cardIndex: number) => void
}

export function TableauColumn({
  columnIndex,
  cards,
  size,
  overlap,
  shook,
  hint,
  onCardClick,
}: TableauColumnProps) {
  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center min-h-[4rem]">
        <PlayingCard size={size} placeholder />
      </div>
    )
  }

  return (
    <div className="relative flex flex-col items-center" style={{ paddingBottom: overlap }}>
      {cards.map((card, index) => {
        const isTop = index === cards.length - 1
        const shaking = shook?.col === columnIndex && shook.cardIndex === index
        const hinted =
          (hint?.fromCol === columnIndex && hint.cardIndex === index) ||
          (hint?.toCol === columnIndex && isTop)
        const canClick = card.faceUp

        return (
          <div
            key={`${card.id}-${shaking ? shook?.token : 'idle'}`}
            className="relative"
            style={{
              marginTop: index === 0 ? 0 : -overlap,
              zIndex: index + 1,
            }}
          >
            <PlayingCard
              card={card}
              faceDown={!card.faceUp}
              size={size}
              shaking={Boolean(shaking)}
              hinted={Boolean(hinted)}
              onClick={canClick ? () => onCardClick(columnIndex, index) : undefined}
            />
          </div>
        )
      })}
    </div>
  )
}
