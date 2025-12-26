<script lang="ts" generics="SingleNode extends object">
	import { onMount, type Snippet } from 'svelte';

	import Self from './tree.svelte';
	import type {
		Node,
		NodeActions,
		NodeWithChildren,
		TreeData
	} from './tree.types';
	import type {} from './tree.utils';
	import { deleteNode, insertNode, updateNode } from './tree.utils';

	type NodeProps<N extends object> = NodeWithChildren<N> & {
		actions: NodeActions<N>;
	};
	type Props = {
		tree: TreeData<SingleNode>;
		node: Snippet<[NodeProps<SingleNode>]>;
		wrapperProps?: Record<string, unknown>;
		wrapperElement?: keyof HTMLElementTagNameMap;
	};

	let {
		node,
		tree = $bindable<TreeData<SingleNode>>({}),
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
				acc: TreeData<SingleNode>,
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

	function toggle(node: NodeWithChildren<SingleNode>) {
		updateNode({
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
					updateNode({ node, tree });
				},
				delete: () => {
					deleteNode({ node: content, tree });
				},

				insert: (node) => {
					insertNode({
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
