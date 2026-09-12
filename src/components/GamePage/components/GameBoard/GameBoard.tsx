import type { DiceRoll, GameEvent, PlayerIndex, PlayerScores } from '@/features/game'
import { useI18n } from '@/lib/i18n'
import { Dice, type PlayerFeedback, PlayerPanel } from './components'

const getPlayerFeedback = (event: GameEvent | null, player: PlayerIndex): PlayerFeedback => {
  if (!event || event.player !== player) {
    return null
  }
  if (event.type === 'rolled-one' || event.type === 'double-six') {
    return 'loss'
  }
  if (event.type === 'won') {
    return 'win'
  }

  return null
}

type GameBoardProps = Readonly<{
  activePlayer: PlayerIndex
  diceAnimationKey: number
  lastEvent: GameEvent | null
  lastRoll: DiceRoll | null
  playerNames: readonly [string, string]
  scores: PlayerScores
  turnScore: number
  winner: PlayerIndex | null
}>

export const GameBoard = ({
  activePlayer,
  diceAnimationKey,
  lastEvent,
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
        feedback={getPlayerFeedback(lastEvent, 0)}
        isActive={activePlayer === 0 && winner === null}
        isWinner={winner === 0}
        name={playerNames[0]}
        score={scores[0]}
        turnScore={activePlayer === 0 && winner === null ? turnScore : 0}
      />
      <div class="grid place-items-center py-2 md:px-2 md:py-0">
        <Dice animate={lastRoll !== null} key={diceAnimationKey} roll={lastRoll} />
      </div>
      <PlayerPanel
        feedback={getPlayerFeedback(lastEvent, 1)}
        isActive={activePlayer === 1 && winner === null}
        isWinner={winner === 1}
        name={playerNames[1]}
        score={scores[1]}
        turnScore={activePlayer === 1 && winner === null ? turnScore : 0}
      />
    </section>
  )
}
