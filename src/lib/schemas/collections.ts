import { z } from "zod";

const CollectionSchema = z.object({
    name: z.string(),
    roleIds: z.array(z.string()),
    routes: z.array(z.object({
        methods: z.string(),
        path: z.string(),
        roleIds: z.array(z.string()),
    })),
    columns: z.array(z.object({
        label: z.string(),
        value: z.string(),
        type: z.string().optional(),
        editable: z.boolean().default(false)
    }))
});

export default CollectionSchema;