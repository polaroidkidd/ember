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

### Tree

A small, headless, accessible and highly-customizable nestable tree component for Svelte. The implementation stores children in a Record keyed by id, enabling O(1) lookups within a node’s children. Helper functions are provided for toggling, inserting, updating and deleting nodes.

#### Implementation details

- The component performs DFS-style path resolution to find nodes by id using `getPathToNodeById` and then performs structural cloning to update/insert/delete nodes immutably. See `src/lib/tree/utils.ts` for the full implementations.
- `onMount` the component normalizes nodes to ensure `expanded` is set to a boolean.

## Development

Scripts available in `package.json`:

- `npm run dev` — starts Vite dev server for the demo site.
- `npm run build` — builds the demo and packages the svelte component.
- `npm run test` — runs unit tests (vitest).
- `npm run check` — runs type/svelte checkers.

## Roadmap

- Include a modal store

## Contributing

PRs and issues welcome. Please keep changes small and add tests.

## License

MIT — see `License.md`.
