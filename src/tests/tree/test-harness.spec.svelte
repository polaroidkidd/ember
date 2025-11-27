<script lang="ts">
	import { Tree } from '$lib/tree';
	import type { NodeProps } from '$lib/types';

	import { MOCK_TREE } from '../../__mock__/data';

	// Use a plain mutable tree variable so tests can bind to it.
	// We deep-clone the mock to avoid shared mutation between tests.
	let tree = $state(MOCK_TREE);

	// The snippet receives content and exposes action buttons to drive
	// the node actions directly from tests via data-testid attributes.
	// This keeps the harness minimal while allowing deterministic tests.
</script>

{#snippet node(content: NodeProps<object>)}
	<div data-testid={`node-${content.id}`} class="node">
		<button
			data-testid={`toggle-${content.id}`}
			onclick={() => content.actions.toggle()}
		>
			toggle
		</button>
		<span>{content.name}</span>

		<button
			data-testid={`insert-${content.id}`}
			onclick={() =>
				content.actions.insert({
					id: `${content.id}-new`,
					name: 'Inserted Node',
					children: {}
				})}
		>
			insert
		</button>

		<button
			data-testid={`update-${content.id}`}
			onclick={() =>
				content.actions.update({ ...content, name: 'Updated Node' })}
		>
			update
		</button>

		<button
			data-testid={`delete-${content.id}`}
			onclick={() => content.actions.delete()}
		>
			delete
		</button>
	</div>
{/snippet}

<div class="accordion">
	<Tree {node} bind:tree />
</div>

<style>
	.accordion {
		border: 1px solid red;
		display: flex;
		flex-direction: row;
		row-gap: 1rem;
	}
	.node {
		border: 1px solid blue;
		padding: 0.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
</style>
