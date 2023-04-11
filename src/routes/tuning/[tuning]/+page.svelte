<script lang="ts">
	export let data;
	import GuitarTuner from '$lib/Tunr.svelte';
</script>

<GuitarTuner tuning={data.tuning} />
