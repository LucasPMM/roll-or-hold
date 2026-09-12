import { describe, expect, it, vi } from 'vitest'
import {
  createGameState,
  defaultWinningScore,
  type GameState,
  gameReducer,
  parseWinningScore,
  rollDice,
} from './game'

const roll = (
  state: GameState,
  firstDie: 1 | 2 | 3 | 4 | 5 | 6,
  secondDie: 1 | 2 | 3 | 4 | 5 | 6,
) => gameReducer(state, { type: 'roll', dice: [firstDie, secondDie] })

const hold = (state: GameState) => gameReducer(state, { type: 'hold' })

describe('createGameState', () => {
  it('creates a fresh two-player match', () => {
    expect(createGameState()).toEqual({
      activePlayer: 0,
      scores: [0, 0],
      turnScore: 0,
      lastRoll: null,
      status: 'playing',
      winner: null,
      winningScore: defaultWinningScore,
      lastEvent: null,
    })
  })

  it('rejects invalid winning scores', () => {
    expect(() => createGameState(0)).toThrow(RangeError)
    expect(() => createGameState(2.5)).toThrow(RangeError)
  })
})

describe('parseWinningScore', () => {
  it.each([
    ['100', 100],
    [' 25 ', 25],
    [1, 1],
  ])('accepts %j as a positive whole number', (candidate, expected) => {
    expect(parseWinningScore(candidate)).toBe(expected)
  })

  it.each(['', '0', '-10', '2.5', 'not-a-number', 0, -1, 1.5, Number.POSITIVE_INFINITY])(
    'rejects %j',
    (candidate) => {
      expect(parseWinningScore(candidate)).toBeNull()
    },
  )
})

describe('gameReducer', () => {
  it('adds both dice to the active turn score', () => {
    const firstRoll = roll(createGameState(), 2, 5)
    const secondRoll = roll(firstRoll, 3, 4)

    expect(secondRoll.activePlayer).toBe(0)
    expect(secondRoll.turnScore).toBe(14)
    expect(secondRoll.scores).toEqual([0, 0])
    expect(secondRoll.lastRoll).toEqual([3, 4])
    expect(secondRoll.lastEvent).toEqual({
      type: 'roll-scored',
      player: 0,
      dice: [3, 4],
      points: 7,
      turnScore: 14,
    })
  })

  it.each([
    [1, 6],
    [6, 1],
  ] as const)('forfeits the turn score when the roll is %j and %j', (firstDie, secondDie) => {
    const stateWithPoints = roll(createGameState(), 4, 5)
    const result = roll(stateWithPoints, firstDie, secondDie)

    expect(result.activePlayer).toBe(1)
    expect(result.turnScore).toBe(0)
    expect(result.scores).toEqual([0, 0])
    expect(result.lastEvent).toEqual({
      type: 'rolled-one',
      player: 0,
      dice: [firstDie, secondDie],
      lostTurnScore: 9,
    })
  })

  it('resets the active player banked score after a double six', () => {
    const playerZeroWithBankedPoints = hold(roll(createGameState(), 4, 5))
    const playerZeroTurn = hold(roll(playerZeroWithBankedPoints, 2, 3))
    const playerZeroWithTurnPoints = roll(playerZeroTurn, 2, 3)
    const result = roll(playerZeroWithTurnPoints, 6, 6)

    expect(result.activePlayer).toBe(1)
    expect(result.turnScore).toBe(0)
    expect(result.scores).toEqual([0, 5])
    expect(result.lastEvent).toEqual({
      type: 'double-six',
      player: 0,
      dice: [6, 6],
      lostBankedScore: 9,
      lostTurnScore: 5,
    })
  })

  it('banks the turn score and passes play when holding', () => {
    const result = hold(roll(createGameState(), 4, 5))

    expect(result.activePlayer).toBe(1)
    expect(result.turnScore).toBe(0)
    expect(result.scores).toEqual([9, 0])
    expect(result.lastEvent).toEqual({
      type: 'held',
      player: 0,
      points: 9,
      total: 9,
    })
  })

  it('declares a winner and ignores gameplay actions after the match ends', () => {
    const winningState = hold(roll(createGameState(10), 5, 5))

    expect(winningState.status).toBe('won')
    expect(winningState.winner).toBe(0)
    expect(winningState.scores).toEqual([10, 0])
    expect(winningState.lastEvent).toEqual({
      type: 'won',
      player: 0,
      points: 10,
      total: 10,
    })
    expect(roll(winningState, 2, 3)).toBe(winningState)
    expect(hold(winningState)).toBe(winningState)
  })

  it('starts a fully reset match with the requested winning score', () => {
    const stateWithPoints = roll(createGameState(), 4, 5)
    const result = gameReducer(stateWithPoints, { type: 'new-game', winningScore: 50 })

    expect(result).toEqual(createGameState(50))
  })
})

describe('rollDice', () => {
  it('maps an injected random source to two die values', () => {
    const randomSource = vi.fn().mockReturnValueOnce(0).mockReturnValueOnce(0.999)

    expect(rollDice(randomSource)).toEqual([1, 6])
    expect(randomSource).toHaveBeenCalledTimes(2)
  })

  it.each([-0.1, 1, Number.POSITIVE_INFINITY, Number.NaN])(
    'rejects an out-of-range random value of %j',
    (randomValue) => {
      expect(() => rollDice(() => randomValue)).toThrow(RangeError)
    },
  )
})
