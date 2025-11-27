<script lang="ts" generics="N extends object = object">
	import { onMount, type Snippet } from 'svelte';

	import type { Node, NodeActions, NodeWithChildren, TreeData } from '../types';
	import Self from './tree.svelte';
	import type {} from './utils';
	import { deleteNode, insertNode, updateNode } from './utils';

	type NodeProps<N extends object> = NodeWithChildren<N> & {
		actions: NodeActions<N>;
	};
	type Props = {
		tree: TreeData<N>;
		node: Snippet<[NodeProps<N>]>;
		wrapperProps?: Record<string, unknown>;
		wrapperElement?: keyof HTMLElementTagNameMap;
	};

	let {
		node,
		tree = $bindable<TreeData<N>>({}),
		wrapperProps,
		wrapperElement
	}: Props = $props();

	// Ensure all nodes have an expanded property
	// If they don't, default to false
	// This is done on mount to avoid issues with
	// SSR and hydration
	onMount(() => {
		tree = Object.entries(tree).reduce(
			(acc: TreeData<N>, [key, value]: [key: string, value: Node<N>]) => {
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

	function toggle(node: NodeWithChildren<N>) {
		tree = updateNode({
			node: {
				...node,
				expanded: !node.expanded
			},
			tree
		});
	}
</script>

{#each Object.entries(tree) as [id, content] (id)}
	<svelte:element this={wrapperElement ?? 'div'} {...wrapperProps}>
		{@render node({
			...content,
			actions: {
				toggle: () => toggle(content),
				update: (node) => {
					tree = updateNode({ node, tree });
				},
				delete: () => {
					tree = deleteNode({ node: content, tree });
				},

				insert: (node) => {
					tree = insertNode({
						tree,
						parent: content,
						node
					});
				}
			}
		})}

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
