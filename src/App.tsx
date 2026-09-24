import { useState } from 'react'
import { GameBoard } from '@/components/GameBoard'
import { LeaderboardModal } from '@/components/LeaderboardModal'
import { SiteFooter } from '@/components/SiteFooter'
import { TopBar } from '@/components/TopBar'
import { WelcomeModal } from '@/components/WelcomeModal'
import { WinModal } from '@/components/WinModal'
import { computeScore } from '@/game/score'
import type { Difficulty } from '@/game/types'
import { useSpiderGame } from '@/hooks/useSpiderGame'
import { hasOnboarded } from '@/lib/leaderboard'

export function App() {
  const [ready, setReady] = useState(() => hasOnboarded())
  const game = useSpiderGame('hard')
  const [showBoard, setShowBoard] = useState(false)

  const score = computeScore(
    game.state.moves,
    game.state.undos,
    game.state.foundations,
    game.state.scoreForcedZero,
  )

  const startWith = (difficulty: Difficulty): void => {
    game.setDifficulty(difficulty)
    setReady(true)
  }

  return (
    <div className="min-h-dvh flex flex-col felt-bg">
      {!ready && <WelcomeModal onStart={(_id, difficulty) => startWith(difficulty)} />}
      <TopBar
        difficulty={game.state.difficulty}
        moves={game.state.moves}
        undos={game.state.undos}
        score={score}
        elapsedMs={game.elapsedMs}
        foundations={game.state.foundations}
        canUndo={game.canUndo}
        onDifficulty={game.setDifficulty}
        onNewGame={() => game.newGame()}
        onRestart={game.restartDeal}
        onUndo={game.undoMove}
        onHint={game.showHint}
        onLeaderboard={() => setShowBoard(true)}
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
      <SiteFooter />
      {showBoard && (
        <LeaderboardModal
          difficulty={game.state.difficulty}
          onClose={() => setShowBoard(false)}
        />
      )}
      {ready && game.state.won && (
        <WinModal
          difficulty={game.state.difficulty}
          elapsedMs={game.elapsedMs}
          moves={game.state.moves}
          undos={game.state.undos}
          score={score}
          onAgain={() => game.newGame()}
        />
      )}
    </div>
  )
}
