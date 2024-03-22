<script lang="ts">
	import { goto } from '$app/navigation';

	// @ts-nocheck
	import { page } from '$app/stores';
	import { openModal } from '$lib/utils/dialog';
	import { parseDate } from '$lib/utils/formatters';
	import DefaultDialog from '../dialog/DefaultDialog.svelte';
	const { slug, tableConfig } = $page.data;
	const query = Object.fromEntries($page.url.searchParams);

	const getUrlFromQuery = (query: any) =>
		$page.url.pathname + `?${new URLSearchParams(query).toString()}`;

	const searchQuery: any = {
		...query,
		active: true
	};
</script>

<DefaultDialog
	modalId="delete_item"
	title="Are you sure?"
	text="Are you sure you want to delete this item?"
/>

<table class="table">
	<!-- head -->
	<thead>
		<tr>
			<th></th>
			{#each tableConfig.columns as column}
				<th>
					<div class="flex flex-row justify-between items-center">
						{column.label}
						<div class="flex flex-col">
							{#if $page.url.searchParams.get('sort_by') !== column.value}
								<a href={getUrlFromQuery({ ...query, sort_by: column.value })}>
									<img class="w-4 h-4" src="/sort-up-svgrepo-com.svg" alt="sort-up" />
								</a>
							{/if}
							{#if $page.url.searchParams.get('sort_by') !== '-' + column.value}
								<a href={getUrlFromQuery({ ...query, sort_by: '-' + column.value })}>
									<img class="w-4 h-4" src="/sort-down-svgrepo-com.svg" alt="sort-down" />
								</a>
							{/if}
						</div>
					</div>
				</th>
			{/each}
			<th>
				<a class="text-white btn btn-xs btn-info" href={`${$page.url.pathname}/create`}>create</a>
			</th>
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
				href={getUrlFromQuery({
					...Object.fromEntries($page.url.searchParams),
					page: $page.data[slug].page - 1
				})}>«</a
			>
		{/if}
		<button class="join-item btn btn-xs disabled"
			>page {$page.data[slug].page} / {Math.floor($page.data[slug].count / $page.data[slug].size)}
		</button>
		{#if $page.data[slug].page < Math.floor($page.data[slug].count / $page.data[slug].size)}
			<a
				class="join-item btn btn-xs"
				href={getUrlFromQuery({
					...Object.fromEntries($page.url.searchParams),
					page: $page.data[slug].page + 1
				})}>»</a
			>
		{/if}
	</div>
</div>
