import type { JSX } from 'preact'
import { useI18n } from '@/lib/i18n'

type NewGameFormProps = Readonly<{
  errorMessage: string | null
  onSubmit: (score: string) => void
  score: string
  setScore: (score: string) => void
}>

export const NewGameForm = ({ errorMessage, onSubmit, score, setScore }: NewGameFormProps) => {
  const { t } = useI18n()

  const handleSubmit = (event: JSX.TargetedSubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit(score)
  }

  const handleChange = (event: JSX.TargetedEvent<HTMLInputElement>) => {
    setScore(event.currentTarget.value)
  }

  return (
    <form
      class="grid gap-3 rounded-card border border-border bg-surface p-5 shadow-subtle sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end"
      noValidate
      onSubmit={handleSubmit}
    >
      <div class="grid gap-1.5">
        <label class="text-sm font-bold" for="winning-score">
          {t('setup.label')}
        </label>
        <input
          aria-describedby={errorMessage ? 'winning-score-error' : 'winning-score-help'}
          aria-invalid={Boolean(errorMessage)}
          class="min-h-12 w-full rounded-xl border border-border-strong bg-canvas px-4 font-semibold tabular-nums"
          id="winning-score"
          inputMode="numeric"
          min="1"
          onInput={handleChange}
          step="1"
          type="number"
          value={score}
        />
        {errorMessage ? (
          <span class="text-sm font-semibold text-accent-strong" id="winning-score-error">
            {errorMessage}
          </span>
        ) : (
          <span class="text-sm font-medium text-muted-foreground" id="winning-score-help">
            {t('setup.help')}
          </span>
        )}
      </div>
      <button
        class="min-h-12 rounded-pill bg-foreground px-6 py-3 font-bold text-canvas transition-transform hover:-translate-y-0.5"
        type="submit"
      >
        {t('action.newGame')}
      </button>
    </form>
  )
}
