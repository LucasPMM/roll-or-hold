import { useI18n } from '@/lib/i18n'

export type PlayerFeedback = 'loss' | 'win' | null

type PlayerPanelProps = Readonly<{
  feedback: PlayerFeedback
  isActive: boolean
  isWinner: boolean
  name: string
  score: number
  turnScore: number
}>

export const PlayerPanel = ({
  feedback,
  isActive,
  isWinner,
  name,
  score,
  turnScore,
}: PlayerPanelProps) => {
  const { t } = useI18n()
  const stateClassName = isWinner
    ? 'border-accent bg-accent-surface'
    : isActive
      ? 'border-foreground bg-surface'
      : 'border-border bg-surface'
  const badgeClassName = isWinner
    ? 'bg-accent text-accent-foreground'
    : isActive
      ? 'bg-foreground text-canvas'
      : 'bg-surface-muted text-muted-foreground'
  const badgeLabel = isWinner
    ? t('player.winner')
    : isActive
      ? t('player.active')
      : t('player.waiting')
  const animationClassName =
    feedback === 'win' ? 'animate-player-win' : feedback === 'loss' ? 'animate-player-loss' : ''

  return (
    <article
      aria-label={name}
      aria-current={isActive && !isWinner ? 'true' : undefined}
      class={`grid min-w-0 content-between gap-4 rounded-2xl border-2 p-3 shadow-subtle transition-colors will-change-transform sm:min-h-64 sm:gap-8 sm:rounded-card sm:p-6 ${stateClassName} ${animationClassName}`}
    >
      <div class="grid min-w-0 w-full justify-items-start gap-2 sm:flex sm:flex-wrap sm:items-center sm:justify-between sm:gap-3">
        <h3 class="min-w-0 w-full truncate font-display text-base font-bold sm:w-auto sm:text-xl">
          {name}
        </h3>
        <span
          class={`rounded-pill px-2 py-0.5 text-[0.625rem] font-bold sm:px-3 sm:py-1 sm:text-xs ${badgeClassName}`}
        >
          {badgeLabel}
        </span>
      </div>

      <div class="grid gap-3 sm:gap-6">
        <div>
          <p class="text-xs font-semibold text-muted-foreground sm:text-sm">{t('score.total')}</p>
          <p class="font-display text-4xl font-bold leading-none tabular-nums sm:text-6xl">
            {score}
          </p>
        </div>

        <div class="rounded-xl bg-surface-muted p-2.5 sm:rounded-2xl sm:p-4">
          <p class="text-xs font-semibold text-muted-foreground sm:text-sm">{t('score.turn')}</p>
          <p class="font-display text-2xl font-bold tabular-nums sm:text-3xl">{turnScore}</p>
        </div>
      </div>
    </article>
  )
}
