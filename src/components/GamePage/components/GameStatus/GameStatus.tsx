type GameStatusProps = Readonly<{
  isWinner: boolean
  message: string
}>

export const GameStatus = ({ isWinner, message }: GameStatusProps) => (
  <div
    aria-live="polite"
    class={`rounded-2xl border px-3 py-3 text-center text-sm font-semibold sm:rounded-card sm:px-5 sm:py-4 sm:text-base ${
      isWinner
        ? 'border-accent bg-accent-surface text-foreground'
        : 'border-border bg-surface text-foreground-secondary'
    }`}
    role="status"
  >
    {message}
  </div>
)
