import { MONGODB_DATABASE } from '$env/static/private';
import clientPromise from '$lib/services/mongodb';
import { slugify } from '$lib/utils/formatters';
import { json, type RequestEvent, type RequestHandler } from '@sveltejs/kit';
import { hash } from 'argon2';


const COLLECTION = 'users';

export const GET: RequestHandler = async ({ url, locals }: RequestEvent) =>
{
    try
    {
        const client = await clientPromise;
        const db = client.db(MONGODB_DATABASE);
        const col = db.collection(COLLECTION);

        const active = url.searchParams.get('active');
        const filter: { active?: boolean; } = {};

        if (!!active)
        {
            filter.active = active == 'true';
        }
        const pipeline = [
            {
                $match: filter
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'createdBy',
                    foreignField: '_id',
                    as: 'createdBy'
                }
            },
            {
                $unwind: '$createdBy'
            },
            {
                $project: {
                    password: 0,
                    'createdBy.password': 0,
                    'createdBy.createdBy': 0,
                    'createdBy.createdAt': 0,
                    'createdBy.updatedAt': 0,
                    'createdBy._id': 0
                }
            }
        ];
        const docs = await col.aggregate(pipeline).toArray();

        return json({ success: true, data: docs, total: docs.length }, { status: 200 });
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
    if (!locals.user || locals.user.role.name !== 'admin')
    {
        return json({ success: false, error: { message: 'Unauthorized' } }, { status: 401 });
    }
    try
    {
        const client = await clientPromise;
        const db = client.db(MONGODB_DATABASE);
        const col = db.collection(COLLECTION);

        const body = await request.json();

        const existingDocument = await col.findOne({
            $or: [
                {
                    username: body.username
                },
                {
                    penName: body.penName
                }
            ]
        });

        if (existingDocument)
        {
            return json(
                { success: false, error: { message: 'username already taken' } },
                { status: 400 }
            );
        }

        const res = await col.insertOne({
            ...body,
            active: !!body.active ? body.active : true,
            role: !!body.role ? body.role : 'author',
            slug: slugify(body.firstName + ' ' + body.lastName),
            password: await hash(body.password),
            createdBy: locals.user._id,
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

export const PATCH: RequestHandler = async ({ locals, request, cookies, params }: RequestEvent) =>
{
    if (!locals.user)
    {
        return json({ success: false, error: { message: 'Unauthorized' } }, { status: 401 });
    }
    try
    {
        const client = await clientPromise;
        const db = client.db(MONGODB_DATABASE);
        const col = db.collection(COLLECTION);

        const body = await request.json();
        const update = body;

        const res = await col.findOneAndUpdate(
            { _id: locals.user._id },
            {
                $set: {
                    ...update,
                    slug: slugify(update.firstName + ' ' + update.lastName),
                    updatedAt: new Date()
                }
            },
            { returnDocument: 'after' }
        );
        // await logHistory({
        //     doc: res.value,
        //     collection: COLLECTION,
        //     operation: 'update',
        //     updatedBy: locals.user._id
        // });
        return json({ success: true, data: res!.value }, { status: 201 });
    } catch (err)
    {
      console.error(err);
        return json({
            success: false,
            error: zodExceptionHandler(err) || err
        }, { status: 400 });
    }
};
