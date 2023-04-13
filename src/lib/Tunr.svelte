<script lang="ts">
	import { onMount } from 'svelte';
	import ToneJSNote from '@tonaljs/note';
	import { autoCorrelate, STANDARD_GUITAR_TUNING } from '$lib/notes';
	import type { Note } from '$lib/notes';
	export let tuning: Note[];
	let detectedFrequency: number | null = null;
	let closestNote: Note | null = null;
	let audioContext: AudioContext;
	let analyser: AnalyserNode;

	let tunedStrings: boolean[] = Array(tuning.length).fill(false);

	$: {
		if (closestNote && detectedFrequency) {
			for (let i = 0; i < tuning.length; i++) {
				if (tuning[i].note === closestNote.note) {
					if (typeof tuning[i] && tuning[i].frequency) {
						const diff = (tuning[i].frequency as number) - detectedFrequency;
						tunedStrings[i] = Math.abs(diff) <= 1;
					}
				}
			}
		}
	}

	onMount(async () => {
		try {
			await navigator.mediaDevices
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
			return `${classes} in-tune bg-green-500 text-black`;
		} else if (diff < 0) {
			return `${classes} bg-yellow-300 text-black`;
		} else {
			return `${classes} bg-orange-300 text-black`;
		}
	};
</script>

{#if !tuning}
	<p>Not tuning provided...</p>
{:else}
	<p class:contrast-50={!closestNote}>
		{#if closestNote}
			Closest Note: {closestNote.note} ({@html closestNote?.frequency?.toFixed(2)} Hz)
		{:else}
			No note detected
		{/if}
	</p>

	<ol class="flex flex-col gap-y-2">
		{#each tuning as guitarNote, index}
			<li class={getStringClass(guitarNote, closestNote)}>
				{guitarNote.note}
				{tunedStrings[index] ? '✓' : ''}
			</li>
		{/each}
	</ol>
{/if}
