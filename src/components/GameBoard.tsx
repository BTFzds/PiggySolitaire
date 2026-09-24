import { useEffect, useState } from 'react'
import { StockPile } from './StockPile'
import { TableauColumn } from './TableauColumn'
import type { CardSize } from './PlayingCard'
import type { HintRef, TableauCard } from '@/game/types'

interface GameBoardProps {
  tableau: TableauCard[][]
  dealsLeft: number
  canDeal: boolean
  shook: { col: number; cardIndex: number; token: number } | null
  hint: HintRef | null
  onCardClick: (col: number, cardIndex: number) => void
  onDeal: () => void
}

function layoutForWidth(w: number): { size: CardSize; overlap: number } {
  if (w < 380) {
    return { size: 'xs', overlap: 14 }
  }
  if (w < 640) {
    return { size: 'sm', overlap: 16 }
  }
  return { size: 'md', overlap: 22 }
}

export function GameBoard({
  tableau,
  dealsLeft,
  canDeal,
  shook,
  hint,
  onCardClick,
  onDeal,
}: GameBoardProps) {
  const [layout, setLayout] = useState(() =>
    layoutForWidth(typeof window !== 'undefined' ? window.innerWidth : 400),
  )

  useEffect(() => {
    const onResize = (): void => setLayout(layoutForWidth(window.innerWidth))
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <main className="mx-auto max-w-5xl px-1.5 sm:px-3 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
      <div className="mb-3 flex justify-end px-1">
        <StockPile dealsLeft={dealsLeft} canDeal={canDeal} onDeal={onDeal} />
      </div>

      <div className="overflow-x-auto pb-2 -mx-1 px-1">
        <div className="grid grid-cols-10 gap-0.5 sm:gap-1.5 min-w-[320px]">
          {tableau.map((cards, col) => (
            <TableauColumn
              key={col}
              columnIndex={col}
              cards={cards}
              size={layout.size}
              overlap={layout.overlap}
              shook={shook}
              hint={hint}
              onCardClick={onCardClick}
            />
          ))}
        </div>
      </div>

      <p className="mt-4 text-center text-[11px] text-cream/55 px-4">
        点明牌自动落到合适列；动不了会晃一下。空列时不能发牌。
      </p>
    </main>
  )
}
