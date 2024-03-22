import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
// import { checkIsAllowed } from '$lib/utils/formatters';

export const load: LayoutServerLoad = async ({ locals, url }) =>
{
	if (!locals.user)
	{
		throw redirect(307, '/auth/login');
	}

	// const path = url.pathname.split('/')[2];

	// const isAllowed = checkIsAllowed(locals.user.role, path);


	// if (!isAllowed)
	// {
	// throw redirect(307, '/bean-noodle');
	return {};
	// }

	// return {};
};
