<script lang="ts">
	import { page } from '$app/stores';
	import { DocumentMode } from '$lib/utils/enums';
	import { parseDate } from '$lib/utils/formatters';
	export let mode: DocumentMode;

	const { tableConfig, details: detailsRes, slug, colTypes } = $page.data;

	const details = detailsRes.data;

	const payload = {
		...detailsRes.data
	};

	const handleSubmit = async () => {
		const url = `/api/${slug}${mode === DocumentMode.Create ? '' : `/${details._id}`}`;

		const res = await fetch(url, {
			headers: {
				'Content-Type': 'application/json'
			},
			method: mode === DocumentMode.Create ? 'POST' : 'PATCH',
			body: JSON.stringify(payload)
		});

		const data = await res.json();

		console.log('data', data);
	};
</script>

<div class="overflow-x-auto mx-auto max-w-2xl">
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
							{:else}
								<input type="text" class="input input-xs" bind:value={payload[column.value]} />
							{/if}
						</td>
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
								<th>editable</th>
							</tr>
							{#each payload['columns'] as col, idx}
								<tr>
									<td>
										<input type="text" class="w-24 input input-xs" bind:value={col.label} />
									</td>
									<td>
										<input type="text" class="w-24 input input-xs" bind:value={col.value} />
									</td>
									<td>
										<select bind:value={col.type}>
											{#each colTypes as type}
												<option value={type.value}>{type.label}</option>
											{/each}
										</select>
									</td>
									<td>
										<input type="checkbox" bind:checked={col.editable} />
									</td>
									<td>
										<button
											class="text-white btn btn-xs btn-error"
											on:click={() => {
												// @ts-ignore
												payload.columns = payload.columns.filter((_, i) => i !== idx);
											}}
										>
											delete
										</button>
									</td>
								</tr>
							{/each}

							<tr>
								<td class="text-center" colspan={4}>
									<button
										class="mt-6 text-white btn btn-xs btn-success"
										type="button"
										on:click={() => {
											console.log('', payload.columns);
											payload.columns = [
												...payload.columns,
												{
													label: '',
													value: '',
													type: '',
													editable: false
												}
											];
										}}>add more column+</button
									>
								</td>
							</tr>
						</table>
					</td>
				</tr>
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
