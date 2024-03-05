<script>
	import { page } from '$app/stores';
	import GenericViewer from '$lib/components/viewers/GenericViewer.svelte';
	import { DocumentMode } from '$lib/utils/enums';

	const { tableConfig, details, slug } = $page.data;
</script>

<GenericViewer mode={DocumentMode.View} />
<!-- <div class="overflow-x-auto mx-auto max-w-md">
	<table class="table">
		<tbody>

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
</div> -->
