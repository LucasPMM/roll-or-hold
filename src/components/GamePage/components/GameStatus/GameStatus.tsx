type GameStatusProps = Readonly<{
  isWinner: boolean
  message: string
}>

export const GameStatus = ({ isWinner, message }: GameStatusProps) => (
  <div
    aria-live="polite"
    class={`rounded-card border px-5 py-4 text-center font-semibold ${
      isWinner
        ? 'border-accent bg-accent-surface text-foreground'
        : 'border-border bg-surface text-foreground-secondary'
    }`}
    role="status"
  >
    {message}
  </div>
)
