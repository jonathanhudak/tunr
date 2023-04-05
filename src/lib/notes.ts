const generateNotes = () => {
	const notes = ['C', 'C#/Db', 'D', 'D#/Eb', 'E', 'F', 'F#/Gb', 'G', 'G#/Ab', 'A', 'A#/Bb', 'B'];

	const frequencies = [];
	let n = 0;

	for (let octave = 0; octave <= 8; octave++) {
		for (let i = 0; i < 12; i++) {
			const note = notes[i] + octave;
			const frequency = 440 * Math.pow(2, (n - 49) / 12);
			frequencies.push({ note, frequency });
			n++;
		}
	}

	return frequencies;
};

export const NOTES = generateNotes();

export const findClosestNote = (frequency) => {
	let minDiff = Infinity;
	let closestNote = null;

	for (let note of NOTES) {
		const diff = Math.abs(note.frequency - frequency);
		if (diff < minDiff) {
			minDiff = diff;
			closestNote = note;
		}
	}

	return closestNote;
};
