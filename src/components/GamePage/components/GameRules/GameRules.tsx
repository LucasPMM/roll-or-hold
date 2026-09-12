import { type TranslationKey, useI18n } from '@/lib/i18n'

const rules = [
  ['rules.roll.title', 'rules.roll.description'],
  ['rules.hold.title', 'rules.hold.description'],
  ['rules.one.title', 'rules.one.description'],
  ['rules.doubleSix.title', 'rules.doubleSix.description'],
] as const satisfies ReadonlyArray<readonly [TranslationKey, TranslationKey]>

export const GameRules = () => {
  const { t } = useI18n()

  return (
    <section aria-labelledby="rules-title" class="rounded-card bg-surface-muted p-6 sm:p-8">
      <h2 class="font-display text-2xl font-bold" id="rules-title">
        {t('rules.title')}
      </h2>
      <ol class="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {rules.map(([titleKey, descriptionKey], index) => (
          <li class="grid grid-cols-[auto_1fr] gap-3" key={titleKey}>
            <span class="grid size-8 place-items-center rounded-full bg-accent text-sm font-bold text-accent-foreground">
              {index + 1}
            </span>
            <div>
              <h3 class="font-bold">{t(titleKey)}</h3>
              <p class="mt-1 text-sm font-medium text-muted-foreground">{t(descriptionKey)}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
