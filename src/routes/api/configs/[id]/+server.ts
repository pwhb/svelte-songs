import { MONGODB_DATABASE } from '$env/static/private';
import OptionSchema from '$lib/schemas/options';
import clientPromise from '$lib/services/mongodb';
import { zodExceptionHandler } from '$lib/utils/exceptions';
import { json, type RequestEvent, type RequestHandler } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';


const COLLECTION = 'configs';

export const GET: RequestHandler = async ({ locals, cookies, params }: RequestEvent) =>
{
    try
    {
        const { id } = params;
        const client = await clientPromise;
        const db = client.db(MONGODB_DATABASE);
        const col = db.collection(COLLECTION);
        const data = await col.findOne({ _id: new ObjectId(id) });
        return json({ success: true, data: data }, { status: 200 });
    } catch (err)
    {
        console.error(err);
        return json({
            success: false,
            error: zodExceptionHandler(err) || err
        }, { status: 400 });
    }
};

export const PATCH: RequestHandler = async ({ locals, request, cookies, params }: RequestEvent) =>
{
    // if (!locals.user || locals.user.role.name !== 'admin')
    // {
    //     return json({ success: false, error: { message: 'Unauthorized' } }, { status: 401 });
    // }
    try
    {
        const { id } = params;
        const client = await clientPromise;
        const db = client.db(MONGODB_DATABASE);
        const col = db.collection(COLLECTION);

        const body = await request.json();
        const validated = OptionSchema.parse(body);
        const res = await col.findOneAndUpdate({
            _id: new ObjectId(id)
        }, {
            $set: {
                ...validated,
                updatedAt: new Date()
            }
        }, {
            returnDocument: 'after'
        });

        // await logHistory({
        //     doc: body,
        //     collection: COLLECTION,
        //     operation: 'update',
        //     updatedBy: locals.user._id
        // });

        return json({ success: true, data: res }, { status: 201 });
    } catch (err)
    {
        console.error(err);
        return json({
            success: false,
            error: zodExceptionHandler(err) || err
        }, { status: 400 });
    }
};

export const DELETE: RequestHandler = async ({ locals, cookies, params }: RequestEvent) =>
{
    // if (!locals.user || locals.user.role.name !== 'admin')
    // {
    //     return json({ success: false, error: { message: 'Unauthorized' } }, { status: 401 });
    // }
    try
    {
        const { id } = params;
        const client = await clientPromise;
        const db = client.db(MONGODB_DATABASE);
        const col = db.collection(COLLECTION);
        const res = await col.deleteOne({ _id: new ObjectId(id) });

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
