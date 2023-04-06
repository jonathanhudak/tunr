import Note from '@tonaljs/note';

// Replace the custom generateNotes function with the Tonal.js library
export const NOTES: Note[] = [];

for (let octave = 0; octave <= 8; octave++) {
	for (let i = 0; i < 12; i++) {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		const note = Note.get(Note.fromFreq(Note.freq(`C${octave}`) * Math.pow(2, i / 12)));
		NOTES.push({ note: note.name, frequency: note.freq });
	}
}

export interface Note {
	note: string;
	frequency?: number | null | undefined;
	string?: string;
}

export const findClosestNote = (frequency) => {
	let minDiff = Infinity;
	let closestNotes: Note[] = [];

	for (const note of NOTES) {
		const diff = Math.abs(note.frequency - frequency);
		if (diff < minDiff) {
			minDiff = diff;
			closestNotes = [note];
		} else if (diff === minDiff) {
			closestNotes.push(note);
		}
	}

	// Calculate the average frequency of the closest notes
	const avgFrequency =
		closestNotes.reduce((sum, note) => sum + note.frequency, 0) / closestNotes.length;

	if (closestNotes[0]) {
		// Update the frequency of the first note in the array to the average frequency
		closestNotes[0].frequency = avgFrequency;

		return closestNotes[0];
	}
};

function convertToNotes(note: { note: string; string: string }): Note {
	const foundNote = NOTES.find((n) => n.note === note.note);
	return { ...note, frequency: foundNote?.frequency };
}

export const STANDARD_GUITAR_TUNING = [
	{ note: 'E3', string: '6th' },
	{ note: 'A3', string: '5th' },
	{ note: 'D4', string: '4th' },
	{ note: 'G4', string: '3rd' },
	{ note: 'B4', string: '2nd' },
	{ note: 'E5', string: '1st' }
].map(convertToNotes);
