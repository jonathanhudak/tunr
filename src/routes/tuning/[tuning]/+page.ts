import { buildTuning } from '$lib/notes';

export function load({ params }) {
	const tuningRaw = decodeURIComponent(params.tuning || '');
	let tuningArray: string[] | undefined = [];
	if (tuningRaw.length % 2 === 0) {
		tuningArray = tuningRaw.match(/.{1,2}/g)?.filter((m) => typeof m === 'string');
	}
	const tuning = buildTuning(tuningArray || []);
	return { tuning };
}
