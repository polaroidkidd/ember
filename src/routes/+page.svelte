<script lang="ts">
	import { type ItemProps } from '$lib/accordion/types';
	import Accordion from '$lib/accordion/accordion.svelte';
	import { v4 as uuid } from 'uuid';
	const a = uuid();
	const b = uuid();
	const c = uuid();
	let tree = $state({
		[a]: {
			id: a,
			name: 'Root',
			children: {
				[c]: {
					id: c,
					name: 'Child of root'
				}
			}
		},
		[b]: {
			id: b,
			name: 'Another Root',
			children: {}
		}
	});
</script>



{#snippet item(content: ItemProps<{}>)}
	<h1>{content.name}</h1>
	{#if content.children}
		<button
			type="button"
			onclick={(e) => {
				e.preventDefault();
				content.actions.toggle();
			}}>Expand</button
		>
	{/if}
{/snippet}

<Accordion {item} bind:tree />
