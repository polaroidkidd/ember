<script lang="ts" generics="SingleNode extends object">
	import { onMount, type Snippet } from 'svelte';

	import Self from './tree.svelte';
	import type { Node, Tree } from './tree.types';

	type Props = {
		tree: Tree<SingleNode>;
		node: Snippet<[SingleNode]>;
		wrapperProps?: Record<string, unknown>;
		wrapperElement?: keyof HTMLElementTagNameMap;
	};

	let {
		node,
		tree = $bindable<Tree<SingleNode>>({}),
		wrapperProps,
		wrapperElement
	}: Props = $props();

	// Ensure all nodes have an expanded property
	// If they don't, default to false
	// This is done on mount to avoid issues with
	// SSR and hydration
	onMount(() => {
		tree = Object.entries(tree).reduce(
			(
				acc: Tree<SingleNode>,
				[key, value]: [key: string, value: Node<SingleNode>]
			) => {
				acc[key] = {
					...value,
					expanded:
						Object.hasOwn(value, 'expanded') &&
						typeof value.expanded === 'boolean'
							? value.expanded
							: false
				};
				return acc;
			},
			{}
		);
	});
</script>

{#each Object.entries(tree) as [id, content] (id)}
	<svelte:element this={wrapperElement ?? 'div'} {...wrapperProps}>
		{@render node(content)}

		{#if content.children && content.expanded}
			<Self
				{node}
				bind:tree={content.children}
				{wrapperProps}
				{wrapperElement}
			/>
		{/if}
	</svelte:element>
{/each}
