<script lang="ts">
	export let data;
	import GuitarTuner from '$lib/Tunr.svelte';
	import { onMount } from 'svelte';

	let url = ``;

	onMount(() => (url = window.location.href));
</script>

Permalink:
<a href={url}>{url}</a>

<GuitarTuner tuning={data.tuning} />
