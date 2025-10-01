<script lang="ts" generics="N extends object = object">
	import { onMount, type Snippet } from 'svelte';

	import Self from './accordion.svelte';
	import type {} from './actions';
	import {
		deleteNode,
		getNodeByPath,
		getPathToNodeById,
		insertNode,
		updateNode,
		updateNodeByPath
	} from './actions';
	import type { Node, NodeActions, NodeWithChildren, Tree } from './types';

	type ItemProps<N extends object> = NodeWithChildren<N> & {
		actions: NodeActions<N>;
	};
	type Props = {
		tree: Tree<N>;
		item: Snippet<[ItemProps<N>]>;
	};

	let { item, tree = $bindable<Tree<N>>({}) }: Props = $props();
	onMount(() => {
		tree = Object.entries(tree).reduce(
			(acc: Tree<N>, [key, value]: [key: string, value: Node<N>]) => {
				acc[key] = {
					...value,
					expanded:
						Object.hasOwn(value, 'expanded') && typeof value.expanded === 'boolean'
							? value.expanded
							: false
				};
				return acc;
			},
			{}
		);
	});

	function toggle(id: string) {
		const path = getPathToNodeById({
			id,
			tree
		});
		const currentNode = getNodeByPath({ path, tree });
		const updatedNode: NodeWithChildren<N> = { ...currentNode, expanded: !currentNode.expanded };

		tree = updateNodeByPath({
			tree,
			update: updatedNode,
			path
		});
	}
</script>

{#each Object.entries(tree) as [id, content] (id)}
	<div class="ml-1">
		{@render item({
			...content,
			actions: {
				toggle: () => toggle(id),
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
			<Self {item} bind:tree={content.children} />
		{/if}
	</div>
{/each}
