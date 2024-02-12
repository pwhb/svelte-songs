import { MONGODB_DATABASE } from '$env/static/private';
import CollectionSchema from '$lib/schemas/collections';

import clientPromise from '$lib/services/mongodb';
import { zodExceptionHandler } from '$lib/utils/exceptions';
import { getOptions, QueryType } from '$lib/utils/query';
import { json, type RequestEvent, type RequestHandler } from '@sveltejs/kit';

const COLLECTION = 'collections';

export const GET: RequestHandler = async ({ url, locals }: RequestEvent) =>
{
    try
    {
        const client = await clientPromise;
        const db = client.db(MONGODB_DATABASE);
        const col = db.collection(COLLECTION);
        const query = Object.fromEntries(url.searchParams);
        const { page, limit, skip, filter, sort } = getOptions(query, [{
            key: 'q',
            type: QueryType.Regex,
            searchedFields: ['name']
        }]);

        const data = await col.find(filter, { skip, limit, sort }).toArray();
        const count = await col.countDocuments(filter);
        return json({ success: true, page, limit, count, data }, { status: 200 });
    } catch (err)
    {
      console.error(err);
        return json({
            success: false,
            error: zodExceptionHandler(err) || err
        }, { status: 400 });
    }
};

export const POST: RequestHandler = async ({ request, locals }: RequestEvent) =>
{
    try
    {
        const client = await clientPromise;
        const db = client.db(MONGODB_DATABASE);
        const col = db.collection(COLLECTION);

        const body = await request.json();
        const validated = CollectionSchema.parse(body);

        const res = await col.insertOne({
            ...validated,
            // createdBy: locals.user._id,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        return json({ success: true, data: res }, { status: 200 });
    } catch (err)
    {
      console.error(err);
        return json({
            success: false,
            error: zodExceptionHandler(err) || err
        }, { status: 400 });
    }
};

