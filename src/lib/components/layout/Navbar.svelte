<script>
	import { page } from '$app/stores';
	import NavIcon from './NavIcon.svelte';

	const { user } = $page.data;
</script>

<div class="navbar bg-base-100">
	<div class="flex-1">
		<a class="text-xl btn btn-ghost" href="/">daisyUI</a>
	</div>
	<div class="flex-none gap-2">
		<div class="form-control">
			<input type="text" placeholder="Search" class="w-24 input input-bordered md:w-auto" />
		</div>

		{#if user}
			<NavIcon />
		{/if}
	</div>
</div>
