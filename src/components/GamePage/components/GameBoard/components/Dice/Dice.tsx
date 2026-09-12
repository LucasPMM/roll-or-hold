import type { JSX } from 'preact'
import type { DiceRoll, DieValue } from '@/features/game'
import { useI18n } from '@/lib/i18n'

type PipPosition = readonly [column: number, row: number]

const pipLayouts: Record<DieValue, readonly PipPosition[]> = {
  1: [[2, 2]],
  2: [
    [1, 1],
    [3, 3],
  ],
  3: [
    [1, 1],
    [2, 2],
    [3, 3],
  ],
  4: [
    [1, 1],
    [3, 1],
    [1, 3],
    [3, 3],
  ],
  5: [
    [1, 1],
    [3, 1],
    [2, 2],
    [1, 3],
    [3, 3],
  ],
  6: [
    [1, 1],
    [3, 1],
    [1, 2],
    [3, 2],
    [1, 3],
    [3, 3],
  ],
}

type DieProps = Readonly<{
  animate: boolean
  hasDelay?: boolean
  value: DieValue | null
}>

const Die = ({ animate, hasDelay = false, value }: DieProps) => {
  const { t } = useI18n()
  const label = value ? t('dice.value', { value }) : t('dice.waiting')
  const animationClassName = animate
    ? `animate-dice-roll ${hasDelay ? '[animation-delay:70ms]' : ''}`
    : ''

  return (
    <div
      aria-label={label}
      class={`grid size-16 shrink-0 grid-cols-3 grid-rows-3 rounded-xl border border-border bg-surface p-2.5 shadow-subtle will-change-transform sm:size-24 sm:rounded-2xl sm:p-4 ${animationClassName}`}
      role="img"
    >
      {value ? (
        pipLayouts[value].map(([column, row]) => {
          const style: JSX.CSSProperties = { gridColumn: column, gridRow: row }
          return (
            <span
              aria-hidden="true"
              class="size-2.5 place-self-center rounded-full bg-foreground sm:size-3.5"
              key={`${column}-${row}`}
              style={style}
            />
          )
        })
      ) : (
        <span
          aria-hidden="true"
          class="col-span-3 row-span-3 place-self-center text-2xl font-bold text-muted-foreground sm:text-3xl"
        >
          ?
        </span>
      )}
    </div>
  )
}

type DiceProps = Readonly<{
  animate: boolean
  roll: DiceRoll | null
}>

export const Dice = ({ animate, roll }: DiceProps) => {
  const { t } = useI18n()

  return (
    <figure
      aria-label={t('dice.groupLabel')}
      class="grid justify-items-center gap-2 rounded-2xl bg-surface-muted px-3 py-3 sm:gap-4 sm:rounded-card sm:px-4 sm:py-6"
    >
      <div class="flex gap-3">
        <Die animate={animate} value={roll?.[0] ?? null} />
        <Die animate={animate} hasDelay value={roll?.[1] ?? null} />
      </div>
      <figcaption class="text-center text-xs font-semibold text-muted-foreground sm:text-sm">
        {roll ? t('dice.lastRoll', { first: roll[0], second: roll[1] }) : t('dice.waiting')}
      </figcaption>
    </figure>
  )
}
