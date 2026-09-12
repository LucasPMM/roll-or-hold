export const defaultWinningScore = 100

export type PlayerIndex = 0 | 1
export type DieValue = 1 | 2 | 3 | 4 | 5 | 6
export type DiceRoll = readonly [DieValue, DieValue]
export type PlayerScores = readonly [number, number]
export type GameStatus = 'playing' | 'won'

export type GameEvent =
  | Readonly<{
      type: 'roll-scored'
      player: PlayerIndex
      dice: DiceRoll
      points: number
      turnScore: number
    }>
  | Readonly<{
      type: 'rolled-one'
      player: PlayerIndex
      dice: DiceRoll
      lostTurnScore: number
    }>
  | Readonly<{
      type: 'double-six'
      player: PlayerIndex
      dice: DiceRoll
      lostBankedScore: number
      lostTurnScore: number
    }>
  | Readonly<{
      type: 'held'
      player: PlayerIndex
      points: number
      total: number
    }>
  | Readonly<{
      type: 'won'
      player: PlayerIndex
      points: number
      total: number
    }>

export type GameState = Readonly<{
  activePlayer: PlayerIndex
  scores: PlayerScores
  turnScore: number
  lastRoll: DiceRoll | null
  status: GameStatus
  winner: PlayerIndex | null
  winningScore: number
  lastEvent: GameEvent | null
}>

export type GameAction =
  | Readonly<{ type: 'roll'; dice: DiceRoll }>
  | Readonly<{ type: 'hold' }>
  | Readonly<{ type: 'new-game'; winningScore: number }>

export type RandomSource = () => number

export const parseWinningScore = (candidate: string | number): number | null => {
  const value = typeof candidate === 'number' ? candidate : Number(candidate.trim())
  if (!Number.isSafeInteger(value) || value < 1) {
    return null
  }
  return value
}

export const createGameState = (winningScore = defaultWinningScore): GameState => {
  const parsedWinningScore = parseWinningScore(winningScore)
  if (!parsedWinningScore) {
    throw new RangeError('The winning score must be a positive whole number.')
  }

  return {
    activePlayer: 0,
    scores: [0, 0],
    turnScore: 0,
    lastRoll: null,
    status: 'playing',
    winner: null,
    winningScore: parsedWinningScore,
    lastEvent: null,
  }
}

const nextPlayer = (player: PlayerIndex): PlayerIndex => (player === 0 ? 1 : 0)

const replacePlayerScore = (
  scores: PlayerScores,
  player: PlayerIndex,
  score: number,
): PlayerScores => (player === 0 ? [score, scores[1]] : [scores[0], score])

const endTurn = (
  state: GameState,
  lastRoll: DiceRoll | null,
  lastEvent: GameEvent,
  scores = state.scores,
): GameState => ({
  ...state,
  activePlayer: nextPlayer(state.activePlayer),
  scores,
  turnScore: 0,
  lastRoll,
  lastEvent,
})

const applyRoll = (state: GameState, dice: DiceRoll): GameState => {
  const [firstDie, secondDie] = dice

  if (firstDie === 1 || secondDie === 1) {
    return endTurn(state, dice, {
      type: 'rolled-one',
      player: state.activePlayer,
      dice,
      lostTurnScore: state.turnScore,
    })
  }

  if (firstDie === 6 && secondDie === 6) {
    const scores = replacePlayerScore(state.scores, state.activePlayer, 0)
    return endTurn(
      state,
      dice,
      {
        type: 'double-six',
        player: state.activePlayer,
        dice,
        lostBankedScore: state.scores[state.activePlayer],
        lostTurnScore: state.turnScore,
      },
      scores,
    )
  }

  const points = firstDie + secondDie
  const turnScore = state.turnScore + points
  return {
    ...state,
    turnScore,
    lastRoll: dice,
    lastEvent: {
      type: 'roll-scored',
      player: state.activePlayer,
      dice,
      points,
      turnScore,
    },
  }
}

const applyHold = (state: GameState): GameState => {
  const total = state.scores[state.activePlayer] + state.turnScore
  const scores = replacePlayerScore(state.scores, state.activePlayer, total)

  if (total >= state.winningScore) {
    return {
      ...state,
      scores,
      turnScore: 0,
      status: 'won',
      winner: state.activePlayer,
      lastEvent: {
        type: 'won',
        player: state.activePlayer,
        points: state.turnScore,
        total,
      },
    }
  }

  return endTurn(
    state,
    state.lastRoll,
    {
      type: 'held',
      player: state.activePlayer,
      points: state.turnScore,
      total,
    },
    scores,
  )
}

export const gameReducer = (state: GameState, action: GameAction): GameState => {
  if (action.type === 'new-game') {
    return createGameState(action.winningScore)
  }
  if (state.status === 'won') {
    return state
  }
  if (action.type === 'roll') {
    return applyRoll(state, action.dice)
  }
  return applyHold(state)
}

const rollDie = (randomSource: RandomSource): DieValue => {
  const randomValue = randomSource()
  if (!Number.isFinite(randomValue) || randomValue < 0 || randomValue >= 1) {
    throw new RangeError(
      'The random source must return a number from 0 up to, but not including, 1.',
    )
  }
  return (Math.floor(randomValue * 6) + 1) as DieValue
}

export const rollDice = (randomSource: RandomSource = Math.random): DiceRoll => [
  rollDie(randomSource),
  rollDie(randomSource),
]
