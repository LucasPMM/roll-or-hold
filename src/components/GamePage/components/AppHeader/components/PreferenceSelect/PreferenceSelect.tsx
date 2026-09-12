import type { JSX } from 'preact'

export type PreferenceOption<Value extends string> = Readonly<{
  label: string
  value: Value
}>

type PreferenceSelectProps<Value extends string> = Readonly<{
  icon: 'language' | 'theme'
  label: string
  onChange: (value: Value) => void
  options: readonly PreferenceOption<Value>[]
  value: Value
}>

const PreferenceIcon = ({ icon }: Pick<PreferenceSelectProps<string>, 'icon'>) => {
  if (icon === 'language') {
    return (
      <svg aria-hidden="true" class="size-4" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8" />
        <path
          d="M3.5 12h17M12 3c2.3 2.5 3.5 5.5 3.5 9S14.3 18.5 12 21c-2.3-2.5-3.5-5.5-3.5-9S9.7 5.5 12 3Z"
          stroke="currentColor"
          stroke-width="1.8"
        />
      </svg>
    )
  }

  return (
    <svg aria-hidden="true" class="size-4" fill="none" viewBox="0 0 24 24">
      <path
        d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.4-6.4L17 7m-10 10-1.4 1.4m12.8 0L17 17M7 7 5.6 5.6"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-width="1.8"
      />
      <circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.8" />
    </svg>
  )
}

export const PreferenceSelect = <Value extends string>({
  icon,
  label,
  onChange,
  options,
  value,
}: PreferenceSelectProps<Value>) => {
  const handleChange = (event: JSX.TargetedEvent<HTMLSelectElement>) => {
    onChange(event.currentTarget.value as Value)
  }

  return (
    <label class="grid min-w-0 flex-1 gap-1.5 text-xs font-semibold text-muted-foreground">
      <span class="px-1">{label}</span>
      <span class="relative block text-foreground">
        <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          <PreferenceIcon icon={icon} />
        </span>
        <select
          aria-label={label}
          class="min-h-11 w-full appearance-none rounded-2xl border border-border bg-surface py-2.5 pl-10 pr-9 text-sm font-bold shadow-subtle transition-colors hover:border-border-strong"
          onChange={handleChange}
          value={value}
        >
          {options.map((option) => (
            <option class="bg-surface text-foreground" key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <svg
          aria-hidden="true"
          class="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path d="m7 10 5 5 5-5" stroke="currentColor" stroke-linecap="round" stroke-width="2" />
        </svg>
      </span>
    </label>
  )
}
