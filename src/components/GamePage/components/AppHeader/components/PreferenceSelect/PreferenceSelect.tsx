import type { JSX } from 'preact'
import { useEffect, useId, useRef, useState } from 'preact/hooks'

export type PreferenceOption<Value extends string> = Readonly<{
  label: string
  value: Value
}>

type PreferenceSelectProps<Value extends string> = Readonly<{
  icon: 'language' | 'theme'
  label: string
  onChange: (value: Value) => void
  options: readonly [PreferenceOption<Value>, ...PreferenceOption<Value>[]]
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
  const [isOpen, setIsOpen] = useState(false)
  const controlId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const selectedOption = options.find((option) => option.value === value) ?? options[0]

  const focusOption = (position: 'first' | 'last' | 'selected') => {
    window.requestAnimationFrame(() => {
      const optionElements = Array.from(
        rootRef.current?.querySelectorAll<HTMLButtonElement>('[role="option"]') ?? [],
      )
      const selectedIndex = options.findIndex((option) => option.value === value)
      const optionIndex =
        position === 'first'
          ? 0
          : position === 'last'
            ? optionElements.length - 1
            : Math.max(selectedIndex, 0)
      optionElements[optionIndex]?.focus()
    })
  }

  const openOptions = (position: 'first' | 'last' | 'selected' = 'selected') => {
    setIsOpen(true)
    focusOption(position)
  }

  const closeOptions = () => {
    setIsOpen(false)
    triggerRef.current?.focus()
  }

  const handleTriggerKeyDown = (event: JSX.TargetedKeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      openOptions('first')
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      openOptions('last')
    } else if (event.key === 'Escape' && isOpen) {
      event.preventDefault()
      closeOptions()
    }
  }

  const handleOptionKeyDown = (event: JSX.TargetedKeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      closeOptions()
      return
    }
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      return
    }

    event.preventDefault()
    const optionElements = Array.from(
      rootRef.current?.querySelectorAll<HTMLButtonElement>('[role="option"]') ?? [],
    )
    const currentIndex = optionElements.indexOf(event.currentTarget)
    const nextIndex =
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? optionElements.length - 1
          : (currentIndex + (event.key === 'ArrowDown' ? 1 : -1) + optionElements.length) %
            optionElements.length
    optionElements[nextIndex]?.focus()
  }

  const selectOption = (option: PreferenceOption<Value>) => {
    onChange(option.value)
    closeOptions()
  }

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('pointerdown', handlePointerDown)

    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [isOpen])

  return (
    <div class="relative grid min-w-0 flex-1 gap-1.5" ref={rootRef}>
      <span
        class="sr-only px-1 text-xs font-semibold text-muted-foreground sm:not-sr-only"
        id={`${controlId}-label`}
      >
        {label}
      </span>
      <span class="relative block text-foreground">
        <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          <PreferenceIcon icon={icon} />
        </span>
        <button
          aria-controls={`${controlId}-options`}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-label={label}
          class="min-h-10 w-full rounded-2xl border border-border bg-surface py-2 pl-9 pr-8 text-left text-sm font-bold shadow-subtle transition-colors hover:border-border-strong sm:min-h-11 sm:py-2.5 sm:pl-10 sm:pr-9"
          onClick={() => (isOpen ? closeOptions() : openOptions())}
          onKeyDown={handleTriggerKeyDown}
          ref={triggerRef}
          type="button"
        >
          <span class="block truncate">{selectedOption.label}</span>
        </button>
        <svg
          aria-hidden="true"
          class={`pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-transform sm:right-3 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
        >
          <path d="m7 10 5 5 5-5" stroke="currentColor" stroke-linecap="round" stroke-width="2" />
        </svg>
      </span>

      {isOpen ? (
        <div
          aria-labelledby={`${controlId}-label`}
          class={`absolute top-full z-50 mt-2 grid min-w-40 overflow-hidden rounded-2xl border border-border bg-surface p-1.5 text-foreground shadow-subtle ${
            icon === 'theme' ? 'right-0' : 'left-0'
          }`}
          id={`${controlId}-options`}
          role="listbox"
        >
          {options.map((option) => {
            const isSelected = option.value === value
            return (
              <button
                aria-selected={isSelected}
                class="flex min-h-11 items-center justify-between gap-4 rounded-xl px-3 py-2 text-left text-sm font-semibold transition-colors hover:bg-accent-surface focus-visible:bg-accent-surface"
                key={option.value}
                onClick={() => selectOption(option)}
                onKeyDown={handleOptionKeyDown}
                role="option"
                type="button"
              >
                <span>{option.label}</span>
                <span
                  aria-hidden="true"
                  class={`grid size-5 place-items-center rounded-full text-xs ${
                    isSelected
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-surface-muted text-transparent'
                  }`}
                >
                  ✓
                </span>
              </button>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
