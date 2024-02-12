import { fail, json, redirect } from '@sveltejs/kit';
import type { Action, Actions, PageServerLoad } from './$types';
import { verify } from 'argon2';
import { MONGODB_DATABASE } from '$env/static/private';
import { login } from '$lib/services/auth';

export const load: PageServerLoad = async ({ locals }) =>
{
	if (locals.user)
	{
		throw redirect(302, '/bean-noodle');
	}
};

const loginAction: Action = async ({ request, cookies }) =>
{
	const data = await request.formData();
	const { username, password } = Object.fromEntries(data) as any;

	const { token, previous, error } = await login({ username, password });

	if (!token)
	{
		return fail(400, { previous, error });
	}

	cookies.set('token', token, {
		httpOnly: true,
		path: '/',
		secure: true,
		sameSite: 'strict',
		maxAge: 60 * 60 * 24 // 1 day
	});

	throw redirect(303, '/bean-noodle');
};

export const actions: Actions = {
	default: loginAction
};
