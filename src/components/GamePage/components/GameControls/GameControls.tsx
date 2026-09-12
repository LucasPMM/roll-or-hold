import { useI18n } from '@/lib/i18n'

type GameControlsProps = Readonly<{
  canHold: boolean
  canRoll: boolean
  onHold: () => void
  onRoll: () => void
}>

const buttonBaseClassName =
  'min-h-12 rounded-pill px-6 py-3 text-base font-bold transition-transform enabled:hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40'

export const GameControls = ({ canHold, canRoll, onHold, onRoll }: GameControlsProps) => {
  const { t } = useI18n()

  return (
    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <button
        class={`${buttonBaseClassName} bg-accent text-accent-foreground shadow-subtle`}
        disabled={!canRoll}
        onClick={onRoll}
        type="button"
      >
        {t('action.roll')}
      </button>
      <button
        class={`${buttonBaseClassName} border border-foreground bg-surface text-foreground`}
        disabled={!canHold}
        onClick={onHold}
        type="button"
      >
        {t('action.hold')}
      </button>
    </div>
  )
}
