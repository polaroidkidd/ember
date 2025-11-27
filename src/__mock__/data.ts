export const MOCK_TREE = {
	'01992b16-2674-7a73-9871-0b0480fde233': {
		id: '01992b16-2674-7a73-9871-0b0480fde233',
		name: 'office',
		children: {}
	},
	'01992b16-3d51-7d03-9a11-a44ccfcd5344': {
		id: '01992b16-3d51-7d03-9a11-a44ccfcd5344',
		name: 'bedroom',
		children: {
			'01992b1b-d067-7563-9621-954dc16e5bde': {
				id: '01992b1b-d067-7563-9621-954dc16e5bde',
				name: 'daniel',
				children: {
					'01998cad-e659-7c71-92e6-39ff2aff9079': {
						id: '01998cad-e659-7c71-92e6-39ff2aff9079',
						name: 'thing',
						children: {
							'01998cae-0f8b-7183-8727-08c21282a51d': {
								id: '01998cae-0f8b-7183-8727-08c21282a51d',
								name: 'other-thing',
								children: {
									'01998cae-3488-7dd0-8613-a00573b19f74': {
										id: '01998cae-3488-7dd0-8613-a00573b19f74',
										name: 'latest-thing',
										children: {}
									}
								}
							}
						}
					},
					'0199a004-378d-7ba3-951d-8fd000223eef': {
						id: '0199a004-378d-7ba3-951d-8fd000223eef',
						name: 'office-thing-thing',
						children: {}
					},
					'0199a004-ba0b-7b63-ad4c-f50b8f88d15a': {
						id: '0199a004-ba0b-7b63-ad4c-f50b8f88d15a',
						name: 'adasdasd',
						children: {}
					},
					'0199a19a-a7b9-7f73-8d1c-cb78111c9ab4': {
						id: '0199a19a-a7b9-7f73-8d1c-cb78111c9ab4',
						name: 'other-thing-thing',
						tags: []
					},
					'0199a19a-daab-7241-92e8-1bccc9c69b70': {
						id: '0199a19a-daab-7241-92e8-1bccc9c69b70',
						name: 'yet-another-new-stuff',
						tags: []
					}
				}
			}
		}
	}
};

export const MOCK_CODE_STRING = `<script lang="ts">
    import { Tree, type NodeProps } from '@dle.dev/ember';
	import clsx from 'clsx';
	import { v4 as uuid } from 'uuid';
	const a = uuid();
	const b = uuid();
	const c = uuid();
     // Just an example of a tree, the actual mock tree can be 
     // found in the repository for this example
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
	
// You're in charge here. The node snippet gets loaded 
// with three actions. Insert, Delete and Update.
{#snippet node(content: nodeProps<{}>)}
	{@const disabled = !(
		content.children && Object.keys(content.children).length > 0
	)}
	<div
		transition:fly
		class={clsx(
			'mb-2 inline-flex nodes-baseline',
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
					'bg-primary-100 hover:bg-primary-200': !disabled,
					'cursor-not-allowed bg-gray-200': disabled
				},

				'px-2 ',
				'flex nodes-baseline justify-baseline'
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

<Tree
	{node}
	bind:tree
	wrapperProps={{
		class: 'ml-6'
	}}
	wrapperElement="span"
/>
`;
