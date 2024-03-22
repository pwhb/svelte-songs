<script>
	// @ts-nocheck
	import { page } from '$app/stores';
	import { openModal } from '$lib/utils/dialog';
	import { parseDate } from '$lib/utils/formatters';
	import DefaultDialog from '../dialog/DefaultDialog.svelte';
	const { slug, tableConfig } = $page.data;
	const query = Object.fromEntries($page.url.searchParams);

	const getUrlFromQuery = (query) =>
		$page.url.pathname + `?${new URLSearchParams(query).toString()}`;

	const searchQuery = {
		...query,
		active: true
	};
</script>

<DefaultDialog modalId="delete_item" title="Are you sure?" text="Are you sure you want to delete this item?" />

<table class="table">
	<!-- head -->
	<thead>
		<tr>
			<th></th>
			{#each tableConfig.columns as column}
				<th>{column.label}</th>
			{/each}
			<th></th>
		</tr>
	</thead>
	<tbody>
		<!-- row 1 -->
		<tr>
			<td></td>
			{#each tableConfig.columns as column}
				{#if column.type === 'date'}
					<td> </td>
				{:else if column.type === 'boolean'}
					<td>
						<input type="checkbox" class="toggle" bind:checked={searchQuery[column.label]} />
					</td>
				{:else}
					<td>
						<input
							type="text"
							class="w-20 input input-xs input-bordered"
							bind:value={searchQuery[column.label]}
						/>
					</td>
				{/if}
			{/each}
			<td>
				<!-- <button
					class="btn btn-xs btn-primary"
					on:click={() => {
						console.log({ searchQuery });
					}}>search</button
				> -->

				<a class="btn btn-xs btn-primary" href={getUrlFromQuery(searchQuery)}>search</a>
			</td>
		</tr>
		{#each $page.data[slug].data as row, idx}
			<tr class="hover">
				<td>{idx + 1 + $page.data[slug].page * $page.data[slug].size}</td>
				{#each tableConfig.columns as column}
					{#if column.type === 'date'}
						<td>{parseDate(row[column.value])}</td>
					{:else if column.type === 'boolean'}
						<td>
							<span
								class={`badge text-white ${row[column.value] ? 'badge-success' : 'badge-error'}`}
							>
								{row[column.value]}
							</span>
						</td>
					{:else}
						<td>{row[column.value]}</td>
					{/if}
				{/each}
				<td>
					<a class="btn btn-xs btn-neutral" href={`/bean-noodle/${slug}/${row._id}`}>view</a>
					<a class="btn btn-xs btn-primary" href={`/bean-noodle/${slug}/${row._id}/edit`}>edit</a>
					<button
						class="text-white btn btn-xs btn-error"
						on:click={() => {
							openModal('delete_item');
						}}>delete</button
					>
				</td>
			</tr>
		{/each}
	</tbody>
</table>

<div class="my-6 w-full text-center">
	<div class="join">
		{#if $page.data[slug].page > 0}
			<a
				class="join-item btn btn-xs"
				href={getUrlFromQuery({ ...query, page: $page.data[slug].page - 1 })}>«</a
			>
		{/if}
		<button class="join-item btn btn-xs disabled"
			>page {$page.data[slug].page} / {Math.floor($page.data[slug].count / $page.data[slug].size)}
		</button>
		{#if $page.data[slug].page < Math.floor($page.data[slug].count / $page.data[slug].size)}
			<a
				class="join-item btn btn-xs"
				href={getUrlFromQuery({ ...query, page: $page.data[slug].page + 1 })}>»</a
			>
		{/if}
	</div>
</div>
