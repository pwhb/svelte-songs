import AuthSchema from '$lib/schemas/auth';
import { zodExceptionHandler } from '$lib/utils/exceptions';
import { type RequestHandler, type RequestEvent, json } from '@sveltejs/kit';
import { ZodError } from 'zod';

export const POST: RequestHandler = async ({ request }: RequestEvent) =>
{
    try
    {

        const body = await request.json();
        const validated = AuthSchema.parse(body);

        return json(
            {
                validated
            },
            { status: 201 }
        );
    } catch (err)
    {
        console.error(err);
        return json({
            success: false,
            error: zodExceptionHandler(err) || err
        }, { status: 400 });
    }
};
