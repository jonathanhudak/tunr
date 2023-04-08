import Note from '@tonaljs/note';

// Replace the custom generateNotes function with the Tonal.js library
export const NOTES: Note[] = [];

for (let octave = 0; octave <= 8; octave++) {
	for (let i = 0; i < 12; i++) {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		const note = Note.get(Note.fromFreq(Note.freq(`C${octave}`) * Math.pow(2, i / 12)));
		NOTES.push({ note: note.name, frequency: note.freq! });
	}
}

export interface Note {
	note: string;
	frequency: number;
	string?: string;
}

export const hps = (frequencyData: number[], sampleRate: number) => {
	const maxHarmonic = 5;
	const downsampledData: number[] = [];
	for (let harmonic = 1; harmonic <= maxHarmonic; harmonic++) {
		for (let i = 0; i < frequencyData.length / (harmonic + 1); i++) {
			downsampledData[i] = downsampledData[i] || 1;
			downsampledData[i] *= frequencyData[i * harmonic];
		}
	}
	const maxIndex = downsampledData.reduce((iMax, x, i, arr) => (x > arr[iMax] ? i : iMax), 0);
	const fundamentalFrequency = (maxIndex * sampleRate) / (2 * frequencyData.length);
	return fundamentalFrequency;
};

export const findClosestNote = (frequencyData: number[], sampleRate: number) => {
	const fundamentalFrequency = hps(frequencyData, sampleRate);
	let minDiff = Infinity;
	let closestNote = null;

	for (const note of NOTES) {
		const diff = Math.abs(note.frequency - fundamentalFrequency);
		if (diff < minDiff) {
			minDiff = diff;
			closestNote = note;
		}
	}

	return closestNote;
};

function convertToNotes(note: { note: string; string: string }): Note {
	const foundNote = NOTES.find((n) => n.note === note.note);
	return { ...note, frequency: foundNote?.frequency };
}

export const STANDARD_GUITAR_TUNING = [
	{ note: 'E3', string: '6th' },
	{ note: 'A2', string: '5th' },
	{ note: 'D3', string: '4th' },
	{ note: 'G3', string: '3rd' },
	{ note: 'B3', string: '2nd' },
	{ note: 'E4', string: '1st' }
].map(convertToNotes);

// Adapted from https://github.com/cwilso/PitchDetect/blob/main/js/pitchdetect.js
// Wow it works!
export function autoCorrelate(buf: Float32Array, sampleRate: number) {
	// Implements the ACF2+ algorithm
	let SIZE = buf.length;
	let rms = 0;

	for (let i = 0; i < SIZE; i++) {
		const val = buf[i];
		rms += val * val;
	}
	rms = Math.sqrt(rms / SIZE);
	if (rms < 0.01)
		// not enough signal
		return -1;

	let r1 = 0,
		r2 = SIZE - 1;
	const thres = 0.2;
	for (let i = 0; i < SIZE / 2; i++)
		if (Math.abs(buf[i]) < thres) {
			r1 = i;
			break;
		}
	for (let i = 1; i < SIZE / 2; i++)
		if (Math.abs(buf[SIZE - i]) < thres) {
			r2 = SIZE - i;
			break;
		}

	buf = buf.slice(r1, r2);
	SIZE = buf.length;

	const c = new Array(SIZE).fill(0);
	for (let i = 0; i < SIZE; i++)
		for (let j = 0; j < SIZE - i; j++) c[i] = c[i] + buf[j] * buf[j + i];

	let d = 0;
	while (c[d] > c[d + 1]) d++;
	let maxval = -1,
		maxpos = -1;
	for (let i = d; i < SIZE; i++) {
		if (c[i] > maxval) {
			maxval = c[i];
			maxpos = i;
		}
	}
	let T0 = maxpos;

	const x1 = c[T0 - 1],
		x2 = c[T0],
		x3 = c[T0 + 1];
	const a = (x1 + x3 - 2 * x2) / 2;
	const b = (x3 - x1) / 2;
	if (a) T0 = T0 - b / (2 * a);

	return sampleRate / T0;
}
