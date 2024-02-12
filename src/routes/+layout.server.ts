import { MONGODB_DATABASE } from '$env/static/private';
import clientPromise from '$lib/services/mongodb';
import { serialize } from '$lib/utils/common.js';
import type { LayoutServerLoad } from './$types';



export const load: LayoutServerLoad = async ({ locals }) =>
{
	const client = await clientPromise;
	const db = client.db(MONGODB_DATABASE);
	const config = await db.collection('configs').findOne({ name: 'main' });
	// const privateConfig = await db.collection('configs').findOne({ name: 'private' });

	return {
		config: serialize(config),
		// privateConfig: serialize(privateConfig),
		user: locals.user ? serialize(locals.user) : null
	};
};
