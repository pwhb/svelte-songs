<script>
	import { page } from '$app/stores';
	import Navbar from '$lib/components/layout/Navbar.svelte';
	import '../app.css';

	console.log({
		data: $page.data
	});
</script>

<div class="lowercase">
	<Navbar />
	<slot />
</div>
