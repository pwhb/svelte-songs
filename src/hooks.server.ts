import { MONGODB_DATABASE } from '$env/static/private';
import { verifyToken } from '$lib/services/auth';
import clientPromise from '$lib/services/mongodb';

import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

const authMiddleware: Handle = async ({ event, resolve }) =>
{
	let token = event.cookies.get('token');

	if (!token)
	{
		const authHeader = event.request.headers.get('Authorization');

		if (!authHeader)
		{
			return await resolve(event);
		}

		const [BeanNoodle, tokenFromHeader] = authHeader.split(' ');
		if (BeanNoodle !== 'BeanNoodle' || !tokenFromHeader)
		{
			return await resolve(event);
		}
		token = tokenFromHeader;
	}

	const decoded = verifyToken(token) as any;
	if (!decoded)
	{
		return await resolve(event);
	}

	try
	{
		const client = await clientPromise;
		const db = client.db(MONGODB_DATABASE);
		const col = db.collection('users');
		
		const pipeline = [
			{ $match: { username: decoded.user.username } },
			{
				$lookup: {
					from: 'roles',
					localField: 'role',
					foreignField: 'name',
					as: 'role'
				}
			},
			{
				$unwind: '$role'
			},
			{
				$project: {
					password: 0
				}
			},
			{ $limit: 1 }
		];
		const user = (await col.aggregate(pipeline).toArray())[0] as any;

		event.locals.user = user;
	} catch (err)
	{
		console.error(err);
	}

	return await resolve(event);
};

export const handle = sequence(authMiddleware);
