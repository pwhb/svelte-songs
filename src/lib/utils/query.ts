import { ObjectId } from "mongodb";
import { DEFAULT_LIMIT } from "./constants";


export enum QueryType
{
    String,
    Boolean,
    ObjectId,
    Date,
    Regex,
    Any
}

export interface QueryKey
{
    type: QueryType;
    key: string;
    field?: string;
    searchedFields?: string[];
}


export function getFilter(keys: QueryKey[], query: any)
{
    const or: any[] = [];
    const and: any[] = [];

    const filter: any = {};
    for (let key of keys)
    {
        if (query[key.key] || key.type === QueryType.Date)
        {
            switch (key.type)
            {

                case QueryType.String: {
                    filter[key.field ? key.field : key.key] = query[key.key];
                    break;
                }
                case QueryType.Boolean: {
                    filter[key.field ? key.field : key.key] = query[key.key] === "true";
                    break;
                }
                case QueryType.ObjectId: {
                    filter[key.field ? key.field : key.key] = new ObjectId(query[key.key] as string);
                    break;
                }
                case QueryType.Date: {
                    if (!!query[`${key.key}.from`])
                    {
                        const from = new Date(query[`${key.key}.from`]).getTime();
                        and.push({
                            [key.field ? key.field : key.key]: { $gte: from }
                        });
                    }

                    if (!!query[`${key.key}.to`])
                    {
                        const to = new Date(query[`${key.key}.to`]).getTime();
                        and.push({
                            [key.field ? key.field : key.key]: { $lt: to + 1000 * 60 * 60 * 24 }
                        });
                    }
                    break;
                }
                case QueryType.Regex: {
                    if (key.searchedFields)
                    {
                        for (let searchedKey of key.searchedFields)
                        {
                            or.push({
                                [searchedKey]: { $regex: query[key.key], $options: "i" }
                            });
                        }
                    }
                    break;
                }
            }
        }
    }

    if (and.length && or.length)
    {
        filter["$and"] = [...and, { "$or": or }];
    } else if (or.length)
    {
        filter["$or"] = or;
    } else if (and.length)
    {
        filter["$and"] = and;
    }

    return filter;

}

export function getSort(sort_by?: any)
{
    const sort: any = {};
    if (sort_by)
    {
        const split = sort_by.split(",");
        for (let key of split)
        {
            const trimmed = key.trim();
            const field = trimmed.replace("-", "");
            sort[field] = trimmed[0] === "-" ? -1 : 1;
        }
    } else
    {
        sort["history.created.at"] = -1;
    }
    return sort;
}

export function getOptions(query: any, keys: QueryKey[] = [])
{
    const page = query.page ? parseInt(query.page as string) : 0;
    const limit = query.limit ? parseInt(query.limit as string) : DEFAULT_LIMIT;
    const skip = page * limit;

    const filter = getFilter(keys, query);
    const sort = getSort(query.sort_by as string);

    return { page, limit, skip, filter, sort };
}