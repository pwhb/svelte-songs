import type { PageServerLoad } from './$types';

import { MONGODB_DATABASE } from '$env/static/private';
import clientPromise from '$lib/services/mongodb';


export const load: PageServerLoad = async ({ locals }) =>
{
	const client = await clientPromise;
	const db = client.db(MONGODB_DATABASE);
	// const fullUser = await db.collection('users').findOne({ _id: locals.user._id });

	return {
		// fullUser: serialize(fullUser)
	};
};
