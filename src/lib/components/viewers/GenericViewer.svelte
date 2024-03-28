<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { showToast } from '$lib/stores/toast';
	import { DocumentMode } from '$lib/utils/enums';
	import { parseDate } from '$lib/utils/formatters';
	export let mode: DocumentMode;

	const { tableConfig, details: detailsRes, slug } = $page.data;

	const details = mode === DocumentMode.Create ? {} : detailsRes.data;
	const payload = {
		...details
	};

	let isLoading = false;

	const handleSubmit = async () => {
		try {
			isLoading = true;
			const url = `/api/${slug}${mode === DocumentMode.Create ? '' : `/${details._id}`}`;

			const res = await fetch(url, {
				headers: {
					'Content-Type': 'application/json'
				},
				method: mode === DocumentMode.Create ? 'POST' : 'PATCH',
				body: JSON.stringify(payload)
			});

			const data = await res.json();
			if (data.success) {
				goto(`/bean-noodle/${slug}`);
				showToast('Created Successfully!');
			}
		} catch (e) {
			console.error(e);
		} finally {
			isLoading = false;
		}
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
							{#if mode === DocumentMode.View || !column.editable}
								<p class="input input-xs input-ghost">
									{column.type === 'date'
										? parseDate(details[column.value])
										: details[column.value]}
								</p>
							{:else if column.type === 'string'}
								<input type="text" class="input input-xs" bind:value={payload[column.value]} />
							{:else if column.type === 'boolean'}
								<input type="checkbox" class="toggle" bind:checked={payload[column.value]} />
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
				<button class="text-white btn btn-sm btn-info" type="submit" disabled={isLoading}
					>save</button
				>
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
