# @dle.dev/ember — Headless Components for Svelte

A collection of headless components for svelte 5

## Install

Yarn / npm / pnpm (package name from package.json):

```bash
npm install @dle.dev/ember
# or
pnpm add @dle.dev/ember
```

Peer dependency: Svelte 5.

## Components

### Accordion

A small, headless, accessible and highly-customizable nestable accordion component for Svelte. The implementation stores nodes in a Record (object) for O(1) access by id and provides helper actions for toggling, inserting, updating and deleting nodes.

#### Implementation details

- The component performs DFS-style path resolution to find nodes by id using `getPathToNodeById` and then performs structural cloning to update/insert/delete nodes immutably. See `src/lib/ember/accordion/actions.ts` for the full implementations.
- `onMount` the component normalizes nodes to ensure `expanded` is set to a boolean.

## Development

Scripts available in `package.json`:

- `npm run dev` — starts Vite dev server for the demo site.
- `npm run build` — builds the demo and packages the svelte component.
- `npm run test` — runs unit tests (vitest).
- `npm run check` — runs type/svelte checkers.

## Contributing

PRs and issues welcome. Please keep changes small and add tests.

## License

MIT — see `License.md`.
