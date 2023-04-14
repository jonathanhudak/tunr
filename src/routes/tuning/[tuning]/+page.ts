import { buildTuning } from '$lib/notes';
import { enharmonic } from '@tonaljs/note';

export function load({ params }) {
	const tuningRaw = decodeURIComponent(params.tuning || '');
	let tuningArray: string[] | undefined = [];

	if (tuningRaw) {
		tuningArray = tuningRaw.match(/([A-G](?:#)?\d)/g) as string[];
	}
	if (tuningArray) {
		tuningArray = tuningArray.map((note) => enharmonic(note));
	}
	const tuning = buildTuning(tuningArray || []);

	console.log('tuning', tuning);
	return { tuning };
}
