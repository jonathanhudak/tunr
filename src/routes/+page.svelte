<script lang="ts">
	import { GUITAR_TUNINGS, UKELELE_TUNINGS } from '$lib/tunings';
</script>

<section class="p-3">
	<h2>Guitar Tuning</h2>
	<ul>
		{#each GUITAR_TUNINGS as tuning}
			<li>
				<a href={tuning.url}>{tuning.name}</a>
			</li>
		{/each}
	</ul>
</section>
<section class="p-3">
	<h2>Ukelele Tuning</h2>
	<ul>
		{#each UKELELE_TUNINGS as tuning}
			<li>
				<a href={tuning.url}>{tuning.name}</a>
			</li>
		{/each}
	</ul>
</section>
