import { MONGODB_DATABASE } from '$env/static/private';
import clientPromise from '$lib/services/mongodb';
import { zodExceptionHandler } from '$lib/utils/exceptions';
import { json, type RequestEvent, type RequestHandler } from '@sveltejs/kit';

const COLLECTION = 'options';

export const GET: RequestHandler = async ({ url, locals }: RequestEvent) =>
{
    try
    {
        const client = await clientPromise;
        const db = client.db(MONGODB_DATABASE);
        const col = db.collection(COLLECTION);

        const data = await col.aggregate([{
            $group: {
                _id: '$name',
                count: { $sum: 1 }
            },
        }, {
            $project: {
                _id: 0,
                name: "$_id",
                count: 1
            }
        }
        ]).toArray();

        return json({ success: true, count: data.length, data }, { status: 200 });
    } catch (err)
    {
        console.error(err);
        return json({
            success: false,
            error: zodExceptionHandler(err) || err
        }, { status: 400 });
    }
};