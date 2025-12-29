<script lang="ts" generics="SingleNode extends object">
	import { onMount, type Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import {
		type BlurParams,
		type FadeParams,
		type FlyParams,
		type ScaleParams,
		type SlideParams,
		type TransitionConfig
	} from 'svelte/transition';

	import Self from './tree.svelte';
	import type { Node, TreeData } from './tree.types';
	type ParamsType =
		| FadeParams
		| BlurParams
		| FlyParams
		| SlideParams
		| ScaleParams
		| undefined;

	type TransitionFunc = (
		node: HTMLElement,
		params: ParamsType
	) => TransitionConfig;

	type Props = {
		tree: TreeData<SingleNode>;
		node: Snippet<[SingleNode]>;
		wrapperProps?: Record<string, unknown>;
		wrapperElement?: keyof HTMLElementTagNameMap;
		transition?: TransitionFunc;
		transitionParams?: ParamsType;
		transitionWrapperProps?: HTMLAttributes<HTMLDivElement>;
	};

	let {
		node,
		tree = $bindable<TreeData<SingleNode>>({}),
		wrapperProps,
		wrapperElement,
		transition,
		transitionParams,
		transitionWrapperProps
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
</script>

{#each Object.entries(tree) as [id, content] (id)}
	<!-- We cannot optionally pass a single attribute to a svelte:element, therefore we need to handle the transition attribute with a if/else statement-->
	{#if transition}
		<svelte:element
			this={wrapperElement ?? 'div'}
			{...wrapperProps}
			transition:transition|local={transitionParams}
		>
			{@render node(content)}

			{#if content.children && content.expanded}
				<div
					transition:transition|local={transitionParams}
					{...transitionWrapperProps}
				>
					<Self
						{node}
						bind:tree={content.children}
						{wrapperProps}
						{wrapperElement}
						{transition}
					/>
				</div>
			{/if}
		</svelte:element>
	{:else}
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
	{/if}
{/each}
