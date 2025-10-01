<script lang="ts">
	import clsx from 'clsx';
	import '../app.css';

	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" type="image/svg" href="/favicon.ico" />

	<title>Ember</title>
	<meta
		name="description"
		content="A small headless svelte component library"
	/>

	<link rel="canonical" href="https://github.com/polaroidkidd/ember" />
</svelte:head>

<main class={clsx('h-9/10 ')}>
	<div class="bg-gradient"></div>
	<div class="bg-grid"></div>

	<div class=" pt-10">
		{@render children()}
	</div>
</main>
