import type { PageServerLoad } from './$types';

import { MONGODB_DATABASE } from '$env/static/private';
import clientPromise from '$lib/services/mongodb';


export const load: PageServerLoad = async ({ locals, fetch }) =>
{
	const res = await fetch('/api/collections?sort_by=name');
	const data = await res.json();
	return {
		collections: data
		// fullUser: serialize(fullUser)
	};
};
