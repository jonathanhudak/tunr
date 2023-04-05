<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { findClosestNote } from '$lib/notes';
	// Add the NOTES constant here

	let detectedFrequency = null;
	let closestNote = null;
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
</script>

<div style="display: flex; flex-direction: column; align-items: center;">
	{#if detectedFrequency}
		<p>Detected Frequency: {@html detectedFrequency.toFixed(2)} Hz</p>
	{/if}
	{#if closestNote}
		<p>
			Closest Note: {closestNote.note} ({@html closestNote.frequency.toFixed(2)} Hz)
		</p>
	{/if}
</div>
