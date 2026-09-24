import { GameBoard } from '@/components/GameBoard'
import { TopBar } from '@/components/TopBar'
import { WinModal } from '@/components/WinModal'
import { useSpiderGame } from '@/hooks/useSpiderGame'

export function App() {
  const game = useSpiderGame('easy')

  return (
    <div className="min-h-dvh flex flex-col felt-bg">
      <TopBar
        difficulty={game.state.difficulty}
        moves={game.state.moves}
        elapsedMs={game.elapsedMs}
        foundations={game.state.foundations}
        canUndo={game.canUndo}
        onDifficulty={game.setDifficulty}
        onNewGame={() => game.newGame()}
        onRestart={game.restartDeal}
        onUndo={game.undoMove}
        onHint={game.showHint}
      />
      <GameBoard
        tableau={game.state.tableau}
        dealsLeft={game.dealsLeft}
        canDeal={game.canDeal}
        shook={game.shook}
        hint={game.hint}
        onCardClick={game.onCardClick}
        onDeal={game.deal}
      />
      {game.state.won && (
        <WinModal
          elapsedMs={game.elapsedMs}
          moves={game.state.moves}
          onAgain={() => game.newGame()}
        />
      )}
    </div>
  )
}
