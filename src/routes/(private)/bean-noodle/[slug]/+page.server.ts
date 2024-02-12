import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, fetch, params }) =>
{
    const { slug } = params;
    const res = await fetch(`/api/${slug}`);
    const data = await res.json();

    const colRes = await fetch(`/api/collections?name=${slug}`);
    const colData = await colRes.json();


    return {
        slug,
        [slug]: data,
        tableConfig: colData.data[0]
    };
};
