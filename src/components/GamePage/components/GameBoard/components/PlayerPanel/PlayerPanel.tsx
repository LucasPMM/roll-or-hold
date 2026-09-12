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
      class={`grid min-h-64 content-between gap-8 rounded-card border-2 p-6 shadow-subtle transition-colors will-change-transform ${stateClassName} ${animationClassName}`}
    >
      <div class="flex flex-wrap items-center justify-between gap-3">
        <h3 class="font-display text-xl font-bold">{name}</h3>
        <span class={`rounded-pill px-3 py-1 text-xs font-bold ${badgeClassName}`}>
          {badgeLabel}
        </span>
      </div>

      <div class="grid gap-6">
        <div>
          <p class="text-sm font-semibold text-muted-foreground">{t('score.total')}</p>
          <p class="font-display text-6xl font-bold leading-none tabular-nums">{score}</p>
        </div>

        <div class="rounded-2xl bg-surface-muted p-4">
          <p class="text-sm font-semibold text-muted-foreground">{t('score.turn')}</p>
          <p class="font-display text-3xl font-bold tabular-nums">{turnScore}</p>
        </div>
      </div>
    </article>
  )
}
