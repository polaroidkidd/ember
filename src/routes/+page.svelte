<script lang="ts">
	import clsx from 'clsx';
	import { fly } from 'svelte/transition';
	import Highlight from 'svelte-highlight';
	import typescript from 'svelte-highlight/languages/typescript';
	import github from 'svelte-highlight/styles/github';

	import { MOCK_CODE_STRING, MOCK_TREE } from '$lib/__mock__/data';
	import Accordion from '$lib/ember/accordion/accordion.svelte';
	import { type ItemProps } from '$lib/ember/accordion/types';

	let tree = $state(MOCK_TREE);
	let action = $state('delete');

	const exampleTree = `
/**
 * A node in the tree. Can have any extra properties
 */	
export type Node<T extends object = object> = T & {
	/*
	 * A unique identifier for the node. This is
	 * required to perform actions on the tree. If it
	 * is not unique, actions will not work as expected.
	 * Most implementations use arrays here and loop over everything
	 * to find the right node, but this implementation
	 * uses a record for O(1) access.
	 */
	id: string;
	/*
	 * This property gets tacked on to the tree
	 * which is passed in and lets you determine
	 * if a node is expanded in the item snippet
	 */
	expanded?: boolean; 
	/*
	 * Any other properties you want to add to the node
	 */
	[key: string | number]: unknown;
};
/**
 * A node which can have children
 */
export type NodeWithChildren<T extends object = object> = Node<T> & {
	children?: Record<string, NodeWithChildren<T>>;
};
/**
 * The complete accordion tree. This is a record of nodes with children
 */
export type Tree<T extends object = object> = Record<string, NodeWithChildren<T>>;
`;
</script>

<svelte:head>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html github}
</svelte:head>
<div class="mb-5 flex items-center justify-baseline">
	<h1 class=" text-4xl">Ember</h1>
	<a
		href="https://github.com/polaroidkidd/ember"
		target="_blank"
		rel="noreferrer"
	>
		<img class="mr-2 ml-4 h-6 w-6" src="/github.svg" alt="GitHub Logo" />
	</a>
</div>
<h2 class="mb-10 text-2xl">A collection of headless svelte-5 components</h2>
<h3 class={clsx('mb-2 text-xl')}>Nestable Accordion</h3>

<p class="mb-2">
	Most implementations use arrays here and loop over everything to find the
	right node, but this implementation uses a record for O(1) access. Use this
	implementation for example when you have to render a large and deeply nested
	file tree. Additionally this library provides insert, update and delete
	actions to the item snippet as helpers. They are <strong>not required</strong>
	to use the component, but they make it easier to work with the tree.
</p>

<p class="mb-2">The component expects to arguments</p>
<ol class="ml-12 list-outside list-decimal py-4">
	<li>A snippet, which renders each entry</li>
	<li>
		A tree structure which represents the items in the accordion. This has to be
		a binded state
	</li>
</ol>

<p class="mb-2">The tree structure it expects is as follows</p>

<div class="mt-10 mb-10 overflow-hidden rounded-md border-[1px] shadow-2xl">
	<Highlight language={typescript} code={exampleTree} />
</div>
<p class="mb-2">
	The `item` snippet gets loaded with four helper methods. Update, Insert,
	Delete and Toggle
</p>
<ul class="mb-10 ml-12 list-outside list-disc py-4">
	<li>
		<i>Update</i> accepts a new node and will replace the current one in the tree
	</li>
	<li>
		<i>Delete</i> removes the current node and all it's children from the tree
	</li>
	<li>
		<i>Insert</i> accepts a new node and will add it as a child of the current node
	</li>
	<li><i>Toggle</i> toggles the expanded state of the current node</li>
</ul>

<p class="mb-2">
	All actions are performed on the tree and any changes are reflected
	immediatelly.
</p>
<h3 class="mb-5 text-xl">Example</h3>

<h3 class="mb-2">Select an action or toggle individual nodes</h3>
<select
	bind:value={action}
	class="mb-4 ml-2 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
>
	<option value="delete">Delete</option>
	<option value="insert">Insert</option>
	<option value="update">Update</option>
</select>
<!-- The ItemProps type should contain the type deffinition of an individual item in the tree-->
{#snippet item(content: ItemProps<object>)}
	{@const disabled = !(
		content.children && Object.keys(content.children).length > 0
	)}
	<div
		transition:fly
		class={clsx(
			'mb-2 inline-flex items-baseline',
			'justify-baseline rounded-2xl border-[1px]',
			'border-primary-200 bg-primary-50 p-4',
			'align-baseline'
		)}
	>
		<button
			{disabled}
			type="button"
			class={clsx(
				'cursor-pointer',
				'mr-2 rounded-full border-[1px]',
				{
					' bg-primary-100 hover:bg-primary-200': !disabled,
					'cursor-not-allowed bg-gray-200': disabled
				},

				'px-2 ',
				'flex items-baseline justify-baseline'
			)}
			onclick={(e) => {
				e.preventDefault();
				content.actions.toggle();
			}}
		>
			<div
				class={clsx('m-x-1 my-2 h-4 w-4 cursor-pointer transition-all  ', {
					'rotate-90': content.expanded
				})}
			>
				<img src="/chevron.svg" alt="Chevron icon" />
			</div>
		</button>
		<h1>{content.name}</h1>

		<button
			class="hover:bg-primary-100flex-col ml-2 flex cursor-pointer rounded-sm border-[1px] px-4 py-2"
			type="button"
			onclick={() => {
				if (action === 'insert') {
					content.actions.insert({
						id: crypto.randomUUID(),
						name: 'New Node',
						children: {}
					});
				} else if (action === 'update') {
					content.actions.update({
						...content,
						name: 'Updated Node'
					});
				} else if (action === 'delete') {
					content.actions.delete();
				}
			}}>{action}</button
		>
	</div>
{/snippet}

<Accordion {item} bind:tree />
<h3 class="mt-5 text-xl">Working Code</h3>
<div class="mt-10 overflow-hidden rounded-md border-[1px] shadow-2xl">
	<Highlight language={typescript} code={MOCK_CODE_STRING} />
</div>
