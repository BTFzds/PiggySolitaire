import { PlayingCard, type CardSize, type HintRole } from './PlayingCard'
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
    const emptyTarget = hint?.toCol === columnIndex
    return (
      <div className="flex flex-col items-center min-h-[4rem]">
        <PlayingCard size={size} placeholder hintRole={emptyTarget ? 'target' : null} />
      </div>
    )
  }

  return (
    <div className="relative flex flex-col items-center" style={{ paddingBottom: overlap }}>
      {cards.map((card, index) => {
        const isTop = index === cards.length - 1
        const shaking = shook?.col === columnIndex && shook.cardIndex === index
        let hintRole: HintRole | null = null
        if (hint?.fromCol === columnIndex && index >= hint.cardIndex) {
          hintRole = 'source'
        } else if (hint?.toCol === columnIndex && isTop) {
          hintRole = 'target'
        }
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
              hintRole={hintRole}
              onClick={canClick ? () => onCardClick(columnIndex, index) : undefined}
            />
          </div>
        )
      })}
    </div>
  )
}
