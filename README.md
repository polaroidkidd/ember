# @dle.dev/ember — Headless Nestable Accordion for Svelte

A small, headless, accessible and highly-customizable nestable accordion component for Svelte. The implementation stores nodes in a Record (object) for O(1) access by id and provides helper actions for toggling, inserting, updating and deleting nodes.

## Features

- Headless: you provide the rendering snippet for each item.
- Nestable: any node can have children and children are rendered recursively.
- Efficient: tree is a Record keyed by id for O(1) lookups instead of scanning arrays.
- Helpers: built-in actions for toggle, insert, update and delete.

## Install

# @dle.dev/ember — Headless Nestable Accordion for Svelte

A small, headless, accessible and highly-customizable nestable accordion component for Svelte. The implementation stores nodes in a Record (object) for O(1) access by id and provides helper actions for toggling, inserting, updating and deleting nodes.

## Features

- Headless: you provide the rendering snippet for each item.
- Nestable: any node can have children and children are rendered recursively.
- Efficient: tree is a Record keyed by id for O(1) lookups instead of scanning arrays.
- Helpers: built-in actions for toggle, insert, update and delete.

## Install

Yarn / npm / pnpm (package name from package.json):

```bash
npm install @dle.dev/ember
# or
pnpm add @dle.dev/ember
```

Peer dependency: Svelte 5.

## Quick usage

Import the component and pass two things:

- an `item` snippet that renders a single node
- a `tree` which is a bindable state holding the whole tree

Minimal example (Svelte):

```svelte
<script lang="ts">
	import { Accordion, type ItemProps } from '@dle.dev/ember';
	import { state } from 'some-state-lib'; // example: Svelte store / framework binding

	// tree has shape: Record<string, NodeWithChildren>
	let tree = $state({
		rootId: { id: 'rootId', name: 'Root', children: {} }
	});

	// item is a Svelte snippet (see demo in src/routes/+page.svelte)
	const item = /* snippet: ItemProps */;
</script>

<Accordion {item} bind:tree />
```

See `src/routes/+page.svelte` in this repo for a complete demo of an `item` snippet with action buttons.

## Types

The component exports the following TypeScript types (see `src/lib/ember/accordion/types.ts`):

- `Node<T>` — a node in the tree. Must include an `id: string`. Optionally `expanded?: boolean` and any extra properties.
- `NodeWithChildren<T>` — `Node` with an optional `children?: Record<string, NodeWithChildren<T>>`.
- `Tree<T>` — `Record<string, NodeWithChildren<T>>` representing the full tree.
- `NodeActions<N>` — the actions provided to each item: `toggle(): void`, `insert(node)`, `update(node)`, `delete()`.
- `ItemProps<N>` — the props passed to your item snippet: the node fields plus `actions: NodeActions<N>`.

Example signatures:

```ts
type NodeActions<N> = {
	toggle: () => void;
	insert: (node: Node<N>) => void;
	delete: () => void;
	update: (node: NodeWithChildren<N>) => void;
};

type ItemProps<N> = NodeWithChildren<N> & { actions: NodeActions<N> };
```

## Component API

Accordion props:

- `item` (Snippet): required — your rendering snippet. It will receive `ItemProps<N>`.
- `tree` (bindable): required — the entire tree object. The component mutates the bound tree when actions are invoked.
- `indent?: string` optional — CSS class or string used to indent nested levels (defaults to `ml-4`).

Item actions available inside your snippet:

- `actions.toggle()` — toggles the node's `expanded` state.
- `actions.insert(node)` — inserts `node` as a child of the current node.
- `actions.update(node)` — replaces the node at this location with `node` (preserves children when you provide them).
- `actions.delete()` — deletes this node and its entire subtree from the tree.

All actions operate immutably on `tree` (they replace the bound `tree` with a new object), so Svelte reactivity will pick up changes.

## Example item snippet (from the demo)

The demo (`src/routes/+page.svelte`) shows a practical snippet that:

- Renders a toggle button (rotates chevron when expanded).
- Renders the node name.
- Has a control button which performs the currently selected action (`insert`, `update`, or `delete`).

Snippet (conceptual):

```svelte
{#snippet item(content: ItemProps<{}>)}
	<button on:click={() => content.actions.toggle()}>Toggle</button>
	<span>{content.name}</span>
	<button on:click={() => content.actions.insert({ id: crypto.randomUUID(), name: 'New Node', children: {} })}>Insert</button>
	<button on:click={() => content.actions.update({ ...content, name: 'Updated' })}>Update</button>
	<button on:click={() => content.actions.delete()}>Delete</button>
{/snippet}
```

Notes: the demo wires a select to pick which of insert/update/delete the control button performs. When inserting, you must provide a unique `id` for the new node.

## Implementation details

- The component performs DFS-style path resolution to find nodes by id using `getPathToNodeById` and then performs structural cloning to update/insert/delete nodes immutably. See `src/lib/ember/accordion/actions.ts` for the full implementations.
- `onMount` the component normalizes nodes to ensure `expanded` is set to a boolean.

## Development

Scripts available in `package.json`:

- `npm run dev` — starts Vite dev server for the demo site.
- `npm run build` — builds the demo and packages the svelte component.
- `npm run test` — runs unit tests (vitest).
- `npm run check` — runs type/svelte checkers.

## Contributing

PRs and issues welcome. Please keep changes small and add tests for action helpers when modifying `src/lib/ember/accordion/actions.ts`.

## License

MIT — see `License.md`.
