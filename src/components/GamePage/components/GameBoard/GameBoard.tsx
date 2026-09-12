import type { DiceRoll, PlayerIndex, PlayerScores } from '@/features/game'
import { useI18n } from '@/lib/i18n'
import { Dice, PlayerPanel } from './components'

type GameBoardProps = Readonly<{
  activePlayer: PlayerIndex
  lastRoll: DiceRoll | null
  playerNames: readonly [string, string]
  scores: PlayerScores
  turnScore: number
  winner: PlayerIndex | null
}>

export const GameBoard = ({
  activePlayer,
  lastRoll,
  playerNames,
  scores,
  turnScore,
  winner,
}: GameBoardProps) => {
  const { t } = useI18n()

  return (
    <section aria-labelledby="game-board-title" class="grid gap-4 md:grid-cols-[1fr_auto_1fr]">
      <h2 class="sr-only" id="game-board-title">
        {t('game.boardLabel')}
      </h2>
      <PlayerPanel
        isActive={activePlayer === 0 && winner === null}
        isWinner={winner === 0}
        name={playerNames[0]}
        score={scores[0]}
        turnScore={activePlayer === 0 && winner === null ? turnScore : 0}
      />
      <div class="grid place-items-center py-2 md:px-2 md:py-0">
        <Dice roll={lastRoll} />
      </div>
      <PlayerPanel
        isActive={activePlayer === 1 && winner === null}
        isWinner={winner === 1}
        name={playerNames[1]}
        score={scores[1]}
        turnScore={activePlayer === 1 && winner === null ? turnScore : 0}
      />
    </section>
  )
}
