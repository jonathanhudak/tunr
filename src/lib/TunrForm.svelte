<script>
	import { goto as navigate } from '$app/navigation';

	let tuning = Array(6).fill('');
	const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

	function onSubmit() {
		const tuningString = tuning.join('');
		navigate(`/tuning/${tuningString}`);
	}
</script>

<form class="grid gap-2 mb-4" on:submit|preventDefault={onSubmit}>
	{#each tuning as note, i}
		<input
			class="dark:bg-black"
			type="text"
			list="notes"
			bind:value={tuning[i]}
			placeholder="Note"
		/>
	{/each}
	<datalist id="notes">
		{#each notes as note}
			{#each Array(9).fill(null) as _, octave}
				<option value="{note}{octave}" />
			{/each}
		{/each}
	</datalist>
	<button
		type="submit"
		class="bg-primary-500 hover:bg-primary-300 text-surface-900 font-bold py-2 px-4 rounded"
		>Submit</button
	>
</form>
