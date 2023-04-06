<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { findClosestNote, STANDARD_GUITAR_TUNING } from '$lib/notes';
	import type { Note } from '$lib/notes';
	// Add the NOTES constant here

	let detectedFrequency: number | null = null;
	let closestNote: Note | null = null;
	let audioContext: AudioContext;
	let analyser: AnalyserNode;

	onMount(async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			audioContext = new AudioContext();
			const source = audioContext.createMediaStreamSource(stream);
			analyser = audioContext.createAnalyser();
			source.connect(analyser);

			const interval = setInterval(() => {
				const dataArray = new Uint8Array(analyser.frequencyBinCount);
				analyser.getByteFrequencyData(dataArray);

				const maxIndex = dataArray.reduce((iMax, x, i, arr) => (x > arr[iMax] ? i : iMax), 0);
				const frequency = (maxIndex * audioContext.sampleRate) / (2 * dataArray.length);

				detectedFrequency = frequency;
				closestNote = findClosestNote(frequency);
			}, 100);

			onDestroy(() => {
				clearInterval(interval);
				audioContext.close();
			});
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
