<script>
// @ts-nocheck

	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { parseDate } from '$lib/utils/formatters';
	const { slug, [slug]: data, tableConfig } = $page.data;
	const query = Object.fromEntries($page.url.searchParams);
</script>

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
					<td> <input type="checkbox" class="toggle" checked /> </td>
				{:else}
					<td>
						<input type="text" class="w-20 input input-xs input-bordered" />
					</td>
				{/if}
			{/each}
			<td>
				<button class="btn btn-xs btn-primary">search</button>
			</td>
		</tr>
		{#each data.data as row, idx}
			<tr class="hover">
				<td>{idx + 1}</td>
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
					<button class="text-white btn btn-xs btn-error">delete</button>
				</td>
			</tr>
		{/each}
	</tbody>
</table>

<div class="my-6 w-full text-center">
	<div class="join">
		{#if data.page > 0}
			<a
				class="join-item btn btn-xs"
				href={$page.url.pathname +
					`?${new URLSearchParams({ ...query, page: data.page - 1 }).toString()}`}>«</a
			>
		{/if}
		<button class="join-item btn btn-xs disabled"
			>page {data.page} / {Math.floor(data.count / data.size)}
		</button>
		{#if data.page < Math.floor(data.count / data.size)}
			<a
				class="join-item btn btn-xs"
				href={$page.url.pathname +
					`?${new URLSearchParams({ ...query, page: data.page + 1 }).toString()}`}>»</a
			>
		{/if}
	</div>
</div>
