# Repository Guidelines

## Project Structure & Module Organization

This is a Svelte 5 component package for `@dle.dev/ember`. Library code lives in
`src/lib`, with the current tree component under `src/lib/tree`. The demo and
documentation routes live in `src/routes`, including component data JSON in
`src/routes/component-data`. Shared mocks are in `src/__mock__`, and tests are
kept in `src/tests` plus route-level specs such as `src/routes/page.svelte.spec.ts`.
Build output is generated into `dist` and should not be edited manually.

## Build, Test, and Development Commands

Use pnpm with Node `>=24.7.0`.

- `pnpm dev` starts the Vite/SvelteKit dev server on port 3000.
- `pnpm build` builds the demo app, runs Svelte packaging, and validates the
  package with `publint`.
- `pnpm check` runs `svelte-check` against `tsconfig.json`.
- `pnpm lint` checks `src/**/*.{js,ts,svelte}` with ESLint.
- `pnpm format` formats the repository with Prettier.
- `pnpm test` runs Vitest once; `pnpm test:ui` starts Vitest in watch mode.
- `pnpm preview` serves the production build; `pnpm preview:cf` previews the
  Cloudflare output with Wrangler.

## Coding Style & Naming Conventions

Prettier is authoritative: use tabs, single quotes, no trailing commas, and an
80-character print width. Svelte files are formatted through
`prettier-plugin-svelte`, and Tailwind classes are sorted with
`prettier-plugin-tailwindcss`. TypeScript is strict, uses LF newlines, and
enforces unused-local and implicit-return checks. ESLint also requires sorted
imports/exports and rejects unused imports. Prefer descriptive lowercase module
names such as `tree.utils.ts`, `tree.types.ts`, and component files ending in
`.svelte`.

## Testing Guidelines

Vitest is configured with separate browser and node projects. Browser tests use
Playwright Chromium and match `src/**/*.svelte.{test,spec}.{js,ts}`. Node tests
match `src/**/*.{test,spec}.{js,ts}` and exclude Svelte component specs. Keep
tests close to the behavior they cover, use `.spec.ts` or `.svelte.spec.ts`, and
add coverage for tree mutations, accessibility-relevant state, and route/demo
behavior when those areas change. Vitest requires assertions, so every test must
make an explicit expectation.

## Commit & Pull Request Guidelines

Recent history uses short imperative subjects such as `Maintenance: Update ...`
and occasional conventional prefixes like `chore:`. Keep commit subjects concise
and focused on one change. For pull requests, include a clear description, test
commands run, linked issues when applicable, and screenshots or short recordings
for visible Svelte route changes. Keep PRs small and add tests for behavior
changes.

## Security & Configuration Tips

Do not commit local secrets or generated Cloudflare credentials. Keep deployment
settings in `wrangler.jsonc`, package metadata in `package.json`, and release
notes through Changesets using `pnpm changeset`.
