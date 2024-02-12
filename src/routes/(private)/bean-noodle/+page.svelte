<script>
	import { page } from '$app/stores';
	const { data } = $page.data.collections;
</script>

<div class="grid grid-cols-2 gap-10 py-10">
	{#each data as col}
		<a
			class="p-5 mx-10 text-center text-white rounded-lg shadow-lg bg-slate-400"
			href={`/bean-noodle/${col.name}`}>{col.name}</a
		>
	{/each}
</div>
