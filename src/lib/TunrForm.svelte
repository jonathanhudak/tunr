<script>
	import { goto as navigate } from '$app/navigation';

	let tuning = Array(6).fill('');
	const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

	function onSubmit() {
		const tuningString = tuning.join('');
		navigate(`/tuning/${tuningString}`);
	}
</script>

<form class="grid grid-cols-7" on:submit|preventDefault={onSubmit}>
	{#each tuning as note, i}
		<input type="text" list="notes" bind:value={tuning[i]} placeholder="Note" />
	{/each}
	<datalist id="notes">
		{#each notes as note}
			{#each Array(9).fill(null) as _, octave}
				<option value="{note}{octave}" />
			{/each}
		{/each}
	</datalist>
	<button type="submit">Submit</button>
</form>
