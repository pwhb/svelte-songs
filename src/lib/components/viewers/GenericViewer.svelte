<script lang="ts">
	import { page } from '$app/stores';
	import { DocumentMode } from '$lib/utils/enums';
	export let mode: DocumentMode;

	const { tableConfig, details: detailsRes, slug } = $page.data;

	const details = detailsRes.data;
	const payload = {
		...detailsRes.data
	};

	const handleSubmit = async () => {
		console.log({ payload, slug });
	};
</script>

<div class="overflow-x-auto mx-auto max-w-md">
	<form on:submit={handleSubmit}>
		<table class="table">
			<tbody>
				<!-- row 1 -->
				{#if mode !== DocumentMode.Create}
					<tr>
						<th>objectId</th>
						<td>{details['_id']}</td>
					</tr>
				{/if}
				{#each tableConfig.columns as column}
					<tr>
						<th>{column.label}</th>
						<td>
							{#if mode === DocumentMode.View}
								<input
									type="text"
									disabled
									class="input input-xs input-ghost"
									bind:value={details[column.value]}
								/>
							{:else}
								<input type="text" class="input input-xs" bind:value={payload[column.value]} />
							{/if}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
		<div class="flex gap-10 justify-center m-10">
			{#if mode === DocumentMode.Create}
				<button class="text-white btn btn-sm btn-success" type="submit">create</button>
			{:else if mode === DocumentMode.Edit}
				<button class="text-white btn btn-sm btn-info" type="submit">save</button>
			{:else}
				<a
					class="text-white btn btn-sm btn-primary"
					href={`/bean-noodle/${slug}/${details._id}/edit`}>edit</a
				>
			{/if}

			<button class="text-white btn btn-sm btn-error">delete</button>
		</div>
	</form>
</div>
