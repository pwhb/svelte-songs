<script>
	import { page } from '$app/stores';

	const { tableConfig, details } = $page.data;
	const slug = 'collections';
</script>

<div class="overflow-x-auto mx-auto max-w-xl">
	<table class="table">
		<tbody>
			<!-- row 1 -->
			<tr>
				<th>objectId</th>
				<td>{details.data['_id']}</td>
			</tr>
			{#each tableConfig.columns as column}
				<tr>
					<th>{column.label}</th>
					<td>{details.data[column.value]}</td>
				</tr>
			{/each}

			<tr>
				<th>columns</th>
				<td>
					<table class="table">
						<tr>
							<th>label</th>
							<th>value</th>
							<th>type</th>
						</tr>
						{#each details.data['columns'] as col}
							<tr>
								<td>
									<input type="text" class="w-24 input input-xs" bind:value={col.label} />
								</td>
								<td>
									<input type="text" class="w-24 input input-xs" bind:value={col.value} />
								</td>
								<td>
									<input type="text" class="w-24 input input-xs" bind:value={col.type} />
								</td>
							</tr>
						{/each}
					</table>
				</td>
			</tr>
		</tbody>
	</table>
	<div class="flex gap-10 justify-center m-10">
		<a class="btn btn-sm btn-primary" href={`/bean-noodle/${slug}/${details.data._id}/edit`}>edit</a
		>
		<button class="text-white btn btn-sm btn-error">delete</button>
	</div>
</div>
