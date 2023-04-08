<script lang="ts">
	import { onMount } from 'svelte';
	import ToneJSNote from '@tonaljs/note';
	import { autoCorrelate, STANDARD_GUITAR_TUNING } from '$lib/notes';
	import type { Note } from '$lib/notes';

	let detectedFrequency: number | null = null;
	let closestNote: Note | null = null;
	let audioContext: AudioContext;
	let analyser: AnalyserNode;

	onMount(async () => {
		try {
			const stream = await navigator.mediaDevices
				.getUserMedia({ audio: true })
				.then((stream) => {
					const context = new AudioContext();
					const source = context.createMediaStreamSource(stream);
					const analyser = context.createAnalyser();
					source.connect(analyser);

					const bufferLength = analyser.fftSize;
					const dataArray = new Float32Array(bufferLength);

					function update() {
						analyser.getFloatTimeDomainData(dataArray);
						const frequency = autoCorrelate(dataArray, context.sampleRate);

						if (frequency !== -1) {
							console.log('Frequency:', frequency, 'Hz');
							detectedFrequency = frequency;
							closestNote = {
								note: ToneJSNote.fromFreq(frequency),
								frequency
							};
						} else {
							console.log('Not enough signal');
						}

						requestAnimationFrame(update);
					}

					update();
				})
				.catch((err) => console.error('Error:', err));
		} catch (err) {
			console.error('Failed to initialize audio:', err);
		}
	});

	const getStringClass = (guitarNote: Note, detectedNote: Note | null) => {
		let classes = 'p-4 rounded-lg border-2 border-black-500/50 dark:border-white-500/10';

		if (!detectedNote || !detectedNote.frequency || !guitarNote || !guitarNote.frequency)
			return classes;
		if (detectedNote.note !== guitarNote.note) {
			return classes;
		}
		const diff = guitarNote.frequency - detectedNote?.frequency;
		classes += 'border-black dark:border-white';

		if (Math.abs(diff) <= 1) {
			return `${classes} bg-green-500 text-black`;
		} else if (diff < 0) {
			return `${classes} bg-yellow-300 text-black`;
		} else {
			return `${classes} bg-orange-300 text-black`;
		}
	};
</script>

<p class:contrast-50={!closestNote}>
	{#if closestNote}
		Closest Note: {closestNote.note} ({@html closestNote?.frequency?.toFixed(2)} Hz)
	{:else}
		No note detected
	{/if}
</p>

<ol class="flex flex-col gap-y-2">
	{#each STANDARD_GUITAR_TUNING as guitarNote}
		<li class={getStringClass(guitarNote, closestNote)}>
			{guitarNote.string} ({guitarNote.note})
		</li>
	{/each}
</ol>
