import { useReducer, useState } from 'preact/hooks'
import {
  createGameState,
  defaultWinningScore,
  type GameEvent,
  gameReducer,
  parseWinningScore,
  type RandomSource,
  rollDice,
} from '@/features/game'
import { type TranslationKey, useI18n } from '@/lib/i18n'
import {
  AppHeader,
  GameBoard,
  GameControls,
  GameRules,
  GameStatus,
  NewGameForm,
} from './components'

type Translate = (key: TranslationKey, values?: Record<string, number | string>) => string

const getStatusMessage = (
  event: GameEvent | null,
  playerNames: readonly [string, string],
  t: Translate,
): string => {
  if (!event) {
    return t('status.ready')
  }

  const player = playerNames[event.player]
  if (event.type === 'roll-scored') {
    return t('status.rollScored', {
      player,
      points: event.points,
      turnScore: event.turnScore,
    })
  }
  if (event.type === 'rolled-one') {
    return t('status.rolledOne', { player, points: event.lostTurnScore })
  }
  if (event.type === 'double-six') {
    return t('status.doubleSix', {
      player,
      banked: event.lostBankedScore,
      turn: event.lostTurnScore,
    })
  }
  if (event.type === 'held') {
    return t('status.held', { player, points: event.points, total: event.total })
  }

  return t('status.won', { player, points: event.points, total: event.total })
}

type GamePageProps = Readonly<{
  randomSource?: RandomSource
}>

export const GamePage = ({ randomSource = Math.random }: GamePageProps) => {
  const { t } = useI18n()
  const [state, dispatch] = useReducer(gameReducer, createGameState())
  const [winningScore, setWinningScore] = useState(String(defaultWinningScore))
  const [winningScoreError, setWinningScoreError] = useState<string | null>(null)
  const [diceAnimationKey, setDiceAnimationKey] = useState(0)
  const playerNames = [t('player.one'), t('player.two')] as const
  const winnerName = state.winner === null ? null : playerNames[state.winner]
  const currentPlayerName = playerNames[state.activePlayer]
  const isWinner = state.status === 'won'

  const handleNewGame = (candidate: string) => {
    const score = parseWinningScore(candidate)
    if (!score) {
      setWinningScoreError(t('setup.error'))
      return
    }

    setWinningScoreError(null)
    setDiceAnimationKey(0)
    dispatch({ type: 'new-game', winningScore: score })
  }

  const handleRoll = () => {
    setDiceAnimationKey((currentKey) => currentKey + 1)
    dispatch({ type: 'roll', dice: rollDice(randomSource) })
  }

  return (
    <div class="min-h-screen bg-canvas text-foreground">
      <a
        class="fixed left-4 top-4 z-50 -translate-y-24 rounded-pill bg-foreground px-4 py-3 font-bold text-canvas focus:translate-y-0"
        href="#main-content"
      >
        {t('navigation.skipToGame')}
      </a>
      <AppHeader />

      <main
        class="mx-auto grid max-w-page gap-5 px-3 py-5 sm:gap-8 sm:px-6 sm:py-10 lg:px-8"
        id="main-content"
      >
        <section class="grid gap-3 text-center sm:gap-5">
          <div class="mx-auto rounded-pill bg-accent-surface px-4 py-1.5 text-xs font-bold text-foreground sm:py-2 sm:text-sm">
            {t('game.target', { score: state.winningScore })}
          </div>
          <div class="mx-auto max-w-3xl">
            <p class="mb-2 text-xs font-bold text-accent-strong sm:mb-3 sm:text-sm">
              {t('game.eyebrow')}
            </p>
            <h1
              class={`font-display text-3xl font-bold leading-tight sm:text-5xl lg:text-6xl ${
                isWinner ? 'animate-player-win' : ''
              }`}
            >
              {winnerName
                ? t('game.winnerTitle', { player: winnerName })
                : t('game.turnTitle', { player: currentPlayerName })}
            </h1>
            <p class="mx-auto mt-2 max-w-2xl text-sm font-medium text-muted-foreground sm:mt-4 sm:text-lg">
              {t('game.introduction')}
            </p>
          </div>
        </section>

        <GameBoard
          activePlayer={state.activePlayer}
          diceAnimationKey={diceAnimationKey}
          lastEvent={state.lastEvent}
          lastRoll={state.lastRoll}
          playerNames={playerNames}
          scores={state.scores}
          turnScore={state.turnScore}
          winner={state.winner}
        />

        <div class="mx-auto grid w-full max-w-2xl gap-3 sm:gap-4">
          <GameStatus
            isWinner={isWinner}
            message={getStatusMessage(state.lastEvent, playerNames, t)}
          />
          <GameControls
            canHold={!isWinner}
            canRoll={!isWinner}
            onHold={() => dispatch({ type: 'hold' })}
            onRoll={handleRoll}
          />
          <NewGameForm
            errorMessage={winningScoreError}
            onSubmit={handleNewGame}
            score={winningScore}
            setScore={setWinningScore}
          />
        </div>

        <GameRules />
      </main>
    </div>
  )
}
