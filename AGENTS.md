# Agent Instructions — Roll or Hold

## Scope and sources of truth

- These instructions apply to the entire repository.
- Read this file, `README.md`, and `docs/DESIGN.md` before making changes.
- Keep implementation, tests, and permanent documentation synchronized.
- Treat the implemented game model and its tests as the source of truth for game behavior once the
  model exists.
- Do not add temporary roadmaps, migration notes, generated research, or other files intended for
  deletion after the refactor. Git history preserves transitional context.

## Working branch and commits

- Keep all modernization work on `refactor/roll-or-hold` until the owner authorizes integration.
- Never commit without explicit authorization after the owner has reviewed the current changes.
- A prior authorization does not cover edits made after that review.
- Write commit messages in English and follow Conventional Commits.
- Never bypass repository checks or Git hooks.

## Language policy

- Write source code, code comments, test descriptions, technical documentation, and commit-facing
  notes in English.
- Never hardcode user-facing copy in a component. Add it to the typed English and Brazilian
  Portuguese translation catalogs.
- English is the fallback locale.
- Keep translation keys and interpolation contracts identical across catalogs.

## Stack and architecture

- Use Preact, TypeScript, and Vite with pnpm.
- Keep the application static and compatible with GitHub Pages. Do not add a backend, server
  runtime, database, client-side secret, or unnecessary runtime API dependency.
- Use a pure, deterministic game model. Inject or isolate randomness so rule behavior can be tested
  without relying on `Math.random`.
- Use local component state or `useReducer` for gameplay. Do not add a global state library.
- Keep components presentational where possible and move game rules, browser preference detection,
  and persistence into focused modules.
- Import source modules through their folder barrel files.

## Folder and component conventions

- Put every reusable component in a PascalCase folder with a matching `ComponentName.tsx` file and
  an `index.ts` barrel.
- Put a component used by only one parent in that parent's `components/ComponentName/` folder,
  also with a matching `index.ts` barrel.
- Give reusable library and feature folders an `index.ts` public entry point.
- Keep files focused and prefer small named helpers, immutable state transitions, guard clauses,
  and explicit types.
- Avoid `else` and `else if`; use guard clauses, early returns, and focused helpers instead.
- Use the shared `ShouldRender` component for conditional JSX visibility.
- Always use braces around conditional and loop bodies, including single-statement branches.
- Never swallow an exception. Every caught error must be reported or translated into an explicit,
  documented recovery path.

## Game invariants

- A match has two players and two six-sided dice.
- A roll containing a 1 forfeits the current turn score and passes the turn.
- A double six forfeits the active player's banked and current scores and passes the turn.
- Holding banks the current turn score and passes the turn.
- Reaching or exceeding the configured target declares a winner and ends gameplay.
- A completed match must expose a clear, localized winner state and a new-match action.
- Do not change these rules without updating the model tests and `README.md` in the same change.

## Design, themes, and assets

- Treat `docs/DESIGN.md` as the visual direction and `src/styles/tokens.css` as the implementation
  source of truth once it exists.
- Use semantic tokens for every canvas, surface, border, foreground, accent, and interaction state.
- Preserve equivalent hierarchy and accessible contrast in light and dark themes.
- Follow the system color scheme until the player explicitly chooses Light or Dark, persist only
  that explicit choice, and apply the resolved theme before the first paint.
- Keep layouts usable from 320px through desktop widths and with text enlarged to 200 percent.
- Respect `prefers-reduced-motion` and retain visible keyboard focus.
- Do not restore the photographic background or raster dice assets. Render dice with semantic HTML
  and CSS, with accessible text alternatives.

## Internationalization

- Support `en` and `pt-BR`, with English as the fallback.
- Detect the browser locale on first visit and persist an explicit locale choice.
- Update the document language and localized metadata when the locale changes.
- Use language names in full where space permits; do not rely on flags.
- Localize dynamic game messages, including rolls, penalties, turn changes, holding, and winning.

## Quality and deployment

- Cover the pure game rules with deterministic unit tests, including rolls containing 1, double
  sixes, holding, target validation, winning, disabled post-win actions, and reset behavior.
- Add focused component tests for owned interaction behavior.
- Verify keyboard use, accessibility, theme and locale persistence, winner UX, and representative
  mobile and desktop widths in browser tests.
- Run the complete repository check, production build, and relevant browser tests before handoff.
- Publish only the verified `dist/` artifact through GitHub Actions.
- After the repository is renamed, configure the Vite base path and canonical metadata for
  `/roll-or-hold/`.
- When the production application is ready, add its GitHub Pages URL and representative desktop
  and mobile screenshots to `README.md`.
