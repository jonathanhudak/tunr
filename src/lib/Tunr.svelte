<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import ToneJSNote from '@tonaljs/note';
	import { findClosestNote, autoCorrelate, STANDARD_GUITAR_TUNING } from '$lib/notes';
	import type { Note } from '$lib/notes';
	// Add the NOTES constant here

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
			// audioContext = new AudioContext();
			// const source = audioContext.createMediaStreamSource(stream);
			// analyser = audioContext.createAnalyser();
			// source.connect(analyser);

			// const interval = setInterval(() => {
			// 	const dataArray = new Uint8Array(analyser.frequencyBinCount);
			// 	analyser.getByteFrequencyData(dataArray);

			// 	// Convert byte data to float data
			// 	const floatData = dataArray.map((byte) => byte / 255);

			// 	detectedFrequency = hps(floatData, audioContext.sampleRate);
			// 	closestNote = findClosestNote(floatData, audioContext.sampleRate);
			// }, 100);

			// onDestroy(() => {
			// 	clearInterval(interval);
			// 	audioContext.close();
			// });
		} catch (err) {
			console.error('Failed to initialize audio:', err);
		}
	});

	const classifyNote = (guitarNote: Note, detectedNote: Note) => {
		if (!detectedNote || !detectedNote.frequency) return 'unknown';
		if (!guitarNote || !guitarNote.frequency) return 'unknown';
		const diff = guitarNote.frequency - detectedNote?.frequency;

		if (Math.abs(diff) <= 1) {
			return 'inTune';
		} else if (diff < 0) {
			return 'flat';
		} else {
			return 'sharp';
		}
	};
</script>

<div style="display: flex; flex-direction: column; align-items: center;">
	{#if detectedFrequency}
		<p>Detected Frequency: {@html detectedFrequency.toFixed(2)} Hz</p>
	{/if}
	{#if closestNote}
		<p>
			Closest Note: {closestNote.note} ({@html closestNote?.frequency?.toFixed(2)} Hz)
		</p>
	{/if}
</div>

<ol>
	{#each STANDARD_GUITAR_TUNING as guitarNote}
		<li
			class={closestNote && closestNote.note === guitarNote.note
				? classifyNote(guitarNote, closestNote)
				: ''}
		>
			{guitarNote.string} ({guitarNote.note})
		</li>
	{/each}
</ol>

<style>
	li {
		list-style: none;
		margin: 8px 0;
	}
	.inTune {
		font-weight: bold;
		color: green;
	}
	.flat {
		font-weight: bold;
		color: red;
	}
	.sharp {
		font-weight: bold;
		color: blue;
	}
</style>
