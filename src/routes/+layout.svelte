<script>
	import { page } from '$app/stores';
	import Navbar from '$lib/components/layout/Navbar.svelte';
	import '../app.css';
</script>

<div class="px-2 md:px-10">
	<Navbar />
	<slot />
</div>
