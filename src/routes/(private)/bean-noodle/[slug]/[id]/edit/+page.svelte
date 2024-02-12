<script>
	import { page } from '$app/stores';

	const { tableConfig, details, slug } = $page.data;
</script>

<div class="overflow-x-auto mx-auto max-w-md">
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
		</tbody>
	</table>
	<div class="flex gap-10 justify-center m-10">
		<a class="btn btn-sm btn-primary" href={`/bean-noodle/${slug}/${details.data._id}/edit`}>edit</a
		>
		<button class="text-white btn btn-sm btn-error">delete</button>
	</div>
</div>
