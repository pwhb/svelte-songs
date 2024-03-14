<script>
	import { page } from '$app/stores';
	import { parseDate } from '$lib/utils/formatters';
	const { slug, [slug]: data, tableConfig } = $page.data;
	console.log({ data, slug, tableConfig });
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
